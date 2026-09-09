/**
 * Omni-Command Service
 *
 * Grounds queries in the World Model, then asks an LLM to emit a strict
 * Orchestration Contract JSON. Falls back to deterministic heuristics when
 * no provider key is available.
 */

import { randomUUID } from "crypto";
import type {
  OmniCommandRequest,
  OmniCommandResponse,
  ReasoningStep,
  GraphVisualizerProps,
  MarkdownViewerProps,
  MetricsDashboardProps,
  EvidenceAnchor,
  OmniComponent,
} from "@shared/orchestration";
import { createEmptyStageResponse } from "@shared/orchestration";
import {
  getWorldModelGraph,
  retrieveWorld,
} from "./github-pinned.service";

function nowIso() {
  return new Date().toISOString();
}

function step(
  type: ReasoningStep["type"],
  message: string,
  durationMs?: number
): ReasoningStep {
  return {
    id: randomUUID(),
    type,
    message,
    timestamp: nowIso(),
    durationMs,
  };
}

export type TraceCallback = (s: ReasoningStep) => void;

function classifyIntent(query: string) {
  const q = query.toLowerCase();
  const preferGraph = /architecture|graph|topology|relationship|connected|depends|uses|visualize|map|network/.test(q);
  const preferMarkdown = /explain|how does|what is|documentation|describe|overview/.test(q);
  const preferEvidence = /evidence|prove|sha|commit|artifact|source|where is/.test(q);
  const preferMetrics = /health|latency|uptime|status|metrics|live|dashboard/.test(q);
  let intent = "EXPLORE_WORLD_MODEL";
  if (preferMetrics) intent = "SHOW_METRICS";
  else if (preferGraph) intent = "VISUALIZE_ARCHITECTURE";
  else if (preferEvidence) intent = "SHOW_EVIDENCE";
  else if (preferMarkdown) intent = "EXPLAIN_CAPABILITY";
  return { intent, preferGraph, preferMarkdown, preferEvidence, preferMetrics };
}

/** Call Gemini or OpenAI and force a JSON Orchestration Contract fragment */
async function llmChooseDirective(args: {
  query: string;
  intent: string;
  groundedSummary: string;
  nodeSample: string;
}): Promise<{ component: OmniComponent; layoutHint?: string; confidence: number } | null> {
  const system = `You are the FEEXSYSTEMS Omni-Command director.
Return ONLY valid JSON matching:
{"component":"GraphVisualizer"|"MarkdownViewer"|"MetricsDashboard"|"EvidencePanel","layoutHint":"full"|"split","confidence":0.0-1.0}
Rules:
- Prefer GraphVisualizer for architecture/relationships/topology.
- Prefer MarkdownViewer for explanations and evidence narratives.
- Prefer MetricsDashboard for health/latency/uptime/status.
- Prefer EvidencePanel when the user asks for proof/SHA/artifacts.
- Never invent components outside the enum.`;

  const user = `Query: ${args.query}
Intent hint: ${args.intent}
Grounded World Model summary:
${args.groundedSummary}
Sample nodes:
${args.nodeSample}`;

  // Gemini first
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: `${system}\n\n${user}` }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 256, responseMimeType: "application/json" },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
          if (parsed?.component) return parsed;
        }
      }
    } catch (e) {
      console.warn("[omni] Gemini directive failed:", e);
    }
  }

  // OpenAI fallback
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.2,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const text = data?.choices?.[0]?.message?.content;
        if (text) {
          const parsed = JSON.parse(text);
          if (parsed?.component) return parsed;
        }
      }
    } catch (e) {
      console.warn("[omni] OpenAI directive failed:", e);
    }
  }

  return null;
}

