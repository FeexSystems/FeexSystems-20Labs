/**
 * Omni-Command Service
 *
 * Turns a natural-language query into a validated Orchestration Contract
 * payload that the frontend Stage can render.
 *
 * For the first shippable version we use deterministic heuristics on top of
 * the existing World Model APIs. Later this will be replaced / augmented by
 * an LLM that is forced to emit the same contract.
 */

import { randomUUID } from "crypto";
import {
  OmniCommandRequest,
  OmniCommandResponse,
  ReasoningStep,
  GraphVisualizerProps,
  MarkdownViewerProps,
  EvidenceAnchor,
  createEmptyStageResponse,
} from "../../../shared/orchestration";
import {
  getWorldModelGraph,
  getPinnedWorldModelProjects,
  retrieveWorld,
  getProjectEvidence,
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

/** Very light intent classification for the MVP */
function classifyIntent(query: string): {
  intent: string;
  preferGraph: boolean;
  preferMarkdown: boolean;
  preferEvidence: boolean;
} {
  const q = query.toLowerCase();

  const graphKeywords = [
    "architecture",
    "graph",
    "topology",
    "relationship",
    "connected",
    "depends",
    "uses",
    "show me the",
    "visualize",
    "map",
    "network",
  ];
  const markdownKeywords = [
    "explain",
    "how does",
    "what is",
    "documentation",
    "describe",
    "overview",
  ];
  const evidenceKeywords = [
    "evidence",
    "prove",
    "sha",
    "commit",
    "artifact",
    "source",
    "where is",
  ];

  const preferGraph = graphKeywords.some((k) => q.includes(k));
  const preferMarkdown = markdownKeywords.some((k) => q.includes(k));
  const preferEvidence = evidenceKeywords.some((k) => q.includes(k));

  let intent = "EXPLORE_WORLD_MODEL";
  if (preferGraph) intent = "VISUALIZE_ARCHITECTURE";
  else if (preferEvidence) intent = "SHOW_EVIDENCE";
  else if (preferMarkdown) intent = "EXPLAIN_CAPABILITY";

  return { intent, preferGraph, preferMarkdown, preferEvidence };
}

export async function executeOmniCommand(
  req: OmniCommandRequest
): Promise<OmniCommandResponse> {
  const requestId = randomUUID();
  const trace: ReasoningStep[] = [];
  const started = Date.now();

  if (!req.query?.trim()) {
    return createEmptyStageResponse(requestId);
  }

  const query = req.query.trim();
  trace.push(step("parse", `Parsing intent from: "${query.slice(0, 80)}${query.length > 80 ? "…" : ""}"`));

  const { intent, preferGraph, preferMarkdown, preferEvidence } = classifyIntent(query);
  trace.push(step("parse", `Classified intent → ${intent}`));

  try {
    // 1. Always ground in World Model retrieval
    const t0 = Date.now();
    const navigatorResult = await retrieveWorld(query);
    trace.push(
      step(
        "retrieve",
        `Retrieved ${navigatorResult?.projects?.length ?? 0} projects, ${navigatorResult?.technologies?.length ?? 0} technologies, ${navigatorResult?.artifacts?.length ?? 0} artifacts`,
        Date.now() - t0
      )
    );

    // 2. Fetch graph when useful
    let graph: Awaited<ReturnType<typeof getWorldModelGraph>> | null = null;
    if (preferGraph || !preferMarkdown) {
      const t1 = Date.now();
      graph = await getWorldModelGraph();
      const nodeCount = Array.isArray(graph?.nodes) ? graph.nodes.length : 0;
      const edgeCount = Array.isArray(graph?.edges) ? graph.edges.length : 0;
      trace.push(step("retrieve", `Loaded World Model graph (${nodeCount} nodes, ${edgeCount} edges)`, Date.now() - t1));
    }

    // 3. Build evidence anchors from navigator results
    const evidence_anchors: EvidenceAnchor[] = [];
    if (navigatorResult?.projects) {
      for (const p of navigatorResult.projects.slice(0, 12)) {
        evidence_anchors.push({
          type: "project",
          id: p.id,
          label: p.name,
          url: p.url,
        });
      }
    }
    if (navigatorResult?.artifacts) {
      for (const a of navigatorResult.artifacts.slice(0, 8)) {
        evidence_anchors.push({
          type: "artifact",
          id: a.id,
          label: a.path,
          sha: a.sha,
        });
      }
    }

    // 4. Decide component
    trace.push(step("decide", "Selecting optimal UI directive…"));

    let response: OmniCommandResponse;

    if (preferEvidence && evidence_anchors.length > 0) {
      // Evidence-focused response → Markdown + anchors
      const content = buildEvidenceMarkdown(navigatorResult);
      const props: MarkdownViewerProps = {
        title: `Evidence for “${query}”`,
        content,
        evidence_anchors,
      };
      response = {
        version: "1.0",
        requestId,
        intent,
        status: "success",
        confidence: 0.85,
        groundedEvidenceCount: evidence_anchors.length,
        reasoning_trace: trace,
        ui_directive: {
          component: "MarkdownViewer",
          props,
          layoutHint: "full",
        },
        context: {
          ...(req.context ?? {}),
          previousIntent: intent,
        },
        suggestions: [
          "Show the architecture graph",
          "Focus on the first project",
          "Which technologies are most common?",
        ],
        evidence_anchors,
      };
    } else if (preferGraph || (graph && (graph.nodes?.length ?? 0) > 0)) {
      // Graph visualizer
      const props = mapGraphToVisualizerProps(graph, navigatorResult);
      response = {
        version: "1.0",
        requestId,
        intent,
        status: "success",
        confidence: 0.9,
        groundedEvidenceCount: evidence_anchors.length,
        reasoning_trace: [
          ...trace,
          step("render", `Rendering GraphVisualizer with ${props.nodes.length} nodes`),
        ],
        ui_directive: {
          component: "GraphVisualizer",
          props,
          layoutHint: "full",
        },
        context: {
          ...(req.context ?? {}),
          previousIntent: intent,
          focusedNodeIds: props.focusNodeId ? [props.focusNodeId] : undefined,
        },
        suggestions: [
          "Explain the central node",
          "Show evidence for these relationships",
          "Which projects use PostgreSQL?",
        ],
        evidence_anchors,
      };
    } else {
      // Default: grounded explanation as Markdown
      const explanation =
        navigatorResult?.explanation ||
        "No grounded explanation available yet. The World Model is still being synchronized.";
      const props: MarkdownViewerProps = {
        title: `Navigator · ${query}`,
        content: `## Grounded Explanation\n\n${explanation}\n\n### Projects\n${(navigatorResult?.projects ?? [])
          .map((p: any) => `- **${p.name}** (\\`${p.repository}\\`)`)
          .join("\n") || "_None_"}\n\n### Technologies\n${(navigatorResult?.technologies ?? [])
          .map((t: any) => `- ${t.name} (${t.projectCount} projects)`)
          .join("\n") || "_None_"}`,
        evidence_anchors,
      };
      response = {
        version: "1.0",
        requestId,
        intent,
        status: "success",
        confidence: 0.8,
        groundedEvidenceCount: evidence_anchors.length,
        reasoning_trace: [
          ...trace,
          step("render", "Rendering MarkdownViewer with grounded explanation"),
        ],
        ui_directive: {
          component: "MarkdownViewer",
          props,
          layoutHint: "full",
        },
        context: {
          ...(req.context ?? {}),
          previousIntent: intent,
        },
        suggestions: [
          "Visualize the architecture",
          "Show me the evidence ledger",
          "List all technologies",
        ],
        evidence_anchors,
      };
    }

    const totalMs = Date.now() - started;
    response.reasoning_trace.push(
      step("render", `Omni-Command completed in ${totalMs} ms`)
    );
    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    trace.push(step("tool", `Error: ${message}`));
    return {
      version: "1.0",
      requestId,
      intent: "ERROR",
      status: "error",
      confidence: 0,
      groundedEvidenceCount: 0,
      reasoning_trace: trace,
      ui_directive: {
        component: "ErrorStage",
        props: { message },
      },
      context: req.context ?? {},
      suggestions: ["Try a simpler query", "Show all projects"],
      evidence_anchors: [],
      error: {
        code: "OMNI_COMMAND_FAILED",
        message,
        recoverable: true,
      },
    };
  }
}

function mapGraphToVisualizerProps(
  graph: any,
  navigatorResult: any
): GraphVisualizerProps {
  const rawNodes = Array.isArray(graph?.nodes) ? graph.nodes : [];
  const rawEdges = Array.isArray(graph?.edges) ? graph.edges : [];

  // Prefer projects returned by the navigator as focus candidates
  const focusId =
    navigatorResult?.projects?.[0]?.id ??
    rawNodes.find((n: any) => n.isPinned)?.id ??
    rawNodes[0]?.id;

  const nodes = rawNodes.slice(0, 40).map((n: any, idx: number) => ({
    id: String(n.id ?? `n-${idx}`),
    label: n.label || n.name || n.id || `Node ${idx}`,
    type: (n.type || n.kind || "PROJECT").toUpperCase() as any,
    group: n.group || n.category || undefined,
    metadata: n.metadata ?? {},
    // Simple grid layout as fallback (client can re-layout)
    position: n.position ?? {
      x: 120 + (idx % 6) * 180,
      y: 80 + Math.floor(idx / 6) * 140,
    },
  }));

  const edges = rawEdges.slice(0, 60).map((e: any, idx: number) => ({
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

  if (navigatorResult?.explanation) {
    lines.push(navigatorResult.explanation, "");
  }

  if (navigatorResult?.projects?.length) {
    lines.push("### Projects");
    for (const p of navigatorResult.projects) {
      lines.push(`- **${p.name}** — \\`${p.repository}\\` ${p.url ? `[repo](${p.url})` : ""}`);
    }
    lines.push("");
  }

  if (navigatorResult?.artifacts?.length) {
    lines.push("### Artifacts (SHA-backed)");
    for (const a of navigatorResult.artifacts) {
      lines.push(`- \\`${a.path}\\` · sha:${a.sha?.slice(0, 8) ?? "—"} · ${a.kind}`);
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
