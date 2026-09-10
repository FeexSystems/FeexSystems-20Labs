import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Sparkles, 
  Layers, 
  Globe, 
  Terminal, 
  Compass, 
  Code2, 
  Eye, 
  Sliders, 
  CheckCircle2, 
  ExternalLink 
} from "lucide-react";
import {
  FullWidthNav,
  CursorDotTrail,
  MagneticGlowButton,
  AppleDock,
  SkeletonLoader,
  InteractionLinesBackground,
  AnimatedBackground,
  PolygonNet,
  StrokeAnimation,
  TsunamiWave,
  ScrollSyncedText,
  ScrollZoomReveal,
  SushCinematicCarousel,
  PillCarousel,
  SequentialCarousel,
  CinematicVideo,
  TheaterVideoPlayer,
  YoutubeEmbedCard,
  ParticleGlobe3D,
  GlobeMorph,
  AsciiArtEffect,
  TransitionVisualizer,
  BtcMonoBadge,
} from "@/components/framer";

type CategoryKey = "all" | "nav" | "backgrounds" | "typography" | "carousels" | "3d" | "primitives";

export default function DesignLab() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("all");
  const [theaterOpen, setTheaterOpen] = useState(false);
  const [strokeVariant, setStrokeVariant] = useState<"neural" | "circuit" | "cube" | "infinity">("neural");
  const [asciiMode, setAsciiMode] = useState<"rotatingCube" | "cyberBanner" | "streamMatrix">("rotatingCube");
  const [bgTheme, setBgTheme] = useState<"cyber" | "matrix" | "violet" | "aurora">("cyber");

  const categories: { key: CategoryKey; label: string; count: number }[] = [
    { key: "all", label: "All Modules", count: 23 },
    { key: "nav", label: "Navigation & Docks", count: 3 },
    { key: "backgrounds", label: "Backgrounds & Shaders", count: 4 },
    { key: "typography", label: "Typography & Vectors", count: 4 },
    { key: "carousels", label: "Carousels & Media", count: 5 },
    { key: "3d", label: "3D & State Graphs", count: 3 },
    { key: "primitives", label: "Primitives & Badges", count: 4 },
  ];

  return (
    <div className="min-h-screen bg-[#05060a] text-white font-sans relative selection:bg-cyan-500 selection:text-black pb-32">
      {/* Global Interactive Cursor Dot Trail */}
      <CursorDotTrail />

      {/* Top Floating Full-Width Nav */}
      <FullWidthNav />

      {/* Hero Header */}
      <section className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/10 blur-[120px] pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          FEEXSYSTEMS MOTION LAB • 23 NATIVE MODULES
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold font-mono tracking-tight text-white mb-4">
          Interaction & 3D <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">Design Lab</span>
        </h1>

        <p className="max-w-2xl mx-auto text-gray-400 text-sm sm:text-base leading-relaxed">
          Explore all 23 native TypeScript Framer-inspired interaction, shader, and 3D visualization modules engineered for the FeexSystems Living Intelligence platform.
        </p>

        {/* Category Filter Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all border ${
                selectedCategory === cat.key
                  ? "bg-cyan-500 text-black font-bold border-cyan-400 shadow-[0_0_15px_rgba(0,245,212,0.3)]"
                  : "bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10"
              }`}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>
      </section>

      {/* Main Modules Showcase Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* ================= SECTION 1: NAVIGATION & DOCKS ================= */}
        {(selectedCategory === "all" || selectedCategory === "nav") && (
          <section className="space-y-6">
            <div className="border-b border-white/10 pb-3 flex items-center justify-between">
              <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                <span className="text-cyan-400">01.</span> Navigation & Docks
              </h2>
              <span className="text-xs font-mono text-gray-400">3 MODULES</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Module 1: FullWidthNav Demo */}
              <div className="rounded-2xl bg-black/60 border border-white/15 p-6 backdrop-blur-xl flex flex-col justify-between">
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                    <span className="text-cyan-400 font-bold">MODULE 01</span>
                    <span>FullWidthNav.tsx</span>
                  </div>
                  <h3 className="text-lg font-bold font-mono text-white">Glassmorphic Sliding Nav</h3>
                  <p className="text-xs text-gray-400">
                    Full-width responsive header with sliding active indicator pill, live status ping, and dropdown mega-menus.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center">
                  <p className="text-xs font-mono text-cyan-300">Live preview active at top of this page</p>
                </div>
              </div>

              {/* Module 2: AppleDock Demo */}
              <div className="rounded-2xl bg-black/60 border border-white/15 p-6 backdrop-blur-xl flex flex-col justify-between">
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                    <span className="text-cyan-400 font-bold">MODULE 02</span>
                    <span>AppleDock.tsx</span>
                  </div>
                  <h3 className="text-lg font-bold font-mono text-white">macOS Spring Magnification Dock</h3>
                  <p className="text-xs text-gray-400">
                    Physics-based distance scaling with floating tooltips and active route pips.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center">
                  <AppleDock />
                </div>
              </div>

              {/* Module 3: PillCarousel Demo */}
              <div className="lg:col-span-2 rounded-2xl bg-black/60 border border-white/15 p-6 backdrop-blur-xl">
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                    <span className="text-cyan-400 font-bold">MODULE 03</span>
                    <span>PillCarousel.tsx</span>
                  </div>
                  <h3 className="text-lg font-bold font-mono text-white">Horizontal Filter Pill Carousel</h3>
                  <p className="text-xs text-gray-400">
                    Smooth scroll snap with item count badges and keyboard navigation.
                  </p>
                </div>
                <PillCarousel />
              </div>
            </div>
          </section>
        )}

        {/* ================= SECTION 2: BACKGROUNDS & SHADERS ================= */}
        {(selectedCategory === "all" || selectedCategory === "backgrounds") && (
          <section className="space-y-6">
            <div className="border-b border-white/10 pb-3 flex items-center justify-between">
              <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                <span className="text-cyan-400">02.</span> Backgrounds & Mathematical Shaders
              </h2>
              <span className="text-xs font-mono text-gray-400">4 MODULES</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Module 4: InteractionLinesBackground */}
              <div className="relative h-[340px] rounded-2xl bg-black/80 border border-white/15 p-6 backdrop-blur-xl overflow-hidden flex flex-col justify-between">
                <InteractionLinesBackground />
                <div className="relative z-10 space-y-1">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">MODULE 04</span>
                  <h3 className="text-lg font-bold font-mono text-white">Interactive Bezier Lines</h3>
                  <p className="text-xs text-gray-400">Move mouse across container to bend dynamic spring lines.</p>
                </div>
                <div className="relative z-10 text-[11px] font-mono text-cyan-400/80">
                  Adaptive 60fps • Proximity Elasticity
                </div>
              </div>

              {/* Module 5: PolygonNet */}
              <div className="relative h-[340px] rounded-2xl bg-black/80 border border-white/15 p-6 backdrop-blur-xl overflow-hidden flex flex-col justify-between">
                <PolygonNet nodeCount={40} />
                <div className="relative z-10 space-y-1">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">MODULE 05</span>
                  <h3 className="text-lg font-bold font-mono text-white">Polygon Constellation Net</h3>
                  <p className="text-xs text-gray-400">Delaunay triangulation with mouse repulsion. Click to send shockwave.</p>
                </div>
                <div className="relative z-10 text-[11px] font-mono text-cyan-400/80">
                  Dynamic Geometry • Shockwave Impulse
                </div>
              </div>

              {/* Module 6: AnimatedBackground */}
              <div className="relative h-[300px] rounded-2xl bg-black/80 border border-white/15 p-6 backdrop-blur-xl overflow-hidden flex flex-col justify-between">
                <AnimatedBackground theme={bgTheme} />
                <div className="relative z-10 space-y-1">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">MODULE 06</span>
                  <h3 className="text-lg font-bold font-mono text-white">Organic Gradient Mesh</h3>
                  <p className="text-xs text-gray-400">Perlin noise floating orbs with cyber grid overlay.</p>
                </div>
                <div className="relative z-10 flex items-center gap-2">
                  {(["cyber", "matrix", "violet", "aurora"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setBgTheme(t)}
                      className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase ${
                        bgTheme === t ? "bg-cyan-500 text-black font-bold" : "bg-white/10 text-gray-300"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Module 7: TsunamiWave */}
              <div className="relative h-[300px] rounded-2xl bg-black/80 border border-white/15 p-6 backdrop-blur-xl overflow-hidden flex flex-col justify-between">
                <div className="relative z-10 space-y-1">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">MODULE 07</span>
                  <h3 className="text-lg font-bold font-mono text-white">Tsunami Multi-Harmonic Wave</h3>
                  <p className="text-xs text-gray-400">Continuous sinusoidal superposition with fluid gradient fill.</p>
                </div>
                <div className="w-full">
                  <TsunamiWave height={140} />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= SECTION 3: TYPOGRAPHY & VECTOR MOTION ================= */}
        {(selectedCategory === "all" || selectedCategory === "typography") && (
          <section className="space-y-6">
            <div className="border-b border-white/10 pb-3 flex items-center justify-between">
              <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                <span className="text-cyan-400">03.</span> Typography & Vector Motion
              </h2>
              <span className="text-xs font-mono text-gray-400">4 MODULES</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Module 8: ScrollSyncedText */}
              <div className="rounded-2xl bg-black/60 border border-white/15 p-6 backdrop-blur-xl">
                <div className="space-y-1 mb-4">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">MODULE 08</span>
                  <h3 className="text-lg font-bold font-mono text-white">Scroll-Synced Typography</h3>
                  <p className="text-xs text-gray-400">Word-by-word chromatic reveal linked to scroll progress.</p>
                </div>
                <ScrollSyncedText text="The World Model is authoritative. Neural reasoning layers project verifiable topological truth." />
              </div>

              {/* Module 9: StrokeAnimation */}
              <div className="rounded-2xl bg-black/60 border border-white/15 p-6 backdrop-blur-xl flex flex-col justify-between">
                <div className="space-y-1 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">MODULE 09</span>
                    <div className="flex items-center gap-1">
                      {(["neural", "circuit", "cube", "infinity"] as const).map((v) => (
                        <button
                          key={v}
                          onClick={() => setStrokeVariant(v)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                            strokeVariant === v ? "bg-cyan-500 text-black font-bold" : "bg-white/10 text-gray-300"
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold font-mono text-white">Self-Drawing Vector Strokes</h3>
                  <p className="text-xs text-gray-400">SVG stroke-dashoffset drawing animation with laser glow.</p>
                </div>
                <div className="h-48 flex items-center justify-center">
                  <StrokeAnimation variant={strokeVariant} />
                </div>
              </div>

              {/* Module 10: ScrollZoomReveal */}
              <div className="rounded-2xl bg-black/60 border border-white/15 p-6 backdrop-blur-xl">
                <div className="space-y-1 mb-4">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">MODULE 10</span>
                  <h3 className="text-lg font-bold font-mono text-white">3D Perspective Scroll Zoom</h3>
                  <p className="text-xs text-gray-400">Smooth scale, tilt unclip, and border-radius morphing.</p>
                </div>
                <ScrollZoomReveal>
                  <div className="p-6 rounded-xl bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-500/30 font-mono text-xs text-cyan-300">
                    Scroll up/down to see this card tilt and zoom smoothly
                  </div>
                </ScrollZoomReveal>
              </div>

              {/* Module 11: AsciiArtEffect */}
              <div className="rounded-2xl bg-black/60 border border-white/15 p-6 backdrop-blur-xl">
                <div className="space-y-1 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">MODULE 11</span>
                    <div className="flex items-center gap-1">
                      {(["rotatingCube", "cyberBanner", "streamMatrix"] as const).map((m) => (
                        <button
                          key={m}
                          onClick={() => setAsciiMode(m)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                            asciiMode === m ? "bg-cyan-500 text-black font-bold" : "bg-white/10 text-gray-300"
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold font-mono text-white">Real-Time ASCII Art Engine</h3>
                  <p className="text-xs text-gray-400">3D mathematical doughnut / cube rendered in glowing monospace ASCII.</p>
                </div>
                <AsciiArtEffect mode={asciiMode} />
              </div>
            </div>
          </section>
        )}

        {/* ================= SECTION 4: CAROUSELS & MEDIA SHOWCASES ================= */}
        {(selectedCategory === "all" || selectedCategory === "carousels") && (
          <section className="space-y-6">
            <div className="border-b border-white/10 pb-3 flex items-center justify-between">
              <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                <span className="text-cyan-400">04.</span> Carousels & Video Stages
              </h2>
              <span className="text-xs font-mono text-gray-400">5 MODULES</span>
            </div>

            <div className="space-y-8">
              {/* Module 12: SushCinematicCarousel */}
              <div className="rounded-2xl bg-black/60 border border-white/15 p-6 backdrop-blur-xl">
                <div className="space-y-1 mb-4">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">MODULE 12</span>
                  <h3 className="text-lg font-bold font-mono text-white">3D Depth Coverflow Carousel</h3>
                  <p className="text-xs text-gray-400">Swipe or click cards to rotate through 3D z-depth perspective stage.</p>
                </div>
                <SushCinematicCarousel />
              </div>

              {/* Module 13: SequentialCarousel */}
              <div className="rounded-2xl bg-black/60 border border-white/15 p-6 backdrop-blur-xl">
                <div className="space-y-1 mb-4">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">MODULE 13</span>
                  <h3 className="text-lg font-bold font-mono text-white">Sequential Stepper Carousel</h3>
                  <p className="text-xs text-gray-400">Multi-stage pipeline walkthrough with live code snippets and autoplay.</p>
                </div>
                <SequentialCarousel />
              </div>

              {/* Modules 14, 15, 16: CinematicVideo, TheaterVideoPlayer, YoutubeEmbedCard */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-2xl bg-black/60 border border-white/15 p-6 backdrop-blur-xl">
                  <div className="space-y-1 mb-4">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">MODULE 14 & 15</span>
                    <h3 className="text-lg font-bold font-mono text-white">Cinematic Video & Fullscreen Theater</h3>
                    <p className="text-xs text-gray-400">Soundwave visualizer HUD with theater mode expansion.</p>
                  </div>
                  <CinematicVideo onOpenTheater={() => setTheaterOpen(true)} />
                </div>

                <div className="rounded-2xl bg-black/60 border border-white/15 p-6 backdrop-blur-xl">
                  <div className="space-y-1 mb-4">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">MODULE 16</span>
                    <h3 className="text-lg font-bold font-mono text-white">Ambient Bleed YouTube Showcase</h3>
                    <p className="text-xs text-gray-400">Responsive embed with colored ambient backlight.</p>
                  </div>
                  <YoutubeEmbedCard videoId="dQw4w9WgXcQ" />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= SECTION 5: 3D & STATE GRAPHS ================= */}
        {(selectedCategory === "all" || selectedCategory === "3d") && (
          <section className="space-y-6">
            <div className="border-b border-white/10 pb-3 flex items-center justify-between">
              <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                <span className="text-cyan-400">05.</span> 3D Particle Globes & State Graphs
              </h2>
              <span className="text-xs font-mono text-gray-400">3 MODULES</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Module 17: ParticleGlobe3D */}
              <div className="rounded-2xl bg-black/60 border border-white/15 p-6 backdrop-blur-xl">
                <div className="space-y-1 mb-2">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">MODULE 17</span>
                  <h3 className="text-lg font-bold font-mono text-white">Interactive 3D Particle Globe</h3>
                  <p className="text-xs text-gray-400">Drag to rotate the 3D Fibonacci sphere in real-time.</p>
                </div>
                <ParticleGlobe3D />
              </div>

              {/* Module 18: GlobeMorph */}
              <div className="rounded-2xl bg-black/60 border border-white/15 p-6 backdrop-blur-xl">
                <div className="space-y-1 mb-2">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">MODULE 18</span>
                  <h3 className="text-lg font-bold font-mono text-white">3D Vertex Geometry Morph</h3>
                  <p className="text-xs text-gray-400">Smooth interpolation across Sphere, Torus, Cube, and Cylinder.</p>
                </div>
                <GlobeMorph />
              </div>

              {/* Module 19: TransitionVisualizer */}
              <div className="lg:col-span-2">
                <TransitionVisualizer />
              </div>
            </div>
          </section>
        )}

        {/* ================= SECTION 6: PRIMITIVES & BADGES ================= */}
        {(selectedCategory === "all" || selectedCategory === "primitives") && (
          <section className="space-y-6">
            <div className="border-b border-white/10 pb-3 flex items-center justify-between">
              <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                <span className="text-cyan-400">06.</span> Interactive Primitives & Badges
              </h2>
              <span className="text-xs font-mono text-gray-400">4 MODULES</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Module 20: MagneticGlowButton */}
              <div className="rounded-2xl bg-black/60 border border-white/15 p-6 backdrop-blur-xl flex flex-col justify-between">
                <div className="space-y-1 mb-6">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">MODULE 20</span>
                  <h3 className="text-lg font-bold font-mono text-white">Magnetic Glow Button</h3>
                  <p className="text-xs text-gray-400">Physics spring cursor attraction with tracking radial glow.</p>
                </div>
                <div className="flex flex-col gap-3 items-center">
                  <MagneticGlowButton size="md" variant="primary">
                    <Sparkles className="w-4 h-4" /> Magnetic Primary
                  </MagneticGlowButton>
                  <MagneticGlowButton size="sm" variant="outline">
                    Outline Magnetic
                  </MagneticGlowButton>
                </div>
              </div>

              {/* Module 21: BtcMonoBadge */}
              <div className="rounded-2xl bg-black/60 border border-white/15 p-6 backdrop-blur-xl flex flex-col justify-between">
                <div className="space-y-1 mb-6">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">MODULE 21</span>
                  <h3 className="text-lg font-bold font-mono text-white">Cryptographic SHA-256 Badge</h3>
                  <p className="text-xs text-gray-400">Click to copy immutable proof hash.</p>
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <BtcMonoBadge label="EVIDENCE PROOF" blockHeight={840192} />
                  <BtcMonoBadge label="GIT COMMIT" commitSha="feex9b3c4f280a91e56d7821bc34" />
                </div>
              </div>

              {/* Module 22: SkeletonLoader */}
              <div className="rounded-2xl bg-black/60 border border-white/15 p-6 backdrop-blur-xl flex flex-col justify-between">
                <div className="space-y-1 mb-4">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">MODULE 22</span>
                  <h3 className="text-lg font-bold font-mono text-white">Cyber Shimmer Skeleton</h3>
                  <p className="text-xs text-gray-400">Telemetry loading state with scanline shimmer.</p>
                </div>
                <div className="space-y-3">
                  <SkeletonLoader variant="stats" />
                  <SkeletonLoader variant="text" lines={2} />
                </div>
              </div>
            </div>
          </section>
        )}

      </main>

      {/* Fullscreen Theater Modal */}
      <TheaterVideoPlayer
        isOpen={theaterOpen}
        onClose={() => setTheaterOpen(false)}
        title="FeexSystems World Model Deep Dive"
      />

      {/* Floating Bottom Apple Dock */}
      <div className="fixed bottom-6 inset-x-0 flex justify-center z-40 pointer-events-auto">
        <AppleDock />
      </div>
    </div>
  );
}
