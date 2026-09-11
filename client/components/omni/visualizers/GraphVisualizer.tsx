import React, { useMemo, useCallback } from "react";
import type { GraphVisualizerProps, GraphNode } from "@shared/orchestration";
import { useOmniStore } from "@/stores/omniStore";
import { Cpu, Database, Terminal, Cloud, Layers, Zap } from "lucide-react";

let ReactFlow: any = null;
let Background: any = null;
let Controls: any = null;
let MarkerType: any = null;
let Handle: any = null;
let Position: any = null;
let useNodesState: any = null;
let useEdgesState: any = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const rf = require("reactflow");
  ReactFlow = rf.default || rf;
  Background = rf.Background;
  Controls = rf.Controls;
  MarkerType = rf.MarkerType;
  Handle = rf.Handle;
  Position = rf.Position;
  useNodesState = rf.useNodesState;
  useEdgesState = rf.useEdgesState;
} catch {
  /* grid fallback */
}

const typeIcon = (type: string) => {
  switch (type) {
    case "TECHNOLOGY":
      return <Cpu size={14} className="text-white/80" />;
    case "DATA":
    case "ARTIFACT":
      return <Database size={14} className="text-white/80" />;
    case "CAPABILITY":
      return <Terminal size={14} className="text-white/80" />;
    case "INFRASTRUCTURE":
      return <Cloud size={14} className="text-white/80" />;
    default:
      return <Layers size={14} className="text-white/80" />;
  }
};

