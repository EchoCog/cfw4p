// Minimal Workers for Platforms entry point for testing
// This is a simplified version to test basic functionality

import { Hono } from "hono";
import { cors } from "hono/cors";

export interface Env {
  DB?: D1Database;
  dispatcher?: DispatchNamespace;
  DISPATCH_NAMESPACE_NAME?: string;
  DISPATCH_NAMESPACE_ACCOUNT_ID?: string;
  DISPATCH_NAMESPACE_API_TOKEN?: string;
}

const app = new Hono<{ Bindings: Env }>();

// Enable CORS for all routes
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "X-Customer-Token"],
  }),
);

// Basic health check
app.get("/", async (c) => {
  return c.json({
    success: true,
    message: "ElizaOS-OpenCog-GnuCash Workers for Platforms is running!",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// API health check
app.get("/api/health", async (c) => {
  return c.json({
    success: true,
    status: "healthy",
    services: {
      worker: "operational",
      database: c.env.DB ? "connected" : "not configured",
      dispatcher: c.env.dispatcher ? "configured" : "not configured",
    },
  });
});

// Test API endpoint
app.get("/api/test", async (c) => {
  return c.json({
    success: true,
    message: "API endpoint is working",
    environment: {
      DISPATCH_NAMESPACE_NAME: c.env.DISPATCH_NAMESPACE_NAME || "not set",
      has_db: !!c.env.DB,
      has_dispatcher: !!c.env.dispatcher,
    },
  });
});

// Test dispatch functionality (if configured)
app.get("/dispatch/test", async (c) => {
  if (!c.env.dispatcher) {
    return c.json(
      {
        success: false,
        error: "Dispatch namespace not configured",
      },
      500,
    );
  }

  try {
    // This is a basic test - in production you'd dispatch to actual customer workers
    return c.json({
      success: true,
      message: "Dispatch namespace is configured and ready",
      namespace: c.env.DISPATCH_NAMESPACE_NAME,
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        error: "Dispatch test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

export default app;
