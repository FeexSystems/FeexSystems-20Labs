import {
  errorHandler,
  notFoundHandler,
} from "./lib/middleware/error.middleware";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { validateEnv } from "./lib/config/validate-env";
import { applyProductionSecurity } from "./lib/middleware/production-security";
import { createServer as createHttpServer } from "http";
import {
  initializeSentry,
  setupSentryErrorHandler,
} from "./lib/logging/sentry";
import { handleDemo } from "./routes/demo";
import { handleChat } from "./routes/chat";
import {
  handleHealthCheck,
  handleReadinessCheck,
  handleLivenessCheck,
} from "./routes/health";
import subscriptionRoutes from "./routes/subscriptions";
import authRoutes from "./routes/auth";
import mockAuthRoutes from "./routes/mock-auth";
import userRoutes from "./routes/users";
import usageRoutes from "./routes/usage";
import billingRoutes from "./routes/billing";
import aiRoutes from "./routes/ai";
import devopsRoutes from "./routes/devops";
import securityRoutes from "./routes/security";
import teamRoutes from "./routes/teams";
import adminRoutes from "./routes/admin";
import worldModelRoutes from "./routes/world-model";
import { connectDatabase } from "./lib/database";
import { createRedisClient } from "./lib/redis";
import { aiService } from "./lib/services/ai.service";
import { securityService } from "./lib/services/security.service";
import { securityCronService } from "./lib/services/security-cron.service";
import { initializeDeploymentWebSocket } from "./lib/services/deployment-websocket.service";

// Load environment variables
dotenv.config();
// Validate environment variables
validateEnv();

export function createServer() {
  const app = express();

  if (process.env.NODE_ENV === "production" && process.env.SENTRY_DSN) {
    initializeSentry(app);
  }

  if (process.env.NODE_ENV === "production") {
    applyProductionSecurity(app);
  } else {
    app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000", credentials: true }));
  }

  app.set("json replacer", (key: string, value: unknown) => typeof value === "bigint" ? value.toString() : value);
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use("/uploads", express.static("uploads"));

  app.get("/health", handleHealthCheck);
  app.get("/health/ready", handleReadinessCheck);
  app.get("/health/live", handleLivenessCheck);

  app.use("/api/demo", handleDemo);
  app.use("/api/chat", handleChat);

  const useMockAuth = process.env["USE_MOCK_AUTH"] === "true";
  if (useMockAuth) {
    console.log("[SERVER] Using MOCK AUTH routes (no database required)");
    app.use("/api/auth", mockAuthRoutes);
  } else {
    app.use("/api/auth", authRoutes);
  }

  app.use("/api/users", userRoutes);
  app.use("/api/usage", usageRoutes);
  app.use("/api/billing", billingRoutes);
  app.use("/api/subscriptions", subscriptionRoutes);
  app.use("/api/ai", aiRoutes);
  app.use("/api/devops", devopsRoutes);
  app.use("/api/security", securityRoutes);
  app.use("/api/teams", teamRoutes);
  app.use("/api/admin", adminRoutes);

  // Living Engineering Intelligence API
  app.use("/api/world-model", worldModelRoutes);

  if (process.env.NODE_ENV === "production" && process.env.SENTRY_DSN) {
    setupSentryErrorHandler(app);
  }

  app.get("/api/ping", (_req, res) => {
    res.json({
      message: "Hello from FeexSystems Enhanced Platform!",
      timestamp: new Date().toISOString(),
      version: "2.0.0",
    });
  });

  if (process.env.NODE_ENV === "production") {
    const spaPath = path.resolve(__dirname, "..", "spa");
    app.use(express.static(spaPath));
    app.get("*", (req, res, next) => {
      if (req.originalUrl.startsWith("/api/")) return next();
      res.sendFile(path.join(spaPath, "index.html"));
    });
  }

  app.use("/api/*", (_req, res) => {
    res.status(404).json({
      success: false,
      error: {
        type: "NOT_FOUND_ERROR",
        message: "API endpoint not found",
        code: "API_ENDPOINT_NOT_FOUND",
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      },
    });
  });

  app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Unhandled error:", error);
    res.status(500).json({
      success: false,
      error: {
        type: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
        code: "INTERNAL_ERROR",
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...(process.env.NODE_ENV === "development" && { details: error.message }),
      },
    });
  });

  return app;
}

export const app = createServer();

export async function initializeInfrastructure() {
  console.log("🚀 Initializing infrastructure...");
  try {
    await connectDatabase();
    createRedisClient();
    await aiService.initialize();
    await securityService.initialize();
    await securityCronService.initialize();
    console.log("✅ Infrastructure initialized successfully");
  } catch (error) {
    console.error("❌ Infrastructure initialization failed:", error);
    throw error;
  }
}

export async function startServer() {
  const port = process.env.PORT || 3001;
  await initializeInfrastructure();
  const httpServer = createHttpServer(app);
  initializeDeploymentWebSocket(httpServer);
  httpServer.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📡 WebSocket endpoints available at ws://localhost:${port}/socket.io/deployments`);
  });
  return httpServer;
}

const isMainModule = import.meta.url === `file://${process.argv[1].replace(/\\/g, "/")}`;
if (isMainModule) startServer().catch(console.error);
