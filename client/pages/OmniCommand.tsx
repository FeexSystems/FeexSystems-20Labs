import React, { useCallback, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Stage } from "@/components/omni/Stage";
import { OmniCommandBar } from "@/components/omni/OmniCommandBar";
import { ReasoningTrace } from "@/components/omni/ReasoningTrace";
import { useOmniStore } from "@/stores/omniStore";
import type { OmniCommandResponse, ReasoningStep } from "@shared/orchestration";
import { Globe, Compass } from "lucide-react";
import "reactflow/dist/style.css";

async function streamOmniCommand(
  query: string,
  context: Record<string, unknown>,
  onTrace: (s: ReasoningStep) => void
): Promise<OmniCommandResponse> {
  const res = await fetch("/api/world-model/omni-command/stream", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
    body: JSON.stringify({ query, context }),
  });

  if (!res.ok || !res.body) {
    const fallback = await fetch("/api/world-model/omni-command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, context }),
    });
    const json = await fallback.json();
    if (!fallback.ok || !json.success) throw new Error(json.error || "Omni-Command failed");
    return json.data as OmniCommandResponse;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let finalResult: OmniCommandResponse | null = null;
  let currentEvent = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n");
    buffer = parts.pop() || "";

    for (const line of parts) {
      if (line.startsWith("event:")) {
        currentEvent = line.slice(6).trim();
      } else if (line.startsWith("data:")) {
        const raw = line.slice(5).trim();
        if (!raw) continue;
        try {
          const data = JSON.parse(raw);
          if (currentEvent === "trace") onTrace(data as ReasoningStep);
          else if (currentEvent === "result") finalResult = data as OmniCommandResponse;
          else if (currentEvent === "error") throw new Error(data.message || "Stream error");
        } catch (e) {
          if (e instanceof SyntaxError) continue;
          throw e;
        }
      }
    }
  }

  if (!finalResult) throw new Error("Stream ended without result");
  return finalResult;
}

export default function OmniCommandPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const bootstrapped = useRef(false);

  const {
    isProcessing,
    setProcessing,
    payload,
    setPayload,
    liveTrace,
    appendTrace,
    clearTrace,
    context,
    setContext,
    setCommand,
    pushHistory,
  } = useOmniStore();

  const execute = useCallback(
    async (query: string) => {
      setProcessing(true);
      clearTrace();
      pushHistory(query);
      setSearchParams({ q: query }, { replace: true });

      try {
        const data = await streamOmniCommand(query, context as any, appendTrace);
        setPayload(data);
        if (data.context) {
          setContext({
            ...data.context,
            sessionId: context.sessionId || data.context.sessionId,
            lastQuery: query,
          });
        }
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
          suggestions: [
            "Show me the backend architecture",
            "Which projects use PostgreSQL?",
            "Run a health check on the platform",
          ],
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
    [
      context,
      setProcessing,
      setPayload,
      setContext,
      pushHistory,
      appendTrace,
      clearTrace,
      setSearchParams,
    ]
  );

  // Deep-link: /omni?q=...
  useEffect(() => {
    if (bootstrapped.current) return;
    const q = searchParams.get("q");
    if (q?.trim()) {
      bootstrapped.current = true;
      setCommand(q.trim());
      execute(q.trim());
    } else {
      bootstrapped.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const suggestions =
    payload?.suggestions?.length
      ? payload.suggestions
      : [
          "Show me the backend architecture",
          "Which projects use PostgreSQL?",
          "Run a health check on the platform",
          "Show evidence for the knowledge graph",
        ];

  const displayTrace =
    liveTrace.length > 0 ? liveTrace : payload?.reasoning_trace ?? [];

  return (
    <div className="relative w-full h-screen bg-zinc-950 text-zinc-100 overflow-hidden flex flex-col">
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

      <div className="flex-1 relative w-full h-full pt-12 pb-40">
        <Stage payload={payload} />
        <ReasoningTrace steps={displayTrace} isProcessing={isProcessing} />
      </div>

      <OmniCommandBar onSubmit={execute} suggestions={suggestions} />
    </div>
  );
}
