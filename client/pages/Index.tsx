import React, { useState, Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  ArrowRight,
  Terminal,
  Copy,
  Check,
  Zap,
  Globe,
  Radio,
  Layers,
  Activity,
  Sparkles,
  AlertTriangle,
  Share2,
} from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

// Lazy-load WebGL 3D Pointillist Scene (ShaderNode 1, 2, 3)
const StippledPointillistShape = lazy(
  () => import("@/components/webgl/StippledPointillistShape")
);

// Framer pointillist media assets from build inventory
const MOVEMENT_ASSETS = {
  connect: "https://framerusercontent.com/images/MOZwutc7hn3g4CHdkOZs8sLpxTU.jpg",
  analyze: "https://framerusercontent.com/images/YnmyKnOiteetA7mvTtBB1wKE6a4.jpg",
  act: "https://framerusercontent.com/images/r2vFGcsroVfi05WSKILzNt9jsBk.jpg",
  guide: "https://framerusercontent.com/images/us2wct4vOrpUUZpy3fPfAVEdaY.png",
};

// Integration logos from inventory & ecosystem
const INTEGRATIONS = [
  {
    name: "Slack",
    tag: "slack.channels",
    img: "https://framerusercontent.com/images/ZGpRDpkrH80wAbyngmZpEOplCY.png",
    status: "CONNECTED",
  },
  {
    name: "Stripe",
    tag: "stripe.events",
    img: "https://framerusercontent.com/images/aYtUgX9knOFDe77AAHaIPgJFUJ0.png",
    status: "LIVE 100%",
  },
  {
    name: "PayPal",
    tag: "paypal.webhooks",
    img: "https://framerusercontent.com/images/OJxjwxKhsabxI4Ffr8HseTxSdQ.png",
    status: "ACTIVE",
  },
  {
    name: "Notion",
    tag: "notion.docs",
    img: "https://framerusercontent.com/images/E5ntY1Waghw3h6Sut74Ugc4Mkg.png",
    status: "SYNCED",
  },
  {
    name: "Snowflake",
    tag: "snowflake.warehouse",
    img: "https://framerusercontent.com/images/An9arR49O3ps1g08LM7gwNuyNFo.png",
    status: "INGESTING",
  },
  {
    name: "PostgreSQL",
    tag: "postgres.production",
    img: null,
    type: "postgres",
    status: "ONLINE",
  },
  {
    name: "GitHub",
    tag: "github.webhooks",
    img: null,
    type: "github",
    status: "HMAC VERIFIED",
  },
  {
    name: "Docker",
    tag: "docker.containers",
    img: null,
    type: "docker",
    status: "ISOLATED",
  },
];

// Testimonials copy from build inventory
const TESTIMONIALS = [
  {
    quote:
      "Signal transformed how we manage multi-region incidents. We went from 45-minute post-mortems to 5-minute autonomous triage before users ever noticed.",
    author: "Elena Rostova",
    role: "VP of Platform Reliability",
    company: "Apex Cloud Systems",
    metrics: "94% MTTR reduction",
    avatar: "https://framerusercontent.com/images/TklpPyYpi3CMSlWFsZY0osS6xrk.png",
  },
  {
    quote:
      "Having our GitHub repositories, commit SHAs, and live telemetry mapped directly into an explorable 3D World Model is pure engineering magic.",
    author: "Marcus Vance",
    role: "Lead Systems Architect",
    company: "VectorFlow Labs",
    metrics: "14 Edge regions synced",
    avatar: "https://framerusercontent.com/images/t6wZnGOi9ZdULsAkqnDmpeFWlAs.png",
  },
  {
    quote:
      "The zero-engineering connector model is real. We wired our PostgreSQL warehouse and Stripe webhooks in under three minutes without writing ETL pipelines.",
    author: "Sarah Chen",
    role: "Head of Engineering",
    company: "BlindPay International",
    metrics: "2.4M events/sec",
    avatar: "https://framerusercontent.com/images/TklpPyYpi3CMSlWFsZY0osS6xrk.png",
  },
  {
    quote:
      "No more spreadsheet purgatory or arguing over whose dashboard is stale. Signal delivers one authoritative signal anchored to cryptographic evidence.",
    author: "David K. Lindqvist",
    role: "Principal Infrastructure Engineer",
    company: "Persona OS",
    metrics: "0 false alarms in 90 days",
    avatar: "https://framerusercontent.com/images/t6wZnGOi9ZdULsAkqnDmpeFWlAs.png",
  },
  {
    quote:
      "The AI anomaly detection doesn't just ping us — it analyzes the causal trace, flags the exact commit SHA, and prepares the mitigation playbook.",
    author: "Amira Al-Mansoor",
    role: "Director of Cyber Defense",
    company: "SecureBase Global",
    metrics: "Sub-second detection",
    avatar: "https://framerusercontent.com/images/TklpPyYpi3CMSlWFsZY0osS6xrk.png",
  },
  {
    quote:
      "The Omni-Command Stage combined with the 3D Knowledge Galaxy is the single most impressive developer intelligence experience in the SaaS industry.",
    author: "Julian Thorne",
    role: "Chief Technology Officer",
    company: "HoloKai Autonomous",
    metrics: "100% Provenance Coverage",
    avatar: "https://framerusercontent.com/images/t6wZnGOi9ZdULsAkqnDmpeFWlAs.png",
  },
];

// Use Cases modes for Section //07
const USE_CASES = [
  {
    id: "engineering",
    label: "Engineering",
    headline: "Automated commit verification & zero-downtime deploys.",
    description:
      "Trace every production incident back to an exact GitHub commit SHA, diff breaking API changes with OpenAPI checks, and monitor deployment health in real time.",
    stats: [
      { label: "Commit Verification", value: "100% Provenance" },
      { label: "Deployment Latency", value: "<12ms Edge" },
      { label: "Rollback Window", value: "Instant 0s" },
    ],
    badge: "ENGINEERING MODE",
  },
  {
    id: "product",
    label: "Product",
    headline: "Real-time user signals without delayed telemetry batching.",
    description:
      "Spot feature adoption shifts, anomalous checkout drops, and cross-platform bottlenecks instantly without waiting for overnight ETL warehouse synchronizations.",
    stats: [
      { label: "Event Ingestion", value: "Sub-second" },
      { label: "Funnel Granularity", value: "Micro-events" },
      { label: "Signal Confidence", value: "99.8%" },
    ],
    badge: "PRODUCT MODE",
  },
  {
    id: "ops",
    label: "Operations",
    headline: "Autonomous fleet defense and predictive capacity planning.",
    description:
      "Predict database connection exhaustion, memory leak trajectories, and cloud API quota limits before they cascade into high-severity infrastructure outages.",
    stats: [
      { label: "Cluster Nodes", value: "14 Active Regions" },
      { label: "Failure Rate", value: "0 Failures" },
      { label: "Auto-Resolution", value: "5 min cycle" },
    ],
    badge: "OPERATIONS MODE",
  },
  {
    id: "security",
    label: "Security",
    headline: "Real-time AI defense that acts before you even know you're under attack.",
    description:
      "Detect token anomalies, HMAC replay attempts, and unauthorized API key spikes with sub-millisecond automated rate limiting and instant credential isolation.",
    stats: [
      { label: "HMAC Verification", value: "SHA-256 Validated" },
      { label: "Token Inspection", value: "0ms overhead" },
      { label: "Audit Ledger", value: "Cryptographic" },
    ],
    badge: "DEFENSE MODE",
  },
];

