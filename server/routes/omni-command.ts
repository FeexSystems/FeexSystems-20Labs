import { Request, Response, Router } from "express";
import { executeOmniCommand } from "../lib/services/omni-command.service";
import { validateOmniRequest } from "../../shared/orchestration-schema";
import { hardQueryRateLimiter } from "../lib/middleware/production-security";

const router = Router();

router.use(hardQueryRateLimiter);

router.post("/", async (req: Request, res: Response) => {
  try {
    const parsed = validateOmniRequest(req.body);
    if (!parsed.success || !parsed.data) {
      return res.status(400).json({
        success: false,
        error: parsed.error || "Invalid Omni-Command request",
      });
    }

    const result = await executeOmniCommand(parsed.data);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("[omni-command] failed:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Omni-Command failed",
    });
  }
});

router.post("/stream", async (req: Request, res: Response) => {
  const parsed = validateOmniRequest(req.body);
  if (!parsed.success || !parsed.data) {
    return res.status(400).json({
      success: false,
      error: parsed.error || "Invalid Omni-Command request",
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
    const result = await executeOmniCommand(parsed.data, (traceStep) => send("trace", traceStep));
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
