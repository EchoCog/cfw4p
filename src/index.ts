// ElizaOS-OpenCog-GnuCash Workers for Platforms Deployment
// Copyright (c) 2024 ElizaOS-OpenCog-GnuCash Project
// Licensed under the GPL-2.0 license

import { Hono } from "hono";
import { cors } from "hono/cors";

import {
  AddDispatchLimits,
  AddOutboundWorker,
  FetchTable,
  GetDispatchLimitFromScript,
  GetOutboundWorkerFromScript,
  Initialize,
} from "./db";
import type { Env } from "./env";
import {
  GetScriptsByTags,
  DeleteScriptInDispatchNamespace,
  GetScriptsInDispatchNamespace,
  PutScriptInDispatchNamespace,
  PutTagsOnScript,
  GetTagsOnScript,
} from "./resource";
import { handleDispatchError, withCustomer, withDb } from "./router";
import { renderPage, BuildTable, UploadPage } from "./render";
import { DispatchLimits, OutboundWorker, WorkerArgs } from "./types";
import { ElizoscogAPI, FinancialQuery } from "./elizoscog-api";

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

// Initialize ElizaOS-OpenCog-GnuCash API
const elizoscogAPI = new ElizoscogAPI();

app.get("/favicon.ico", () => {
  return new Response();
});

/*
 * ElizaOS-OpenCog-GnuCash API Endpoints
 */

