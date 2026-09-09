import React from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import type { ReasoningStep } from "../../../shared/orchestration";

interface ReasoningTraceProps {
  steps: ReasoningStep[];
  isProcessing: boolean;
}

export function ReasoningTrace({ steps, isProcessing }: ReasoningTraceProps) {
  if (!steps.length) return null;

  return (
    <div className="absolute top-6 right-6 w-80 max-h-[70vh] overflow-y-auto pointer-events-none z-20">
      <div className="flex flex-col gap-2">
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;
          return (
            <div
              key={step.id}
              className="bg-zinc-900/85 backdrop-blur-md border border-zinc-800 rounded-lg p-3 text-sm text-zinc-300 shadow-xl flex items-start gap-3 animate-in fade-in slide-in-from-right-4 duration-300"
            >
              <div className="mt-0.5 text-indigo-400 shrink-0">
                {isLast && isProcessing ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <ArrowRight size={14} />
                )}
              </div>
              <span className="leading-snug">{step.message}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
