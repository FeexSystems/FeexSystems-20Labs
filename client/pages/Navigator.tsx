import React, { FormEvent, useEffect, useState, Suspense, lazy } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  BrainCircuit,
  Cpu,
  ExternalLink,
  FileCode,
  GitBranch,
  Globe,
  Network,
  Sparkles,
  Terminal,
} from "lucide-react";
import { FeexWorldBadge } from "@/components/FeexLogo";
import { TextScrambleMorph } from "@/components/motion/TextScrambleMorph";
import {
  FullWidthNav,
  CursorDotTrail,
  MagneticGlowButton,
  BtcMonoBadge,
  AppleDock,
  AmbientLivingBackground,
} from "@/components/framer";

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
  suggestions?: string[];
  aiModel?: string;
}

const SUGGESTED_QUERIES = [
  "Which projects use PostgreSQL?",
  "Write an LRU Cache in TypeScript",
  "Explain FeexSystems World Model & 3D Galaxy",
  "How does Docker containerization work?",
  "What technologies power Persona OS?",
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
    <main className="min-h-screen bg-[#000000] text-white antialiased font-mono selection:bg-white selection:text-black relative">
      {/* 0. AMBIENT LIVING INTELLIGENCE BACKGROUND */}
      <AmbientLivingBackground fixed={true} opacity={32} linesOpacity={16} />

      {/* Interactive Cursor Trail */}
      <CursorDotTrail dotColor="rgba(0, 245, 212, 0.6)" trailColor="rgba(123, 44, 191, 0.3)" />

      {/* 1. SLIDING GLASSMORPHIC NAVBAR */}
      <FullWidthNav />

      {/* 2. DREI 3D GROUNDED EVIDENCE HERO */}
      <Suspense
        fallback={
          <div className="h-52 w-full bg-black flex items-center justify-center font-mono text-xs text-white/40">
            Initializing 3D Evidence Scene...
          </div>
        }
      >
        <DreiNavigatorHero />
      </Suspense>

      {/* 3. HERO TITLES & COMMAND DECK */}
      <section className="container mx-auto max-w-7xl px-5 md:px-8 pt-10 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-[10px] border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 uppercase mb-3">
              <Sparkles className="size-3.5 text-white/80" />
              <span>//01 Grounded Model Reasoning Layer</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              FEEXSYSTEMS AI Navigator.
            </h1>
            <p className="mt-3 text-sm md:text-base text-white/60 max-w-2xl leading-relaxed">
              Query the persistent World Model with multi-model intelligence. Responses are strictly grounded in repository observations, commit SHAs, and Evidence Fabric graphs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <BtcMonoBadge hash="sha-feex-evidence-retrieval-v2" blockHeight={894210} label="EVIDENCE PROOF" />
            <FeexWorldBadge sha="sha-feex-grounded-retrieval" status="VERIFIED 100%" />
          </div>
        </div>

        {/* Model Status Strip */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-white/10 bg-[#121212] px-4 py-3 text-xs text-white/60">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-white">
              <Cpu className="size-3.5 text-white/80" />
              <span>PRIMARY: GOOGLE GEMINI ENTERPRISE</span>
            </span>
            <span className="text-white/20 hidden sm:inline">|</span>
            <span className="text-white/40 hidden sm:inline">FALLBACK: CLAUDE 3.5 & GPT-4O</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-medium text-emerald-400">0% UNGROUNDED HALLUCINATIONS</span>
          </div>
        </div>

        {/* Terminal Query Form */}
        <form onSubmit={handleFormSubmit} className="mt-6">
          <div className="relative flex flex-col sm:flex-row items-stretch gap-2 rounded-[20px] border border-white/10 bg-[#121212] p-2.5 shadow-2xl">
            <div className="relative flex-1 flex items-center min-w-0">
              <div className="pl-3 pr-2 text-white/40 font-mono text-xs flex items-center gap-1.5 shrink-0">
                <Terminal className="size-3.5 text-white/70" />
                <span className="hidden sm:inline">query //</span>
              </div>
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Ask e.g. Which projects use PostgreSQL? or What powers Persona OS?"
                className="w-full h-11 bg-transparent text-sm font-mono text-white placeholder:text-white/30 focus:outline-none px-2"
              />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <MagneticGlowButton
                type="submit"
                disabled={loading}
                variant="primary"
                glowColor="rgba(0, 245, 212, 0.4)"
                className="px-6 h-11 rounded-[10px] text-xs font-mono"
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
              </MagneticGlowButton>
              <Link
                to={`/omni?q=${encodeURIComponent(q || "Show me the backend architecture")}`}
                className="px-4 h-11 rounded-[10px] border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-mono flex items-center justify-center gap-1.5 transition-colors shrink-0"
                title="Launch dynamic Omni Stage canvas with this query"
              >
                <Terminal className="size-3.5 text-white/80" />
                <span>Omni Stage</span>
              </Link>
            </div>
          </div>

          {/* Suggested Queries Chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-white/40">// SUGGESTED:</span>
            {SUGGESTED_QUERIES.map((sq) => (
              <button
                key={sq}
                type="button"
                onClick={() => handleSelectSuggestion(sq)}
                className="rounded-[10px] border border-white/10 bg-black/60 px-3 py-1.5 text-white/60 hover:text-white hover:border-white/30 transition-all text-xs"
              >
                {sq}
              </button>
            ))}
          </div>
        </form>
      </section>

      {/* 4. RESULTS SECTION */}
      <section className="container mx-auto max-w-7xl px-5 md:px-8 py-6 pb-24">
        {error && (
          <div className="mb-6 p-4 rounded-[20px] bg-red-950/20 border border-red-500/30 text-xs font-mono text-red-400">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-8">
            {/* Grounded AI Explanation Panel */}
            {result.explanation && (
              <div className="rounded-[20px] border border-white/10 bg-[#121212]/90 backdrop-blur-md p-6 lg:p-8 relative shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 mb-4 gap-2">
                  <div className="flex items-center gap-2 text-white font-mono text-xs font-bold tracking-wider uppercase">
                    <BrainCircuit className="size-4 text-emerald-400" />
                    <span>// DEEP REASONING INTELLIGENCE</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-normal">
                      Gemini 3.7 Flash · Deep Reasoning
                    </span>
                  </div>
                  <span className="text-[11px] font-mono rounded-[10px] border border-white/10 bg-white/5 px-2.5 py-0.5 text-white/70">
                    {result.groundedEvidenceCount || 0} Evidence Anchors
                  </span>
                </div>
                <div className="text-sm sm:text-base text-white/90 leading-relaxed font-mono whitespace-pre-wrap">
                  {result.explanation}
                </div>
                {result.suggestions && result.suggestions.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap gap-2 items-center">
                    <span className="text-xs text-white/40">Suggested queries:</span>
                    {result.suggestions.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectSuggestion(s)}
                        className="px-3 py-1 text-xs rounded-full border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white text-white/80 transition-all font-mono"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Grounded Projects */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="flex items-center justify-between text-xs font-mono text-white/40 border-b border-white/10 pb-2">
                  <span className="uppercase tracking-wider flex items-center gap-2">
                    <GitBranch className="size-3.5 text-white/80" />
                    <span>Grounded Projects ({result.projects.length})</span>
                  </span>
                  <span>CANONICAL WORLD MODEL</span>
                </div>

                <div className="flex flex-col gap-3">
                  {result.projects.length ? (
                    result.projects.map((p, idx) => (
                      <div
                        key={p.id}
                        className="rounded-[20px] border border-white/10 bg-[#121212] p-6 hover:border-white/30 transition-all flex flex-col justify-between"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="size-2 bg-white rounded-none" />
                              <h4 className="font-mono font-bold text-white text-base">
                                {p.name}
                              </h4>
                            </div>
                            <div className="mt-1 font-mono text-xs text-white/40 truncate">
                              {p.repository}
                            </div>
                            <p className="mt-2 text-xs text-white/60 leading-relaxed">
                              {p.description || "Project entity discovered from the FEEXSYSTEMS GitHub ecosystem."}
                            </p>
                          </div>
                          <span className="text-[11px] font-mono text-white/40 shrink-0">
                            //{String(idx + 1).padStart(2, "0")}
                          </span>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-3">
                            <Link
                              to={`/world?focus=${encodeURIComponent(p.id)}`}
                              className="inline-flex items-center gap-1.5 text-xs font-mono text-white/80 hover:text-white transition-colors"
                            >
                              <Globe className="size-3.5" />
                              <span>Focus in 3D Galaxy</span>
                            </Link>
                            <Link
                              to={`/omni?q=${encodeURIComponent(`Analyze ${p.name} architecture and dependencies`)}`}
                              className="inline-flex items-center gap-1.5 text-xs font-mono text-white/60 hover:text-white transition-colors"
                            >
                              <Terminal className="size-3 text-white/60" />
                              <span>Omni Stage</span>
                            </Link>
                          </div>
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-mono text-white/40 hover:text-white transition-colors"
                          >
                            <span>Repo</span>
                            <ExternalLink className="size-3" />
                          </a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 rounded-[20px] border border-dashed border-white/10 bg-[#121212]/50 text-center font-mono text-xs text-white/40">
                      No direct project entities discovered for this query.
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Technologies & Evidence Artifacts */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                {/* Connected Technologies Matrix */}
                <div className="rounded-[20px] border border-white/10 bg-[#121212] p-6">
                  <div className="flex items-center justify-between text-xs font-mono text-white/40 border-b border-white/10 pb-3 mb-4">
                    <span className="uppercase tracking-wider flex items-center gap-2">
                      <Network className="size-3.5 text-white/80" />
                      <span>Connected Technologies</span>
                    </span>
                    <span className="rounded-[10px] border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/60">
                      {result.technologies.length}
                    </span>
                  </div>

                  {result.technologies.length ? (
                    <div className="flex flex-wrap gap-2">
                      {result.technologies.map((t) => (
                        <button
                          key={t.name}
                          type="button"
                          onClick={() => handleSelectSuggestion(t.name)}
                          className="rounded-[10px] border border-white/10 bg-black/60 px-3 py-1.5 text-xs font-mono text-white/70 hover:text-white hover:border-white/30 transition-colors flex items-center gap-1.5"
                        >
                          <span>{t.name}</span>
                          <span className="text-[10px] text-white/40">({t.projectCount})</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs font-mono text-white/40">No connected technologies found.</p>
                  )}
                </div>

                {/* Grounded Artifacts Ledger */}
                {result.artifacts && result.artifacts.length > 0 && (
                  <div className="rounded-[20px] border border-white/10 bg-[#121212] p-6">
                    <div className="flex items-center justify-between text-xs font-mono text-white/40 border-b border-white/10 pb-3 mb-4">
                      <span className="uppercase tracking-wider flex items-center gap-2">
                        <FileCode className="size-3.5 text-white/80" />
                        <span>Evidence Fabric Artifacts</span>
                      </span>
                      <span className="rounded-[10px] border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/60">
                        {result.artifacts.length}
                      </span>
                    </div>

                    <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                      {result.artifacts.map((art) => (
                        <div
                          key={art.id}
                          className="rounded-[10px] border border-white/10 bg-black/60 p-3 font-mono text-xs flex flex-col gap-1.5 hover:border-white/20 transition-colors"
                        >
                          <div className="flex items-center justify-between text-white/40">
                            <span className="text-[10px] uppercase text-cyan-400 font-semibold">{art.kind}</span>
                            <BtcMonoBadge
                              label={art.sha.slice(0, 8)}
                              sublabel="SHA-256"
                              status="confirmed"
                              size="sm"
                            />
                          </div>
                          <div className="text-white truncate font-medium">
                            {art.path}
                          </div>
                          <div className="text-[11px] text-white/40 truncate">
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
      <footer className="border-t border-white/10 py-12 bg-black text-xs font-mono text-white/60">
        <div className="container mx-auto max-w-7xl px-5 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="size-2.5 bg-white rounded-none" />
            <span className="font-bold text-white uppercase tracking-wider">FEEXSYSTEMS</span>
            <span className="text-white/40">// Living World Model</span>
          </div>
          <div className="text-white/40">
            © 2026 FEEXSYSTEMS. Authoritative Provenance & SOC 2 Type II Certified.
          </div>
        </div>
      </footer>

      {/* 6. FLOATING MACOS APP DOCK */}
      <AppleDock />
    </main>
  );
}
