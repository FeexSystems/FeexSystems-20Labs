import { FormEvent, useEffect, useState } from "react";
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FeexHorizontalLockup, FeexWorldBadge } from "@/components/FeexLogo";

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
    <main className="min-h-screen bg-background text-foreground">
      {/* Header & Hero Search */}
      <section className="border-b border-border bg-gradient-to-b from-card/40 to-background">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Link to="/">
                <FeexHorizontalLockup markSize={28} showSubtitle={false} />
              </Link>
              <span className="text-[#64748B] font-mono">/</span>
              <span className="font-mono text-sm text-[#00F5D4] uppercase tracking-wider">
                Navigator
              </span>
              <FeexWorldBadge sha="sha-feex-navigator" status="GROUNDED 100%" className="hidden sm:inline-flex" />
            </div>
            <Button asChild size="sm" className="bg-[#00F5D4] font-semibold text-black hover:bg-[#00F5D4]/80 shadow-feex-neon">
              <Link to="/world">
                <Globe className="h-4 w-4 mr-1.5" /> 3D World Model
              </Link>
            </Button>
          </div>

          <div className="mt-8 max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00F5D4]/20 bg-[#00F5D4]/10 px-4 py-1.5 text-xs font-mono text-[#00F5D4]">
              <Sparkles className="h-4 w-4" />
              World Model AI Navigator · Grounded Retrieval
            </div>
            <h1 className="mt-6 text-5xl font-black tracking-tight md:text-7xl">
              Ask the engineering world.
            </h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Search the persistent World Model. Results are grounded in repository observations, artifacts,
              technologies, and evidence provenance — not ungrounded LLM hallucinations.
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="mt-10 flex max-w-3xl gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="e.g. Which projects use PostgreSQL?"
                className="h-14 pl-12 text-base shadow-lg"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="h-14 px-7 bg-emerald-500 font-semibold text-black hover:bg-emerald-400"
            >
              {loading ? "Searching..." : "Explore"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          {/* Suggestion Chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Suggested:</span>
            {SUGGESTED_QUERIES.map((sq) => (
              <button
                key={sq}
                type="button"
                onClick={() => handleSelectSuggestion(sq)}
                className="rounded-lg border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground transition hover:border-primary/40 hover:text-foreground hover:bg-card"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results Area */}
      <section className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
        {error && (
          <div className="mb-8 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-8">
            {/* Grounded AI Explanation Banner */}
            {result.explanation && (
              <Card className="border-emerald-500/30 bg-emerald-950/10 shadow-xl backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
                      <BrainCircuit className="h-4 w-4" />
                      Grounded AI Explanation
                    </div>
                    <Badge variant="outline" className="border-emerald-500/30 text-xs text-emerald-400">
                      {result.groundedEvidenceCount || 0} Evidence Anchors
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-white/90 leading-relaxed">
                    {result.explanation}
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Grounded Projects */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg">
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-5 w-5 text-primary" />
                      Grounded Projects ({result.projects.length})
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {result.projects.length ? (
                    result.projects.map((p) => (
                      <div
                        key={p.id}
                        className="rounded-xl border border-border p-4 transition hover:border-primary/40 hover:bg-card/40"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-foreground">{p.name}</h4>
                            <div className="font-mono text-xs text-muted-foreground mt-0.5">
                              {p.repository}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10">
                              <Link to={`/evidence/${encodeURIComponent(p.id)}`} title="Inspect evidence in Explorer">
                                <FileCode className="h-3.5 w-3.5" />
                              </Link>
                            </Button>
                            <a
                              href={p.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-muted-foreground hover:text-primary transition p-1"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                          {p.description || "Project entity discovered from the FeexSystems GitHub ecosystem."}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No direct project matches found for this query.</p>
                  )}
                </CardContent>
              </Card>

              {/* Technology Relationships & Evidence */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Network className="h-5 w-5 text-primary" />
                      Connected Technologies ({result.technologies.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.technologies.length ? (
                      <div className="flex flex-wrap gap-2">
                        {result.technologies.map((t) => (
                          <Badge
                            key={t.name}
                            variant="secondary"
                            className="px-3 py-1 text-xs cursor-pointer hover:bg-primary/20"
                            onClick={() => handleSelectSuggestion(t.name)}
                          >
                            {t.name} · {t.projectCount} project{t.projectCount !== 1 ? "s" : ""}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No technology relationships matched.</p>
                    )}
                  </CardContent>
                </Card>

                {/* Artifacts & Evidence Provenance */}
                {result.artifacts && result.artifacts.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                        <ShieldCheck className="h-4 w-4 text-emerald-400" />
                        Matched Artifacts & Provenance
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {result.artifacts.map((art) => (
                        <Link
                          key={art.id}
                          to={`/evidence/${encodeURIComponent(art.projectId)}?path=${encodeURIComponent(art.path)}`}
                          className="flex items-center justify-between rounded-lg border border-border/60 bg-card/30 p-2.5 text-xs transition hover:border-emerald-500/40 hover:bg-emerald-500/5 group"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <FileCode className="h-3.5 w-3.5 text-muted-foreground group-hover:text-emerald-400 shrink-0" />
                            <span className="font-mono text-foreground group-hover:text-emerald-300 truncate">{art.path}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Badge variant="outline" className="text-[10px]">
                              {art.kind}
                            </Badge>
                            <span className="text-[10px] text-emerald-400 opacity-0 group-hover:opacity-100 transition">Inspect &rarr;</span>
                          </div>
                        </Link>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* 3D and Evidence Links Action */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <div>
                <h4 className="font-semibold text-emerald-300">Explore Evidence & Topology</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Verify cryptographic SHAs in the Evidence Explorer or inspect spatial graphs in 3D.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button asChild variant="outline" size="sm" className="border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10">
                  <Link to="/evidence">
                    <FileCode className="h-4 w-4 mr-1.5" />
                    Evidence Explorer
                  </Link>
                </Button>
                <Button asChild size="sm" className="bg-emerald-500 font-semibold text-black hover:bg-emerald-400">
                  <Link to="/world">
                    <Globe className="h-4 w-4 mr-1.5" />
                    3D Galaxy
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!result && !loading && (
          <div className="grid gap-5 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <BrainCircuit className="h-6 w-6 text-primary" />
                <h3 className="mt-4 font-semibold">Authoritative World Model</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  The persistent World Model is the canonical source of truth; LLMs interpret grounded facts.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <h3 className="mt-4 font-semibold">Evidence-Backed Provenance</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Every entity relationship is anchored in GitHub trees, manifest files, and commit SHAs.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Globe className="h-6 w-6 text-primary" />
                <h3 className="mt-4 font-semibold">3D Spatial Topology</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Navigate the engineering galaxy to visualize dependencies, architecture, and technology hubs.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </section>
    </main>
  );
}
