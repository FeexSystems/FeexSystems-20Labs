import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { Stage } from "@/components/omni/Stage";
import { OmniCommandBar } from "@/components/omni/OmniCommandBar";
import { ReasoningTrace } from "@/components/omni/ReasoningTrace";
import { useOmniStore } from "@/stores/omniStore";
import type { OmniCommandResponse } from "../../shared/orchestration";
import { Globe, Compass } from "lucide-react";

export default function OmniCommandPage() {
  const {
    isProcessing,
    setProcessing,
    payload,
    setPayload,
    context,
    setContext,
    pushHistory,
  } = useOmniStore();

  const execute = useCallback(
    async (query: string) => {
      setProcessing(true);
      pushHistory(query);

      try {
        const res = await fetch("/api/world-model/omni-command", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, context }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || "Omni-Command request failed");
        }
        const data = json.data as OmniCommandResponse;
        setPayload(data);
        if (data.context) setContext(data.context);
      } catch (err) {
        setPayload({
          version: "1.0",
          requestId: "client-error",
          intent: "ERROR",
          status: "error",
          confidence: 0,
          groundedEvidenceCount: 0,
          reasoning_trace: [],
          ui_directive: {
            component: "ErrorStage",
            props: {
              message: err instanceof Error ? err.message : "Request failed",
            },
          },
          context: {},
          suggestions: ["Show me the backend architecture", "Which projects use PostgreSQL?"],
          evidence_anchors: [],
          error: {
            code: "CLIENT_FETCH_ERROR",
            message: err instanceof Error ? err.message : "Unknown",
            recoverable: true,
          },
        });
      } finally {
        setProcessing(false);
      }
    },
    [context, setProcessing, setPayload, setContext, pushHistory]
  );

  const suggestions =
    payload?.suggestions?.length
      ? payload.suggestions
      : [
          "Show me the backend architecture",
          "Which projects use PostgreSQL?",
          "What technologies power Persona OS?",
          "Show evidence for the knowledge graph",
        ];

  return (
    <div className="relative w-full h-screen bg-zinc-950 text-zinc-100 overflow-hidden flex flex-col">
      {/* Top bar */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 py-3 bg-zinc-950/70 backdrop-blur border-b border-zinc-900">
        <div className="flex items-center gap-3">
          <Link to="/" className="font-display font-bold tracking-wider text-sm">
            FEEX<span className="text-cyan-400">SYSTEMS</span>
          </Link>
          <span className="text-zinc-700">/</span>
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
            Omni-Command
          </span>
        </div>
        <nav className="flex items-center gap-3 text-xs font-mono">
          <Link to="/navigator" className="text-zinc-500 hover:text-zinc-200 flex items-center gap-1">
            <Compass size={12} /> Navigator
          </Link>
          <Link to="/world" className="text-zinc-500 hover:text-zinc-200 flex items-center gap-1">
            <Globe size={12} /> 3D World
          </Link>
        </nav>
      </header>

      {/* Stage */}
      <div className="flex-1 relative w-full h-full pt-12 pb-32">
        <Stage payload={payload} />
        <ReasoningTrace
          steps={payload?.reasoning_trace ?? []}
          isProcessing={isProcessing}
        />
      </div>

      {/* Command Bar */}
      <OmniCommandBar onSubmit={execute} suggestions={suggestions} />
    </div>
  );
}