// FAQ items for Section //11
const FAQ_ITEMS = [
  {
    id: "faq-1",
    question: "What makes FeexSystems Signal different from standard APM dashboards?",
    answer:
      "Traditional APM dashboards present disconnected, lagging graphs across separate silos. Signal unifies raw telemetry, Git repositories, and runtime models into an authoritative 3D World Model. When an anomaly occurs, it delivers reasoned synthesis anchored to verifiable commit SHAs rather than ambiguous charts.",
  },
  {
    id: "faq-2",
    question: "How fast is the event ingestion pipeline?",
    answer:
      "Our Edge network ingests and analyzes streams at 2.4M+ events per second with sub-second end-to-end latency from event generation to live dashboard visualization.",
  },
  {
    id: "faq-3",
    question: "Does Signal require custom engineering or manual data transformation pipelines?",
    answer:
      "Zero engineering required. With instant connector webhooks for Stripe, Snowflake, PostgreSQL, Slack, and GitHub, Signal parses and aligns schemas automatically using autonomous semantic mappings.",
  },
  {
    id: "faq-4",
    question: "How does the Evidence Fabric ensure verifiable provenance?",
    answer:
      "Every detected entity, node transition, and anomaly is cryptographically tagged with commit SHAs, file paths, repository coordinates, and HMAC SHA-256 signatures, ensuring full traceability without guesswork.",
  },
  {
    id: "faq-5",
    question: "Can I try the 3D Spatial Knowledge Galaxy before deploying?",
    answer:
      "Yes. The 3D Spatial World (/world) and AI Navigator (/navigator) are fully public and accessible directly in your browser without requiring upfront authentication or credit card registration.",
  },
  {
    id: "faq-6",
    question: "What security compliance standards does Signal adhere to?",
    answer:
      "Signal is architected for defense-grade security with SOC 2 Type II assurance, end-to-end TLS 1.3 encryption, ephemeral sandbox execution, and strict role-based access controls.",
  },
];

