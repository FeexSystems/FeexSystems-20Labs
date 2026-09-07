import { useEffect, useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Boxes, GitBranch, Network, Sparkles } from "lucide-react";

const ImmersiveHeroBackground = lazy(() =>
  import("./webgl/ImmersiveHeroBackground").then((mod) => ({ default: mod.ImmersiveHeroBackground })),
);

export function EnhancedHero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => setIsVisible(true), []);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background pt-20">
      <Suspense fallback={null}>
        <ImmersiveHeroBackground quality="high" particleCount={3000} />
      </Suspense>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className={`relative z-10 mx-auto max-w-7xl px-6 py-20 text-center transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          <Sparkles className="h-4 w-4" />
          Living Engineering Intelligence
        </div>

        <h1 className="text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
          A living model of
          <span className="block bg-gradient-to-r from-primary via-emerald-400 to-primary bg-clip-text text-transparent">
            what you build.
          </span>
        </h1>

        <p className="mx-auto mt-8 max-w-3xl text-xl leading-relaxed text-muted-foreground md:text-2xl">
          FEEXSYSTEMS turns repositories, artifacts, technologies and relationships into an explorable engineering world — grounded in GitHub evidence and built to evolve with the work.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to="/projects"
            className="group inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary to-emerald-400 px-8 py-4 font-bold text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/25"
          >
            Explore the ecosystem
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-xl border border-border bg-card/70 px-8 py-4 font-semibold text-foreground backdrop-blur transition-all duration-300 hover:border-primary/30 hover:bg-muted"
          >
            Open Command Center
          </Link>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-4 md:grid-cols-3">
          {[
            { icon: GitBranch, title: "Repositories", text: "GitHub is the evidence substrate." },
            { icon: Network, title: "World Model", text: "Relationships become first-class data." },
            { icon: Boxes, title: "Engineering Worlds", text: "Projects become navigable systems." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-border/70 bg-card/60 p-6 text-left backdrop-blur transition-colors hover:border-primary/30">
              <Icon className="mb-4 h-6 w-6 text-primary" />
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
