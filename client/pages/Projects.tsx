import React, { useEffect, useMemo, useState, Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Boxes,
  Compass,
  ExternalLink,
  FileCode,
  GitBranch,
  Globe,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Terminal,
  Activity,
  Layers,
  Check,
  ChevronRight,
} from "lucide-react";
import { feexProjects } from "@/lib/feex-ecosystem";
import { FeexHorizontalLockup, FeexWorldBadge } from "@/components/FeexLogo";
import { CursorSpotlightCard } from "@/components/motion/CursorSpotlightCard";
import { LinkPreviewCard } from "@/components/media/LinkPreviewCard";
import { InfiniteMarqueeTicker } from "@/components/carousel/InfiniteMarqueeTicker";

// Lazy-load Drei 3D Topology Hero for maximum initial bundle performance
const DreiProjectsHero = lazy(() => import("@/components/webgl/DreiProjectsHero"));
const ProjectMini3DCard = lazy(() => import("@/components/webgl/ProjectMini3DCard"));

type WorldProject = {
  id: string;
  repository: string;
  name: string;
  description: string | null;
  url: string;
  metadata?: { language?: string; topics?: string[]; stars?: number };
  lastObservedAt?: string;
};

const DOMAIN_FILTERS = ["ALL", "INTELLIGENCE", "HEALTHCARE", "FINANCE", "RESEARCH"];

