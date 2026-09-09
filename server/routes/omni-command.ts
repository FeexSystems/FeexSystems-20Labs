import { Request, Response, Router } from "express";
import { executeOmniCommand } from "../lib/services/omni-command.service";
import type { OmniCommandRequest } from "../../../shared/orchestration";

const router = Router();

/**
 * POST /api/world-model/omni-command
 * Body: { query: string, context?: OmniCommandContext }
 * Returns: OmniCommandResponse (Orchestration Contract)
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const body = req.body as OmniCommandRequest;
    if (!body || typeof body.query !== "string") {
      return res.status(400).json({
        success: false,
        error: "Body must contain a string 'query' field",
      });
    }

    const result = await executeOmniCommand({
      query: body.query,
      context: body.context,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("[omni-command] failed:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Omni-Command failed",
    });
  }
});

export default router;
