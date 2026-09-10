import React, { useState } from "react";
import { ShieldCheck, Copy, Check, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BtcMonoBadgeProps {
  commitSha?: string;
  blockHeight?: number;
  label?: string;
  timestamp?: string;
  className?: string;
}

export function BtcMonoBadge({
  commitSha = "4a9f2e7b8c1d5e3f6a0b9c8d7e6f5a4b3c2d1e0f",
  blockHeight = 840029,
  label = "IMMUTABLE PROOF",
  timestamp = "2026-09-10 18:42 UTC",
  className,
}: BtcMonoBadgeProps) {
  const [copied, setCopied] = useState(false);

  const copySha = () => {
    navigator.clipboard.writeText(commitSha);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shortSha = `${commitSha.slice(0, 7)}...${commitSha.slice(-7)}`;

  return (
    <div
      onClick={copySha}
      className={cn(
        "group inline-flex items-center gap-2.5 px-3 py-1.5 rounded-none bg-black/80 border border-white/15 hover:border-white/50 backdrop-blur-md shadow-lg font-mono text-xs cursor-pointer select-none transition-all duration-200",
        className
      )}
      title="Click to copy cryptographic SHA-256"
    >
      {/* Status Dot */}
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-300" />
        </span>
        <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>

      <div className="w-[1px] h-3.5 bg-white/15" />

      {/* Block & SHA */}
      <div className="flex items-center gap-2 text-gray-300">
        <span className="text-gray-400 text-[11px]">#{blockHeight}</span>
        <span className="text-white font-semibold group-hover:text-gray-300 transition-colors">
          {shortSha}
        </span>
      </div>

      {/* Copy / Verified Glyph */}
      <div className="pl-1 text-gray-400 group-hover:text-white transition-colors">
        {copied ? (
          <Check className="w-3.5 h-3.5 text-gray-300" />
        ) : (
          <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
        )}
      </div>
    </div>
  );
}

export default BtcMonoBadge;