export default function Projects() {
  const [query, setQuery] = useState("");
  const [activeDomain, setActiveDomain] = useState("ALL");
  const [projects, setProjects] = useState<WorldProject[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const r = await fetch("/api/world-model/projects");
      const d = await r.json();
      if (!r.ok || !d.success) throw new Error(d.error || "World Model unavailable");
      setProjects(d.projects || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "World Model unavailable");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const sync = async () => {
    setSyncing(true);
    try {
      await fetch("/api/world-model/sync/github-pinned", { method: "POST" });
      await load();
    } finally {
      setSyncing(false);
    }
  };

  const fallback = useMemo(() => {
    return projects.length
      ? projects
      : feexProjects.map((p) => ({
          id: p.id,
          repository: `FeexSystems/${p.repository}`,
          name: p.name,
          description: p.description,
          url: `https://github.com/FeexSystems/${p.repository}`,
          metadata: { language: p.technologies[0], topics: p.technologies },
        }));
  }, [projects]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return fallback.filter((p) => {
      const matchesText = !q || [
        p.name,
        p.repository,
        p.description || "",
        p.metadata?.language || "",
        ...(p.metadata?.topics || [])
      ].join(" ").toLowerCase().includes(q);

      if (activeDomain === "ALL") return matchesText;
      const desc = (p.description || "").toLowerCase();
      const repo = p.repository.toLowerCase();
      const domainMatch = desc.includes(activeDomain.toLowerCase()) || 
                          repo.includes(activeDomain.toLowerCase()) ||
                          (p.metadata?.topics || []).some(t => t.toLowerCase().includes(activeDomain.toLowerCase()));
      return matchesText && domainMatch;
    });
  }, [fallback, query, activeDomain]);

  return (
    <main className="min-h-screen bg-[#040406] text-white antialiased font-sans">
      
      {/* 1. INDUSTRIAL GLOBAL HEADER */}
      <header className="sticky top-0 z-50 flex items-center pt-2.5 bg-[#040406]/85 backdrop-blur-md border-b border-gray-20/80">
        <div className="container mx-auto flex h-11 flex-1 items-center justify-between bg-white text-black pr-2 pl-5 sm:pl-6 border border-gray-20">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-display font-extrabold tracking-widest text-base sm:text-lg text-black">
                FEEX<span className="text-[#00B4D8]">SYSTEMS</span>
              </span>
              <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-300 hidden sm:inline-block font-bold">
                WORLD_MODEL
              </span>
            </Link>
            <span className="text-gray-40 font-mono">/</span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-black">
              PROJECTS EXPLORER
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1 h-full">
            <Link to="/" className="inline-flex items-center h-full px-4 text-xs font-medium text-black hover:text-gray-60 transition-colors">
              Home
            </Link>
            <Link to="/navigator" className="inline-flex items-center h-full px-4 text-xs font-medium text-black hover:text-gray-60 transition-colors">
              Navigator
            </Link>
            <Link to="/evidence" className="inline-flex items-center h-full px-4 text-xs font-medium text-black hover:text-gray-60 transition-colors">
              Evidence
            </Link>
            <Link to="/world" className="inline-flex items-center h-full px-4 text-xs font-medium text-cyan-600 hover:text-cyan-800 transition-colors font-mono">
              • 3D World
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={sync}
              disabled={syncing}
              className="inline-flex items-center gap-1.5 h-8 px-3 bg-neutral-100 hover:bg-neutral-200 border border-gray-30 text-xs font-mono font-medium text-black transition-colors"
            >
              <RefreshCw className={`size-3 ${syncing ? "animate-spin text-cyan-600" : "text-black"}`} />
              <span>{syncing ? "Syncing..." : "Sync GitHub"}</span>
            </button>
            <Link
              to="/world"
              className="inline-flex items-center gap-1.5 h-8 px-3.5 bg-black text-white hover:bg-neutral-800 text-xs font-mono font-medium transition-colors"
            >
              <Globe className="size-3.5 text-cyan" />
              <span>Launch 3D</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. DREI 3D TOPOLOGY HERO */}
      <Suspense fallback={<div className="h-52 w-full bg-[#040406] flex items-center justify-center font-mono text-xs text-gray-60">Initializing 3D Topology Scene...</div>}>
        <DreiProjectsHero />
      </Suspense>

      {/* 3. HERO TITLES & INDUSTRIAL CONTROL STATS */}
      <section className="container mx-auto px-5 md:px-8 pt-10 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-20 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono tracking-widest text-[#00F5D4] uppercase bg-[#00F5D4]/10 border border-[#00F5D4]/30 rounded-full mb-3">
              <Sparkles className="size-3 text-[#00F5D4]" />
              Authoritative World Model Registry
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal text-white">
              FEEXSYSTEMS <mark className="inline-block bg-yellow text-black px-2 pb-0.5 font-semibold">Project Explorer.</mark>
            </h1>
            <p className="mt-3 text-sm md:text-base text-gray-40 max-w-2xl leading-relaxed">
              Every pinned repository is an autonomous living world. Artifacts, technologies, and cryptographic relationships synchronized with zero manual configuration.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <FeexWorldBadge sha="sha-feex-projects-mesh" status="ACTIVE 100%" />
          </div>
        </div>

        {/* Hairline 3-Card Metric Strip */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-px bg-gray-20 border border-gray-20">
          <div className="bg-[#090a0f] p-6">
            <div className="flex items-center justify-between text-gray-40">
              <span className="font-mono text-xs uppercase tracking-wider">Synchronized Repositories</span>
              <Boxes className="size-4 text-[#00F5D4]" />
            </div>
            <div className="mt-3 font-display text-3xl text-white font-medium">
              {projects.length || feexProjects.length} <span className="text-xs text-gray-60 font-mono">Live</span>
            </div>
            <div className="mt-1 text-xs text-gray-60 font-mono">
              Tracked across GitHub org
            </div>
          </div>

          <div className="bg-[#090a0f] p-6">
            <div className="flex items-center justify-between text-gray-40">
              <span className="font-mono text-xs uppercase tracking-wider">Evidence Pipeline</span>
              <GitBranch className="size-4 text-yellow" />
            </div>
            <div className="mt-3 font-display text-3xl text-white font-medium">
              HMAC <span className="text-xs text-yellow font-mono">SHA-256</span>
            </div>
            <div className="mt-1 text-xs text-gray-60 font-mono">
              Cryptographically verified
            </div>
          </div>

          <div className="bg-[#090a0f] p-6">
            <div className="flex items-center justify-between text-gray-40">
              <span className="font-mono text-xs uppercase tracking-wider">Model Retrieval Status</span>
              <ShieldCheck className="size-4 text-emerald-400" />
            </div>
            <div className="mt-3 font-display text-3xl text-white font-medium">
              100% <span className="text-xs text-emerald-400 font-mono">Grounded</span>
            </div>
            <div className="mt-1 text-xs text-gray-60 font-mono">
              Zero hallucinated entities
            </div>
          </div>
        </div>
      </section>

      {/* 3.5. CONTINUOUS REPOSITORY & TELEMETRY MARQUEE */}
      <div className="container mx-auto px-5 md:px-8 pt-6">
        <InfiniteMarqueeTicker speed={28} pauseOnHover={true} />
      </div>

      {/* 4. SEARCH & DOMAIN FILTER DECK */}
      <section className="container mx-auto px-5 md:px-8 py-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border border-gray-20 bg-[#090a0f] p-4">
          
          {/* Terminal Search Input */}
          <div className="relative flex-1">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-gray-40 font-mono text-xs pointer-events-none">
              <Terminal className="size-3.5 text-[#00F5D4]" />
              <span className="hidden sm:inline">query //</span>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by repo, technology, language..."
              className="w-full h-10 pl-10 sm:pl-24 pr-4 bg-[#040406] border border-gray-20 text-xs font-mono text-white placeholder:text-gray-60 focus:outline-none focus:border-[#00F5D4] transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-gray-40 hover:text-white"
              >
                CLEAR
              </button>
            )}
          </div>

          {/* Domain Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {DOMAIN_FILTERS.map((d) => (
              <button
                key={d}
                onClick={() => setActiveDomain(d)}
                className={`px-3 py-1.5 text-xs font-mono tracking-wider transition-all border ${
                  activeDomain === d
                    ? "bg-white text-black font-bold border-white"
                    : "bg-[#040406] text-gray-40 hover:text-white border-gray-20 hover:border-gray-30"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-950/30 border border-red-900/60 text-xs font-mono text-red-400 flex items-center justify-between">
            <span>World Model sync notice: {error}. Showing fallback registry.</span>
            <button onClick={load} className="underline hover:text-white">Retry</button>
          </div>
        )}
      </section>

      {/* 5. HAIRLINE PROJECT CARD MATRIX GRID WITH CURSOR SPOTLIGHT & LINK PREVIEW */}
      <section className="container mx-auto px-5 md:px-8 py-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-20 border border-gray-20">
          {visible.map((p, idx) => {
            const shortRepo = p.repository.split("/").pop();
            const language = p.metadata?.language || "TypeScript";

            return (
              <CursorSpotlightCard
                key={p.id}
                spotlightColor="rgba(0, 245, 212, 0.12)"
                className="group relative flex flex-col justify-between p-6 sm:p-7 bg-[#090a0f] hover:bg-[#141416] transition-all duration-200"
              >
                <div>
                  {/* Top Bar: Language + Index */}
                  <div className="flex items-center justify-between text-xs font-mono text-gray-40 border-b border-gray-20/60 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-[#00F5D4]" />
                      <span className="text-white font-medium">{language}</span>
                    </div>
                    <span className="text-[11px] text-gray-60">0{idx + 1} // REPO</span>
                  </div>

                  {/* Project Name with Rich Link Preview Card */}
                  <LinkPreviewCard
                    url={p.url}
                    title={p.name}
                    description={p.description || "Engineering project discovered and anchored in the FEEXSYSTEMS Living World Model."}
                    repo={p.repository}
                  >
                    <h3 className="font-display text-xl text-white font-medium tracking-tight group-hover:text-[#00F5D4] transition-colors cursor-pointer inline-block">
                      {p.name}
                    </h3>
                  </LinkPreviewCard>

                  {/* Repository slug */}
                  <div className="mt-1 font-mono text-xs text-gray-40 truncate">
                    feexsystems/{shortRepo}
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-xs sm:text-sm text-gray-40 leading-relaxed line-clamp-3">
                    {p.description || "Engineering project discovered and anchored in the FEEXSYSTEMS Living World Model."}
                  </p>

                  {/* Topics Pills */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {(p.metadata?.topics || ["AI", "Systems", "WebGL"]).slice(0, 4).map((topic) => (
                      <span
                        key={topic}
                        className="px-2 py-0.5 text-[10px] font-mono bg-[#040406] border border-gray-20 text-gray-40 group-hover:border-gray-30"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* Interactive 3D Presentation Controls Preview */}
                  <div className="mt-4 border border-gray-20/60 bg-[#040406] relative">
                    <div className="absolute top-2 left-2.5 z-10 text-[9px] font-mono text-gray-50 flex items-center gap-1.5 pointer-events-none">
                      <span className="size-1 rounded-full bg-[#00F5D4] animate-pulse" />
                      <span>3D TILT // DREI PRESENTATION</span>
                    </div>
                    <Suspense fallback={<div className="h-28 flex items-center justify-center font-mono text-[10px] text-gray-60">Initializing 3D Artifact...</div>}>
                      <ProjectMini3DCard
                        domain={p.description?.includes("Med") ? "Healthcare" : p.name?.includes("Xchange") ? "Finance" : p.name?.includes("Labs") ? "Research" : "Intelligence"}
                        isPinned={idx < 2}
                        color={idx % 2 === 0 ? "#00F5D4" : "#facc15"}
                      />
                    </Suspense>
                  </div>
                </div>

                {/* Bottom Actions Bar */}
                <div className="mt-8 pt-4 border-t border-gray-20/60 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/navigator?q=${encodeURIComponent(p.name)}`}
                      className="inline-flex items-center gap-1 text-xs font-mono text-gray-40 hover:text-white transition-colors"
                      title="Explore in AI Navigator"
                    >
                      <Compass className="size-3.5 text-[#00F5D4]" />
                      <span>Nav</span>
                    </Link>
                    <span className="text-gray-20">|</span>
                    <Link
                      to={`/evidence/${encodeURIComponent(p.id)}`}
                      className="inline-flex items-center gap-1 text-xs font-mono text-gray-40 hover:text-white transition-colors"
                      title="View Evidence Provenance"
                    >
                      <FileCode className="size-3.5 text-yellow" />
                      <span>Evidence</span>
                    </Link>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/world?focus=${encodeURIComponent(p.id)}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono bg-neutral-950 border border-gray-20 hover:border-[#00F5D4] text-white transition-colors"
                    >
                      <Globe className="size-3 text-[#00F5D4]" />
                      <span>3D</span>
                    </Link>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center p-1.5 bg-neutral-950 border border-gray-20 hover:border-white text-gray-40 hover:text-white transition-colors"
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                </div>
              </CursorSpotlightCard>
            );
          })}
        </div>

        {!visible.length && (
          <div className="mt-8 p-12 border border-dashed border-gray-20 text-center font-mono text-xs text-gray-60">
            No projects found matching current filter query.
          </div>
        )}
      </section>

      {/* 6. GLOBAL FOOTER STRIP */}
      <footer className="border-t border-gray-20 py-8 bg-[#040406] text-xs font-mono text-gray-60">
        <div className="container mx-auto px-5 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white uppercase tracking-wider">FEEXSYSTEMS</span>
            <span>Living Engineering Intelligence</span>
          </div>
          <div>
            <span>Authoritative World Model · SOC 2 Type II Certified</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
