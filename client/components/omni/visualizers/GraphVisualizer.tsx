import React from "react";
import type { GraphVisualizerProps, GraphNode } from "../../../../shared/orchestration";
import { Cpu, Database, Terminal, Cloud, Zap, Layers } from "lucide-react";

const typeIcon = (type: string) => {
  switch (type) {
    case "TECHNOLOGY":
      return <Cpu size={14} className="text-emerald-400" />;
    case "DATA":
    case "ARTIFACT":
      return <Database size={14} className="text-blue-400" />;
    case "CAPABILITY":
      return <Terminal size={14} className="text-indigo-400" />;
    case "INFRASTRUCTURE":
      return <Cloud size={14} className="text-amber-400" />;
    default:
      return <Layers size={14} className="text-zinc-400" />;
  }
};

function NodeCard({ node, focused }: { node: GraphNode; focused?: boolean }) {
  return (
    <div
      className={`px-3 py-2.5 rounded-xl bg-zinc-900 border w-44 transition-all ${
        focused
          ? "border-indigo-500 shadow-lg shadow-indigo-500/20"
          : "border-zinc-700 hover:border-zinc-500"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-lg bg-zinc-800 border border-zinc-700">
          {typeIcon(node.type)}
        </div>
        <div className="min-w-0">
          <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider truncate">
            {node.group || node.type}
          </div>
          <div className="text-sm font-medium text-zinc-100 truncate">{node.label}</div>
        </div>
      </div>
    </div>
  );
}

export function GraphVisualizer(props: GraphVisualizerProps) {
  const { nodes = [], edges = [], focusNodeId } = props;

  if (!nodes.length) {
    return (
      <div className="w-full h-full flex items-center justify-center text-zinc-500">
        <Zap size={24} className="mr-2" /> No graph nodes returned from the World Model.
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-auto p-6 md:p-10">
      <div className="mb-4 flex items-center justify-between text-xs font-mono text-zinc-500">
        <span>
          GraphVisualizer · {nodes.length} nodes · {edges.length} edges
        </span>
        {focusNodeId && <span className="text-indigo-400">focus: {focusNodeId}</span>}
      </div>

      {/* Simple responsive grid layout (force-directed can be added later with reactflow) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {nodes.map((n) => (
          <NodeCard key={n.id} node={n} focused={n.id === focusNodeId} />
        ))}
      </div>

      {edges.length > 0 && (
        <div className="mt-10 pt-6 border-t border-zinc-800">
          <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3">
            Relationships
          </h3>
          <div className="flex flex-wrap gap-2">
            {edges.slice(0, 40).map((e, i) => (
              <span
                key={e.id || i}
                className="text-[11px] px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono"
              >
                {e.source} —{e.label || e.relation || "→"}→ {e.target}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
