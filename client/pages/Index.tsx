import React, { useState, Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  ShieldCheck,
  Menu,
  X,
  ArrowRight,
  Github,
  ExternalLink,
  Globe,
  Terminal,
  Copy,
  Check,
  Key,
  Cpu,
  RefreshCw,
  GitBranch,
  Layers,
  Database,
  Search,
  Activity,
  Boxes,
  Lock,
  Radio,
  Zap,
} from "lucide-react";
import { feexProjects } from "@/lib/feex-ecosystem";
import { FeexHorizontalLockup, FeexWorldBadge } from "@/components/FeexLogo";
import { HeroVideoDialog } from "@/components/media/HeroVideoDialog";
import { ShimmerButton } from "@/components/motion/ShimmerButton";
import { InfiniteMarqueeTicker } from "@/components/carousel/InfiniteMarqueeTicker";
import { BentoEvidenceGrid } from "@/components/gallery/BentoEvidenceGrid";
import { HorizontalProjectSlider } from "@/components/carousel/HorizontalProjectSlider";
import { CursorSpotlightCard } from "@/components/motion/CursorSpotlightCard";
import { ProjectMini3DCard } from "@/components/webgl/ProjectMini3DCard";

// Lazy-load Drei WebGL 3D scenes for optimal initial bundle execution
const DreiLandingHero = lazy(() => import("@/components/webgl/DreiLandingHero"));
const DreiGatewayInspector = lazy(() => import("@/components/webgl/DreiGatewayInspector"));
import { ArchitectureBurgerStack } from "@/components/ArchitectureBurgerStack";

// --- PARTNER & ECOSYSTEM LOGOS FOR MARQUEE RIBBON ---
const PARTNER_LOGOS = [
  "Fireworks AI",
  "Cal.com",
  "Mintlify",
  "Symbolica",
  "BlindPay",
  "Magic Patterns",
  "Plain",
  "FEEXSYSTEMS",
  "Persona OS",
  "Yurrheeler Med",
  "KappaXchange",
  "3WM SONIK Labs",
  "HoloKai Systems",
  "Fireworks AI",
  "Cal.com",
  "Mintlify",
  "Symbolica",
  "BlindPay",
  "Magic Patterns",
  "Plain",
];

// --- 5-STAGE DEPLOYMENT WORKFLOW STEPS ---
const DEPLOYMENT_STEPS = [
  {
    id: "connect",
    title: "Connect a repo and push code",
    subtitle: "Git-based deploys, zero setup",
    desc: "Link your Git repository once and deploy automatically on every push. No complex pipelines or manual steps needed.",
    command: "git remote add feex https://api.feexsystems.codes/deploy.git\ngit push feex main",
    statusBadge: "WEBHOOK_ACTIVE",
    meta: "SHA-256 HMAC Verified",
  },
  {
    id: "deploy",
    title: "Deploy Docker containers",
    subtitle: "Any language, any framework",
    desc: "Run real containers that stay online, keeping the serverless feel while avoiding cold starts and short-lived runtimes.",
    command: "docker build -t feex/gateway:v2.4 . && feex deploy --mesh=3d",
    statusBadge: "CONTAINER_ONLINE",
    meta: "Cluster Node #402 Ready",
  },
  {
    id: "preview",
    title: "Previews for every commit",
    subtitle: "Test every commit before it ships",
    desc: "Test changes in an isolated sandbox environment, then promote when the results and Evidence Fabric integrity checks look right.",
    command: "curl -I https://preview-pr42.feexsystems.codes/health",
    statusBadge: "ISOLATED_PREVIEW_READY",
    meta: "Ephemeral Namespace #883",
  },
  {
    id: "ship",
    title: "Ship immutable versions",
    subtitle: "Instant rollbacks, no guesswork",
    desc: "Keep releases safe with fast rollback paths; switch back instantly without redeploying. The previous production instance stays running for 30 minutes.",
    command: "feex release promote --env=production --zero-downtime",
    statusBadge: "CANONICAL_PROD_100%",
    meta: "Active in 14 Edge Regions",
  },
  {
    id: "validate",
    title: "Validate releases automatically",
    subtitle: "Branch protection & OpenAPI checks",
    desc: "Make it really hard to ship broken APIs. OpenAPI diffs and Evidence Fabric ledgers automatically flag breaking changes before they hit production.",
    command: "feex evidence verify --commit=$(git rev-parse HEAD)",
    statusBadge: "EVIDENCE_INTEGRITY_VALID",
    meta: "100% Provenance Anchored",
  },
];