function TechLogo({ type, className = "size-7" }: { type?: string; className?: string }) {
  if (type === "postgres") {
    return (
      <svg className={`${className} text-white`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.06 14.88c-.37.23-.8.35-1.25.35-.61 0-1.16-.24-1.57-.64-.41-.4-.65-.95-.65-1.56 0-.6.24-1.15.65-1.56.41-.4.96-.64 1.57-.64.45 0 .88.12 1.25.35v3.7zm-2.09-8.4c.3-.3.7-.48 1.15-.48.44 0 .84.18 1.15.48.3.3.48.7.48 1.15 0 .44-.18.84-.48 1.15-.31.3-.71.48-1.15.48-.45 0-.85-.18-1.15-.48-.3-.31-.48-.71-.48-1.15 0-.45.18-.85.48-1.15z" />
      </svg>
    );
  }
  if (type === "github") {
    return (
      <svg className={`${className} text-white`} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    );
  }
  if (type === "docker") {
    return (
      <svg className={`${className} text-white`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.186.186 0 00-.185.186v1.887c0 .102.083.185.185.185zm-2.954-5.43h2.118a.186.186 0 00.186-.186V3.576a.186.186 0 00-.186-.186h-2.118a.186.186 0 00-.186.186v1.886c0 .102.083.186.186.186zm0 2.715h2.118a.186.186 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.186.186 0 00-.186.185v1.887c0 .102.083.186.186.186zm-2.953 0h2.118a.186.186 0 00.186-.186V6.29a.186.186 0 00-.186-.185H8.076a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186zm5.907 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.186.186 0 00-.186.186v1.887c0 .102.083.185.186.185zm-8.86 0h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186H5.123a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185zm2.953 0h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186H8.076a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185zm-5.906 0h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186H2.17a.186.186 0 00-.186.186v1.887c0 .102.083.185.186.185z" />
      </svg>
    );
  }
  return null;
}

export default function Index() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMovement, setActiveMovement] = useState<"connect" | "analyze" | "act">("connect");
  const [activeUseCase, setActiveUseCase] = useState<string>("engineering");
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");
  const [copiedTerminal, setCopiedTerminal] = useState(false);

  const selectedUseCaseData = USE_CASES.find((u) => u.id === activeUseCase) || USE_CASES[0];

  const handleCopyCmd = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTerminal(true);
    setTimeout(() => setCopiedTerminal(false), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#000000] text-white antialiased font-mono selection:bg-white selection:text-black">
      {/* ========================================================================= */}
      {/* GLOBAL TECHNICAL STICKY HEADER                                            */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#121212]/90 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
          {/* Brand Lockup */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-base md:text-lg font-bold tracking-tight text-white hover:text-white/80 transition-colors"
            >
              <span className="size-3 bg-white rounded-none" />
              <span>FEEXSYSTEMS</span>
              <span className="text-white/40 text-xs hidden sm:inline">// SIGNAL</span>
            </Link>
            <span className="hidden lg:inline-block rounded-[10px] border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] text-white/70">
              v2.4 LIVING WORLD
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav
            aria-label="Primary navigation"
            className="hidden xl:flex items-center gap-6 text-xs text-white/70"
          >
            <a href="#problem" className="hover:text-white transition-colors">
              //02 Problem
            </a>
            <a href="#product" className="hover:text-white transition-colors">
              //03 Product
            </a>
            <a href="#solution" className="hover:text-white transition-colors">
              //04 Solution
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              //05 How It Works
            </a>
            <a href="#capabilities" className="hover:text-white transition-colors">
              //06 Capabilities
            </a>
            <a href="#use-cases" className="hover:text-white transition-colors">
              //07 Use Cases
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              //10 Pricing
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              //11 FAQ
            </a>
          </nav>

          {/* Action CTAs & Ecosystem Links */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/projects"
              className="text-xs text-white/70 hover:text-white transition-colors px-2 py-1"
            >
              Projects
            </Link>
            <Link
              to="/omni"
              className="inline-flex items-center gap-1.5 rounded-[10px] border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white hover:bg-white/10 transition-colors"
            >
              <Terminal className="size-3.5 text-white/80" />
              <span>Omni Stage</span>
            </Link>
            <Link
              to="/world"
              className="inline-flex items-center gap-2 rounded-[10px] bg-white px-4 py-1.5 text-xs font-semibold text-black hover:bg-white/90 transition-all shadow-sm"
            >
              <Globe className="size-3.5" />
              <span>Launch 3D</span>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="flex size-10 items-center justify-center rounded-[10px] border border-white/10 bg-[#121212] text-white xl:hidden hover:border-white/30 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-white/10 bg-[#121212] px-6 py-6 text-sm flex flex-col gap-4">
            <div className="flex flex-col gap-3 text-white/80 border-b border-white/10 pb-4">
              <a
                href="#problem"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-white"
              >
                //02 The problem
              </a>
              <a
                href="#product"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-white"
              >
                //03 The product
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-white"
              >
                //05 How it works
              </a>
              <a
                href="#capabilities"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-white"
              >
                //06 Capabilities
              </a>
              <a
                href="#use-cases"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-white"
              >
                //07 Use cases
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-white"
              >
                //10 Pricing
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-white"
              >
                //11 FAQ
              </a>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Link
                to="/world"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-[10px] bg-white py-2.5 text-xs font-semibold text-black"
              >
                <Globe className="size-4" />
                <span>Launch 3D Spatial World</span>
              </Link>
              <Link
                to="/omni"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-[10px] border border-white/20 bg-white/5 py-2.5 text-xs text-white"
              >
                <Terminal className="size-4" />
                <span>Open Omni-Command Stage</span>
              </Link>
              <Link
                to="/projects"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 text-xs text-white/70 hover:text-white"
              >
                Browse Projects Explorer
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 text-xs text-white/70 hover:text-white"
              >
                Sign in to Platform
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 w-full overflow-hidden">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION WITH 3D STIPPLED POINTILLIST SIMULATION                  */}
        {/* ========================================================================= */}
        <section className="relative min-h-[92vh] w-full flex flex-col justify-between overflow-hidden border-b border-white/10 bg-[#000000] pt-12 pb-16">
          {/* Background 3D Monochrome Stippled Scientific Particle Visualization */}
          <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
            <Suspense
              fallback={
                <div className="h-full w-full bg-[#000000] flex items-center justify-center text-white/30 text-xs">
                  [INITIALIZING POINTILLIST SIMULATION...]
                </div>
              }
            >
              <StippledPointillistShape count={9000} showLandscape={true} />
            </Suspense>
          </div>

          {/* Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-[#000000]/60 z-10 pointer-events-none" />

          {/* Hero Content Container */}
          <div className="container relative z-20 mx-auto max-w-7xl px-5 md:px-8 pt-8 md:pt-14 my-auto">
            <div className="max-w-4xl space-y-6">
              {/* Headline Top Tag */}
              <div className="inline-flex items-center gap-2.5 rounded-[10px] border border-white/15 bg-[#121212]/80 px-3.5 py-1.5 text-xs text-white/90 backdrop-blur-md">
                <span className="size-2 rounded-full bg-white animate-pulse" />
                <span className="tracking-wide">// We visualise the invisible</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-normal leading-[1.05] tracking-tight text-white">
                Turning noise <br />
                <span className="text-white/60">into signal</span>
              </h1>

              {/* Subheadline */}
              <p className="max-w-2xl text-base sm:text-lg md:text-xl text-white/60 leading-relaxed">
                Real-time AI defense that acts before you even know you're under attack.
              </p>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  to="/world"
                  className="inline-flex items-center gap-2.5 rounded-[10px] bg-white px-6 py-3.5 text-sm font-semibold text-black hover:bg-white/90 hover:scale-[1.02] transition-all shadow-lg"
                >
                  <Globe className="size-4" />
                  <span>Launch 3D World Model</span>
                </Link>

                <Link
                  to="/omni"
                  className="inline-flex items-center gap-2 rounded-[10px] border border-white/20 bg-[#121212] px-6 py-3.5 text-sm text-white hover:border-white/50 hover:bg-[#1a1a1a] transition-all"
                >
                  <Terminal className="size-4 text-white/80" />
                  <span>Omni-Command Stage</span>
                </Link>

                <Link
                  to="/projects"
                  className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white px-3 py-3 transition-colors"
                >
                  <span>Explore Projects</span>
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Live Telemetry Ticker Ribbon */}
          <div className="container relative z-20 mx-auto max-w-7xl px-5 md:px-8 mt-12">
            <div className="rounded-[20px] border border-white/10 bg-[#121212]/90 p-4 backdrop-blur-md">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="size-2 rounded-full bg-emerald-400" />
                  <div>
                    <span className="text-white/40 block text-[10px]">CONNECTORS</span>
                    <span className="text-white font-medium">23 online · 0 failures</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="size-2 rounded-full bg-white" />
                  <div>
                    <span className="text-white/40 block text-[10px]">THROUGHPUT</span>
                    <span className="text-white font-medium">2.4M events / sec</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="size-2 rounded-full bg-cyan-400" />
                  <div>
                    <span className="text-white/40 block text-[10px]">EDGE LATENCY</span>
                    <span className="text-white font-medium">&lt; 12ms sub-second</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="size-2 rounded-full bg-amber-400" />
                  <div>
                    <span className="text-white/40 block text-[10px]">PROVENANCE</span>
                    <span className="text-white font-medium">SHA-256 HMAC Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* ========================================================================= */}
        {/* 2. SECTION //02 — THE PROBLEM                                             */}
        {/* ========================================================================= */}
        <section id="problem" className="w-full border-b border-white/10 bg-[#0a0a0a] py-24">
          <div className="container mx-auto max-w-7xl px-5 md:px-8">
            <div className="max-w-3xl space-y-4">
              <div className="text-xs tracking-widest text-white/50 uppercase">
                //02 — The problem
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-white">
                Data is everywhere. Clarity is not.
              </h2>
              <p className="text-base sm:text-lg text-white/60 leading-relaxed">
                Your data lives across dashboards, tools, and silos. Teams spend more time searching
                than deciding. By the time insights surface, the moment is gone.
              </p>
            </div>

            {/* 3 Problem Cards */}
            <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  number: "01",
                  title: "Disconnected data sources",
                  desc: "Databases, cloud logs, API gateways, and Slack channels operate in isolation. Without a unified world model, relationships are invisible.",
                  detail: "Fragmented pipelines · Stale schemas · Redundant ETLs",
                },
                {
                  number: "02",
                  title: "Delayed insights",
                  desc: "Batch summaries and manual query queues produce answers hours or days late. When security attacks or revenue drops occur, reactive triage fails.",
                  detail: "Batch lag · Alert fatigue · Missed windows",
                },
                {
                  number: "03",
                  title: "Decision paralysis",
                  desc: "Dozens of conflicting charts across tools force teams into spreadsheet purgatory. Nobody agrees on the canonical truth when it matters most.",
                  detail: "Zero synthesis · Debated metrics · Slower releases",
                },
              ].map((prob, i) => (
                <div
                  key={i}
                  className="rounded-[20px] border border-white/10 bg-[#121212] p-8 flex flex-col justify-between hover:border-white/30 transition-all group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/40">// PROBLEM {prob.number}</span>
                      <AlertTriangle className="size-4 text-white/40 group-hover:text-amber-400 transition-colors" />
                    </div>
                    <h3 className="text-xl font-medium text-white group-hover:text-white transition-colors">
                      {prob.title}
                    </h3>
                    <p className="text-sm text-white/60 leading-relaxed">
                      {prob.desc}
                    </p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-white/10 text-xs text-white/40">
                    {prob.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. SECTION //03 — THE PRODUCT (SHADERNODE 2: HOLOGRAPHIC TOPOLOGY)        */}
        {/* ========================================================================= */}
        <section id="product" className="w-full border-b border-white/10 bg-[#000000] py-24">
          <div className="container mx-auto max-w-7xl px-5 md:px-8">
            <div className="max-w-3xl space-y-4">
              <div className="text-xs tracking-widest text-white/50 uppercase">
                //03 — The product
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-white">
                see what others miss
              </h2>
              <p className="text-base sm:text-lg text-white/60 leading-relaxed">
                From raw inputs to refined insight — visualize your entire data flow in one place.
              </p>
            </div>

            {/* Product Visual & Live Telemetry Stage */}
            <div className="mt-14 rounded-[20px] border border-white/10 bg-[#121212] overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 bg-[#0a0a0a] px-6 py-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-white" />
                  <span className="text-white/80">FEEX // LIVING WORLD DASHBOARD</span>
                </div>
                <div className="flex items-center gap-4 text-white/40">
                  <span>TOPOLOGY: 3D GRAPH</span>
                  <span>EVIDENCE: ANCHORED</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
                {/* Left Product View: 3D Topology ShaderNode 2 + Dashboard Canvas */}
                <div className="lg:col-span-8 p-6 md:p-10 border-b lg:border-b-0 lg:border-r border-white/10 bg-black/40 relative">
                  <div className="relative rounded-[10px] border border-white/10 overflow-hidden bg-black h-72 sm:h-96 w-full">
                    <Suspense
                      fallback={
                        <div className="h-full w-full flex items-center justify-center text-xs text-white/30">
                          [INITIALIZING TOPOLOGY SHADER...]
                        </div>
                      }
                    >
                      <StippledPointillistShape
                        count={4500}
                        showLandscape={false}
                        showBeacons={true}
                        morphScale={1.3}
                        radius={2.1}
                        height="h-full w-full"
                      />
                    </Suspense>
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-2 rounded-[10px] border border-white/15 bg-black/80 px-2.5 py-1 text-[10px] text-white/80 backdrop-blur-md">
                      <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>SHADER // REAL-TIME TOPOLOGY CORE</span>
                    </div>
                  </div>

                  {/* Product Dashboard Visual Reference from Build Inventory */}
                  <div className="mt-6 rounded-[10px] border border-white/10 overflow-hidden bg-black/60 p-2">
                    <img
                      src="https://framerusercontent.com/images/cIJfC7dimK1aQTwW2KPh5aYKkw.png"
                      alt="Signal Unified Product Dashboard"
                      className="w-full rounded-[6px] object-cover opacity-90 hover:opacity-100 transition-opacity"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>

                  {/* Fallback interactive stage overlay */}
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="rounded-[10px] border border-white/10 bg-[#121212] p-3 text-xs">
                      <div className="text-white/40 text-[10px]">TOPOLOGY NODES</div>
                      <div className="text-white font-semibold mt-1">13 Repositories</div>
                    </div>
                    <div className="rounded-[10px] border border-white/10 bg-[#121212] p-3 text-xs">
                      <div className="text-white/40 text-[10px]">AUDIT COMMITS</div>
                      <div className="text-white font-semibold mt-1">3.8M Verified</div>
                    </div>
                    <div className="rounded-[10px] border border-white/10 bg-[#121212] p-3 text-xs col-span-2 sm:col-span-1">
                      <div className="text-white/40 text-[10px]">AI ADAPTERS</div>
                      <div className="text-white font-semibold mt-1">Provider Neutral</div>
                    </div>
                  </div>
                </div>

                {/* Right Interactive Telemetry Console */}
                <div className="lg:col-span-4 p-6 md:p-8 flex flex-col justify-between space-y-6 bg-[#0e0e0e]">
                  <div className="space-y-4">
                    <div className="text-xs text-white/40 tracking-wider uppercase">
                      LIVE SYSTEM FEEDS
                    </div>
                    <h4 className="text-lg font-medium text-white">
                      Full-Stack Visual Topology
                    </h4>
                    <p className="text-xs text-white/60 leading-relaxed">
                      Every entity and edge in FeexSystems is grounded in verifiable commit logs,
                      webhook payloads, and container runtime states.
                    </p>

                    <div className="space-y-2 pt-2">
                      {[
                        { label: "Git Repository Sync", val: "Continuous HMAC", status: "ONLINE" },
                        { label: "Spatial Coordinate Graph", val: "3D Galaxy Core", status: "HEALTHY" },
                        { label: "Evidence Ledger Verification", val: "100% Provenance", status: "VALID" },
                        { label: "Omni Command Channel", val: "SSE Stream Ready", status: "READY" },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-[10px] border border-white/5 bg-[#121212] px-3.5 py-2 text-xs"
                        >
                          <span className="text-white/70">{item.label}</span>
                          <span className="text-white font-semibold text-[10px] bg-white/10 px-2 py-0.5 rounded">
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 space-y-2">
                    <Link
                      to="/world"
                      className="w-full flex items-center justify-center gap-2 rounded-[10px] bg-white py-2.5 text-xs font-semibold text-black hover:bg-white/90 transition-all"
                    >
                      <Globe className="size-3.5" />
                      <span>Inspect 3D Knowledge Galaxy</span>
                    </Link>
                    <Link
                      to="/omni"
                      className="w-full flex items-center justify-center gap-2 rounded-[10px] border border-white/15 bg-white/5 py-2 text-xs text-white hover:bg-white/10 transition-colors"
                    >
                      <Terminal className="size-3.5" />
                      <span>Launch Omni Command</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. SECTION //04 — THE SOLUTION                                            */}
        {/* ========================================================================= */}
        <section id="solution" className="w-full border-b border-white/10 bg-[#0a0a0a] py-24">
          <div className="container mx-auto max-w-7xl px-5 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Text Presentation */}
              <div className="lg:col-span-6 space-y-6">
                <div className="text-xs tracking-widest text-white/50 uppercase">
                  //04 — The solution
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-white whitespace-pre-wrap">
                  one platform.  total clarity
                </h2>
                <p className="text-base sm:text-lg text-white/60 leading-relaxed">
                  Signal unifies your data, analyzes it in real time, and surfaces what actually matters
                  — so your team can move faster with confidence.
                </p>

                <div className="space-y-4 pt-4">
                  {[
                    {
                      title: "Autonomous Integration Fabric",
                      desc: "Zero-engineering connectors wire your databases, message queues, and external APIs with automatic schema harmonization.",
                    },
                    {
                      title: "Sub-Second Neural Anomaly Detection",
                      desc: "Detect statistical spikes, token exhaustion, and silent regressions before customer-facing degradation occurs.",
                    },
                    {
                      title: "Evidence-Backed Action Playbooks",
                      desc: "Every flagged insight contains execution-ready playbooks, Slack triggers, and rollback pointers tied to verified commit SHAs.",
                    },
                  ].map((sol, idx) => (
                    <div
                      key={idx}
                      className="rounded-[10px] border border-white/10 bg-[#121212] p-4 space-y-1 hover:border-white/30 transition-colors"
                    >
                      <div className="text-sm font-medium text-white flex items-center gap-2">
                        <Check className="size-4 text-white" />
                        <span>{sol.title}</span>
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed pl-6">
                        {sol.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Solution Visual / Graphic */}
              <div className="lg:col-span-6">
                <div className="rounded-[20px] border border-white/10 bg-[#121212] overflow-hidden p-3 relative group">
                  <img
                    src="https://framerusercontent.com/images/tRhaUmnYsgp5Gu0bg5sA0mVE.jpg"
                    alt="Aesthetic Nature Solution Landscape"
                    className="w-full h-80 sm:h-96 rounded-[10px] object-cover grayscale contrast-125 opacity-70 group-hover:opacity-90 transition-opacity"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  <div className="absolute inset-3 bg-gradient-to-t from-black via-black/40 to-transparent rounded-[10px] flex flex-col justify-end p-6">
                    <div className="text-xs text-white/50 uppercase tracking-widest">
                      EVIDENCE FABRIC LEDGER
                    </div>
                    <div className="text-xl font-medium text-white mt-1">
                      Deterministic Reality · Zero Hallucination
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <Link
                        to="/evidence"
                        className="inline-flex items-center gap-1.5 text-xs text-black bg-white px-3.5 py-1.5 rounded-[10px] font-semibold hover:bg-white/90 transition-colors"
                      >
                        <span>Audit Evidence Ledger</span>
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. SECTION //05 — HOW IT WORKS                                            */}
        {/* ========================================================================= */}
        <section id="how-it-works" className="w-full border-b border-white/10 bg-[#000000] py-24">
          <div className="container mx-auto max-w-7xl px-5 md:px-8">
            <div className="max-w-3xl space-y-4">
              <div className="text-xs tracking-widest text-white/50 uppercase">
                //05 — how it works
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-white">
                from data to decision in seconds
              </h2>
              <p className="text-base sm:text-lg text-white/60 leading-relaxed">
                Three movements. Connect, analyze, act. No middle ground, no spreadsheet purgatory
              </p>
            </div>

            {/* Movement Selector Tabs */}
            <div className="mt-10 flex flex-wrap gap-2 border-b border-white/10 pb-4">
              {[
                { id: "connect", label: "01-connect", heading: "Wire it up." },
                { id: "analyze", label: "02-analyze", heading: "Surface the signal." },
                { id: "act", label: "03-ACT", heading: "move with conviction" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveMovement(tab.id as any)}
                  className={`rounded-[10px] px-4 py-2 text-xs transition-all ${
                    activeMovement === tab.id
                      ? "bg-white text-black font-semibold"
                      : "border border-white/10 bg-[#121212] text-white/70 hover:text-white"
                  }`}
                >
                  <span className="uppercase">{tab.label}</span> — {tab.heading}
                </button>
              ))}
            </div>

            {/* Three Movements Grid Display with Framer 3D Pointillist Visual Media */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Movement 1: 01-connect */}
              <div
                className={`rounded-[20px] border p-6 md:p-8 flex flex-col justify-between transition-all ${
                  activeMovement === "connect"
                    ? "border-white bg-[#121212] shadow-2xl scale-[1.01]"
                    : "border-white/10 bg-[#0e0e0e] opacity-85 hover:opacity-100"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/50 uppercase tracking-wider">01-connect</span>
                    <Radio className="size-4 text-white" />
                  </div>
                  <h3 className="text-2xl font-medium text-white">Wire it up.</h3>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Integrate your tools, APIs, and data sources instantly. Zero engineering required.
                  </p>

                  {/* Framer 3D Movement Render */}
                  <div className="rounded-[10px] overflow-hidden border border-white/10 bg-black/60 aspect-video relative">
                    <img
                      src={MOVEMENT_ASSETS.connect}
                      alt="3D Shape floating over uncertain landscape - Wire it up"
                      className="w-full h-full object-cover grayscale contrast-125 opacity-80 hover:opacity-100 transition-opacity"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                    <div className="absolute bottom-2 left-2 text-[10px] bg-black/70 px-2 py-0.5 rounded border border-white/10 text-white/70">
                      // 01-CONNECT SIMULATION
                    </div>
                  </div>

                  {/* Connect Terminal Block */}
                  <div className="rounded-[10px] border border-white/10 bg-black p-4 font-mono text-xs space-y-2">
                    <div className="flex items-center justify-between text-white/40 pb-2 border-b border-white/10">
                      <span>▸ initializing connectors...</span>
                      <button
                        onClick={() =>
                          handleCopyCmd(
                            "stripe.events LIVE\nsnowflake.warehouse LIVE\nslack.channels LIVE\npostgres.production LIVE"
                          )
                        }
                        className="hover:text-white transition-colors"
                        title="Copy command"
                      >
                        {copiedTerminal ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                      </button>
                    </div>
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">✓ stripe.events</span>
                        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white font-bold">
                          LIVE
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">✓ snowflake.warehouse</span>
                        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white font-bold">
                          LIVE
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">✓ slack.channels</span>
                        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white font-bold">
                          LIVE
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">✓ postgres.production</span>
                        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white font-bold">
                          LIVE
                        </span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-white/10 text-white/60 text-[11px]">
                      — 23 sources online · 0 failures
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-[11px] text-white/40">
                  Instant webhook receiver with HMAC SHA-256 validation.
                </div>
              </div>

              {/* Movement 2: 02-analyze */}
              <div
                className={`rounded-[20px] border p-6 md:p-8 flex flex-col justify-between transition-all ${
                  activeMovement === "analyze"
                    ? "border-white bg-[#121212] shadow-2xl scale-[1.01]"
                    : "border-white/10 bg-[#0e0e0e] opacity-85 hover:opacity-100"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/50 uppercase tracking-wider">02-analyze</span>
                    <Activity className="size-4 text-white" />
                  </div>
                  <h3 className="text-2xl font-medium text-white">Surface the signal.</h3>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Our AI identifies patterns, anomalies, and opportunities in real time — and tells you
                    why they matter.
                  </p>

                  {/* Framer 3D Movement Render */}
                  <div className="rounded-[10px] overflow-hidden border border-white/10 bg-black/60 aspect-video relative">
                    <img
                      src={MOVEMENT_ASSETS.analyze}
                      alt="3D Shape floating over uncertain landscape - Surface the signal"
                      className="w-full h-full object-cover grayscale contrast-125 opacity-80 hover:opacity-100 transition-opacity"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                    <div className="absolute bottom-2 left-2 text-[10px] bg-black/70 px-2 py-0.5 rounded border border-white/10 text-white/70">
                      // 02-ANALYZE SIMULATION
                    </div>
                  </div>

                  {/* Analyze Terminal Block */}
                  <div className="rounded-[10px] border border-white/10 bg-black p-4 font-mono text-xs space-y-2">
                    <div className="flex items-center justify-between text-white/70 pb-2 border-b border-white/10">
                      <span>sec</span>
                      <span className="text-[11px] text-white/90">scanning · 2.4M events / sec</span>
                    </div>

                    <div className="py-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white/90 font-medium">LIVE</span>
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-bold">
                          ANOM
                        </span>
                      </div>
                      <div className="text-amber-200/90 text-[11px] font-mono">
                        2 anomalies flagged · investigating
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-2/3 bg-white animate-pulse" />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10 text-white/50 text-[11px]">
                      Vectorized pattern matching via pgvector
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-[11px] text-white/40">
                  Sub-millisecond inference with provider-neutral AI adapters.
                </div>
              </div>

              {/* Movement 3: 03-ACT */}
              <div
                className={`rounded-[20px] border p-6 md:p-8 flex flex-col justify-between transition-all ${
                  activeMovement === "act"
                    ? "border-white bg-[#121212] shadow-2xl scale-[1.01]"
                    : "border-white/10 bg-[#0e0e0e] opacity-85 hover:opacity-100"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/50 uppercase tracking-wider">03-ACT</span>
                    <Zap className="size-4 text-white" />
                  </div>
                  <h3 className="text-2xl font-medium text-white">move with conviction</h3>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Turn insights into decisions with clarity and speed. Share, ship, repeat.
                  </p>

                  {/* Framer 3D Movement Render */}
                  <div className="rounded-[10px] overflow-hidden border border-white/10 bg-black/60 aspect-video relative">
                    <img
                      src={MOVEMENT_ASSETS.act}
                      alt="3D Shape floating over uncertain landscape - Move with conviction"
                      className="w-full h-full object-cover grayscale contrast-125 opacity-80 hover:opacity-100 transition-opacity"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                    <div className="absolute bottom-2 left-2 text-[10px] bg-black/70 px-2 py-0.5 rounded border border-white/10 text-white/70">
                      // 03-ACT SIMULATION
                    </div>
                  </div>

                  {/* Act Terminal Block */}
                  <div className="rounded-[10px] border border-white/10 bg-black p-4 font-mono text-xs space-y-2">
                    <div className="flex items-center justify-between text-white/70 pb-2 border-b border-white/10">
                      <span>LIVE</span>
                      <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded font-bold">
                        ANOM
                      </span>
                    </div>

                    <div className="space-y-1 text-white/80 text-[11px]">
                      <div className="text-white font-semibold">revenue.eu_west · spike +28%</div>
                      <div className="text-white/60">→ notified #growth · 2:14pm</div>
                      <div className="text-white/60">→ campaign budget reallocated · 2:17pm</div>
                      <div className="text-white/60">→ playbook executed · 2:19pm</div>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-emerald-400 font-medium text-[11px]">
                      <span>✓ resolved · 5 min cycle</span>
                      <span className="size-2 rounded-full bg-emerald-400" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-[11px] text-white/40">
                  Closed-loop remediation with immutable audit logging.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. SECTION //06 — CAPABILITIES                                            */}
        {/* ========================================================================= */}
        <section id="capabilities" className="w-full border-b border-white/10 bg-[#0a0a0a] py-24">
          <div className="container mx-auto max-w-7xl px-5 md:px-8">
            <div className="max-w-3xl space-y-4">
              <div className="text-xs tracking-widest text-white/50 uppercase">
                //06 — Capabilities
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-white">
                Built for modern data teams.
              </h2>
              <p className="text-base sm:text-lg text-white/60 leading-relaxed">
                Everything you need to move from question to decision — and nothing you don't.
              </p>
            </div>

            {/* 5 Capability Cards in Asymmetrical Grid */}
            <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  num: "/01",
                  title: "Real-time insights",
                  desc: "Always up-to-date data across your entire stack. Sub-second latency from event to dashboard.",
                  icon: Activity,
                },
                {
                  num: "/02",
                  title: "AI predictions",
                  desc: "Spot trends before they happen. Forecasting models tuned per metric, not one-size-fits-all.",
                  icon: Sparkles,
                },
                {
                  num: "/03",
                  title: "Data visualization",
                  desc: "Transform complex data into easy-to-understand visuals. Interactive charts and graphs enhance user engagement.",
                  icon: Layers,
                },
                {
                  num: "/04",
                  title: "Collaboration tools",
                  desc: "Seamlessly share insights with your team. Commenting and tagging features foster collaborative decision-making.",
                  icon: Share2,
                },
                {
                  num: "/05",
                  title: "Custom alerts",
                  desc: "Get notified about critical metrics in real-time. Set thresholds and receive alerts via multiple channels.",
                  icon: Radio,
                },
              ].map((feat, i) => {
                const IconComp = feat.icon;
                return (
                  <div
                    key={i}
                    className={`rounded-[20px] border border-white/10 bg-[#121212] p-8 flex flex-col justify-between hover:border-white/40 transition-all ${
                      i === 4 ? "md:col-span-2 lg:col-span-2" : ""
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/40 font-mono">{feat.num}</span>
                        <IconComp className="size-5 text-white/60" />
                      </div>
                      <h3 className="text-xl font-medium text-white">{feat.title}</h3>
                      <p className="text-sm text-white/60 leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/5 text-[11px] text-white/40 flex items-center justify-between">
                      <span>Enterprise Ready</span>
                      <span className="size-1.5 rounded-full bg-white/40" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. SECTION //07 — USE CASES                                               */}
        {/* ========================================================================= */}
        <section id="use-cases" className="w-full border-b border-white/10 bg-[#000000] py-24">
          <div className="container mx-auto max-w-7xl px-5 md:px-8">
            <div className="max-w-3xl space-y-4">
              <div className="text-xs tracking-widest text-white/50 uppercase">
                //07 — use cases
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-white">
                Designed for teams that move fast.
              </h2>
              <p className="text-base sm:text-lg text-white/60 leading-relaxed">
                Pick a mode. Whatever you're optimizing — Signal speaks your language.
              </p>
            </div>

            {/* Mode Tab Switcher */}
            <div className="mt-10 flex flex-wrap gap-2">
              {USE_CASES.map((uc) => (
                <button
                  key={uc.id}
                  onClick={() => setActiveUseCase(uc.id)}
                  className={`rounded-[10px] px-5 py-2.5 text-xs transition-all ${
                    activeUseCase === uc.id
                      ? "bg-white text-black font-semibold"
                      : "border border-white/10 bg-[#121212] text-white/70 hover:text-white"
                  }`}
                >
                  {uc.label}
                </button>
              ))}
            </div>

            {/* Active Mode Spotlight Panel */}
            <div className="mt-8 rounded-[20px] border border-white/10 bg-[#121212] p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <span className="text-[11px] text-white/50 border border-white/15 bg-white/5 px-2.5 py-1 rounded-[10px]">
                    {selectedUseCaseData.badge}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-medium text-white">
                    {selectedUseCaseData.headline}
                  </h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {selectedUseCaseData.description}
                  </p>
                </div>

                <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
                  {selectedUseCaseData.stats.map((st, idx) => (
                    <div
                      key={idx}
                      className="rounded-[10px] border border-white/10 bg-[#0a0a0a] p-4 text-xs"
                    >
                      <div className="text-white/40 text-[10px]">{st.label}</div>
                      <div className="text-base font-semibold text-white mt-1">{st.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. SECTION //08 — INTEGRATIONS                                            */}
        {/* ========================================================================= */}
        <section id="integrations" className="w-full border-b border-white/10 bg-[#0a0a0a] py-24">
          <div className="container mx-auto max-w-7xl px-5 md:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <div className="text-xs tracking-widest text-white/50 uppercase">
                //08 — Integrations
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-white">
                connect your entire stack
              </h2>
              <p className="text-sm sm:text-base text-white/60">
                Native webhooks, direct database connectors, and zero-configuration API ingestors.
              </p>
            </div>

            {/* Auto-scrolling Marquee Integration Strip */}
            <div className="mt-12 overflow-hidden py-4 border-y border-white/5 bg-black/40 relative">
              <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
              <div className="flex w-max items-center gap-6 animate-marquee">
                {[...INTEGRATIONS, ...INTEGRATIONS, ...INTEGRATIONS].map((tool, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 rounded-[12px] border border-white/10 bg-[#121212] px-4 py-2 text-xs hover:border-white/30 transition-all shrink-0"
                  >
                    {tool.img ? (
                      <img
                        src={tool.img}
                        alt={tool.name}
                        className="size-5 rounded object-contain filter invert opacity-80"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <TechLogo type={tool.type} className="size-5 text-white/80" />
                    )}
                    <span className="font-medium text-white">{tool.name}</span>
                    <span className="text-[9px] text-white/40 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded font-mono">
                      {tool.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Integrations Responsive Grid */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {INTEGRATIONS.map((tool, idx) => (
                <div
                  key={idx}
                  className="rounded-[20px] border border-white/10 bg-[#121212] p-5 flex flex-col justify-between hover:border-white/30 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-4">
                    {tool.img ? (
                      <img
                        src={tool.img}
                        alt={tool.name}
                        className="size-8 rounded object-contain filter invert opacity-80 group-hover:opacity-100 transition-opacity"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <TechLogo type={tool.type} className="size-8 text-white/80 group-hover:opacity-100 transition-opacity" />
                    )}
                    <span className="text-[9px] font-mono text-white/60 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">
                      {tool.status}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{tool.name}</div>
                    <div className="text-[11px] font-mono text-white/40 mt-0.5">{tool.tag}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 9. SECTION //09 — TESTIMONIALS                                            */}
        {/* ========================================================================= */}
        <section id="testimonials" className="w-full border-b border-white/10 bg-[#000000] py-24">
          <div className="container mx-auto max-w-7xl px-5 md:px-8">
            <div className="max-w-3xl space-y-4">
              <div className="text-xs tracking-widest text-white/50 uppercase">
                //09 — Testimonials
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-white">
                What others whisper about the experience.
              </h2>
            </div>

            {/* 6 Testimonial Cards Grid */}
            <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, idx) => (
                <div
                  key={idx}
                  className="rounded-[20px] border border-white/10 bg-[#121212] p-8 flex flex-col justify-between hover:border-white/30 transition-colors"
                >
                  <div className="space-y-4">
                    <div className="text-xs text-white/40">// VERIFIED DEPLOYMENT</div>
                    <p className="text-sm text-white/80 leading-relaxed italic">
                      "{t.quote}"
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {t.avatar && (
                        <img
                          src={t.avatar}
                          alt={t.author}
                          className="size-9 rounded-full object-cover border border-white/20 grayscale"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-white">{t.author}</div>
                        <div className="text-xs text-white/50">{t.role} · {t.company}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-white/60 bg-white/5 border border-white/10 px-2 py-0.5 rounded shrink-0">
                      {t.metrics}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 10. SECTION //10 — PRICING                                                */}
        {/* ========================================================================= */}
        <section id="pricing" className="w-full border-b border-white/10 bg-[#0a0a0a] py-24">
          <div className="container mx-auto max-w-7xl px-5 md:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl space-y-4">
                <div className="text-xs tracking-widest text-white/50 uppercase">
                  //10 — Pricing
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-white">
                  flexible pricing
                </h2>
                <p className="text-base text-white/60">
                  Your questions, answered with clarity. Scale seamlessly from solo builder to multi-region fleet.
                </p>
              </div>

              {/* Monthly vs Annual Toggle */}
              <div className="flex items-center gap-3 rounded-[10px] border border-white/10 bg-[#121212] p-1.5 text-xs">
                <button
                  onClick={() => setBillingPeriod("monthly")}
                  className={`rounded-[8px] px-4 py-1.5 transition-colors ${
                    billingPeriod === "monthly" ? "bg-white text-black font-semibold" : "text-white/60"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingPeriod("annual")}
                  className={`rounded-[8px] px-4 py-1.5 transition-colors ${
                    billingPeriod === "annual" ? "bg-white text-black font-semibold" : "text-white/60"
                  }`}
                >
                  Annual <span className="text-emerald-400 font-bold ml-1">-20%</span>
                </button>
              </div>
            </div>

            {/* 3 Pricing Tiers */}
            <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Starter */}
              <div className="rounded-[20px] border border-white/10 bg-[#121212] p-8 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="text-xs text-white/40">// TIER 01</div>
                  <h3 className="text-2xl font-medium text-white">Developer</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-semibold text-white">
                      {billingPeriod === "monthly" ? "$49" : "$39"}
                    </span>
                    <span className="text-xs text-white/50">/ month</span>
                  </div>
                  <p className="text-xs text-white/60">
                    Ideal for individual engineers and small startup prototypes.
                  </p>

                  <div className="space-y-2.5 pt-4 text-xs text-white/70">
                    <div className="flex items-center gap-2">
                      <Check className="size-3.5 text-white" />
                      <span>500k monthly telemetry events</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="size-3.5 text-white" />
                      <span>3 Active Data Connectors</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="size-3.5 text-white" />
                      <span>3D Spatial Knowledge Galaxy</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="size-3.5 text-white" />
                      <span>Community Discord Support</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    to="/register"
                    className="w-full flex items-center justify-center rounded-[10px] border border-white/20 bg-white/5 py-3 text-xs text-white hover:bg-white/10 transition-colors"
                  >
                    Start Free Trial
                  </Link>
                </div>
              </div>

              {/* Pro / Scale (Featured) */}
              <div className="rounded-[20px] border-2 border-white bg-[#141414] p-8 flex flex-col justify-between shadow-2xl relative">
                <div className="absolute -top-3 right-6 rounded-full bg-white text-black px-3 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                  RECOMMENDED
                </div>

                <div className="space-y-4">
                  <div className="text-xs text-white/40">// TIER 02</div>
                  <h3 className="text-2xl font-medium text-white">Scale</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-semibold text-white">
                      {billingPeriod === "monthly" ? "$199" : "$159"}
                    </span>
                    <span className="text-xs text-white/50">/ month</span>
                  </div>
                  <p className="text-xs text-white/60">
                    For fast-moving data teams requiring continuous anomaly defense.
                  </p>

                  <div className="space-y-2.5 pt-4 text-xs text-white/90">
                    <div className="flex items-center gap-2">
                      <Check className="size-3.5 text-white" />
                      <span>50M monthly telemetry events</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="size-3.5 text-white" />
                      <span>Unlimited Integrations & Webhooks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="size-3.5 text-white" />
                      <span>AI Anomaly Detection & Reasoning</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="size-3.5 text-white" />
                      <span>Omni-Command Stage Orchestration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="size-3.5 text-white" />
                      <span>Cryptographic Evidence Ledger</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    to="/register"
                    className="w-full flex items-center justify-center rounded-[10px] bg-white py-3 text-xs font-semibold text-black hover:bg-white/90 transition-all shadow-md"
                  >
                    Deploy Scale Tier
                  </Link>
                </div>
              </div>

              {/* Enterprise */}
              <div className="rounded-[20px] border border-white/10 bg-[#121212] p-8 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="text-xs text-white/40">// TIER 03</div>
                  <h3 className="text-2xl font-medium text-white">Enterprise</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-semibold text-white">Custom</span>
                  </div>
                  <p className="text-xs text-white/60">
                    Dedicated VPC peering, custom AI fine-tuning, and SOC 2 Type II assurance.
                  </p>

                  <div className="space-y-2.5 pt-4 text-xs text-white/70">
                    <div className="flex items-center gap-2">
                      <Check className="size-3.5 text-white" />
                      <span>Billion+ event scale & streaming</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="size-3.5 text-white" />
                      <span>Dedicated Edge Cluster Nodes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="size-3.5 text-white" />
                      <span>Custom LLM Adapter Training</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="size-3.5 text-white" />
                      <span>24/7 Dedicated Architect Support</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <a
                    href="mailto:engineering@feexsystems.codes"
                    className="w-full flex items-center justify-center rounded-[10px] border border-white/20 bg-white/5 py-3 text-xs text-white hover:bg-white/10 transition-colors"
                  >
                    Contact Enterprise
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 11. SECTION //11 — FAQ ACCORDION                                          */}
        {/* ========================================================================= */}
        <section id="faq" className="w-full border-b border-white/10 bg-[#000000] py-24">
          <div className="container mx-auto max-w-7xl px-5 md:px-8">
            <div className="max-w-3xl space-y-4">
              <div className="text-xs tracking-widest text-white/50 uppercase">
                //11 — FAQ
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-white">
                Your questions, answered.
              </h2>
              <p className="text-base text-white/60">
                Everything you need to know about getting started with SecureBase and what to expect
                from day one.
              </p>
            </div>

            {/* Radix Accordion Component */}
            <div className="mt-14 max-w-4xl">
              <Accordion type="single" collapsible className="w-full space-y-4">
                {FAQ_ITEMS.map((item) => (
                  <AccordionItem
                    key={item.id}
                    value={item.id}
                    className="rounded-[20px] border border-white/10 bg-[#121212] px-6 py-2"
                  >
                    <AccordionTrigger className="text-left text-sm md:text-base font-medium text-white hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-xs md:text-sm text-white/60 leading-relaxed pt-2">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 12. FINAL CALL TO ACTION BLOCK (WITH SHADERNODE 3)                       */}
        {/* ========================================================================= */}
        <section className="w-full bg-[#0a0a0a] py-28 relative overflow-hidden border-b border-white/10">
          {/* Background 3D Monochrome Stippled Scientific Particle Simulation (ShaderNode 3) */}
          <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
            <Suspense
              fallback={
                <div className="h-full w-full bg-[#0a0a0a] flex items-center justify-center text-white/30 text-xs">
                  [INITIALIZING POINTILLIST SIMULATION...]
                </div>
              }
            >
              <StippledPointillistShape
                count={5500}
                showLandscape={true}
                showBeacons={false}
                morphScale={1.2}
                radius={2.5}
                height="h-full w-full"
              />
            </Suspense>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a] z-0 pointer-events-none" />

          <div className="container mx-auto max-w-7xl px-5 md:px-8 relative z-10 text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 rounded-[10px] border border-white/15 bg-[#121212]/90 backdrop-blur-md px-3 py-1 text-xs text-white/70">
                <span className="size-2 rounded-full bg-white animate-pulse" />
                <span>CANONICAL WORLD MODEL ACTIVE</span>
              </div>

              <h2 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white">
                From data to decision. <br />
                <span className="text-white/60">In seconds.</span>
              </h2>

              <p className="text-base sm:text-lg text-white/60 leading-relaxed">
                Step into the living spatial knowledge universe. Discover relationships, query
                evidence provenance, and deploy autonomous telemetry with zero engineering friction.
              </p>

              <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/world"
                  className="inline-flex items-center gap-2.5 rounded-[10px] bg-white px-8 py-4 text-sm font-semibold text-black hover:bg-white/90 hover:scale-[1.02] transition-all shadow-xl"
                >
                  <Globe className="size-4" />
                  <span>Launch 3D World Model</span>
                </Link>

                <Link
                  to="/omni"
                  className="inline-flex items-center gap-2 rounded-[10px] border border-white/20 bg-[#121212]/90 backdrop-blur-md px-8 py-4 text-sm text-white hover:bg-[#1a1a1a] transition-all"
                >
                  <Terminal className="size-4 text-white/80" />
                  <span>Open Omni-Command Stage</span>
                </Link>

                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 rounded-[10px] border border-white/10 px-6 py-4 text-sm text-white/70 hover:text-white transition-colors"
                >
                  <span>Browse Projects</span>
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* 13. GLOBAL TECHNICAL FOOTER                                               */}
      {/* ========================================================================= */}
      <footer className="w-full border-t border-white/10 bg-[#000000] py-16 text-xs text-white/50">
        <div className="container mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
            {/* Brand column */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2 text-base font-bold text-white tracking-tight">
                <span className="size-2.5 bg-white" />
                <span>FEEXSYSTEMS</span>
              </div>
              <p className="text-xs text-white/60 max-w-sm leading-relaxed">
                Evidence-backed developer platform turning the GitHub ecosystem into an explorable
                Living World Model.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-white/40">
                <span className="size-2 rounded-full bg-emerald-400" />
                <span>All systems operational · 99.999% SLA</span>
              </div>
            </div>

            {/* Platform links */}
            <div className="space-y-3">
              <div className="text-white font-semibold text-xs tracking-wider uppercase">
                Platform
              </div>
              <ul className="space-y-2">
                <li>
                  <Link to="/world" className="hover:text-white transition-colors">
                    3D Spatial World
                  </Link>
                </li>
                <li>
                  <Link to="/projects" className="hover:text-white transition-colors">
                    Projects Explorer
                  </Link>
                </li>
                <li>
                  <Link to="/navigator" className="hover:text-white transition-colors">
                    AI Navigator
                  </Link>
                </li>
                <li>
                  <Link to="/omni" className="hover:text-white transition-colors">
                    Omni-Command Stage
                  </Link>
                </li>
                <li>
                  <Link to="/evidence" className="hover:text-white transition-colors">
                    Evidence Fabric
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources links */}
            <div className="space-y-3">
              <div className="text-white font-semibold text-xs tracking-wider uppercase">
                Resources
              </div>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://github.com/FeexSystems"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    GitHub Organization
                  </a>
                </li>
                <li>
                  <a href="/health" target="_blank" className="hover:text-white transition-colors">
                    System Health
                  </a>
                </li>
                <li>
                  <a href="/api/ping" target="_blank" className="hover:text-white transition-colors">
                    Ecosystem Ping
                  </a>
                </li>
                <li>
                  <Link to="/login" className="hover:text-white transition-colors">
                    Platform Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-white transition-colors">
                    Create Account
                  </Link>
                </li>
              </ul>
            </div>

            {/* Ecosystem Projects */}
            <div className="space-y-3">
              <div className="text-white font-semibold text-xs tracking-wider uppercase">
                Ecosystem
              </div>
              <ul className="space-y-2 text-white/40">
                <li>Persona Digital OS</li>
                <li>Yurrheeler Med Advisor</li>
                <li>KappaXchangeFin</li>
                <li>3WM SONIK Labs</li>
                <li>HoloKai Systems</li>
              </ul>
            </div>
          </div>

          <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/40">
            <div>© 2026 FEEXSYSTEMS. Build better systems faster. All rights reserved.</div>
            <div className="flex items-center gap-6">
              <a href="#terms" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#trust" className="hover:text-white transition-colors">
                Trust Center
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
