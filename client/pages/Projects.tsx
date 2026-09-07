import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Boxes, ExternalLink, GitBranch, Search, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { feexProjects, githubRepositoryUrl } from "@/lib/feex-ecosystem";

const statusLabel: Record<string, string> = {
  active: "Active",
  research: "Research",
  prototype: "Prototype",
  archived: "Archived",
};

export default function Projects() {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("All");

  const domains = useMemo(
    () => ["All", ...Array.from(new Set(feexProjects.map((project) => project.domain)))],
    [],
  );

  const projects = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return feexProjects.filter((project) => {
      const matchesDomain = domain === "All" || project.domain === domain;
      const matchesQuery = !normalized || [
        project.name,
        project.repository,
        project.description,
        project.domain,
        ...project.technologies,
      ].some((value) => value.toLowerCase().includes(normalized));
      return matchesDomain && matchesQuery;
    });
  }, [domain, query]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/.16),transparent_35%),radial-gradient(circle_at_bottom_left,hsl(160_80%_45%/.10),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="mb-8 flex items-center gap-3 text-sm text-muted-foreground">
            <Link to="/" className="transition-colors hover:text-foreground">FEEXSYSTEMS</Link>
            <span>/</span>
            <span>Projects</span>
          </div>

          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Living Engineering Intelligence
            </div>
            <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
              Explore the systems behind <span className="text-primary">FEEXSYSTEMS</span>.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground md:text-xl">
              Projects are presented as engineering worlds: repositories, technologies, artifacts and relationships that will progressively synchronize with their GitHub evidence.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <Card className="border-border/70 bg-card/70 backdrop-blur">
              <CardContent className="p-5">
                <Boxes className="mb-3 h-5 w-5 text-primary" />
                <div className="text-3xl font-bold">{feexProjects.length}</div>
                <div className="text-sm text-muted-foreground">Showcase worlds</div>
              </CardContent>
            </Card>
            <Card className="border-border/70 bg-card/70 backdrop-blur">
              <CardContent className="p-5">
                <GitBranch className="mb-3 h-5 w-5 text-primary" />
                <div className="text-3xl font-bold">GitHub</div>
                <div className="text-sm text-muted-foreground">Evidence substrate</div>
              </CardContent>
            </Card>
            <Card className="border-border/70 bg-card/70 backdrop-blur">
              <CardContent className="p-5">
                <ShieldCheck className="mb-3 h-5 w-5 text-primary" />
                <div className="text-3xl font-bold">Evidence-first</div>
                <div className="text-sm text-muted-foreground">Canonical design principle</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Engineering ecosystem</h2>
            <p className="mt-1 text-sm text-muted-foreground">A first vertical slice of the FEEXSYSTEMS project registry.</p>
          </div>
          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects, technologies..." className="pl-9" />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {domains.map((item) => (
            <Button key={item} variant={domain === item ? "default" : "outline"} size="sm" onClick={() => setDomain(item)}>
              {item}
            </Button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="group flex h-full flex-col border-border/80 bg-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-xl border border-primary/20 bg-primary/10 p-3 text-primary">
                    <Boxes className="h-5 w-5" />
                  </div>
                  <Badge variant="outline">{statusLabel[project.status]}</Badge>
                </div>
                <CardTitle className="mt-4 text-xl">{project.name}</CardTitle>
                <CardDescription className="leading-6">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto space-y-5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{project.domain}</span>
                  <span className="font-mono">{project.repository}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((technology) => <Badge key={technology} variant="secondary">{technology}</Badge>)}
                </div>
                <Button asChild className="w-full group-hover:bg-primary">
                  <a href={githubRepositoryUrl(project.repository)} target="_blank" rel="noreferrer">
                    Inspect repository
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No projects match this query.
          </div>
        )}

        <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-semibold">Next layer: live repository intelligence</h3>
              <p className="mt-1 text-sm text-muted-foreground">The registry is intentionally evidence-safe today. The next ingestion layer will replace static metadata with synchronized GitHub observations, commits, artifacts and technology evidence.</p>
            </div>
            <Button asChild variant="outline">
              <a href="https://github.com/FeexSystems/FeexSystems-20Labs" target="_blank" rel="noreferrer">
                View app source <ArrowUpRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
