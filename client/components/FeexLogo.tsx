import React from "react";

interface FeexMasterMarkProps {
  size?: number | string;
  className?: string;
  glow?: boolean;
}

/**
 * FEEXSYSTEMS Master Mark
 * Canonical 16x16 modular matrix with 45° isometric cutaways,
 * concentric orbital telemetry arcs, and quantum state indicator.
 */
export function FeexMasterMark({
  size = 36,
  className = "",
  glow = true,
}: FeexMasterMarkProps) {
  const filterId = React.useId();
  const gradId = React.useId();
  const accentId = React.useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none transition-transform duration-300 hover:scale-105 ${className}`}
    >
      <defs>
        {/* Core Linear Gradient: Phosphor Cyan -> Ion Azure -> Quantum Violet */}
        <linearGradient
          id={gradId}
          x1="16"
          y1="16"
          x2="112"
          y2="112"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#00F5D4" />
          <stop offset="50%" stopColor="#0066FF" />
          <stop offset="100%" stopColor="#7B2CBF" />
        </linearGradient>

        {/* Accent Coordinate Vector Gradient */}
        <linearGradient
          id={accentId}
          x1="16"
          y1="64"
          x2="112"
          y2="64"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#80E5FF" />
        </linearGradient>

        {/* Telemetry Sensor Ring Glow */}
        {glow && (
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        )}
      </defs>

      {/* Ground Plane Sensor Grid / Hex Base */}
      <circle
        cx="64"
        cy="64"
        r="58"
        stroke="#121826"
        strokeWidth="1.5"
        strokeDasharray="2 4"
      />
      <circle cx="64" cy="64" r="48" stroke="#1F293D" strokeWidth="1" />

      {/* Dynamic World Model Node Connectors */}
      <path
        d="M64 8 L64 24 M64 104 L64 120 M8 64 L24 64 M104 64 L120 64"
        stroke="#00F5D4"
        strokeOpacity="0.45"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Living Geometry: The 'F-X' Hyper-Structure */}
      <path
        d="M38 32 H90 V44 H52 V58 H84 V70 H52 V96 H38 V32Z"
        fill={`url(#${gradId})`}
      />

      {/* Vector Provenance Node & Trajectory Line (The X Coordinate Vector) */}
      <path
        d="M72 70 L96 96 M96 70 L78 88"
        stroke={`url(#${accentId})`}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Active Quantum State Indicator (Central Anchor) */}
      <circle
        cx="64"
        cy="64"
        r="3.5"
        fill="#00F5D4"
        filter={glow ? `url(#${filterId})` : undefined}
      />
      <circle cx="96" cy="96" r="2.5" fill="#FFFFFF" />
    </svg>
  );
}

interface FeexHorizontalLockupProps {
  markSize?: number;
  className?: string;
  showSubtitle?: boolean;
}

/**
 * FEEXSYSTEMS Horizontal Platform Lockup (4.5:1 ratio)
 */
export function FeexHorizontalLockup({
  markSize = 36,
  className = "",
  showSubtitle = true,
}: FeexHorizontalLockupProps) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <FeexMasterMark size={markSize} glow={true} />
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-2">
          <span className="font-display font-extrabold tracking-widest text-base sm:text-lg text-white">
            FEEX<span className="text-[#00F5D4]">SYSTEMS</span>
          </span>
          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#00F5D4]/10 text-[#00F5D4] border border-[#00F5D4]/30 hidden sm:inline-block">
            WORLD_MODEL
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase">
            Living Engineering Intelligence
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * World Model Provenance Pill
 */
export function FeexWorldBadge({
  sha = "sha-canonical",
  status = "SYNC 100%",
  className = "",
}: {
  sha?: string;
  status?: string;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-[10px] bg-[#121212] border border-white/10 text-xs font-mono shadow-sm backdrop-blur-md ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
      </span>
      <span className="text-white/40 uppercase tracking-wider text-[10px]">
        EVIDENCE:
      </span>
      <span className="text-white font-medium hover:text-white/80 cursor-pointer transition-colors">
        {sha}
      </span>
      <span className="text-white/20">|</span>
      <span className="text-white/80 text-[10px] font-semibold">{status}</span>
    </div>
  );
}
