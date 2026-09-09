import React, { FormEvent, useEffect, useState, Suspense, lazy } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  BrainCircuit,
  Compass,
  ExternalLink,
  FileCode,
  GitBranch,
  Globe,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  Terminal,
  Activity,
  Cpu,
  Layers,
  Lock,
  ChevronRight,
} from "lucide-react";
import { FeexHorizontalLockup, FeexWorldBadge } from "@/components/FeexLogo";
import { CursorSpotlightCard } from "@/components/motion/CursorSpotlightCard";
import { TextScrambleMorph } from "@/components/motion/TextScrambleMorph";

// Lazy-load Drei 3D Navigator Hero
const DreiNavigatorHero = lazy(() => import("@/components/webgl/DreiNavigatorHero"));

interface NavigatorProject {
  id: string;
  repository: string;
  name: string;
  description?: string | null;
  url: string;
  metadata?: any;
}

interface NavigatorTechnology {
  name: string;
  projectCount: number;
}

interface NavigatorArtifact {
  id: string;
  projectId: string;
  projectName: string;
  repository?: string;
  path: string;
  sha: string;
  kind: string;
}

interface NavigatorResult {
  query: string;
  explanation?: string;
  projects: NavigatorProject[];
  technologies: NavigatorTechnology[];
  artifacts?: NavigatorArtifact[];
  groundedEvidenceCount?: number;
}

const SUGGESTED_QUERIES = [
  "Which projects use PostgreSQL?",
  "What technologies power Persona OS?",
  "Three.js and WebGL systems",
  "TypeScript projects in Healthcare",
  "AI and knowledge architecture",
];