// --- TELEMETRY HISTOGRAM MOCK DATA (30 DAYS) ---
const TELEMETRY_DAYS = [
  { day: "01", reqs: 42, latency: 11, spike: false },
  { day: "02", reqs: 58, latency: 12, spike: false },
  { day: "03", reqs: 48, latency: 10, spike: false },
  { day: "04", reqs: 72, latency: 13, spike: false },
  { day: "05", reqs: 65, latency: 11, spike: false },
  { day: "06", reqs: 38, latency: 9, spike: false },
  { day: "07", reqs: 31, latency: 9, spike: false },
  { day: "08", reqs: 84, latency: 14, spike: false },
  { day: "09", reqs: 92, latency: 15, spike: false },
  { day: "10", reqs: 115, latency: 18, spike: true },
  { day: "11", reqs: 145, latency: 19, spike: true },
  { day: "12", reqs: 110, latency: 16, spike: false },
  { day: "13", reqs: 88, latency: 12, spike: false },
  { day: "14", reqs: 95, latency: 13, spike: false },
  { day: "15", reqs: 120, latency: 17, spike: false },
  { day: "16", reqs: 135, latency: 18, spike: false },
  { day: "17", reqs: 168, latency: 21, spike: true },
  { day: "18", reqs: 142, latency: 16, spike: false },
  { day: "19", reqs: 98, latency: 12, spike: false },
  { day: "20", reqs: 85, latency: 11, spike: false },
  { day: "21", reqs: 105, latency: 13, spike: false },
  { day: "22", reqs: 130, latency: 15, spike: false },
  { day: "23", reqs: 155, latency: 17, spike: false },
  { day: "24", reqs: 148, latency: 16, spike: false },
  { day: "25", reqs: 175, latency: 22, spike: true },
  { day: "26", reqs: 190, latency: 24, spike: true },
  { day: "27", reqs: 162, latency: 18, spike: false },
  { day: "28", reqs: 138, latency: 15, spike: false },
  { day: "29", reqs: 125, latency: 14, spike: false },
  { day: "30", reqs: 182, latency: 20, spike: true },
];

