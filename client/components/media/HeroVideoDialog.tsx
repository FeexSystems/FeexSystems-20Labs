import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, X, Sparkles, Shield, Maximize2, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroVideoDialogProps {
  videoSrc?: string;
  thumbnailSrc?: string;
  thumbnailAlt?: string;
  badgeText?: string;
  title?: string;
  description?: string;
  className?: string;
}

export function HeroVideoDialog({
  videoSrc = "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
  thumbnailSrc,
  thumbnailAlt = "FEEXSYSTEMS Architecture Demonstration",
  badgeText = "FEEXSYSTEMS // ARCHITECTURAL WALKTHROUGH",
  title = "Evidence Fabric & 3D Spatial Knowledge Graph",
  description = "A living demonstration of how GitHub ecosystem commits, Webhooks, and dependencies project into an authoritative 3D World Model.",
  className,
}: HeroVideoDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className={cn("relative w-full select-none font-mono", className)}>
      {/* Outer Glow Halo */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#00F5D4]/20 via-[#00FFA3]/10 to-[#7B2CBF]/20 rounded-2xl blur-xl opacity-75 pointer-events-none" />

      {/* Video Card Container */}
      <div
        onClick={() => setIsOpen(true)}
        className="group relative overflow-hidden rounded-xl border border-gray-20 bg-[#090a0f] p-2 transition-all duration-300 hover:border-[#00F5D4]/60 cursor-pointer shadow-2xl"
      >
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-20/70 text-[10px] text-gray-40">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-red-500/80 inline-block" />
            <span className="size-2 rounded-full bg-yellow-500/80 inline-block" />
            <span className="size-2 rounded-full bg-[#00F5D4] inline-block animate-pulse" />
            <span className="text-[#00F5D4] font-bold tracking-wider ml-1">{badgeText}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] text-[#00FFA3]">
            <Shield className="size-3 text-[#00FFA3]" />
            <span>HMAC-VERIFIED 1080P</span>
          </div>
        </div>

        {/* Video Surface Preview */}
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black/90">
          {thumbnailSrc ? (
            <img
              src={thumbnailSrc}
              alt={thumbnailAlt}
              className="size-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:brightness-90"
            />
          ) : (
            <div className="relative size-full flex items-center justify-center bg-gradient-to-br from-[#060810] via-[#0b0e17] to-[#121826]">
              {/* Cyber Grid Pattern */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, #00F5D4 1px, transparent 0)`,
                  backgroundSize: "24px 24px",
                }}
              />
              {/* Geometric Core Graphic */}
              <div className="relative flex flex-col items-center justify-center text-center p-6 z-10">
                <div className="size-20 rounded-full border border-[#00F5D4]/40 flex items-center justify-center mb-4 bg-black/50 backdrop-blur-md shadow-[0_0_25px_rgba(0,245,212,0.2)]">
                  <div className="size-14 rounded-full border border-[#00FFA3]/60 flex items-center justify-center">
                    <Sparkles className="size-6 text-[#00F5D4] animate-spin" style={{ animationDuration: "8s" }} />
                  </div>
                </div>
                <h4 className="text-white font-bold text-sm tracking-wide mb-1">{title}</h4>
                <p className="text-gray-40 text-xs max-w-md line-clamp-2">{description}</p>
              </div>
            </div>
          )}

          {/* Holographic Scanline Overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.03] to-transparent bg-[length:100%_4px] opacity-70" />

          {/* Centered Play Button (21st Style) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-20 rounded-full bg-[#00F5D4]/10 backdrop-blur-md flex items-center justify-center border border-[#00F5D4]/30 transition-transform duration-300 group-hover:scale-110 shadow-[0_0_30px_rgba(0,245,212,0.3)]">
              <div className="size-14 rounded-full bg-[#00F5D4] flex items-center justify-center text-black shadow-lg transition-transform duration-200 group-hover:scale-105">
                <Play className="size-6 fill-black translate-x-0.5" />
              </div>
            </div>
          </div>

          {/* Bottom Video Meta Strip */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-black/75 backdrop-blur-md px-3 py-1.5 rounded border border-gray-20/50 text-[10px] text-gray-30">
            <span className="flex items-center gap-1.5 text-white">
              <span className="size-1.5 rounded-full bg-[#00FFA3] animate-ping" />
              PLAY STREAM DEMO
            </span>
            <span className="text-yellow text-[9px]">4K 60FPS // LIVING MODEL</span>
          </div>
        </div>
      </div>

      {/* Spring-Animated Modal Video Player */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 md:p-8"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl rounded-2xl border border-[#00F5D4]/40 bg-[#090a0f] p-3 shadow-[0_0_80px_rgba(0,245,212,0.25)] overflow-hidden"
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between pb-3 px-2 text-xs text-gray-40 border-b border-gray-20">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#00F5D4] animate-pulse" />
                  <span className="text-white font-bold">{title}</span>
                  <span className="text-[10px] text-gray-40 hidden sm:inline">// REPRODUCIBLE EVIDENCE STREAM</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-gray-40 hover:text-[#00F5D4] transition-colors p-1"
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-full bg-white/10 p-1.5 text-gray-40 hover:bg-white/20 hover:text-white transition-colors"
                    title="Close preview"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>

              {/* Video Player Frame */}
              <div className="relative mt-3 aspect-video w-full overflow-hidden rounded-xl bg-black border border-gray-20">
                {videoSrc.includes("youtube") || videoSrc.includes("vimeo") ? (
                  <iframe
                    src={`${videoSrc}?autoplay=1&mute=${isMuted ? 1 : 0}`}
                    className="size-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={title}
                  />
                ) : (
                  <video
                    src={videoSrc}
                    autoPlay
                    controls
                    muted={isMuted}
                    className="size-full object-contain"
                  />
                )}
              </div>

              {/* Modal Footer Controls */}
              <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] text-gray-40 px-2">
                <div className="flex items-center gap-4">
                  <span>CANONICAL: <strong className="text-[#00FFA3]">PROVENANCE GROUNDED</strong></span>
                  <span>ENCRYPTION: <strong className="text-white">SHA-256 HMAC</strong></span>
                </div>
                <span className="text-[#00F5D4] text-[10px]">FEEXSYSTEMS LIVING INTELLIGENCE RUNTIME</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default HeroVideoDialog;