export default function Navigator() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [q, setQ] = useState(initialQuery);
  const [result, setResult] = useState<NavigatorResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const executeSearch = async (queryText: string) => {
    if (!queryText.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/world-model/navigator?q=${encodeURIComponent(queryText)}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Navigator service unavailable");
      }
      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Navigator service unavailable");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!q.trim()) return;
    setSearchParams({ q: q.trim() });
    executeSearch(q.trim());
  };

  const handleSelectSuggestion = (queryText: string) => {
    setQ(queryText);
    setSearchParams({ q: queryText });
    executeSearch(queryText);
  };

  useEffect(() => {
    if (initialQuery) {
      setQ(initialQuery);
      executeSearch(initialQuery);
    }
  }, [initialQuery]);

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
              AI NAVIGATOR
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1 h-full">
            <Link to="/" className="inline-flex items-center h-full px-4 text-xs font-medium text-black hover:text-gray-60 transition-colors">
              Home
            </Link>
            <Link to="/projects" className="inline-flex items-center h-full px-4 text-xs font-medium text-black hover:text-gray-60 transition-colors">
              Projects
            </Link>
            <Link to="/evidence" className="inline-flex items-center h-full px-4 text-xs font-medium text-black hover:text-gray-60 transition-colors">
              Evidence
            </Link>
            <Link to="/world" className="inline-flex items-center h-full px-4 text-xs font-medium text-cyan-600 hover:text-cyan-800 transition-colors font-mono">
              • 3D World
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 h-8 px-3 bg-neutral-100 hover:bg-neutral-200 border border-gray-30 text-xs font-mono font-medium text-black transition-colors"
            >
              <span>View Projects</span>
            </Link>
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

      {/* 2. DREI 3D GROUNDED EVIDENCE HERO */}
      <Suspense fallback={<div className="h-52 w-full bg-[#040406] flex items-center justify-center font-mono text-xs text-gray-60">Initializing 3D Evidence Scene...</div>}>
        <DreiNavigatorHero />
      </Suspense>

      {/* 3. HERO TITLES & COMMAND DECK */}
      <section className="container mx-auto px-5 md:px-8 pt-10 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-20 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono tracking-widest text-cyan uppercase bg-cyan/10 border border-cyan/30 rounded-full mb-3">
              <Sparkles className="size-3 text-cyan" />
              Grounded Model Reasoning Layer
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal text-white">
              FEEXSYSTEMS <mark className="inline-block bg-yellow text-black px-2 pb-0.5 font-semibold">AI Navigator.</mark>
            </h1>
            <p className="mt-3 text-sm md:text-base text-gray-40 max-w-2xl leading-relaxed">
              Query the persistent World Model with multi-model intelligence. Responses are strictly grounded in repository observations, commit SHAs, and Evidence Fabric graphs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <FeexWorldBadge sha="sha-feex-grounded-retrieval" status="VERIFIED 100%" />
          </div>
        </div>

        {/* Model Status Strip */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-gray-40 border-b border-gray-20/60 pb-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-white">
              <Cpu className="size-3.5 text-cyan" />
              <span>PRIMARY: GOOGLE GEMINI ENTERPRISE</span>
            </span>
            <span className="text-gray-20 hidden sm:inline">|</span>
            <span className="text-gray-40 hidden sm:inline">FALLBACK: CLAUDE 3.5 & GPT-4O</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>0% UNGROUNDED HALLUCINATIONS</span>
          </div>
        </div>

        {/* Terminal Query Form */}
        <form onSubmit={handleFormSubmit} className="mt-6">
          <div className="relative flex flex-col sm:flex-row items-stretch border border-gray-20 bg-[#090a0f] p-2">
            <div className="relative flex-1 flex items-center">
              <div className="pl-3 pr-2 text-gray-40 font-mono text-xs flex items-center gap-1.5">
                <Terminal className="size-3.5 text-cyan" />
                <span className="hidden sm:inline">feex-query //</span>
              </div>
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Ask e.g. Which projects use PostgreSQL? or What powers Persona OS?"
                className="w-full h-11 bg-transparent text-sm font-mono text-white placeholder:text-gray-60 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-2 sm:mt-0 px-6 h-11 bg-white hover:bg-neutral-200 text-black font-medium text-xs font-mono flex items-center justify-center gap-2 transition-colors shrink-0"
            >
              {loading ? (
                <>
                  <span className="size-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Grounding...</span>
                </>
              ) : (
                <>
                  <span>Search World</span>
                  <ArrowRight className="size-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Suggested Queries Chips */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-gray-60">Suggested Prompts:</span>
            {SUGGESTED_QUERIES.map((sq) => (
              <button
                key={sq}
                type="button"
                onClick={() => handleSelectSuggestion(sq)}
                className="px-2.5 py-1 bg-[#090a0f] border border-gray-20 hover:border-cyan/50 text-gray-40 hover:text-white transition-colors"
              >
                {sq}
              </button>
            ))}
          </div>
        </form>
      </section>

      {/* 4. RESULTS SECTION */}
      <section className="container mx-auto px-5 md:px-8 py-6 pb-24">
        {error && (
          <div className="mb-6 p-4 bg-red-950/30 border border-red-900/60 text-xs font-mono text-red-400">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-8">
            {/* Grounded AI Explanation Panel */}
            {result.explanation && (
              <CursorSpotlightCard
                spotlightColor="rgba(6, 182, 212, 0.16)"
                className="border border-cyan/40 bg-[#090a0f] p-6 lg:p-8 relative shadow-2xl overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan/5 rounded-full blur-3xl pointer-events-none" />
                <div className="flex items-center justify-between border-b border-gray-20/60 pb-4 mb-4">
                  <div className="flex items-center gap-2 text-cyan font-mono text-xs font-semibold tracking-wider uppercase">
                    <BrainCircuit className="size-4 text-cyan" />
                    <span>GROUNDED MODEL EXPLANATION</span>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 border border-cyan/30 text-cyan bg-cyan/10">
                    {result.groundedEvidenceCount || 0} Evidence Anchors
                  </span>
                </div>
                <p className="text-sm sm:text-base text-gray-30 leading-relaxed font-sans">
                  {result.explanation}
                </p>
              </CursorSpotlightCard>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Grounded Projects */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="flex items-center justify-between text-xs font-mono text-gray-40 border-b border-gray-20 pb-2">
                  <span className="uppercase tracking-wider flex items-center gap-2">
                    <GitBranch className="size-3.5 text-yellow" />
                    <span>Grounded Projects ({result.projects.length})</span>
                  </span>
                  <span>CANONICAL WORLD MODEL</span>
                </div>

                <div className="grid grid-cols-1 gap-px bg-gray-20 border border-gray-20">
                  {result.projects.length ? (
                    result.projects.map((p, idx) => (
                      <CursorSpotlightCard
                        key={p.id}
                        spotlightColor="rgba(0, 245, 212, 0.12)"
                        className="p-5 bg-[#090a0f] hover:bg-neutral-900/60 transition-colors flex flex-col justify-between"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="size-1.5 rounded-full bg-cyan" />
                              <h4 className="font-display font-medium text-white text-base">
                                {p.name}
                              </h4>
                            </div>
                            <div className="mt-1 font-mono text-xs text-gray-40 truncate">
                              {p.repository}
                            </div>
                            <p className="mt-2 text-xs text-gray-40 leading-relaxed">
                              {p.description || "Project entity discovered from the FEEXSYSTEMS GitHub ecosystem."}
                            </p>
                          </div>
                          <span className="text-[10px] font-mono text-gray-60 shrink-0">
                            0{idx + 1} //
                          </span>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-20/60 flex items-center justify-between">
                          <Link
                            to={`/world?focus=${encodeURIComponent(p.id)}`}
                            className="inline-flex items-center gap-1 text-xs font-mono text-cyan hover:underline"
                          >
                            <Globe className="size-3" /> Focus in 3D Galaxy
                          </Link>
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-mono text-gray-40 hover:text-white"
                          >
                            <span>Repo</span>
                            <ExternalLink className="size-3" />
                          </a>
                        </div>
                      </CursorSpotlightCard>
                    ))
                  ) : (
                    <div className="p-8 bg-[#090a0f] text-center font-mono text-xs text-gray-60">
                      No direct project entities discovered for this query.
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Technologies & Evidence Artifacts */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* Connected Technologies Matrix */}
                <div className="border border-gray-20 bg-[#090a0f] p-5">
                  <div className="flex items-center justify-between text-xs font-mono text-gray-40 border-b border-gray-20 pb-3 mb-3">
                    <span className="uppercase tracking-wider flex items-center gap-2">
                      <Network className="size-3.5 text-cyan" />
                      <span>Connected Technologies</span>
                    </span>
                    <span>{result.technologies.length}</span>
                  </div>

                  {result.technologies.length ? (
                    <div className="flex flex-wrap gap-1.5">
                      {result.technologies.map((t) => (
                        <button
                          key={t.name}
                          type="button"
                          onClick={() => handleSelectSuggestion(t.name)}
                          className="px-2.5 py-1 text-xs font-mono bg-[#040406] border border-gray-20 hover:border-cyan text-gray-30 hover:text-white transition-colors flex items-center gap-1.5"
                        >
                          <span>{t.name}</span>
                          <span className="text-[10px] text-gray-60">({t.projectCount})</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs font-mono text-gray-60">No connected technologies found.</p>
                  )}
                </div>

                {/* Grounded Artifacts Ledger */}
                {result.artifacts && result.artifacts.length > 0 && (
                  <div className="border border-gray-20 bg-[#090a0f] p-5">
                    <div className="flex items-center justify-between text-xs font-mono text-gray-40 border-b border-gray-20 pb-3 mb-3">
                      <span className="uppercase tracking-wider flex items-center gap-2">
                        <FileCode className="size-3.5 text-yellow" />
                        <span>Evidence Fabric Artifacts</span>
                      </span>
                      <span>{result.artifacts.length}</span>
                    </div>

                    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                      {result.artifacts.map((art) => (
                        <div
                          key={art.id}
                          className="p-3 bg-[#040406] border border-gray-20/80 font-mono text-xs flex flex-col gap-1"
                        >
                          <div className="flex items-center justify-between text-gray-40">
                            <span className="text-[10px] uppercase text-cyan">{art.kind}</span>
                            <TextScrambleMorph
                              text={art.sha.slice(0, 8)}
                              className="text-[10px] text-gray-40 font-mono"
                              duration={0.8}
                            />
                          </div>
                          <div className="text-white truncate font-medium">
                            {art.path}
                          </div>
                          <div className="text-[11px] text-gray-60 truncate">
                            {art.projectName}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

            </div>
          </div>
        )}
      </section>

      {/* 5. GLOBAL FOOTER STRIP */}
      <footer className="border-t border-gray-20 py-8 bg-[#040406] text-xs font-mono text-gray-60">
        <div className="container mx-auto px-5 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white uppercase tracking-wider">FEEXSYSTEMS</span>
            <span>Living Engineering Intelligence</span>
          </div>
          <div>
            <span>Authoritative World Model · Provider-Neutral AI Service</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
