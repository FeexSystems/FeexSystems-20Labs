import React from "react";
import { Link } from "react-router-dom";
import { Boxes, ShieldCheck, Cpu, Database, Compass, ArrowUpRight, Sparkles, Activity } from "lucide-react";
import { CursorSpotlightCard } from "@/components/motion/CursorSpotlightCard";
import { TextScrambleMorph } from "@/components/motion/TextScrambleMorph";

export function BentoEvidenceGrid() {
  return (
    <section className="relative w-full select-none font-mono py-12">
      {/* Header Deck */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-gray-20">
        <div>
          <div className="flex items-center gap-2 mb-2 text-[10px] text-[#00F5D4]">
            <span className="size-1.5 rounded-full bg-[#00F5D4] animate-ping" />
            <span className="font-bold tracking-wider">SYSTEM TOPOLOGY // BENTO GALLERY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Architecture of Living Intelligence
          </h2>
          <p className="text-xs text-gray-40 mt-1 max-w-xl">
            Five core architectural pillars operating simultaneously across telemetry, model reasoning, and 3D spatial space.
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex items-center gap-2 text-xs text-gray-40">
          <span className="size-2 rounded-full bg-[#00FFA3]" />
          <span>ALL PILLARS ONLINE</span>
        </div>
      </div>

      {/* Asymmetric Bento Grid (21st Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: 3D Spatial Knowledge Galaxy (Col span 2) */}
        <CursorSpotlightCard
          spotlightColor="rgba(0, 245, 212, 0.18)"
          className="md:col-span-2 relative min-h-[260px] flex flex-col justify-between group border-gray-20/80 hover:border-[#00F5D4]/60"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded border border-[#00F5D4]/30 bg-[#00F5D4]/10 flex items-center justify-center text-[#00F5D4]">
                <Compass className="size-5" />
              </div>
              <div>
                <span className="text-[10px] text-[#00F5D4] block">SPATIAL DIMENSION</span>
                <h3 className="text-lg font-bold text-white group-hover:text-[#00F5D4] transition-colors">
                  3D Spatial Knowledge Galaxy
                </h3>
              </div>
            </div>
            <Link
              to="/world"
              className="size-8 rounded border border-gray-20 bg-black/60 flex items-center justify-center text-gray-40 hover:text-white hover:border-[#00F5D4] transition-all"
            >
              <ArrowUpRight className="size-4" />
            </Link>
          </div>

          <p className="text-xs text-gray-40 my-4 leading-relaxed max-w-lg">
            Projects repositories, artifacts, and technologies into an explorable 3D orbital universe. Powered by Drei CatmullRom conduits, transmission materials, and accelerated BVH raycasting.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-20/60 text-[10px]">
            <span className="bg-black/60 border border-gray-20 px-2 py-1 text-white">
              <TextScrambleMorph text="60 FPS ADAPTIVE WEBGL" />
            </span>
            <span className="bg-black/60 border border-gray-20 px-2 py-1 text-cyan-400">
              GALAXY RADAR HUD
            </span>
            <span className="bg-black/60 border border-gray-20 px-2 py-1 text-[#00FFA3]">
              ZERO FRAME-DROP
            </span>
          </div>
        </CursorSpotlightCard>

        {/* Card 2: Authoritative World Model (Col span 1) */}
        <CursorSpotlightCard
          spotlightColor="rgba(250, 204, 21, 0.15)"
          className="relative min-h-[260px] flex flex-col justify-between group border-gray-20/80 hover:border-yellow/60"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded border border-yellow/30 bg-yellow/10 flex items-center justify-center text-yellow">
                <Database className="size-5" />
              </div>
              <div>
                <span className="text-[10px] text-yellow block">AUTHORITY</span>
                <h3 className="text-base font-bold text-white group-hover:text-yellow transition-colors">
                  Authoritative World Model
                </h3>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-40 my-4 leading-relaxed">
            The database-backed PostgreSQL graph is the single canonical ground truth. Models interpret; they never hallucinate facts without provenance.
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-gray-20/60 text-[10px] text-gray-40">
            <span>PRISMA ORM</span>
            <span className="text-yellow font-bold">100% CANONICAL</span>
          </div>
        </CursorSpotlightCard>

        {/* Card 3: Evidence Fabric Provenance (Col span 1) */}
        <CursorSpotlightCard
          spotlightColor="rgba(0, 255, 163, 0.18)"
          className="relative min-h-[240px] flex flex-col justify-between group border-gray-20/80 hover:border-[#00FFA3]/60"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded border border-[#00FFA3]/30 bg-[#00FFA3]/10 flex items-center justify-center text-[#00FFA3]">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <span className="text-[10px] text-[#00FFA3] block">GROUNDING</span>
                <h3 className="text-base font-bold text-white group-hover:text-[#00FFA3] transition-colors">
                  Evidence Fabric
                </h3>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-40 my-4 leading-relaxed">
            Every entity links to verifiable evidence: repository commit SHAs, file paths, and HMAC SHA-256 verified webhook ingestion events.
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-gray-20/60 text-[10px] text-gray-40">
            <span>HASH PROVENANCE</span>
            <span className="text-[#00FFA3] font-bold">SHA-256 SIGNED</span>
          </div>
        </CursorSpotlightCard>

        {/* Card 4: Provider-Neutral AI Layer (Col span 1) */}
        <CursorSpotlightCard
          spotlightColor="rgba(123, 44, 191, 0.2)"
          className="relative min-h-[240px] flex flex-col justify-between group border-gray-20/80 hover:border-[#7B2CBF]/60"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded border border-[#7B2CBF]/30 bg-[#7B2CBF]/10 flex items-center justify-center text-[#c084fc]">
                <Cpu className="size-5" />
              </div>
              <div>
                <span className="text-[10px] text-[#c084fc] block">ORCHESTRATION</span>
                <h3 className="text-base font-bold text-white group-hover:text-[#c084fc] transition-colors">
                  Provider-Neutral AI
                </h3>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-40 my-4 leading-relaxed">
            Model reasoning layers utilize provider-agnostic abstractions (<code className="text-white">aiService</code>) enabling interchangeable routing across Gemini, Claude, and OpenAI.
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-gray-20/60 text-[10px] text-gray-40">
            <span>ADAPTER LAYER</span>
            <span className="text-[#c084fc] font-bold">NEUTRAL ROUTING</span>
          </div>
        </CursorSpotlightCard>

        {/* Card 5: Non-Blocking Real-Time Ingestion (Col span 1) */}
        <CursorSpotlightCard
          spotlightColor="rgba(0, 245, 212, 0.16)"
          className="relative min-h-[240px] flex flex-col justify-between group border-gray-20/80 hover:border-[#00F5D4]/60"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded border border-[#00F5D4]/30 bg-[#00F5D4]/10 flex items-center justify-center text-[#00F5D4]">
                <Activity className="size-5" />
              </div>
              <div>
                <span className="text-[10px] text-[#00F5D4] block">RESILIENCE</span>
                <h3 className="text-base font-bold text-white group-hover:text-[#00F5D4] transition-colors">
                  Non-Blocking Runtime
                </h3>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-40 my-4 leading-relaxed">
            Database and external services attach lazily in the background. Readiness checks and HTTP servers respond with zero blocking overhead.
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-gray-20/60 text-[10px] text-gray-40">
            <span>LATENCY</span>
            <span className="text-[#00F5D4] font-bold">&lt; 15MS READINESS</span>
          </div>
        </CursorSpotlightCard>
      </div>
    </section>
  );
}

export default BentoEvidenceGrid;
