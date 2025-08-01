import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { handleDemo } from "./routes/demo";
import { handleChat } from "./routes/chat";
import { handleHealthCheck, handleReadinessCheck, handleLivenessCheck } from "./routes/health";
import subscriptionRoutes from "./routes/subscriptions";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import { connectDatabase } from "./lib/database";
import { createRedisClient } from "./lib/redis";

// Load environment variables
dotenv.config();

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  
  // Serve uploaded files
  app.use('/uploads', express.static('uploads'));

  // Health check endpoints (should be first)
  app.get("/health", handleHealthCheck);
  app.get("/health/ready", handleReadinessCheck);
  app.get("/health/live", handleLivenessCheck);

  // API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ 
      message: "Hello from FeexSystems Enhanced Platform!", 
      timestamp: new Date().toISOString(),
      version: "2.0.0"
    });
  });

  app.get("/api/demo", handleDemo);
  app.post("/api/chat", handleChat);
  
  // Authentication routes
  app.use("/api/auth", authRoutes);
  
  // User routes
  app.use("/api/users", userRoutes);
  
  // Subscription routes
  app.use("/api/subscriptions", subscriptionRoutes);

  // 404 handler for API routes
  app.use("/api/*", (_req, res) => {
    res.status(404).json({ 
      error: "API endpoint not found",
      timestamp: new Date().toISOString()
    });
  });

  // Global error handler
  app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
      error: "Internal server error",
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  });

  return app;
}

// Initialize infrastructure connections
export async function initializeInfrastructure() {
  console.log('🚀 Initializing infrastructure...');
  
  try {
    // Connect to database
    await connectDatabase();
    
    // Initialize Redis
    createRedisClient();
    
    console.log('✅ Infrastructure initialized successfully');
  } catch (error) {
    console.error('❌ Infrastructure initialization failed:', error);
    throw error;
  }
}
