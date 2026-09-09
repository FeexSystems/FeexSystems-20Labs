import { Request, Response, Router } from "express";
import { executeOmniCommand } from "../lib/services/omni-command.service";
import type { OmniCommandRequest } from "@shared/orchestration";

const router = Router();

/**
 * POST /api/world-model/omni-command
 * Body: { query: string, context?: OmniCommandContext }
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

    res.json({ success: true, data: result });
  } catch (error) {
    console.error("[omni-command] failed:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Omni-Command failed",
    });
  }
});

/**
 * POST /api/world-model/omni-command/stream
 * Server-Sent Events: streams reasoning_trace steps, then final payload.
 * Events:
 *   event: trace   data: ReasoningStep
 *   event: result  data: OmniCommandResponse
 *   event: error   data: { message }
 */
router.post("/stream", async (req: Request, res: Response) => {
  const body = req.body as OmniCommandRequest;
  if (!body || typeof body.query !== "string") {
    return res.status(400).json({
      success: false,
      error: "Body must contain a string 'query' field",
    });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const send = (event: string, data: unknown) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const result = await executeOmniCommand(
      { query: body.query, context: body.context },
      (traceStep) => send("trace", traceStep)
    );
    send("result", result);
  } catch (error) {
    send("error", {
      message: error instanceof Error ? error.message : "Omni-Command stream failed",
    });
  } finally {
    res.end();
  }
});

export default router;
