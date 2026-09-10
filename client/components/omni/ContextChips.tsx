import React from "react";
import { X, Crosshair } from "lucide-react";
import { useOmniStore } from "@/stores/omniStore";

export function ContextChips() {
  const { context, setContext } = useOmniStore();
  const focused = context.focusedNodeIds ?? [];

  if (!focused.length && !context.previousIntent && !context.lastQuery) {
    return null;
  }

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-2 max-w-3xl mx-auto px-4">
      {focused.map((id) => (
        <span
          key={id}
          className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2 py-1 rounded-md bg-indigo-500/15 border border-indigo-500/30 text-indigo-300"
        >
          <Crosshair size={10} />
          focus:{id.length > 24 ? id.slice(0, 24) + "…" : id}
          <button
            type="button"
            className="hover:text-white"
            onClick={() =>
              setContext({
                focusedNodeIds: focused.filter((f) => f !== id),
              })
            }
            aria-label="Clear focus"
          >
            <X size={10} />
          </button>
        </span>
      ))}
      {context.previousIntent && (
        <span className="text-[11px] font-mono px-2 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-400">
          intent:{context.previousIntent}
        </span>
      )}
      {focused.length > 0 && (
        <button
          type="button"
          className="text-[11px] font-mono px-2 py-1 rounded-md bg-zinc-900 border border-zinc-700 text-zinc-500 hover:text-zinc-200"
          onClick={() => setContext({ focusedNodeIds: [] })}
        >
          clear focus
        </button>
      )}
    </div>
  );
}