// Get financial accounts
app.get("/api/accounts", async (c) => {
  try {
    const accounts = await elizoscogAPI.getAccounts();
    return c.json({
      success: true,
      data: accounts,
      message: "Financial accounts retrieved successfully",
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        error: "Failed to retrieve accounts",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

// Get recent transactions
app.get("/api/transactions", async (c) => {
  try {
    const limit = parseInt(c.req.query("limit") || "50");
    const transactions = await elizoscogAPI.getTransactions(limit);
    return c.json({
      success: true,
      data: transactions,
      message: "Transactions retrieved successfully",
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        error: "Failed to retrieve transactions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

// Ask financial questions using natural language
app.post("/api/ask", async (c) => {
  try {
    const query: FinancialQuery = await c.req.json();

    if (!query.query) {
      return c.json(
        {
          success: false,
          error: "Query is required",
        },
        400,
      );
    }

    const response = await elizoscogAPI.askFinancialQuestion(query);
    return c.json({
      success: true,
      data: response,
      message: "Financial question processed successfully",
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        error: "Failed to process financial question",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

// Get financial insights
app.get("/api/insights", async (c) => {
  try {
    const insights = await elizoscogAPI.getFinancialInsights();
    return c.json({
      success: true,
      data: insights,
      message: "Financial insights generated successfully",
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        error: "Failed to generate insights",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

// Simulate transaction
app.post("/api/simulate-transaction", async (c) => {
  try {
    const transaction = await c.req.json();
    const result = await elizoscogAPI.simulateTransaction(transaction);
    return c.json({
      success: result.success,
      data: result,
      message: result.message,
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        error: "Failed to simulate transaction",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

/*
 * Workers for Platforms Management Interface
 */

// Main dashboard
app.get("/", withDb, async (c) => {
  let body = `
    <div style="max-width: 1200px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
      <h1>🌟 ElizaOS-OpenCog-GnuCash Workers for Platforms</h1>
      <p><strong>Revolutionary AI-Financial Intelligence on Cloudflare Workers</strong></p>
      
      <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3>🚀 API Endpoints</h3>
        <ul>
          <li><strong>GET /api/accounts</strong> - Retrieve financial accounts</li>
          <li><strong>GET /api/transactions</strong> - Get recent transactions</li>
          <li><strong>POST /api/ask</strong> - Ask natural language financial questions</li>
          <li><strong>GET /api/insights</strong> - Get AI-powered financial insights</li>
          <li><strong>POST /api/simulate-transaction</strong> - Simulate transactions</li>
        </ul>
      </div>

      <div style="background: #e8f4fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3>🧠 Cognitive Financial Intelligence</h3>
        <p>This deployment integrates:</p>
        <ul>
          <li><strong>ElizaOS</strong> - Multi-agent AI framework</li>
          <li><strong>OpenCog</strong> - Cognitive architecture & reasoning</li>
          <li><strong>GnuCash</strong> - Financial management system</li>
        </ul>
      </div>
      
      <hr style="margin: 30px 0;"/>
      
      <div>
        <form style="display: inline" action="/init"><input type="submit" value="Initialize" /></form>
        <small> - Resets db and dispatch namespace to initial state</small>
      </div>
      
      <h2>DB Tables</h2>`;

  try {
    body += [
      BuildTable("customers", await FetchTable(c.var.db, "customers")),
      BuildTable(
        "customer_tokens",
        await FetchTable(c.var.db, "customer_tokens"),
      ),
    ].join("");
  } catch (e) {
    body +=
      '<div>No DB data. Do you need to <a href="/init">initialize</a>?</div>';
  }

  try {
    const scripts = await GetScriptsInDispatchNamespace(c.env);
    body += "</br><h2>Dispatch Namespace</h2>";
    body += BuildTable(c.env.DISPATCH_NAMESPACE_NAME, scripts);
  } catch (e) {
    console.log(JSON.stringify(e, Object.getOwnPropertyNames(e)));
    body += `<div>Dispatch namespace "${c.env.DISPATCH_NAMESPACE_NAME}" was not found.</div>`;
  }

  body += "</div>";
  return c.html(renderPage(body));
});

// Initialize example data
app.get("/init", withDb, async (c) => {
  const scripts = await GetScriptsInDispatchNamespace(c.env);
  await Promise.all(
    scripts.map(async (script) =>
      DeleteScriptInDispatchNamespace(c.env, script.id),
    ),
  );
  await Initialize(c.var.db);
  return Response.redirect(c.req.url.replace("/init", ""));
});

// Upload interface
app.get("/upload", (c) => {
  const customUploadPage = `
    <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
      <h2>Upload ElizaOS-OpenCog-GnuCash Worker Script</h2>
      <p>Deploy your cognitive financial intelligence workers to the platform.</p>
      ${UploadPage}
    </div>
  `;
  return c.html(renderPage(customUploadPage));
});

// Get scripts for a customer
app.get("/script", withDb, withCustomer, async (c) => {
  const scripts = await GetScriptsByTags(c.env, [
    { tag: c.var.customer.id, allow: true },
  ]);
  return c.json(scripts);
});

// Dispatch worker execution
app.get("/dispatch/:name", withDb, async (c) => {
  try {
    const scriptName = c.req.param("name");
    const dispatchLimits = (
      await GetDispatchLimitFromScript(c.var.db, scriptName)
    ).results as unknown as DispatchLimits;
    const outboundWorker = (
      await GetOutboundWorkerFromScript(c.var.db, scriptName)
    ).results as unknown as OutboundWorker;
    const workerArgs: WorkerArgs = {};
    const worker = c.env.dispatcher.get(scriptName, workerArgs, {
      limits: dispatchLimits,
      outbound: outboundWorker?.outbound_script_id,
    });

    return await worker.fetch(c.req.raw);
  } catch (e: unknown) {
    return handleDispatchError(c, e);
  }
});

// Upload customer script
app.put("/script/:name", withDb, withCustomer, async (c) => {
  const scriptName = c.req.param("name");

  try {
    const tags = await GetTagsOnScript(c.env, scriptName);
    if (tags.length > 0 && !tags.includes(c.var.customer.id)) {
      return c.text("Script name already reserved", 409);
    }
  } catch (e) {
    return c.text("Could not complete request", 500);
  }

  let scriptContent: string;
  let limits: DispatchLimits;
  let outbound: OutboundWorker;
  try {
    const data: {
      script: string;
      dispatch_config: {
        limits?: { cpuMs: number; memory: number };
        outbound: string;
      };
    } = (await c.req.json()) as {
      script: string;
      dispatch_config: {
        limits?: { cpuMs: number; memory: number };
        outbound: string;
      };
    };

    scriptContent = data.script;
    limits = { script_id: scriptName, ...data.dispatch_config.limits };
    outbound = {
      script_id: scriptName,
      outbound_script_id: data.dispatch_config.outbound,
    };
  } catch (e) {
    return c.text(
      "Expected json: { script: string, dispatch_config: { limits?: { cpuMs: number, memory: number }, outbound: string }}",
      400,
    );
  }

  const scriptResponse = await PutScriptInDispatchNamespace(
    c.env,
    scriptName,
    scriptContent,
  );
  if (!scriptResponse.ok) {
    return c.json(await scriptResponse.json() as Record<string, any>, 400);
  }

  if (limits.cpuMs || limits.memory) await AddDispatchLimits(c.var.db, limits);

  if (outbound?.outbound_script_id !== "") {
    await AddOutboundWorker(c.var.db, outbound);
  }

  const tagsResponse = await PutTagsOnScript(c.env, scriptName, [
    c.var.customer.id,
    c.var.customer.plan_type,
  ]);
  if (!tagsResponse.ok) {
    console.log(
      tagsResponse.url,
      tagsResponse.status,
      await tagsResponse.text(),
    );
  }

  return c.text("ElizaOS-OpenCog-GnuCash worker deployed successfully", 201);
});

export default app;
