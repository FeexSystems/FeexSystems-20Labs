import { Request, Response, Router } from "express";
import {
  getAllProjectsEvidenceSummary,
  getArtifactContent,
  getPinnedWorldModelProjects,
  getProjectEvidence,
  getWorldModelGraph,
  processWebhook,
  retrieveWorld,
  syncPinnedProjects,
  verifyGitHubSignature,
} from "../lib/services/github-pinned.service";
import { retrieveWorldHybrid } from "../lib/services/hybrid-retrieval.service";
import { reindexWorldModelEmbeddings, ensureEmbeddingTables } from "../lib/services/embedding.service";
import {
  reconstructProjectState,
  listProjectEvents,
} from "../lib/services/temporal-reconstruction.service";
import {
  provisionWebhooksForWorldModel,
  createOrUpdateWorldModelWebhook,
  listRepoWebhooks,
  getConfiguredWebhookUrl,
} from "../lib/services/webhook-provisioning.service";
import {
  runWorldModelMaintenance,
  getLastMaintenanceReport,
  isMaintenanceRunning,
} from "../lib/services/world-model-maintenance.service";

const router = Router();

type RawRequest = Request & { rawBody?: Buffer };

router.get("/projects", async (_req: Request, res: Response) => {
  try {
    const projects = await getPinnedWorldModelProjects();
    res.json({
      success: true,
      source: "world-model",
      projects,
      count: Array.isArray(projects) ? projects.length : 0,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "World Model query failed",
    });
  }
});

router.get("/graph", async (_req: Request, res: Response) => {
  try {
    const graph = await getWorldModelGraph();
    res.json({ success: true, source: "world-model-graph", data: graph });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "World Model graph query failed",
    });
  }
});

router.get("/evidence/projects", async (_req: Request, res: Response) => {
  try {
    const projects = await getAllProjectsEvidenceSummary();
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Evidence projects query failed",
    });
  }
});

router.get(["/evidence/content", "/evidence/:projectId/content"], async (req: Request, res: Response) => {
  try {
    const projectId = decodeURIComponent(String(req.query.projectId || req.params.projectId || "")).trim();
    const filePath = String(req.query.path || "").trim();
    if (!projectId || !filePath) {
      return res.status(400).json({ success: false, error: "Project ID and file path query are required" });
    }
    const result = await getArtifactContent(projectId, filePath);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Artifact content fetch failed",
    });
  }
});

router.get(["/evidence/detail", "/evidence/:projectId"], async (req: Request, res: Response) => {
  try {
    const projectId = decodeURIComponent(String(req.query.projectId || req.params.projectId || "")).trim();
    if (!projectId) {
      return res.status(400).json({ success: false, error: "Project ID is required" });
    }
    const evidence = await getProjectEvidence(projectId);
    res.json({ success: true, data: evidence });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Evidence retrieval failed",
    });
  }
});

/** Temporal reconstruction — state at commit or date */
router.get("/temporal/:projectId", async (req: Request, res: Response) => {
  try {
    const projectId = decodeURIComponent(String(req.params.projectId || "")).trim();
    if (!projectId) {
      return res.status(400).json({ success: false, error: "projectId is required" });
    }
    const snapshot = await reconstructProjectState({
      projectId,
      at: req.query.at ? String(req.query.at) : undefined,
      commitSha: req.query.commit ? String(req.query.commit) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : 50,
    });
    res.json({ success: true, data: snapshot });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Temporal reconstruction failed",
    });
  }
});

router.get("/temporal/:projectId/events", async (req: Request, res: Response) => {
  try {
    const projectId = decodeURIComponent(String(req.params.projectId || "")).trim();
    const events = await listProjectEvents(projectId, req.query.limit ? Number(req.query.limit) : 50);
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Event listing failed",
    });
  }
});

