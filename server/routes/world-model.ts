import express from "express";
import { processWebhook, retrieveWorld, syncPinnedProjects, verifyGitHubSignature } from "../lib/services/living-intelligence.service";

const router = express.Router();

router.get("/projects", async (_req, res) => {
  try {
    const result = await retrieveWorld("", 100);
    res.json({ success: true, data: result.projects });
  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : "World Model unavailable" });
  }
});

router.get("/navigator", async (req, res) => {
  try {
    const query = String(req.query.q || "").trim();
    if (!query) return res.status(400).json({ success: false, error: "Query is required" });
    res.json({ success: true, data: await retrieveWorld(query) });
  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : "Navigator unavailable" });
  }
});

router.post("/sync/pinned", async (_req, res) => {
  try {
    res.json({ success: true, data: await syncPinnedProjects() });
  } catch (error) {
    res.status(502).json({ success: false, error: error instanceof Error ? error.message : "GitHub sync failed" });
  }
});

router.post("/webhook", express.raw({ type: "application/json", limit: "5mb" }), async (req, res) => {
  const raw = Buffer.isBuffer(req.body) ? req.body.toString("utf8") : JSON.stringify(req.body);
  if (!verifyGitHubSignature(raw, req.header("x-hub-signature-256"))) {
    return res.status(401).json({ success: false, error: "Invalid GitHub webhook signature" });
  }
  try {
    const payload = JSON.parse(raw);
    if (payload.ref && !String(payload.ref).endsWith("/main") && payload.ref !== "refs/heads/main") {
      return res.status(202).json({ success: true, ignored: true, reason: "non-default branch" });
    }
    res.status(202).json({ success: true, data: await processWebhook(payload) });
  } catch (error) {
    res.status(400).json({ success: false, error: error instanceof Error ? error.message : "Invalid webhook" });
  }
});

export default router;
