import React from "react";
import { Sparkles } from "lucide-react";

export function EmptyStage() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center opacity-50">
      <Sparkles size={48} className="text-zinc-600 mb-4" />
      <p className="text-zinc-500 text-lg">The Stage is empty.</p>
      <p className="text-zinc-600 text-sm mt-1">Issue a command to render the World Model.</p>
    </div>
  );
}