router.get("/navigator", async (req: Request, res: Response) => {
  try {
    const q = String(req.query.q || "").trim();
    if (!q) {
      return res.status(400).json({ success: false, error: "Query parameter 'q' is required" });
    }
    const hybrid = String(req.query.hybrid || "true") !== "false";
    const result = hybrid ? await retrieveWorldHybrid(q) : await retrieveWorld(q);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Navigator retrieval failed",
    });
  }
});

router.post("/navigator", async (req: Request, res: Response) => {
  try {
    const q = String(req.body?.query || req.body?.q || "").trim();
    if (!q) {
      return res.status(400).json({ success: false, error: "Body field 'query' is required" });
    }
    const hybrid = req.body?.hybrid !== false;
    const result = hybrid ? await retrieveWorldHybrid(q) : await retrieveWorld(q);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Navigator retrieval failed",
    });
  }
});

router.post("/sync/github-pinned", async (_req: Request, res: Response) => {
  try {
    const projects = await syncPinnedProjects();
    let embeddings: unknown = null;
    try {
      embeddings = await reindexWorldModelEmbeddings();
    } catch {
      embeddings = { skipped: true };
    }
    res.json({
      success: true,
      source: "github-profile-pinned",
      synchronizedAt: new Date().toISOString(),
      projects,
      count: projects.length,
      embeddings,
    });
  } catch (error) {
    console.error("GitHub pinned World Model sync failed:", error);
    res.status(502).json({
      success: false,
      error: error instanceof Error ? error.message : "GitHub synchronization failed",
    });
  }
});

router.post("/embeddings/reindex", async (_req: Request, res: Response) => {
  try {
    await ensureEmbeddingTables();
    const result = await reindexWorldModelEmbeddings();
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Embedding reindex failed",
    });
  }
});

/** Provision GitHub webhooks for World Model repos */
router.post("/webhooks/provision", async (req: Request, res: Response) => {
  try {
    const pinnedOnly = req.body?.pinnedOnly !== false;
    const result = await provisionWebhooksForWorldModel({ pinnedOnly });
    res.json({
      success: true,
      callbackUrl: getConfiguredWebhookUrl(),
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Webhook provisioning failed",
    });
  }
});

router.post("/webhooks/provision/:owner/:repo", async (req: Request, res: Response) => {
  try {
    const fullName = `${req.params.owner}/${req.params.repo}`;
    const result = await createOrUpdateWorldModelWebhook(fullName);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Webhook provisioning failed",
    });
  }
});

router.get("/webhooks/:owner/:repo", async (req: Request, res: Response) => {
  try {
    const fullName = `${req.params.owner}/${req.params.repo}`;
    const hooks = await listRepoWebhooks(fullName);
    res.json({ success: true, data: hooks });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "List webhooks failed",
    });
  }
});

/** Autonomous maintenance */
router.post("/maintenance/run", async (req: Request, res: Response) => {
  try {
    const report = await runWorldModelMaintenance({
      skipSync: Boolean(req.body?.skipSync),
      skipEmbed: Boolean(req.body?.skipEmbed),
      eventRetentionDays: req.body?.eventRetentionDays
        ? Number(req.body.eventRetentionDays)
        : undefined,
    });
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Maintenance failed",
    });
  }
});

router.get("/maintenance/status", async (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      running: isMaintenanceRunning(),
      lastRun: getLastMaintenanceReport(),
    },
  });
});

router.post("/webhook", async (req: RawRequest, res: Response) => {
  const raw = req.rawBody?.toString("utf8") || JSON.stringify(req.body);
  if (!verifyGitHubSignature(raw, req.header("x-hub-signature-256"))) {
    return res.status(401).json({ success: false, error: "Invalid GitHub webhook signature" });
  }
  try {
    const payload = req.body;
    if (
      payload.ref &&
      payload.repository?.default_branch &&
      payload.ref !== `refs/heads/${payload.repository.default_branch}`
    ) {
      return res.status(202).json({
        success: true,
        ignored: true,
        reason: "non-default branch",
      });
    }
    const result = await processWebhook(payload);
    res.status(202).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Invalid webhook",
    });
  }
});

export default router;
