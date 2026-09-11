import React, { FormEvent, useCallback } from "react";
import { Terminal, ArrowRight, Loader2, Mic, MicOff } from "lucide-react";
import { useOmniStore } from "@/stores/omniStore";
import { ContextChips } from "./ContextChips";
import { useSpeechNavigation } from "@/hooks/useSpeechNavigation";

interface OmniCommandBarProps {
  onSubmit: (query: string) => void;
  suggestions?: string[];
}

export function OmniCommandBar({ onSubmit, suggestions = [] }: OmniCommandBarProps) {
  const { command, setCommand, isProcessing } = useOmniStore();

  const handleFinalVoice = useCallback(
    (text: string) => {
      const cleaned = text.trim();
      if (!cleaned || isProcessing) return;
      setCommand(cleaned);
      onSubmit(cleaned);
    },
    [isProcessing, onSubmit, setCommand]
  );

  const handleInterimVoice = useCallback(
    (text: string) => {
      setCommand(text);
    },
    [setCommand]
  );

  const { supported, status, isListening, errorMessage, toggle } = useSpeechNavigation({
    lang: "en-US",
    autoSubmit: true,
    onFinalTranscript: handleFinalVoice,
    onInterimTranscript: handleInterimVoice,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!command.trim() || isProcessing) return;
    onSubmit(command.trim());
  };

  const micDisabled = isProcessing || status === "unsupported" || status === "denied";

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-30 font-mono">
      <form
        onSubmit={handleSubmit}
        className={`relative bg-[#121212]/95 backdrop-blur-xl border flex items-center shadow-2xl rounded-[20px] transition-all duration-300 ${
          isProcessing
            ? "border-indigo-500/50 shadow-indigo-500/20"
            : "border-zinc-700 hover:border-zinc-600"
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
          className="w-full bg-transparent border-none outline-none text-zinc-100 placeholder-zinc-500 px-4 py-4 text-lg disabled:opacity-50"
          autoFocus
        />

        <div className="pr-3 flex items-center gap-2">
          <span className="hidden sm:inline-block text-xs font-semibold text-zinc-600 uppercase tracking-widest">
            OMNI
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

      {/* Voice status line */}
      {(isListening || errorMessage || (!supported && status === "unsupported")) && (
        <div className="flex justify-center mt-2">
          {isListening && (
            <span className="text-[11px] font-mono text-rose-400/90 tracking-wide">
              ● Listening — click mic to stop, or pause to auto-submit
            </span>
          )}
          {!isListening && errorMessage && (
            <span className="text-[11px] font-mono text-amber-500/90">{errorMessage}</span>
          )}
          {status === "unsupported" && (
            <span className="text-[11px] font-mono text-zinc-600">
              Voice navigation requires Chrome, Edge, or Safari
            </span>
          )}
        </div>
      )}

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