function NodeCard({
  node,
  focused,
  onFocus,
}: {
  node: GraphNode;
  focused?: boolean;
  onFocus?: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onFocus?.(node.id)}
      className={`text-left px-3 py-2.5 rounded-xl bg-zinc-900 border w-44 transition-all ${
    <div
      className={`p-3.5 rounded-[20px] bg-[#121212] border transition-all duration-200 font-mono ${
        focused
          ? "border-white shadow-lg shadow-white/10 bg-white/5"
          : "border-white/10 hover:border-white/30"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-[10px] bg-white/5 border border-white/10 shrink-0">{typeIcon(node.type)}</div>
        <div className="min-w-0">
          <div className="text-[9px] font-mono font-semibold text-white/40 uppercase tracking-wider truncate">
            {node.group || node.type}
          </div>
          <div className="text-xs font-semibold text-white truncate mt-0.5">{node.label}</div>
        </div>
      </div>
    </button>
  );
}

function TechNode({ data }: { data: any }) {
  return (
    <div
      className={`px-3 py-2 shadow-xl rounded-xl bg-zinc-900 border w-44 hover:border-indigo-500 transition-all ${
        data.focused ? "border-indigo-500" : "border-zinc-700"
      }`}
      onClick={() => data.onFocus?.(data.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") data.onFocus?.(data.id);
      }}
    >
    <div className="px-3.5 py-2.5 shadow-2xl rounded-[20px] bg-[#121212] border border-white/10 w-48 hover:border-white/30 transition-all font-mono">
      {Handle && Position && (
        <>
          <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-white/60 !border-none" />
          <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-white/60 !border-none" />
        </>
      )}
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-[10px] bg-white/5 border border-white/10 shrink-0">{typeIcon(data.type)}</div>
        <div className="min-w-0">
          <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider truncate">
            {data.group || data.type}
          </div>
          <div className="text-xs font-bold text-white truncate">{data.label}</div>
        </div>
      </div>
    </div>
  );
}

function ReactFlowGraph({
  nodes,
  edges,
  focusNodeId,
  onFocus,
}: GraphVisualizerProps & { onFocus: (id: string) => void }) {
  const initialNodes = useMemo(
    () =>
      nodes.map((n, idx) => ({
        id: n.id,
        type: "techNode",
        position: n.position || { x: 80 + (idx % 5) * 220, y: 60 + Math.floor(idx / 5) * 160 },
        data: {
          id: n.id,
          label: n.label,
          type: n.type,
          group: n.group,
          focused: n.id === focusNodeId,
          onFocus,
        },
        style:
          n.id === focusNodeId
            ? { boxShadow: "0 0 0 2px rgba(255,255,255,0.8)" }
            : undefined,
      })),
    [nodes, focusNodeId, onFocus]
  );

  const initialEdges = useMemo(
    () =>
      edges.map((e, i) => ({
        id: e.id || `e-${i}`,
        source: e.source,
        target: e.target,
        label: e.label || e.relation,
        animated: e.animated !== false,
        style: { stroke: "#ffffff", strokeWidth: 1.5, opacity: 0.6 },
        markerEnd: MarkerType
          ? { type: MarkerType.ArrowClosed, color: "#ffffff" }
          : undefined,
      })),
    [edges]
  );

  const [rfNodes, , onNodesChange] = useNodesState(initialNodes);
  const [rfEdges, , onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback(
    (_: any, node: any) => {
      if (node?.id) onFocus(node.id);
    },
    [onFocus]
  );

  return (
    <div className="w-full h-full min-h-[420px]">
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={{ techNode: TechNode }}
        fitView
        className="bg-black"
      >
        {Background && <Background color="#1a1a1a" gap={24} size={1} />}
        {Controls && <Controls className="!bg-[#121212] !border-white/10 !fill-white/70" />}
      </ReactFlow>
    </div>
  );
}

export function GraphVisualizer(props: GraphVisualizerProps) {
  const { nodes = [], edges = [], focusNodeId } = props;
  const setContext = useOmniStore((s) => s.setContext);

  const onFocus = useCallback(
    (id: string) => {
      setContext({ focusedNodeIds: [id] });
    },
    [setContext]
  );

  if (!nodes.length) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white/40 font-mono text-xs">
        <Zap size={16} className="mr-2 text-white/60" /> No graph nodes returned from the World Model.
      </div>
    );
  }

  if (ReactFlow && useNodesState) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="px-4 py-2 text-xs font-mono text-zinc-500 border-b border-zinc-900">
          GraphVisualizer (React Flow) · {nodes.length} nodes · {edges.length} edges
          {focusNodeId ? ` · focus ${focusNodeId}` : ""}
          <span className="text-zinc-600"> · click node to focus</span>
      <div className="w-full h-full flex flex-col font-mono">
        <div className="px-5 py-2.5 text-xs text-white/50 border-b border-white/10 bg-[#121212] flex items-center justify-between">
          <span>//01 GRAPH TOPOLOGY · {nodes.length} NODES · {edges.length} EDGES</span>
          {focusNodeId && <span className="text-white">FOCUS: {focusNodeId}</span>}
        </div>
        <div className="flex-1 min-h-0">
          <ReactFlowGraph {...props} onFocus={onFocus} />
        <div className="flex-1 min-h-0 bg-black">
          <ReactFlowGraph {...props} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-auto p-6 md:p-10">
      <div className="mb-4 flex items-center justify-between text-xs font-mono text-zinc-500">
        <span>
          GraphVisualizer (grid) · {nodes.length} nodes · {edges.length} edges · click to focus
        </span>
        {focusNodeId && <span className="text-indigo-400">focus: {focusNodeId}</span>}
    <div className="w-full h-full overflow-auto p-6 md:p-10 font-mono selection:bg-white selection:text-black">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
        <div>
          <span className="text-[10px] text-white/40 uppercase tracking-widest block">//01 TOPOLOGY GRID</span>
          <span className="text-sm font-bold text-white">
            World Model Causal Graph · {nodes.length} Nodes · {edges.length} Edges
          </span>
        </div>
        {focusNodeId && (
          <span className="text-xs px-2.5 py-1 rounded-[10px] border border-white/20 bg-white/10 text-white self-start">
            focus: {focusNodeId}
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {nodes.map((n) => (
          <NodeCard key={n.id} node={n} focused={n.id === focusNodeId} onFocus={onFocus} />
        ))}
      </div>
      {edges.length > 0 && (
        <div className="mt-10 pt-6 border-t border-white/10">
          <h3 className="text-xs font-mono uppercase tracking-widest text-white/50 mb-3">
            // CAUSAL RELATIONSHIPS ({edges.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {edges.slice(0, 40).map((e, i) => (
              <span
                key={e.id || i}
                className="text-[11px] px-3 py-1 rounded-[10px] bg-[#121212] border border-white/10 text-white/70 font-mono flex items-center gap-1.5"
              >
                <span className="size-1 rounded-full bg-white/40" />
                <span className="text-white/90">{e.source}</span>
                <span className="text-white/40">─[{e.label || e.relation || "rel"}]─→</span>
                <span className="text-white/90">{e.target}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
