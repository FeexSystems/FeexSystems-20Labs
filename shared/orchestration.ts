/**
 * FEEXSYSTEMS Omni-Command Orchestration Contract (v1.0)
 *
 * The frontend is a "dumb canvas". The agent returns this payload and the
 * Stage dynamically mounts the correct React component.
 *
 * Canonical principles preserved:
 * - World Model is authoritative
 * - Evidence, not claims
 * - Provider-neutral intelligence
 */

export type OmniComponent =
  | "GraphVisualizer"
  | "MarkdownViewer"
  | "MetricsDashboard"
  | "CodeViewer"
  | "EvidencePanel"
  | "EmptyStage"
  | "ErrorStage";

export type ReasoningStepType =
  | "parse"
  | "retrieve"
  | "rank"
  | "decide"
  | "render"
  | "tool";

export interface ReasoningStep {
  id: string;
  type: ReasoningStepType;
  message: string;
  timestamp: string; // ISO-8601
  durationMs?: number;
}

export interface EvidenceAnchor {
  type: "project" | "artifact" | "technology" | "relationship" | "commit";
  id: string;
  label: string;
  url?: string;
  sha?: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: "PROJECT" | "TECHNOLOGY" | "ARTIFACT" | "CAPABILITY" | "INFRASTRUCTURE" | "DATA";
  group?: string;
  metadata?: Record<string, unknown>;
  position?: { x: number; y: number };
}

export interface GraphEdge {
  id?: string;
  source: string;
  target: string;
  label?: string;
  relation?: string;
  animated?: boolean;
}

export interface GraphVisualizerProps {
  layout?: "force-directed" | "hierarchical" | "radial";
  nodes: GraphNode[];
  edges: GraphEdge[];
  focusNodeId?: string;
}

export interface MarkdownViewerProps {
  title: string;
  content: string;
  source_node_id?: string;
  linked_entities?: string[];
  evidence_anchors?: EvidenceAnchor[];
}

export interface MetricsDashboardProps {
  widget_type: "latency_chart" | "health" | "usage" | "custom";
  status: "LIVE" | "CACHED" | "STALE";
  data_points: Array<{ timestamp: string; value: number; label?: string }>;
  summary?: string;
}

export interface OmniCommandContext {
  focusedNodeIds?: string[];
  filters?: Record<string, string>;
  previousIntent?: string;
  sessionId?: string;
}

export interface OmniCommandRequest {
  query: string;
  context?: OmniCommandContext;
}

export interface OmniCommandResponse {
  version: "1.0";
  requestId: string;
  intent: string;
  status: "success" | "partial" | "error";
  confidence: number; // 0–1
  groundedEvidenceCount: number;

  reasoning_trace: ReasoningStep[];

  ui_directive: {
    component: OmniComponent;
    props: GraphVisualizerProps | MarkdownViewerProps | MetricsDashboardProps | Record<string, unknown>;
    layoutHint?: "full" | "split" | "sidebar";
  };

  secondary_directive?: {
    component: OmniComponent;
    props: Record<string, unknown>;
  };

  context: OmniCommandContext;

  suggestions: string[];
  evidence_anchors: EvidenceAnchor[];

  error?: {
    code: string;
    message: string;
    recoverable: boolean;
  };
}

/** Helper to create a minimal empty-stage response */
export function createEmptyStageResponse(requestId: string): OmniCommandResponse {
  return {
    version: "1.0",
    requestId,
    intent: "IDLE",
    status: "success",
    confidence: 1,
    groundedEvidenceCount: 0,
    reasoning_trace: [],
    ui_directive: {
      component: "EmptyStage",
      props: {},
    },
    context: {},
    suggestions: [
      "Show me the backend architecture",
      "Which projects use PostgreSQL?",
      "What technologies power Persona OS?",
      "Show evidence for the knowledge graph",
    ],
    evidence_anchors: [],
  };
}
