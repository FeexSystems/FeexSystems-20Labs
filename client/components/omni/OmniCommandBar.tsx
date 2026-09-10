import React, { FormEvent } from "react";
import { Terminal, ArrowRight, Loader2 } from "lucide-react";
import { useOmniStore } from "@/stores/omniStore";
import { ContextChips } from "./ContextChips";

interface OmniCommandBarProps {
  onSubmit: (query: string) => void;
  suggestions?: string[];
}

export function OmniCommandBar({ onSubmit, suggestions = [] }: OmniCommandBarProps) {
  const { command, setCommand, isProcessing } = useOmniStore();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!command.trim() || isProcessing) return;
    onSubmit(command.trim());
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-30 font-mono">
      <form
        onSubmit={handleSubmit}
        className={`relative bg-[#121212]/95 backdrop-blur-xl border flex items-center shadow-2xl rounded-[20px] transition-all duration-300 ${
          isProcessing
            ? "border-white/40 shadow-white/5"
            : "border-white/15 hover:border-white/30"
        }`}
      >
        <div className="pl-5 text-white/60">
          {isProcessing ? (
            <Loader2 size={18} className="animate-spin text-white" />
          ) : (
            <Terminal size={18} className="text-white/80" />
          )}
        </div>

        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          disabled={isProcessing}
          placeholder='e.g., Show me the backend architecture…'
          className="w-full bg-transparent border-none outline-none text-white placeholder-white/40 px-4 py-4 text-sm sm:text-base font-mono disabled:opacity-50"
          autoFocus
        />

        <div className="pr-3 flex items-center gap-2">
          <span className="hidden sm:inline-block text-[10px] font-mono tracking-widest text-white/40 uppercase bg-white/5 border border-white/10 px-2 py-0.5 rounded-[6px]">
            OMNI // CMD
          </span>
          <button
            type="submit"
            disabled={isProcessing || !command.trim()}
            className="rounded-[10px] bg-white text-black font-semibold hover:bg-white/90 disabled:opacity-30 p-2 sm:px-3 text-xs transition-colors flex items-center gap-1"
          >
            <span className="hidden sm:inline">Execute</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </form>

      <ContextChips />

      {suggestions.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5 mt-2.5">
          {suggestions.slice(0, 5).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setCommand(s);
                onSubmit(s);
              }}
              className="text-[11px] font-mono px-3 py-1 rounded-[10px] bg-[#121212] border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
