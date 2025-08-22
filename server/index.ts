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
import userRoutes from "./routes/users";
import usageRoutes from "./routes/usage";
import billingRoutes from "./routes/billing";
import aiRoutes from "./routes/ai";
import devopsRoutes from "./routes/devops";
import securityRoutes from "./routes/security";
import teamRoutes from "./routes/teams";
import adminRoutes from "./routes/admin";
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

  // Sentry monitoring (production only)
  if (process.env.NODE_ENV === "production" && process.env.SENTRY_DSN) {
    initializeSentry(app);
  }

  // Security middleware for production
  if (process.env.NODE_ENV === "production") {
    applyProductionSecurity(app);
  } else {
    app.use(
      cors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true,
      }),
    );
  }
  app.set("json replacer", (key, value) =>
    typeof value === "bigint" ? value.toString() : value,
  );
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Serve uploaded files
  app.use("/uploads", express.static("uploads"));

  // Health check endpoints (should be first)
  app.get("/health", handleHealthCheck);
  app.get("/health/ready", handleReadinessCheck);
  app.get("/health/live", handleLivenessCheck);

  // API routes
  app.use("/api/demo", handleDemo);
  app.use("/api/chat", handleChat);
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/usage", usageRoutes);
  app.use("/api/billing", billingRoutes);
  app.use("/api/subscriptions", subscriptionRoutes);
  app.use("/api/ai", aiRoutes);
  app.use("/api/devops", devopsRoutes);
  app.use("/api/security", securityRoutes);
  app.use("/api/teams", teamRoutes);
  app.use("/api/admin", adminRoutes);

  // Sentry error handler (production only)
  if (process.env.NODE_ENV === "production" && process.env.SENTRY_DSN) {
    setupSentryErrorHandler(app);
  }

  // API ping endpoint
  app.get("/api/ping", (_req, res) => {
    res.json({
      message: "Hello from FeexSystems Enhanced Platform!",
      timestamp: new Date().toISOString(),
      version: "2.0.0",
    });
  });

  // 404 handler for API routes
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

  // Serve static files in production
  if (process.env.NODE_ENV === "production") {
    app.use(express.static("dist/spa"));

    // SPA fallback - serve index.html for all non-API routes
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve("dist/spa/index.html"));
    });
  }
  // In development, let Vite handle non-API routes

  // Global error handler
  app.use(
    (
      error: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      console.error("Unhandled error:", error);
      res.status(500).json({
        success: false,
        error: {
          type: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
          code: "INTERNAL_ERROR",
          timestamp: new Date().toISOString(),
          requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ...(process.env.NODE_ENV === "development" && {
            details: error.message,
          }),
        },
      });
    },
  );

  return app;
}

// Create app instance for testing
export const app = createServer();

// Initialize infrastructure connections
export async function initializeInfrastructure() {
  console.log("🚀 Initializing infrastructure...");

  try {
    // Connect to database
    await connectDatabase();

    // Initialize Redis
    createRedisClient();

    // Initialize AI service
    await aiService.initialize();

    // Initialize Security service
    await securityService.initialize();

    // Initialize Security Cron service
    await securityCronService.initialize();

    console.log("✅ Infrastructure initialized successfully");
  } catch (error) {
    console.error("❌ Infrastructure initialization failed:", error);
    throw error;
  }
}

// Start server with WebSocket support
export async function startServer() {
  const port = process.env.PORT || 3001;

  // Initialize infrastructure first
  await initializeInfrastructure();

  // Create HTTP server
  const httpServer = createHttpServer(app);

  // Initialize WebSocket services
  initializeDeploymentWebSocket(httpServer);

  // Start listening
  httpServer.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(
      `📡 WebSocket endpoints available at ws://localhost:${port}/socket.io/deployments`,
    );
  });

  return httpServer;
}

// Start server if this file is run directly
// Note: This check is disabled for ES modules compatibility
// The server is started via Vite dev server instead
// if (import.meta.url === `file://${process.argv[1]}`) {
//   startServer().catch(console.error);
// }
