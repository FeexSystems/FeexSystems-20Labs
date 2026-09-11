import { Suspense, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import {
  Boxes,
  Compass,
  ExternalLink,
  FileCode,
  Maximize2,
  Minimize2,
  RefreshCw,
  RotateCw,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { FeexHorizontalLockup, FeexWorldBadge } from "@/components/FeexLogo";
import { GalaxyScene } from "@/components/galaxy/GalaxyScene";
import type { GalaxyQuality, GraphData, GraphNode } from "@/components/galaxy/types";
import { QUALITY_PRESETS } from "@/components/galaxy/types";

const CANONICAL_INITIAL_GRAPH: GraphData = {
  nodes: [
    {
      id: "github:FeexSystems/FEEXSYSTEMS-Persona-Digital-Portfolio",
      name: "Persona Digital Operating Environment",
      type: "project",
      repository: "FeexSystems/FEEXSYSTEMS-Persona-Digital-Portfolio",
      description: "Spatial digital environment for Persona, systems, and engineering relationships.",
      url: "https://github.com/FeexSystems/FEEXSYSTEMS-Persona-Digital-Portfolio",
      isPinned: true,
      domain: "Intelligence",
      language: "JavaScript",
      artifactCount: 14,
      val: 36,
    },
    {
      id: "github:FeexSystems/yurrheeler-med-advisor",
      name: "Yurrheeler Med Advisor",
      type: "project",
      repository: "FeexSystems/yurrheeler-med-advisor",
      description: "AI-oriented healthcare medical-advisor engineering project.",
      url: "https://github.com/FeexSystems/yurrheeler-med-advisor",
      isPinned: true,
      domain: "Healthcare",
      language: "TypeScript",
      artifactCount: 12,
      val: 36,
    },
    {
      id: "github:FeexSystems/kappaxchangefin",
      name: "KappaXchangeFin",
      type: "project",
      repository: "FeexSystems/kappaxchangefin",
      description: "Financial infrastructure within the FEEXSYSTEMS ecosystem.",
      url: "https://github.com/FeexSystems/kappaxchangefin",
      isPinned: true,
      domain: "Finance",
      language: "TypeScript",
      artifactCount: 10,
      val: 36,
    },
    {
      id: "github:FeexSystems/HoloKai-Systems-Labs",
      name: "HoloKai Systems Labs",
      type: "project",
      repository: "FeexSystems/HoloKai-Systems-Labs",
      description: "Civilization intelligence and knowledge interfaces.",
      url: "https://github.com/FeexSystems/HoloKai-Systems-Labs",
      domain: "Research",
      language: "TypeScript",
      artifactCount: 8,
      val: 24,
    },
    {
      id: "github:FeexSystems/VYRA-LABS",
      name: "VYRA Labs",
      type: "project",
      repository: "FeexSystems/VYRA-LABS",
      description: "Experimental systems laboratory.",
      url: "https://github.com/FeexSystems/VYRA-LABS",
      domain: "Research",
      language: "TypeScript",
      artifactCount: 8,
      val: 24,
    },
    {
      id: "github:FeexSystems/3WM-SONIK-LABS",
      name: "3WM SONIK Labs",
      type: "project",
      repository: "FeexSystems/3WM-SONIK-LABS",
      description: "Three-world-model research laboratory.",
      url: "https://github.com/FeexSystems/3WM-SONIK-LABS",
      domain: "Intelligence",
      language: "TypeScript",
      artifactCount: 9,
      val: 24,
    },
    { id: "tech:typescript", name: "TypeScript", type: "technology", val: 16 },
    { id: "tech:threejs", name: "Three.js", type: "technology", val: 14 },
    { id: "tech:react", name: "React", type: "technology", val: 16 },
    { id: "tech:ai", name: "AI", type: "technology", val: 18 },
    { id: "tech:postgresql", name: "PostgreSQL", type: "technology", val: 15 },
    { id: "tech:webgl", name: "WebGL", type: "technology", val: 14 },
    { id: "tech:worldmodels", name: "World Models", type: "technology", val: 16 },
  ],
  links: [
    { id: "rel:1", source: "github:FeexSystems/FEEXSYSTEMS-Persona-Digital-Portfolio", target: "tech:threejs", relation: "USES" },
    { id: "rel:2", source: "github:FeexSystems/FEEXSYSTEMS-Persona-Digital-Portfolio", target: "tech:webgl", relation: "USES" },
    { id: "rel:3", source: "github:FeexSystems/yurrheeler-med-advisor", target: "tech:react", relation: "USES" },
    { id: "rel:4", source: "github:FeexSystems/yurrheeler-med-advisor", target: "tech:ai", relation: "USES" },
    { id: "rel:5", source: "github:FeexSystems/kappaxchangefin", target: "tech:postgresql", relation: "USES" },
    { id: "rel:6", source: "github:FeexSystems/3WM-SONIK-LABS", target: "tech:worldmodels", relation: "USES" },
    { id: "rel:7", source: "github:FeexSystems/3WM-SONIK-LABS", target: "tech:ai", relation: "USES" },
    { id: "rel:8", source: "github:FeexSystems/HoloKai-Systems-Labs", target: "tech:ai", relation: "USES" },
  ],
  stats: { totalProjects: 6, totalTechnologies: 7, totalLinks: 8 },
};

function detectDefaultQuality(): GalaxyQuality {
  if (typeof window === "undefined") return "balanced";
  const cores = navigator.hardwareConcurrency || 4;
  const mem = (navigator as any).deviceMemory || 4;
  if (cores <= 4 || mem <= 4) return "performance";
  if (cores >= 8 && mem >= 8) return "cinematic";
  return "balanced";
}

export default function SpatialWorld() {
  const [graphData, setGraphData] = useState<GraphData>(CANONICAL_INITIAL_GRAPH);
  const [loading, setLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [domainFilter, setDomainFilter] = useState("all");
  const [autoRotate, setAutoRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [quality, setQuality] = useState<GalaxyQuality>(() => detectDefaultQuality());

  const loadGraph = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/world-model/graph");
      const json = await res.json();
      if (json.success && json.data) setGraphData(json.data);
    } catch (e) {
      console.warn("Could not fetch live graph, using fallback", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGraph();
  }, []);

  const domains = useMemo(() => {
    const set = new Set<string>();
    graphData.nodes.forEach((n) => {
      if (n.domain) set.add(n.domain);
    });
    return Array.from(set);
  }, [graphData]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const dpr = QUALITY_PRESETS[quality].dpr;

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#040406] text-white select-none">
      <div className="bg-diagonal-stripes absolute inset-0 z-10 opacity-10 pointer-events-none" />

      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 md:p-6 pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <Link
            to="/"
            className="flex items-center gap-3 border border-gray-20 bg-[#090a0f]/90 px-4 py-2 text-sm font-semibold backdrop-blur-xl transition hover:border-[#00F5D4]/50"
          >
            <FeexHorizontalLockup markSize={24} showSubtitle={false} />
            <span className="text-gray-40 font-mono">/</span>
            <span className="text-[#00F5D4] font-mono text-xs tracking-wider uppercase">
              KNOWLEDGE_GALAXY_HQ
            </span>
          </Link>
          <FeexWorldBadge sha="sha-galaxy-hq" status="HQ ACTIVE" className="hidden lg:inline-flex" />
        </div>

        <div className="flex items-center gap-2 pointer-events-auto font-mono text-xs">
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value as GalaxyQuality)}
            className="h-9 px-2 border border-gray-20 bg-[#090a0f]/90 text-[#00F5D4] outline-none"
            title="Render quality"
          >
            {(Object.keys(QUALITY_PRESETS) as GalaxyQuality[]).map((k) => (
              <option key={k} value={k}>
                {QUALITY_PRESETS[k].label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`h-9 px-3 border flex items-center gap-1.5 transition-colors ${
              autoRotate
                ? "bg-[#090a0f] text-[#00F5D4] border-[#00F5D4]/40"
                : "bg-[#090a0f]/80 text-gray-40 border-gray-20"
            }`}
          >
            <RotateCw className={`size-3.5 ${autoRotate ? "animate-spin" : ""}`} style={{ animationDuration: "4s" }} />
            <span className="hidden sm:inline">ORBIT</span>
          </button>
          <button
            onClick={loadGraph}
            className="h-9 px-3 border border-gray-20 bg-[#090a0f]/90 text-gray-40 hover:text-[#00F5D4] flex items-center gap-1.5"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={toggleFullscreen}
            className="h-9 px-3 border border-gray-20 bg-[#090a0f]/90 text-gray-40 hover:text-white"
          >
            {isFullscreen ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
          </button>
        </div>
      </header>

      <div className="absolute top-20 left-4 z-20 w-full max-w-xs space-y-2 pointer-events-auto md:left-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-40" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter galaxy…"
            className="w-full h-10 pl-9 pr-3 border border-gray-20 bg-[#090a0f]/90 text-sm font-mono text-white placeholder:text-gray-40 outline-none focus:border-[#00F5D4]/50"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setDomainFilter("all")}
            className={`px-2 py-1 text-[10px] font-mono uppercase border ${
              domainFilter === "all"
                ? "border-[#00F5D4] text-[#00F5D4]"
                : "border-gray-20 text-gray-40"
            }`}
          >
            All
          </button>
          {domains.map((d) => (
            <button
              key={d}
              onClick={() => setDomainFilter(d)}
              className={`px-2 py-1 text-[10px] font-mono uppercase border ${
                domainFilter === d ? "border-[#00F5D4] text-[#00F5D4]" : "border-gray-20 text-gray-40"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono text-gray-40 border border-gray-20 bg-[#090a0f]/80 px-3 py-2">
          <Boxes className="size-3 text-[#00F5D4]" />
          <span>{graphData.stats.totalProjects} worlds</span>
          <span>·</span>
          <span>{graphData.stats.totalTechnologies} tech</span>
          <span>·</span>
          <span>{graphData.stats.totalLinks} links</span>
          <Sparkles className="size-3 text-[#00FFA3] ml-auto" />
          <span className="text-[#00FFA3]">{QUALITY_PRESETS[quality].label}</span>
        </div>
      </div>

      <div className="absolute inset-0 z-0">
        <Canvas
          dpr={dpr}
          camera={{ position: [0, 8, 28], fov: 50, near: 0.1, far: 200 }}
          gl={{ antialias: quality !== "performance", powerPreference: "high-performance" }}
          onPointerMissed={() => setSelectedNode(null)}
        >
          <Suspense fallback={null}>
            <GalaxyScene
              data={graphData}
              selectedNode={selectedNode}
              searchQuery={searchQuery}
              domainFilter={domainFilter}
              autoRotate={autoRotate}
              quality={quality}
              onSelectNode={setSelectedNode}
            />
          </Suspense>
        </Canvas>
        <Loader
          containerStyles={{ background: "rgba(4,4,6,0.85)", backdropFilter: "blur(8px)" }}
          innerStyles={{ backgroundColor: "#00F5D4" }}
          barStyles={{ backgroundColor: "#00FFA3" }}
          dataStyles={{ color: "#00F5D4", fontFamily: "monospace", fontSize: 11 }}
          dataInterpolation={(p) => `GALAXY_BOOT ${(p * 100).toFixed(0)}%`}
        />
      </div>

      {selectedNode && (
        <aside className="absolute top-24 right-4 z-20 w-full max-w-sm border border-gray-20 bg-[#090a0f]/95 backdrop-blur-xl p-5 pointer-events-auto md:right-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#00F5D4] mb-1">
                {selectedNode.type === "project" ? "WORLD NODE" : "TECHNOLOGY"}
              </div>
              <h2 className="text-lg font-semibold leading-tight">{selectedNode.name}</h2>
            </div>
            <button onClick={() => setSelectedNode(null)} className="text-gray-40 hover:text-white">
              <X className="size-4" />
            </button>
          </div>

          {selectedNode.description && (
            <p className="text-sm text-gray-40 mb-4 leading-relaxed">{selectedNode.description}</p>
          )}

          <div className="grid grid-cols-2 gap-2 mb-4">
            {selectedNode.domain && (
              <div className="border border-gray-20 bg-[#040406] p-3">
                <span className="text-[10px] uppercase text-gray-40 block">Domain</span>
                <span className="text-xs font-semibold mt-1 block">{selectedNode.domain}</span>
              </div>
            )}
            <div className="border border-gray-20 bg-[#040406] p-3">
              <span className="text-[10px] uppercase text-gray-40 block">Language</span>
              <span className="text-xs font-semibold mt-1 block">{selectedNode.language || "—"}</span>
            </div>
            {typeof selectedNode.artifactCount === "number" && (
              <div className="border border-gray-20 bg-[#040406] p-3">
                <span className="text-[10px] uppercase text-gray-40 block">Artifacts</span>
                <span className="text-xs font-semibold mt-1 block">{selectedNode.artifactCount}</span>
              </div>
            )}
          </div>

          {selectedNode.repository && (
            <div className="border border-gray-20 bg-[#040406] p-3 mb-4">
              <div className="flex items-center justify-between text-[10px] text-gray-40 mb-1">
                <span>Repository</span>
                <ShieldCheck className="size-3.5 text-emerald-400" />
              </div>
              <div className="font-mono text-xs text-emerald-400 break-all">{selectedNode.repository}</div>
            </div>
          )}

          <div className="space-y-2">
            {selectedNode.type === "project" && (
              <Link
                to={`/evidence?projectId=${encodeURIComponent(selectedNode.id)}`}
                className="w-full h-10 border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 flex items-center justify-center gap-2 text-sm"
              >
                <FileCode className="size-4" /> Inspect Evidence
              </Link>
            )}
            {selectedNode.url && (
              <a
                href={selectedNode.url}
                target="_blank"
                rel="noreferrer"
                className="w-full h-10 bg-white hover:bg-gray-90 text-black font-semibold flex items-center justify-center gap-2 text-sm"
              >
                GitHub Source <ExternalLink className="size-3.5" />
              </a>
            )}
            <Link
              to={`/navigator?q=${encodeURIComponent(selectedNode.name)}`}
              className="w-full h-10 border border-gray-20 hover:bg-neutral-900 flex items-center justify-center gap-2 text-sm"
            >
              <Compass className="size-4 text-[#00F5D4]" /> Query Navigator
            </Link>
            <Link
              to={`/omni?q=${encodeURIComponent("Show architecture for " + selectedNode.name)}`}
              className="w-full h-10 border border-[#00F5D4]/30 text-[#00F5D4] hover:bg-[#00F5D4]/10 flex items-center justify-center gap-2 text-sm"
            >
              Open in Omni-Command
            </Link>
          </div>
        </aside>
      )}
    </div>
  );
}
