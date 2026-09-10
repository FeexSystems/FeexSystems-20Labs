import React, { useEffect, useState, useRef } from "react";
import { X, Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TheaterVideoPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  title?: string;
  description?: string;
}

export function TheaterVideoPlayer({
  isOpen,
  onClose,
  videoUrl,
  title = "FeexSystems World Model Demonstration",
  description = "A comprehensive tour through 3D Spatial Knowledge, Evidence Fabric, and Autonomous Agent Orchestration.",
}: TheaterVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(35);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === " ") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
      if (e.key.toLowerCase() === "m") setIsMuted((m) => !m);
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 sm:p-8 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Ambient Radial Glow */}
      <div className="absolute w-[80vw] h-[80vh] rounded-full bg-white/5 blur-[140px] pointer-events-none" />

      {/* Main Player Box */}
      <div
        className="relative w-full max-w-5xl rounded-2xl overflow-hidden border border-white/20 bg-black shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 bg-white/5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
            <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              {title}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Canvas Stage */}
        <div className="relative aspect-video w-full bg-[#05070e] flex items-center justify-center">
          {videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              autoPlay
              muted={isMuted}
              loop
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-20 h-20 rounded-full bg-white/10 border border-white/30 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-white" />
                ) : (
                  <Play className="w-8 h-8 text-white translate-x-0.5" />
                )}
              </div>
              <div className="font-mono text-sm text-gray-300 max-w-md">
                Interactive Theater Stage Simulation
              </div>
            </div>
          )}
        </div>

        {/* Scrubber & Controls */}
        <div className="p-4 bg-white/5 border-t border-white/10 space-y-3">
          {/* Progress Slider */}
          <div
            className="relative h-1.5 w-full rounded-full bg-white/20 cursor-pointer overflow-hidden group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickPercent = ((e.clientX - rect.left) / rect.width) * 100;
              setProgress(clickPercent);
            }}
          >
            <div
              className="absolute top-0 bottom-0 left-0 bg-white rounded-full shadow-[0_0_8px_#ffffff]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-gray-400">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-white hover:text-gray-300 transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-white hover:text-gray-300 transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <span>02:14 / 06:45</span>
            </div>

            <div className="hidden sm:block text-gray-400 text-[11px]">
              Press <kbd className="px-1 py-0.5 rounded bg-white/10 text-white">Space</kbd> to Pause, <kbd className="px-1 py-0.5 rounded bg-white/10 text-white">M</kbd> to Mute, <kbd className="px-1 py-0.5 rounded bg-white/10 text-white">Esc</kbd> to Close
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TheaterVideoPlayer;