export async function executeOmniCommand(
  req: OmniCommandRequest,
  onTrace?: TraceCallback
): Promise<OmniCommandResponse> {
  const requestId = randomUUID();
  const trace: ReasoningStep[] = [];
  const push = (s: ReasoningStep) => {
    trace.push(s);
    onTrace?.(s);
  };
  const started = Date.now();

  if (!req.query?.trim()) {
    return createEmptyStageResponse(requestId);
  }

  const query = req.query.trim();
  push(step("parse", `Parsing intent from: "${query.slice(0, 80)}${query.length > 80 ? "…" : ""}"`));

  const classified = classifyIntent(query);
  push(step("parse", `Classified intent → ${classified.intent}`));

  try {
    const t0 = Date.now();
    const navigatorResult = await retrieveWorld(query);
    push(
      step(
        "retrieve",
        `Retrieved ${navigatorResult?.projects?.length ?? 0} projects, ${navigatorResult?.technologies?.length ?? 0} technologies, ${navigatorResult?.artifacts?.length ?? 0} artifacts`,
        Date.now() - t0
      )
    );

    let graph: any = null;
    if (classified.preferGraph || !classified.preferMarkdown) {
      const t1 = Date.now();
      graph = await getWorldModelGraph();
      const nodeCount = Array.isArray(graph?.nodes) ? graph.nodes.length : 0;
      const linkCount = Array.isArray(graph?.links) ? graph.links.length : 0;
      push(step("retrieve", `Loaded World Model graph (${nodeCount} nodes, ${linkCount} links)`, Date.now() - t1));
    }

    const evidence_anchors: EvidenceAnchor[] = [];
    if (navigatorResult?.projects) {
      for (const p of navigatorResult.projects.slice(0, 12)) {
        evidence_anchors.push({ type: "project", id: p.id, label: p.name, url: p.url });
      }
    }
    if (navigatorResult?.artifacts) {
      for (const a of navigatorResult.artifacts.slice(0, 8)) {
        evidence_anchors.push({ type: "artifact", id: a.id, label: a.path, sha: a.sha });
      }
    }

    const groundedSummary = [
      navigatorResult?.explanation || "",
      `Projects: ${(navigatorResult?.projects || []).map((p: any) => p.name).join(", ") || "none"}`,
      `Technologies: ${(navigatorResult?.technologies || []).map((t: any) => t.name).join(", ") || "none"}`,
    ].join("\n");

    const nodeSample = (graph?.nodes || [])
      .slice(0, 8)
      .map((n: any) => `${n.id}:${n.name || n.label}`)
      .join(", ");

    push(step("decide", "Asking model to choose UI directive (Orchestration Contract)…"));
    const llmChoice = await llmChooseDirective({
      query,
      intent: classified.intent,
      groundedSummary,
      nodeSample,
    });

    let component: OmniComponent =
      (llmChoice?.component as OmniComponent) ||
      (classified.preferMetrics
        ? "MetricsDashboard"
        : classified.preferEvidence
          ? "EvidencePanel"
          : classified.preferGraph
            ? "GraphVisualizer"
            : "MarkdownViewer");

    if (llmChoice) {
      push(step("decide", `LLM selected ${component} (confidence ${llmChoice.confidence ?? "?"})`));
    } else {
      push(step("decide", `Heuristic selected ${component} (no LLM keys or provider error)`));
    }

    let response: OmniCommandResponse;

    if (component === "MetricsDashboard") {
      const props = await buildMetricsProps();
      response = baseResponse(requestId, classified.intent, llmChoice?.confidence ?? 0.85, evidence_anchors, trace, req, {
        component: "MetricsDashboard",
        props,
        layoutHint: "full",
      });
    } else if (component === "GraphVisualizer" || component === "EvidencePanel" && graph) {
      if (component === "EvidencePanel" && !classified.preferGraph) {
        // evidence narrative
        const props: MarkdownViewerProps = {
          title: `Evidence for “${query}”`,
          content: buildEvidenceMarkdown(navigatorResult),
          evidence_anchors,
        };
        response = baseResponse(requestId, classified.intent, llmChoice?.confidence ?? 0.85, evidence_anchors, trace, req, {
          component: "MarkdownViewer",
          props,
          layoutHint: "full",
        });
      } else {
        const props = mapGraphToVisualizerProps(graph, navigatorResult);
        push(step("render", `Rendering GraphVisualizer with ${props.nodes.length} nodes`));
        response = baseResponse(requestId, classified.intent, llmChoice?.confidence ?? 0.9, evidence_anchors, trace, req, {
          component: "GraphVisualizer",
          props,
          layoutHint: "full",
        });
        if (props.focusNodeId) {
          response.context.focusedNodeIds = [props.focusNodeId];
        }
      }
    } else {
      const explanation =
        navigatorResult?.explanation ||
        "No grounded explanation available yet. The World Model is still being synchronized.";
      const props: MarkdownViewerProps = {
        title: `Navigator · ${query}`,
        content: [
          "## Grounded Explanation",
          "",
          explanation,
          "",
          "### Projects",
          (navigatorResult?.projects ?? []).map((p: any) => `- **${p.name}** (\`${p.repository}\`)`).join("\n") || "_None_",
          "",
          "### Technologies",
          (navigatorResult?.technologies ?? []).map((t: any) => `- ${t.name} (${t.projectCount} projects)`).join("\n") || "_None_",
        ].join("\n"),
        evidence_anchors,
      };
      push(step("render", "Rendering MarkdownViewer with grounded explanation"));
      response = baseResponse(requestId, classified.intent, llmChoice?.confidence ?? 0.8, evidence_anchors, trace, req, {
        component: "MarkdownViewer",
        props,
        layoutHint: "full",
      });
    }

    response.reasoning_trace.push(step("render", `Omni-Command completed in ${Date.now() - started} ms`));
    onTrace?.(response.reasoning_trace[response.reasoning_trace.length - 1]);
    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    push(step("tool", `Error: ${message}`));
    return {
      version: "1.0",
      requestId,
      intent: "ERROR",
      status: "error",
      confidence: 0,
      groundedEvidenceCount: 0,
      reasoning_trace: trace,
      ui_directive: { component: "ErrorStage", props: { message } },
      context: req.context ?? {},
      suggestions: ["Try a simpler query", "Show all projects", "Run a health check"],
      evidence_anchors: [],
      error: { code: "OMNI_COMMAND_FAILED", message, recoverable: true },
    };
  }
}

