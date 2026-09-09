import React, { FormEvent } from "react";
import { Terminal, ArrowRight, Loader2 } from "lucide-react";
import { useOmniStore } from "@/stores/omniStore";

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
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-30">
      <form
        onSubmit={handleSubmit}
        className={`relative bg-zinc-900/90 backdrop-blur-xl border flex items-center shadow-2xl rounded-2xl transition-all duration-300 ${
          isProcessing
            ? "border-indigo-500/50 shadow-indigo-500/20"
            : "border-zinc-700 hover:border-zinc-600"
        }`}
      >
        <div className="pl-5 text-zinc-400">
          {isProcessing ? (
            <Loader2 size={20} className="animate-spin text-indigo-400" />
          ) : (
            <Terminal size={20} />
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
            className="bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 disabled:opacity-50 p-2 rounded-lg transition-colors"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </form>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mt-3 opacity-80">
          {suggestions.slice(0, 4).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setCommand(s);
                onSubmit(s);
              }}
              className="text-xs px-2.5 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
