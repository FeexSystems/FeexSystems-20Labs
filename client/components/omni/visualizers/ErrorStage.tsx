import React from "react";
import { AlertTriangle } from "lucide-react";

export function ErrorStage({ message }: { message?: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-red-400">
      <AlertTriangle size={40} className="mb-3" />
      <p className="text-lg font-medium">Omni-Command error</p>
      <p className="text-sm text-zinc-500 mt-1 max-w-md text-center">
        {message || "Something went wrong while querying the World Model."}
      </p>
    </div>
  );
}