export default function Index() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [activeStep, setActiveStep] = useState("connect");
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [selectedHistogramDay, setSelectedHistogramDay] = useState(TELEMETRY_DAYS[29]);
  const [codeTab, setCodeTab] = useState<"curl" | "typescript" | "python">("typescript");

  const currentStepData = DEPLOYMENT_STEPS.find((s) => s.id === activeStep) || DEPLOYMENT_STEPS[0];

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(currentStepData.command);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#040406] text-white antialiased font-sans selection:bg-[#00F5D4] selection:text-black">
      
      {/* ========================================================================= */}
      {/* 1. GLOBAL UNKEY INDUSTRIAL HEADER                                        */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 flex items-center pt-2.5 bg-[#040406]/85 backdrop-blur-md">
        <div className="container mx-auto flex h-11 flex-1 items-center justify-between bg-white text-black pr-0 pl-6 border border-gray-20 shadow-token-md">
          <div className="relative flex h-full shrink-0 items-center gap-3">
            <Link className="inline-flex shrink-0 font-bold tracking-tight text-xl text-black hover:opacity-80 transition-opacity" to="/">
              FEEXSYSTEMS
            </Link>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono uppercase bg-black text-white rounded">
              v2.4 DEVELOPER PLATFORM
            </span>
          </div>
          
          <nav aria-label="Primary navigation" className="hidden h-full lg:flex items-center">
            {/* Resources Dropdown */}
            <div
              className="relative flex h-full items-center justify-center group"
              onMouseEnter={() => setResourcesOpen(true)}
              onMouseLeave={() => setResourcesOpen(false)}
            >
              <button
                type="button"
                className="relative inline-flex h-full items-center gap-1 px-5 py-0 text-sm leading-none font-medium tracking-tight transition-colors text-black hover:text-gray-60"
              >
                Resources{" "}
                <ChevronDown
                  className={`size-3.5 opacity-70 transition-transform duration-200 ${
                    resourcesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {resourcesOpen && (
                <div className="absolute top-full left-0 mt-0 w-82.5 transition-all duration-200 bg-white border border-gray-20 shadow-token-lg z-50">
                  <ul className="flex w-full flex-col bg-white">
                    <li>
                      <Link className="flex flex-col gap-1 px-5 py-4 hover:bg-gray-94 transition-colors" to="/world">
                        <span className="text-sm font-semibold text-black flex items-center gap-1.5">
                          3D Knowledge Galaxy <span className="text-[10px] bg-[#00F5D4] text-black px-1.5 py-0.2 rounded font-mono">FEEX 3D</span>
                        </span>
                        <span className="text-xs text-gray-40">Explorable planetary core network</span>
                      </Link>
                    </li>
                    <li>
                      <Link className="flex flex-col gap-1 px-5 py-4 hover:bg-gray-94 transition-colors" to="/evidence">
                        <span className="text-sm font-semibold text-black">Evidence Fabric Ledger</span>
                        <span className="text-xs text-gray-40">Cryptographic audit trails & commit SHAs</span>
                      </Link>
                    </li>
                    <li>
                      <Link className="flex flex-col gap-1 px-5 py-4 hover:bg-gray-94 transition-colors" to="/navigator">
                        <span className="text-sm font-semibold text-black">AI Navigator</span>
                        <span className="text-xs text-gray-40">Grounded ecosystem intelligence reasoning</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <Link className="inline-flex items-center h-full px-5 text-sm font-medium tracking-tight text-black hover:text-gray-60" to="/projects">
              Projects
            </Link>
            <Link className="inline-flex items-center h-full px-5 text-sm font-medium tracking-tight text-black hover:text-gray-60" to="/navigator">
              Navigator
            </Link>
            <Link className="inline-flex items-center h-full px-5 text-sm font-medium tracking-tight text-black hover:text-gray-60" to="/evidence">
              Evidence
            </Link>
            <Link
              className="inline-flex items-center h-full px-5 text-sm font-bold tracking-tight text-[#0066FF] hover:text-[#0052cc] gap-1"
              to="/world"
            >
              <span className="h-2 w-2 rounded-full bg-[#00F5D4] animate-pulse" />
              3D World
            </Link>
          </nav>

          <nav aria-label="Actions" className="hidden items-center gap-2 lg:flex h-full pr-1">
            <Link
              className="inline-flex items-center justify-center h-9 font-medium tracking-tight hover:bg-gray-12 hover:text-white px-4 text-sm transition-colors duration-200"
              to="/login"
            >
              Sign in
            </Link>
            <Link
              className="inline-flex items-center justify-center h-9 font-bold tracking-tight bg-black text-white hover:bg-gray-80 px-4 text-sm transition-all shadow-token-sm"
              to="/world"
            >
              <Globe className="h-3.5 w-3.5 mr-1.5 text-[#00F5D4]" />
              Launch 3D World
            </Link>
          </nav>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="flex size-11 items-center justify-center bg-black text-white lg:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-5 right-5 z-50 bg-white text-black p-5 border border-gray-20 shadow-2xl flex flex-col gap-3 lg:hidden">
            <Link className="py-2 border-b border-gray-94 font-medium flex items-center justify-between" to="/world">
              <span>3D Spatial World</span>
              <span className="text-[10px] bg-[#00F5D4] text-black px-1.5 py-0.5 rounded font-mono">FEEX 3D</span>
            </Link>
            <Link className="py-2 border-b border-gray-94 font-medium" to="/projects">Projects Explorer</Link>
            <Link className="py-2 border-b border-gray-94 font-medium" to="/navigator">AI Navigator</Link>
            <Link className="py-2 border-b border-gray-94 font-medium" to="/evidence">Evidence Fabric</Link>
            <div className="flex gap-2 mt-2">
              <Link className="flex-1 text-center py-2.5 border border-black text-black text-sm font-medium" to="/login">
                Sign in
              </Link>
              <Link className="flex-1 text-center py-2.5 bg-black text-white text-sm font-medium" to="/world">
                Launch 3D
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="relative w-full overflow-x-clip bg-[#040406] text-white grow">
        
        {/* ========================================================================= */}
        {/* 2. HERO SECTION WITH 3D DREI MOTIONS, STACKED TYPOGRAPHY & MARQUEE       */}
        {/* ========================================================================= */}
        <section className="relative z-0 w-full border-b border-gray-20 pb-16">
          {/* High-Performance 3D WebGL Background (Drei Float, Trail, Edges, ScreenSpace) */}
          <div className="absolute inset-0 z-0 h-full w-full pointer-events-none opacity-85">
            <Suspense fallback={null}>
              <DreiLandingHero />
            </Suspense>
          </div>

          <div className="relative min-h-[min(50rem,100svh)] w-full overflow-hidden flex flex-col justify-end pt-16">
            <div className="absolute inset-0 bg-gradient-to-t from-[#040406] via-transparent to-transparent z-10 pointer-events-none" />
            
            <div className="relative z-20 container mx-auto px-5 md:px-8 pb-8 md:pb-12 xl:pb-16">
              
              {/* Massive Industrial Stacked Words (as seen in Unkey spec) */}
              <div className="mb-6 select-none font-mono text-xs md:text-sm tracking-[0.25em] text-gray-40 uppercase space-y-1">
                <div>DEPLOY</div>
                <div>SCALE</div>
                <div className="text-[#00F5D4] font-bold flex items-center gap-2">
                  <span>➔ GATEWAY</span>
                  <span className="text-[10px] px-2 py-0.5 bg-[#00F5D4]/10 border border-[#00F5D4]/30 rounded text-[#00F5D4] tracking-normal">
                    FEEX 3D SPATIAL ENGINE ACTIVE
                  </span>
                </div>
                <div>OBSERVE</div>
                <div>PROTECT</div>
              </div>

              {/* Primary Headline */}
              <h1 className="max-w-176 font-display text-4xl leading-[1.125] font-normal text-white sm:text-5xl md:text-[2.625rem] lg:text-[3.25rem] xl:text-[4rem]">
                The Developer Platform for Living Intelligence
              </h1>

              <div className="mt-4 flex flex-col gap-7 md:mt-6 md:flex-row md:items-end md:justify-between md:gap-6">
                <p className="max-w-132.75 text-sm leading-snug text-gray-40 sm:text-base font-normal">
                  FEEXSYSTEMS unifies your engineering intelligence with autonomous World Models. Deploy APIs and models instantly, route through global evidence gateways, and explore provenance in one explorable 3D universe.
                </p>
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <Link to="/world">
                    <ShimmerButton
                      shimmerColor="#00F5D4"
                      background="radial-gradient(ellipse 80% 50% at 50% 120%, rgba(0, 245, 212, 0.28), rgba(9, 10, 15, 0.95))"
                      className="h-11 px-6 font-semibold text-white tracking-wide border border-[#00F5D4]/40 hover:border-[#00F5D4] shadow-token-md"
                    >
                      <Globe className="size-4 mr-2 text-[#00F5D4] inline-block" />
                      Launch 3D World
                    </ShimmerButton>
                  </Link>
                  <a
                    className="inline-flex items-center justify-center h-11 border border-white/40 text-white font-medium hover:bg-white/10 px-5 text-base transition-all gap-2"
                    href="https://github.com/FeexSystems"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="size-4" /> View on GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* SOCIAL PROOF & LIVE ECOSYSTEM MARQUEE TICKER */}
          <div className="container mx-auto px-5 md:px-8 mt-6">
            <InfiniteMarqueeTicker speed={32} pauseOnHover={true} />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. CONTROL PLANE CARD MATRIX GRID                                         */}
        {/* ========================================================================= */}
        <section className="pt-20 md:pt-30 xl:pt-42.5 container mx-auto px-5 md:px-8">
          <div className="relative sm:pl-8 border-l border-gray-20/40">
            <div className="text-[11px] font-mono tracking-widest text-[#00F5D4] uppercase mb-2 flex items-center gap-2">
              <Radio className="size-3.5 animate-pulse" />
              <span>SINGLE PANE OF CONTROL</span>
            </div>
            <h2 className="max-w-[42rem] font-display text-[1.75rem] leading-[1.15] text-white md:text-4xl lg:text-[2.5rem] xl:text-[2.75rem]">
              Unify your fragmented ecosystem with a single control plane for{" "}
              <mark className="inline-block bg-yellow text-black px-2 pb-0.5 font-bold">
                access and traffic.
              </mark>
            </h2>
            <p className="mt-6 max-w-144 text-base md:text-lg leading-relaxed text-gray-70">
              Stop assembling your API and intelligence stack piece by piece. Running APIs and World Models at scale usually means juggling hosting, gateways, rate limits, and monitoring across multiple vendors.
            </p>
          </div>

          {/* 4-Card Industrial Matrix Grid with hairline borders */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-20 border border-gray-20">
            {[
              {
                tag: "Branch Overview",
                highlight: "Faster to ship.",
                text: "Go from code to running API and 3D node in minutes. Test safely, promote when ready, roll back if needed.",
                preview: (
                  <div className="mt-4 p-3 bg-[#040406] border border-gray-20/60 rounded font-mono text-xs text-gray-60 space-y-1">
                    <div className="flex items-center justify-between text-[#00F5D4]">
                      <span>main ➔ feex/v2.4</span>
                      <span className="text-[10px] bg-[#00F5D4]/10 px-1 rounded">LIVE</span>
                    </div>
                    <div className="text-[10px] text-gray-40">sha-wm3 · 14 artifacts indexed</div>
                  </div>
                ),
              },
              {
                tag: "Manage API Keys",
                highlight: "Safer by default.",
                text: "Protect every endpoint with keys, rate limits, and instant access revocation out of the box.",
                preview: (
                  <div className="mt-4 p-3 bg-[#040406] border border-gray-20/60 rounded font-mono text-xs text-gray-60 space-y-1">
                    <div className="flex items-center justify-between text-yellow">
                      <span>key_live_feex_90...</span>
                      <span className="text-[10px] text-emerald-400">100 req/s</span>
                    </div>
                    <div className="text-[10px] text-gray-40">HMAC-SHA256 auto-revocation</div>
                  </div>
                ),
              },
              {
                tag: "Control Plane",
                highlight: "Simpler to run.",
                text: "One single unified platform for deployments, edge gateways, and 3D spatial knowledge graphs.",
                preview: (
                  <div className="mt-4 p-3 bg-[#040406] border border-gray-20/60 rounded font-mono text-xs text-gray-60 space-y-1">
                    <div className="flex items-center justify-between text-[#06b6d4]">
                      <span>Mesh Nodes: 13</span>
                      <span className="text-[10px] bg-[#06b6d4]/10 text-[#06b6d4] px-1 rounded">HEALTHY</span>
                    </div>
                    <div className="text-[10px] text-gray-40">PostgreSQL + Redis Bull Fabric</div>
                  </div>
                ),
              },
              {
                tag: "Usage 30 Days",
                highlight: "Visible from day one.",
                text: "Every request logged. Every decision tracked with Evidence Fabric provenance before users notice.",
                preview: (
                  <div className="mt-4 p-3 bg-[#040406] border border-gray-20/60 rounded font-mono text-xs text-gray-60 space-y-1">
                    <div className="flex items-center justify-between text-emerald-400">
                      <span>Uptime: 99.999%</span>
                      <span className="text-[10px] text-gray-40">&lt;15ms edge</span>
                    </div>
                    <div className="text-[10px] text-gray-40">3.8M verified executions</div>
                  </div>
                ),
              },
            ].map((card, i) => (
              <div key={i} className="flex flex-col justify-between bg-[#090a0f] p-6 lg:p-8 hover:bg-[#141416] transition-colors duration-200">
                <div>
                  <div className="text-xs font-mono text-gray-40 tracking-wider uppercase mb-4">
                    {card.tag}
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    <span className="text-white font-semibold">{card.highlight}</span>{" "}
                    <span className="text-gray-40 font-normal">{card.text}</span>
                  </h3>
                </div>
                {card.preview}
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3.5. LIVING ECOSYSTEM PROJECTS CAROUSEL (HORIZONTAL PROJECT SLIDER)       */}
        {/* ========================================================================= */}
        <section className="pt-20 md:pt-30 xl:pt-36 container mx-auto px-5 md:px-8">
          <HorizontalProjectSlider
            title="Living Ecosystem Projects"
            subtitle="Explore active multi-agent platforms, autonomous fintech protocols, and clinical intelligence nodes anchored to the canonical World Model."
            viewAllHref="/projects"
            viewAllLabel="Explore All 6 Projects"
          >
            {feexProjects.map((proj) => (
              <div
                key={proj.id}
                className="w-[320px] sm:w-[380px] shrink-0 snap-start"
              >
                <CursorSpotlightCard
                  spotlightColor="rgba(0, 245, 212, 0.12)"
                  className="h-full bg-[#090a0f] border border-gray-20/80 rounded-lg p-5 flex flex-col justify-between hover:border-[#00F5D4]/40 transition-all group"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#00F5D4]/10 text-[#00F5D4] border border-[#00F5D4]/20">
                        {proj.domain}
                      </span>
                      <span className="text-[10px] font-mono text-gray-40 flex items-center gap-1">
                        <GitBranch className="size-3 text-[#00F5D4]" />
                        {proj.stars} stars
                      </span>
                    </div>

                    <h4 className="text-base font-semibold text-white group-hover:text-[#00F5D4] transition-colors leading-snug">
                      {proj.name}
                    </h4>

                    <p className="text-xs text-gray-40 mt-2 line-clamp-2 leading-relaxed">
                      {proj.description}
                    </p>

                    {/* Interactive 3D Mini Mesh Node Canvas */}
                    <div className="mt-4 h-32 w-full bg-[#040406] border border-gray-20/40 rounded overflow-hidden relative">
                      <ProjectMini3DCard color={proj.color} domain={proj.domain} />
                      <div className="absolute bottom-2 right-2 text-[9px] font-mono text-gray-40 bg-[#090a0f]/90 px-1.5 py-0.5 rounded border border-gray-20/40 pointer-events-none">
                        Drei 3D View
                      </div>
                    </div>
                  </div>

                  {/* Footer CTAs */}
                  <div className="mt-4 pt-3 border-t border-gray-20/60 flex items-center justify-between">
                    <Link
                      to={`/world?focus=${encodeURIComponent(proj.id)}`}
                      className="text-xs font-mono text-[#00F5D4] hover:underline flex items-center gap-1"
                    >
                      <Globe className="size-3" /> Focus in 3D Galaxy
                    </Link>
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-gray-40 hover:text-white flex items-center gap-1"
                    >
                      <ExternalLink className="size-3" /> GitHub
                    </a>
                  </div>
                </CursorSpotlightCard>
              </div>
            ))}
          </HorizontalProjectSlider>
        </section>

        {/* ========================================================================= */}
        {/* 4. INTERACTIVE 5-STAGE DEPLOYMENT WORKFLOW SLIDER                         */}
        {/* ========================================================================= */}
        <section className="pt-24 md:pt-35 xl:pt-45 container mx-auto px-5 md:px-8">
          <div className="text-[11px] font-mono tracking-widest text-[#00F5D4] uppercase mb-2">
            INTEGRATED WORKFLOW
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-white max-w-176 leading-tight">
            Engineered for teams who demand instant deployments with strict verification.
          </h2>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Steps Navigation Tabs */}
            <div className="lg:col-span-5 flex flex-col divide-y divide-gray-20/60 border border-gray-20 bg-[#090a0f]">
              {DEPLOYMENT_STEPS.map((step, idx) => {
                const isActive = activeStep === step.id;
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(step.id)}
                    className={`text-left p-6 transition-all relative ${
                      isActive
                        ? "bg-[#141416] text-white"
                        : "text-gray-40 hover:text-gray-70 hover:bg-[#090a0f]/80"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00F5D4]" />
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-gray-40">0{idx + 1} //</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        isActive ? "bg-[#00F5D4]/10 text-[#00F5D4] border border-[#00F5D4]/30" : "text-gray-60"
                      }`}>
                        {step.subtitle}
                      </span>
                    </div>
                    <div className={`mt-2 font-medium text-base ${isActive ? "text-white" : "text-gray-70"}`}>
                      {step.title}
                    </div>
                    <p className="mt-1 text-xs text-gray-40 leading-relaxed">
                      {step.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Right Interactive Living Panel with 3D Drei Gateway Inspector */}
            <div className="lg:col-span-7 flex flex-col gap-4 border border-gray-20 bg-[#090a0f] p-6 lg:p-8 relative">
              {/* Background diagonal stripes decoration */}
              <div className="bg-diagonal-stripes absolute inset-0 opacity-10 pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between border-b border-gray-20/60 pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-mono text-xs text-emerald-400 font-semibold tracking-wider">
                    {currentStepData.statusBadge}
                  </span>
                </div>
                <div className="font-mono text-xs text-gray-40">
                  {currentStepData.meta}
                </div>
              </div>

              {/* Step Detail Heading */}
              <div className="relative z-10 my-2">
                <h3 className="text-xl font-semibold text-white">
                  {currentStepData.title}
                </h3>
                <p className="text-sm text-gray-40 mt-1">
                  {currentStepData.desc}
                </p>
              </div>

              {/* Interactive Terminal / Command Box with Copy Action */}
              <div className="relative z-10 bg-[#040406] border border-gray-20 rounded p-4 font-mono text-xs">
                <div className="flex items-center justify-between text-gray-60 mb-2 border-b border-gray-20/40 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Terminal className="size-3.5 text-[#00F5D4]" />
                    <span className="text-[11px]">feex-cli // bash</span>
                  </div>
                  <button
                    onClick={handleCopyCommand}
                    className="flex items-center gap-1 text-[11px] hover:text-white transition-colors"
                  >
                    {copiedCmd ? (
                      <>
                        <Check className="size-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-[#00F5D4] overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {currentStepData.command}
                </pre>
              </div>

              {/* Embedded 3D Feex Gateway Inspector Widget */}
              <div className="relative z-10 mt-2">
                <Suspense fallback={<div className="h-64 flex items-center justify-center font-mono text-xs text-gray-60">Initializing Feex 3D Gateway...</div>}>
                  <DreiGatewayInspector />
                </Suspense>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4.5. ASYMMETRIC BENTO EVIDENCE GRID (5-PILLAR ARCHITECTURE)               */}
        {/* ========================================================================= */}
        <section className="pt-24 md:pt-35 xl:pt-45 container mx-auto px-5 md:px-8">
          <BentoEvidenceGrid />
        </section>

        {/* ========================================================================= */}
        {/* 5. THE LLM APPLICATION DEVELOPMENT BURGER (ARCHITECTURE STACK EXPLORER)  */}
        {/* ========================================================================= */}
        <ArchitectureBurgerStack />

        {/* ========================================================================= */}
        {/* 6. HIGH AVAILABILITY LAYER & 30-DAY TELEMETRY HISTOGRAM                  */}
        {/* ========================================================================= */}
        <section className="pt-24 md:pt-35 xl:pt-45 container mx-auto px-5 md:px-8">
          <div className="border border-gray-20 bg-[#090a0f] p-6 lg:p-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-gray-20/60">
              <div>
                <div className="text-[11px] font-mono tracking-widest text-[#00F5D4] uppercase mb-2 flex items-center gap-2">
                  <Activity className="size-3.5" />
                  <span>HIGH AVAILABILITY TELEMETRY</span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl text-white">
                  Telemetry Built for Zero-Downtime Reliability
                </h2>
                <p className="text-sm text-gray-40 mt-1 max-w-144">
                  Sub-millisecond Edge routing across 14 globally distributed regions with zero recorded cold starts.
                </p>
              </div>

              <div className="flex items-center gap-6 font-mono text-xs">
                <div>
                  <span className="text-gray-60 block text-[10px]">CURRENT DAY</span>
                  <span className="text-white font-bold">DAY {selectedHistogramDay.day}</span>
                </div>
                <div>
                  <span className="text-gray-60 block text-[10px]">REQUEST LOAD</span>
                  <span className="text-yellow font-bold">{selectedHistogramDay.reqs}k reqs</span>
                </div>
                <div>
                  <span className="text-gray-60 block text-[10px]">MEDIAN LATENCY</span>
                  <span className="text-[#00F5D4] font-bold">{selectedHistogramDay.latency}ms</span>
                </div>
              </div>
            </div>

            {/* Interactive Histogram Bars */}
            <div className="mt-8 pt-4">
              <div className="h-44 flex items-end gap-1.5 sm:gap-2.5">
                {TELEMETRY_DAYS.map((item, idx) => {
                  const isSelected = selectedHistogramDay.day === item.day;
                  const heightPercent = Math.max(15, Math.round((item.reqs / 200) * 100));
                  return (
                    <div
                      key={idx}
                      onMouseEnter={() => setSelectedHistogramDay(item)}
                      className="flex-1 flex flex-col items-center gap-1 group cursor-pointer h-full justify-end"
                    >
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t transition-all duration-200 ${
                          isSelected
                            ? "bg-yellow shadow-token-md scale-y-105"
                            : item.spike
                            ? "bg-yellow/60 group-hover:bg-yellow"
                            : "bg-[#06b6d4]/40 group-hover:bg-[#06b6d4]"
                        }`}
                      />
                      <span className={`text-[9px] font-mono ${isSelected ? "text-white font-bold" : "text-gray-60"}`}>
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-gray-40 mt-4 border-t border-gray-20/40 pt-3">
                <span>← Day 01 (Previous Month)</span>
                <span className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="size-2 rounded-full bg-[#06b6d4]" /> Standard Load
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="size-2 rounded-full bg-yellow" /> Traffic Peaks
                  </span>
                </span>
                <span>Day 30 (Live Today) →</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6.5. ARCHITECTURAL VIDEO WALKTHROUGH DEMO (HERO VIDEO DIALOG)             */}
        {/* ========================================================================= */}
        <section className="pt-24 md:pt-35 xl:pt-45 container mx-auto px-5 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="text-[11px] font-mono tracking-widest text-[#00F5D4] uppercase mb-2">
              LIVING MULTIMEDIA INTEL
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-white">
              Watch the Living World Model in Action
            </h2>
            <p className="text-sm text-gray-40 mt-3 leading-relaxed">
              Witness how continuous GitHub webhooks synthesize real-time commit SHAs into spatial coordinates, grounded AI retrieval vectors, and automated health assurances.
            </p>
          </div>

          <HeroVideoDialog
            videoSrc="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            thumbnailSrc="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1280&auto=format&fit=crop"
            thumbnailAlt="FEEXSYSTEMS Living World Model Architectural Demonstration"
            title="FEEXSYSTEMS — Living World Model & Evidence Fabric Walkthrough"
            badgeText="WATCH 4K WALKTHROUGH"
          />
        </section>

        {/* ========================================================================= */}
        {/* 7. SELF-SERVE DEVELOPER PORTAL & MULTI-LANGUAGE CODE SNIPPETS            */}
        {/* ========================================================================= */}
        <section className="pt-24 md:pt-35 xl:pt-45 container mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-5">
              <div className="text-[11px] font-mono tracking-widest text-[#00F5D4] uppercase mb-2">
                DEVELOPER PORTAL
              </div>
              <h2 className="font-display text-3xl md:text-4xl text-white">
                Authenticate, verify, and reason with a few lines of code.
              </h2>
              <p className="mt-4 text-base text-gray-60 leading-relaxed">
                Interact with the canonical World Model using your preferred language SDK or directly through the HTTP Edge API. All calls inherit verifiable evidence provenance.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  "Grounded retrieval with AI explanation (/api/world-model/navigator)",
                  "3D/2D node and edge graph topology (/api/world-model/graph)",
                  "Evidence provenance verification ledger (/api/world-model/evidence/:id)",
                  "HMAC SHA-256 webhook event ingestion (/api/world-model/webhook)",
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-gray-70 font-mono">
                    <ShieldCheck className="size-4 text-[#00F5D4] shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Code Snippet Switcher */}
            <div className="lg:col-span-7 border border-gray-20 bg-[#090a0f] rounded-lg overflow-hidden">
              <div className="flex items-center justify-between border-b border-gray-20 bg-[#040406] px-4 py-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setCodeTab("typescript")}
                    className={`px-3 py-1 text-xs font-mono rounded ${
                      codeTab === "typescript" ? "bg-gray-20 text-white" : "text-gray-40 hover:text-white"
                    }`}
                  >
                    TypeScript
                  </button>
                  <button
                    onClick={() => setCodeTab("curl")}
                    className={`px-3 py-1 text-xs font-mono rounded ${
                      codeTab === "curl" ? "bg-gray-20 text-white" : "text-gray-40 hover:text-white"
                    }`}
                  >
                    cURL
                  </button>
                  <button
                    onClick={() => setCodeTab("python")}
                    className={`px-3 py-1 text-xs font-mono rounded ${
                      codeTab === "python" ? "bg-gray-20 text-white" : "text-gray-40 hover:text-white"
                    }`}
                  >
                    Python
                  </button>
                </div>
                <div className="text-[11px] font-mono text-gray-60">
                  SDK v2.4.0
                </div>
              </div>

              <div className="p-5 font-mono text-xs leading-relaxed overflow-x-auto text-gray-70">
                {codeTab === "typescript" && (
                  <pre className="text-[#00F5D4]">
{`import { FeexClient } from "@feexsystems/sdk";

const feex = new FeexClient({
  apiKey: process.env.FEEX_API_KEY,
  gatewayRegion: "us-east",
});

// Grounded World Model reasoning query
const result = await feex.navigator.query({
  prompt: "What repositories compose the Persona Digital Operating Environment?",
  verifyEvidence: true,
});

console.log(result.explanation);
console.log("Traceable Commit SHA:", result.evidence.sha);`}
                  </pre>
                )}

                {codeTab === "curl" && (
                  <pre className="text-yellow">
{`curl -X POST https://api.feexsystems.codes/v1/navigator \\
  -H "Authorization: Bearer key_live_feex_902..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "How is 3WM SONIK connected to AI World Models?",
    "includeProvenance": true
  }'`}
                  </pre>
                )}

                {codeTab === "python" && (
                  <pre className="text-[#06b6d4]">
{`from feexsystems import FeexClient

client = FeexClient(api_key="key_live_feex_902...")

# Query the 3D Knowledge Galaxy topology
graph = client.world_model.get_topology(domain="Intelligence")

for node in graph.nodes:
    print(f"Node: {node.name} -> Language: {node.language}")`}
                  </pre>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. BOTTOM WORKFLOW CALL TO ACTION                                         */}
        {/* ========================================================================= */}
        <section className="pt-24 md:pt-35 xl:pt-45 pb-20 container mx-auto px-5 md:px-8">
          <div className="relative overflow-hidden border border-gray-20 bg-gradient-to-br from-[#090a0f] via-[#040406] to-[#0A0E17] p-8 md:p-14 text-center">
            <div className="bg-blue-glow absolute -top-24 -left-24 h-64 w-64 rounded-full blur-3xl pointer-events-none" />
            <div className="bg-yellow-glow absolute -bottom-24 -right-24 h-64 w-64 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="text-[10px] font-mono tracking-widest text-[#00F5D4] uppercase px-3 py-1 bg-[#00F5D4]/10 border border-[#00F5D4]/30 rounded">
                EXPLORE THE LIVING REPOSITORY
              </span>
              <h2 className="mt-4 font-display text-3xl md:text-5xl text-white">
                Build better systems faster.
              </h2>
              <p className="mt-4 text-base text-gray-60 leading-relaxed">
                Step into the 3D World Model. Search coordinate nodes, trace commits to evidence, and experience Living Engineering Intelligence.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  className="inline-flex items-center justify-center h-12 bg-white text-black font-bold hover:bg-gray-90 px-8 text-base transition-all shadow-token-lg hover:scale-105"
                  to="/world"
                >
                  <Globe className="h-4 w-4 mr-2 text-[#00F5D4]" />
                  Launch 3D World Model
                </Link>
                <Link
                  className="inline-flex items-center justify-center h-12 border border-gray-20 bg-[#141416] text-white font-medium hover:bg-gray-20 px-8 text-base transition-all"
                  to="/projects"
                >
                  Browse Projects Explorer
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ========================================================================= */}
      {/* 8. GLOBAL INDUSTRIAL SYSTEM FOOTER                                        */}
      {/* ========================================================================= */}
      <footer className="border-t border-gray-20 bg-[#040406] py-14 text-xs font-mono text-gray-40">
        <div className="container mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
            
            <div className="md:col-span-2 space-y-3">
              <div className="text-base font-bold text-white tracking-tight">
                FEEXSYSTEMS
              </div>
              <p className="text-gray-60 max-w-sm font-sans text-sm">
                The evidence-backed developer platform turning the GitHub ecosystem into an explorable 3D World Model.
              </p>
              <div className="pt-2 flex items-center gap-2 text-[10px] text-gray-40">
                <span className="size-2 rounded-full bg-emerald-400" />
                <span>SOC 2 Type II Certified Assurance</span>
              </div>
            </div>

            <div>
              <div className="text-white font-semibold mb-3 tracking-wider uppercase text-[11px]">
                Platform
              </div>
              <ul className="space-y-2">
                <li><Link className="hover:text-white transition-colors" to="/world">3D Spatial World</Link></li>
                <li><Link className="hover:text-white transition-colors" to="/projects">Project Explorer</Link></li>
                <li><Link className="hover:text-white transition-colors" to="/navigator">AI Navigator</Link></li>
                <li><Link className="hover:text-white transition-colors" to="/evidence">Evidence Fabric</Link></li>
              </ul>
            </div>

            <div>
              <div className="text-white font-semibold mb-3 tracking-wider uppercase text-[11px]">
                Resources
              </div>
              <ul className="space-y-2">
                <li><a className="hover:text-white transition-colors" href="https://github.com/FeexSystems" target="_blank" rel="noreferrer">GitHub Organization</a></li>
                <li><a className="hover:text-white transition-colors" href="/health" target="_blank">System Status</a></li>
                <li><a className="hover:text-white transition-colors" href="/api/ping" target="_blank">Ecosystem Ping</a></li>
                <li><Link className="hover:text-white transition-colors" to="/login">Platform Sign In</Link></li>
              </ul>
            </div>

            <div>
              <div className="text-white font-semibold mb-3 tracking-wider uppercase text-[11px]">
                Ecosystem
              </div>
              <ul className="space-y-2">
                <li><span className="text-gray-60">Persona Digital OS</span></li>
                <li><span className="text-gray-60">Yurrheeler Med Advisor</span></li>
                <li><span className="text-gray-60">KappaXchangeFin</span></li>
                <li><span className="text-gray-60">3WM SONIK Labs</span></li>
              </ul>
            </div>

          </div>

          <div className="mt-12 pt-6 border-t border-gray-20/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-60 text-[11px]">
            <div>
              © 2026 FEEXSYSTEMS. Build better systems faster. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <a href="#terms" className="hover:text-white">Terms of Service</a>
              <a href="#privacy" className="hover:text-white">Privacy Policy</a>
              <a href="#trust" className="hover:text-white">Trust Center</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
