import { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  Boxes,
  CheckCircle2,
  Database,
  GitBranch,
  Github,
  Globe,
  Network,
  Radar,
  Search,
  ShieldCheck,
  Sparkles,
  Waypoints,
  Workflow,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { feexProjects, githubRepositoryUrl } from "@/lib/feex-ecosystem";

const NeuralNetwork = lazy(() =>
  import("@/components/webgl/NeuralNetwork").then((mod) => ({ default: mod.NeuralNetwork }))
);

const pipeline = [
  { label: "GitHub Organization", icon: Github, detail: "Repository discovery" },
  { label: "Repository Discovery", icon: Search, detail: "Projects become entities" },
  { label: "Persistent World Model", icon: Database, detail: "Canonical state" },
  { label: "Evidence Fabric", icon: ShieldCheck, detail: "Traceable implementation evidence" },
  { label: "Incremental Ingestion", icon: Activity, detail: "Change-aware synchronization" },
  { label: "Project Explorer", icon: Boxes, detail: "Progressive disclosure" },
  { label: "3D Spatial Graph", icon: Globe, detail: "Interactive spatial knowledge galaxy" },
  { label: "Navigator", icon: BrainCircuit, detail: "Reason over grounded context" },
];

const capabilities = [
  {
    icon: Network,
    title: "World Model",
    text: "Represent projects, repositories, artifacts, technologies, capabilities and relationships as canonical engineering reality.",
  },
  {
    icon: ShieldCheck,
    title: "Evidence Fabric",
    text: "Connect claims to repositories, files, commits, observations and temporal evidence instead of relying on generated descriptions.",
  },
  {
    icon: Globe,
    title: "3D Spatial Galaxy",
    text: "Explore interconnected projects and technologies as a full-screen interactive 3D universe with physics and orbital topology.",
  },
  {
    icon: Workflow,
    title: "Incremental Intelligence",
    text: "Detect repository changes, identify impacted entities and propagate updates through the engineering graph.",
  },
  {
    icon: BrainCircuit,
    title: "AI Navigator",
    text: "Ask questions about the ecosystem and retrieve grounded graph, semantic and evidence context before reasoning.",
  },
  {
    icon: Radar,
    title: "Living State",
    text: "Continuously move from a static portfolio snapshot toward a synchronized digital representation of the engineering ecosystem.",
  },
];

export default function Index() {
  const featuredProjects = feexProjects.filter((project) => project.featured);

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Hero Section with Live WebGL Background */}
      <section id="home" className="relative isolate overflow-hidden border-b border-border">
        {/* WebGL Neural Background */}
        <Suspense fallback={null}>
          <NeuralNetwork className="pointer-events-none opacity-40" nodeCount={60} />
        </Suspense>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,hsl(var(--primary)/.18),transparent_32%),radial-gradient(circle_at_85%_20%,hsl(190_90%_55%/.12),transparent_30%)] pointer-events-none" />
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(hsl(var(--border)/.28)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/.28)_1px,transparent_1px)] [background-size:48px_48px] pointer-events-none" />

        {/* Navigation Bar */}
        <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-black text-primary-foreground shadow-lg shadow-primary/20">
              F
            </div>
            <div>
              <div className="font-bold tracking-tight">FEEXSYSTEMS</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Living Engineering Intelligence
              </div>
            </div>
          </Link>
          <div className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <Link to="/world" className="flex items-center gap-1.5 text-emerald-400 font-semibold hover:text-emerald-300">
              <Sparkles className="h-3.5 w-3.5" />
              3D World
            </Link>
            <a href="#platform" className="hover:text-foreground">Platform</a>
            <Link to="/projects" className="hover:text-foreground">Projects</Link>
            <Link to="/navigator" className="hover:text-foreground">Navigator</Link>
            <a href="#architecture" className="hover:text-foreground">Architecture</a>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild size="sm" className="bg-emerald-500 font-semibold text-black hover:bg-emerald-400">
              <Link to="/world">
                <Globe className="h-4 w-4 mr-1.5" />
                Launch 3D World
              </Link>
            </Button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto grid max-w-7xl gap-14 px-6 pb-20 pt-16 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pb-28 lg:pt-20">
          <div className="flex flex-col justify-center">
            <Badge
              variant="outline"
              className="mb-7 w-fit gap-2 border-primary/30 bg-primary/10 px-3 py-1.5 text-primary backdrop-blur-md"
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              FEEXSYSTEMS.CODES · SYSTEM MVP
            </Badge>
            <h1 className="max-w-4xl text-5xl font-black tracking-[-0.04em] md:text-7xl lg:text-8xl">
              Your engineering ecosystem,
              <span className="block bg-gradient-to-r from-primary via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                made explorable.
              </span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
              FEEXSYSTEMS turns GitHub repositories and implementation evidence into a living World Model —
              then gives humans and AI a powerful way to explore how the systems connect, evolve and work in 3D.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 px-7 bg-emerald-500 font-semibold text-black hover:bg-emerald-400">
                <Link to="/world">
                  <Globe className="h-4 w-4 mr-2" />
                  Enter 3D World Model
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-7">
                <Link to="/projects">
                  Explore Projects <ArrowRight className="h-4 w-4 ml-1.5" />
                </Link>
              </Button>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" /> Evidence-first
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" /> Provider-neutral
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" /> 3D Spatial Knowledge Graph
              </span>
            </div>
          </div>

          {/* Right Hologram / Interactive Card */}
          <div className="relative flex min-h-[480px] items-center justify-center">
            <div className="absolute h-72 w-72 rounded-full border border-primary/20 shadow-[0_0_100px_hsl(var(--primary)/.15)]" />
            <div className="absolute h-96 w-96 rounded-full border border-border/50" />
            <div className="absolute h-[30rem] w-[30rem] rounded-full border border-dashed border-border/40" />

            <div className="relative w-full max-w-xl rounded-3xl border border-border/80 bg-card/75 p-5 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">World Model</div>
                  <div className="mt-1 font-semibold">FEEXSYSTEMS Ecosystem</div>
                </div>
                <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs text-emerald-400 border-emerald-500/30">
                  <Link to="/world">
                    <Globe className="h-3.5 w-3.5" /> 3D View
                  </Link>
                </Button>
              </div>
              <div className="relative mt-6 grid grid-cols-3 gap-3">
                {[
                  ["PERSONA OS", "Intelligence"],
                  ["YURRHEELER", "Healthcare"],
                  ["KAPPAXCHANGE", "Finance"],
                  ["3WM SONIK", "World Models"],
                  ["HOLOKAI", "Research"],
                  ["FEEX APP", "Platform"],
                ].map(([name, domain], index) => (
                  <Link
                    key={name}
                    to="/world"
                    className={`rounded-2xl border p-4 transition hover:-translate-y-1 hover:border-primary/50 block ${
                      index === 0 ? "border-primary/40 bg-primary/10" : "border-border bg-background/50"
                    }`}
                  >
                    <div className="mb-4 h-2 w-2 rounded-full bg-primary" />
                    <div className="text-sm font-semibold">{name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{domain}</div>
                  </Link>
                ))}
              </div>
              <div className="mt-4 rounded-2xl border border-border bg-background/60 p-4 font-mono text-xs text-muted-foreground">
                <div><span className="text-primary">→</span> repository discovered</div>
                <div className="mt-1.5"><span className="text-primary">→</span> evidence indexed</div>
                <div className="mt-1.5"><span className="text-primary">→</span> relationships resolved in 3D graph</div>
                <div className="mt-1.5"><span className="text-primary">→</span> navigator context ready</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="border-b border-border bg-card/30">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border px-6 lg:grid-cols-4 lg:px-8">
          {[
            [String(feexProjects.length), "Showcase projects"],
            [String(new Set(feexProjects.map((p) => p.domain)).size), "Engineering domains"],
            ["8", "Intelligence layers"],
            ["GitHub", "Evidence substrate"],
          ].map(([value, label]) => (
            <div key={label} className="px-5 py-8 first:pl-0 lg:px-8">
              <div className="text-2xl font-bold tracking-tight md:text-3xl">{value}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Capabilities / Platform Grid */}
      <section id="platform" className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="max-w-3xl">
          <Badge variant="outline">The platform</Badge>
          <h2 className="mt-5 text-4xl font-bold tracking-tight md:text-6xl">Not another project gallery.</h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            FEEXSYSTEMS is being built as an intelligence substrate for understanding an engineering ecosystem —
            from high-level worlds down to the evidence inside source repositories.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.title}
                className="group border-border/80 bg-card/60 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
              >
                <CardHeader>
                  <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <CardDescription className="pt-2 leading-6">{item.text}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Featured Projects Section */}
      <section id="projects" className="border-y border-border bg-card/25">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <Badge variant="outline" className="gap-2">
                <GitBranch className="h-3.5 w-3.5" /> GitHub project worlds
              </Badge>
              <h2 className="mt-5 text-4xl font-bold tracking-tight md:text-6xl">The work becomes the interface.</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                The first showcase layer surfaces projects from the FeexSystems engineering ecosystem. Each project
                progressively gains repository, artifact, technology and evidence depth as synchronization comes online.
              </p>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="outline">
                <Link to="/world">
                  <Globe className="h-4 w-4 mr-2" />
                  3D Knowledge Graph
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/projects">View all projects <ArrowRight /></Link>
              </Button>
            </div>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <Card
                key={project.id}
                className="group overflow-hidden border-border/80 bg-background/80 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl"
              >
                <div className="h-1 bg-gradient-to-r from-primary via-emerald-400 to-cyan-400" />
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="rounded-xl border border-primary/20 bg-primary/10 p-3 text-primary">
                      <Boxes className="h-5 w-5" />
                    </div>
                    <Badge variant="outline">{project.domain}</Badge>
                  </div>
                  <CardTitle className="mt-4 text-2xl">{project.name}</CardTitle>
                  <CardDescription className="leading-6">{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-5 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary">{tech}</Badge>
                    ))}
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <a href={githubRepositoryUrl(project.repository)} target="_blank" rel="noreferrer">
                      Inspect GitHub repository <ArrowRight />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section id="architecture" className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr] lg:items-center">
          <div>
            <Badge variant="outline">Architecture</Badge>
            <h2 className="mt-5 text-4xl font-bold tracking-tight md:text-6xl">
              From repository reality to intelligence.
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              The platform is organized around one continuous evidence-to-intelligence pipeline. The UI is the
              projection; the World Model is the authority.
            </p>
            <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <div className="font-semibold">Canonical data + model reasoning</div>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    The LLM interprets grounded World Model context. Generated reasoning does not silently become
                    canonical project truth.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {pipeline.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.label}
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-card/60 p-4 transition hover:border-primary/40 hover:bg-card"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold">{step.label}</div>
                    <div className="text-sm text-muted-foreground">{step.detail}</div>
                  </div>
                  <div className="hidden text-xs font-mono text-muted-foreground sm:block">
                    0{index + 1}
                  </div>
                  <ArrowRight className="hidden h-4 w-4 text-muted-foreground group-hover:text-primary sm:block" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Navigator CTA Section */}
      <section id="navigator" className="border-y border-border bg-card/25">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge variant="outline" className="gap-2">
                <BrainCircuit className="h-3.5 w-3.5" /> AI Navigator
              </Badge>
              <h2 className="mt-5 text-4xl font-bold tracking-tight md:text-6xl">Ask the ecosystem questions.</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                Navigator combines semantic retrieval, graph traversal and evidence resolution before asking a model to
                explain what the World Model knows.
              </p>
              <div className="mt-8 space-y-3 text-sm text-muted-foreground">
                {[
                  "Which projects use PostgreSQL?",
                  "How is Persona OS connected to FEEXSYSTEMS?",
                  "What changed in the healthcare world recently?",
                  "Show me the evidence behind this technology relationship.",
                ].map((question) => (
                  <Link
                    key={question}
                    to={`/navigator?q=${encodeURIComponent(question)}`}
                    className="flex items-center gap-3 rounded-xl border border-border bg-background/70 p-4 transition hover:border-emerald-500/50 hover:bg-background/90 block"
                  >
                    <Search className="h-4 w-4 text-primary" />
                    {question}
                  </Link>
                ))}
              </div>
            </div>
            <Card className="overflow-hidden border-primary/20 bg-background shadow-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Grounded Engineering Context</div>
                  <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-500/30">
                    Live Retrieval
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Navigator retrieves canonical World Model context, resolved relationships, and repository commit SHAs
                  before model reasoning.
                </p>
                <div className="flex gap-2.5 pt-2">
                  <Button asChild size="sm" className="bg-emerald-500 font-semibold text-black hover:bg-emerald-400">
                    <Link to="/navigator">Open Navigator</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/world">Explore 3D Galaxy</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