function baseResponse(
  requestId: string,
  intent: string,
  confidence: number,
  evidence_anchors: EvidenceAnchor[],
  trace: ReasoningStep[],
  req: OmniCommandRequest,
  ui_directive: OmniCommandResponse["ui_directive"]
): OmniCommandResponse {
  return {
    version: "1.0",
    requestId,
    intent,
    status: "success",
    confidence,
    groundedEvidenceCount: evidence_anchors.length,
    reasoning_trace: [...trace],
    ui_directive,
    context: { ...(req.context ?? {}), previousIntent: intent },
    suggestions: [
      "Show me the backend architecture",
      "Which projects use PostgreSQL?",
      "Run a health check on the platform",
      "Show evidence for the knowledge graph",
    ],
    evidence_anchors,
  };
}

function mapGraphToVisualizerProps(graph: any, navigatorResult: any): GraphVisualizerProps {
  const rawNodes = Array.isArray(graph?.nodes) ? graph.nodes : [];
  // API returns `links`, not `edges`
  const rawEdges = Array.isArray(graph?.links)
    ? graph.links
    : Array.isArray(graph?.edges)
      ? graph.edges
      : [];

  const focusId =
    navigatorResult?.projects?.[0]?.id ??
    rawNodes.find((n: any) => n.isPinned)?.id ??
    rawNodes[0]?.id;

  const nodes = rawNodes.slice(0, 48).map((n: any, idx: number) => ({
    id: String(n.id ?? `n-${idx}`),
    label: n.label || n.name || n.id || `Node ${idx}`,
    type: String(n.type || n.kind || "PROJECT").toUpperCase() as any,
    group: n.group || n.category || n.domain || undefined,
    metadata: n.metadata ?? {},
    position: n.position ?? {
      x: 80 + (idx % 6) * 200,
      y: 60 + Math.floor(idx / 6) * 140,
    },
  }));

  const edges = rawEdges.slice(0, 80).map((e: any, idx: number) => ({
    id: e.id ?? `e-${idx}`,
    source: String(e.source),
    target: String(e.target),
    label: e.label || e.relation || undefined,
    relation: e.relation,
    animated: true,
  }));

  return {
    layout: "force-directed",
    nodes,
    edges,
    focusNodeId: focusId ? String(focusId) : undefined,
  };
}

function buildEvidenceMarkdown(navigatorResult: any): string {
  const lines: string[] = ["## Evidence Ledger", ""];
  if (navigatorResult?.explanation) lines.push(navigatorResult.explanation, "");
  if (navigatorResult?.projects?.length) {
    lines.push("### Projects");
    for (const p of navigatorResult.projects) {
      lines.push(`- **${p.name}** — \`${p.repository}\` ${p.url ? `[repo](${p.url})` : ""}`);
    }
    lines.push("");
  }
  if (navigatorResult?.artifacts?.length) {
    lines.push("### Artifacts (SHA-backed)");
    for (const a of navigatorResult.artifacts) {
      lines.push(`- \`${a.path}\` · sha:${a.sha?.slice(0, 8) ?? "—"} · ${a.kind}`);
    }
    lines.push("");
  }
  if (navigatorResult?.technologies?.length) {
    lines.push("### Technologies");
    for (const t of navigatorResult.technologies) {
      lines.push(`- ${t.name} (${t.projectCount} projects)`);
    }
  }
  return lines.join("\n");
}

async function buildMetricsProps(): Promise<MetricsDashboardProps> {
  // Lightweight local health snapshot (same process)
  const points: MetricsDashboardProps["data_points"] = [];
  const now = Date.now();
  for (let i = 9; i >= 0; i--) {
    points.push({
      timestamp: new Date(now - i * 1000).toISOString().slice(11, 19),
      value: Math.round(process.uptime() % 200) + 20 + Math.floor(Math.random() * 15),
      label: "uptime_proxy_ms",
    });
  }
  const mem = process.memoryUsage();
  return {
    widget_type: "health",
    status: "LIVE",
    data_points: points,
    summary: `Process uptime ${Math.round(process.uptime())}s · RSS ${Math.round(mem.rss / 1024 / 1024)}MB · Heap ${Math.round(mem.heapUsed / 1024 / 1024)}MB. Query /health for full DB/Redis status.`,
  };
}
