import { Request, Response, Router } from "express";
import {
  getPinnedWorldModelProjects,
  syncPinnedProjects,
} from "../lib/services/github-pinned.service";

const router = Router();

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

router.post("/sync/github-pinned", async (_req: Request, res: Response) => {
  try {
    const projects = await syncPinnedProjects();
    res.json({
      success: true,
      source: "github-profile-pinned",
      synchronizedAt: new Date().toISOString(),
      projects,
      count: projects.length,
    });
  } catch (error) {
    console.error("GitHub pinned World Model sync failed:", error);
    res.status(502).json({
      success: false,
      error: error instanceof Error ? error.message : "GitHub synchronization failed",
    });
  }
});

export default router;
