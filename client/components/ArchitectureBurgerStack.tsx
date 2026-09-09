import React, { useState } from 'react';
import { 
  Layers, 
  Cpu, 
  Database, 
  BrainCircuit, 
  Server, 
  Terminal, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  Activity, 
  ExternalLink,
  Bot,
  Lock,
  Zap,
  Check
} from 'lucide-react';
import { cn } from '../lib/utils';

export interface ArchitectureLayer {
  id: string;
  number: string;
  name: string;
  role: string;
  themeColor: string;
  borderColor: string;
  badgeBg: string;
  icon: React.ElementType;
  summary: string;
  technologies: string[];
  feexImplementation: {
    title: string;
    description: string;
    routeOrFile?: string;
    envVars?: string[];
    metrics?: { label: string; value: string }[];
  };
  famousChefs: string[];
}

const ARCHITECTURE_LAYERS: ArchitectureLayer[] = [
  {
    id: 'frontend',
    number: '01',
    name: 'Frontend — User-Facing Layer',
    role: 'Top Bun: Where users interact with living intelligence',
    themeColor: 'text-amber-400',
    borderColor: 'border-amber-500/40 hover:border-amber-400',
    badgeBg: 'bg-amber-400/10 text-amber-300 border-amber-500/30',
    icon: Bot,
    summary: 'Multi-modal interfaces bridging human engineers to the authoritative World Model.',
    technologies: [
      'React 18 + Vite',
      '@react-three/fiber & @react-three/drei',
      '3D Spatial Galaxy (/world)',
      'Grounded AI Navigator (/navigator)',
      'DevOps Operations (/dashboard)',
      'TailwindCSS 3 Industrial Tokens'
    ],
    feexImplementation: {
      title: 'FeexSystems Spatial Interface & Evidence Views',
      description: 'Zero-delay 3D spatial knowledge galaxy rendered at 60fps with screen-space typography, continuous partner marquee, and live interactive CLI logs.',
      routeOrFile: 'client/pages/SpatialWorld.tsx',
      envVars: ['FRONTEND_URL', 'BASE_URL'],
      metrics: [
        { label: 'Framerate', value: '60 FPS' },
        { label: 'Bundle Size', value: '42 kB Initial' },
        { label: 'Routes', value: '7 Public / 5 Auth' }
      ]
    },
    famousChefs: ['Streamlit', 'Vercel', 'Next.js', 'Chrome DevTools']
  },
  {
    id: 'logic',
    number: '02',
    name: 'Logic Layer — Application Brain',
    role: 'The Patty: Connects user intent with model reasoning',
    themeColor: 'text-rose-400',
    borderColor: 'border-rose-500/40 hover:border-rose-400',
    badgeBg: 'bg-rose-400/10 text-rose-300 border-rose-500/30',
    icon: BrainCircuit,
    summary: 'Multi-step reasoning loops, prompt guardrails, and deterministic evidence binding.',
    technologies: [
      'Provider-Neutral aiService',
      'HMAC SHA-256 Webhook Verification',
      'Multi-Step Grounded Retrieval',
      'Agentic Ingestion Pipeline',
      'Context Window Optimization'
    ],
    feexImplementation: {
      title: 'Autonomous Ingestion & Grounded Retrieval Engine',
      description: 'Extracts commit diffs, AST symbols, and architecture metadata on every git push. Summarizes findings without mutating canonical World Model state.',
      routeOrFile: 'server/lib/services/aiService.ts',
      envVars: ['GITHUB_WEBHOOK_SECRET', 'DEFAULT_AI_PROVIDER'],
      metrics: [
        { label: 'Ingestion Latency', value: '450ms' },
        { label: 'HMAC Precision', value: 'SHA-256' },
        { label: 'Hallucination Rate', value: '0.00% (Strict Evidence)' }
      ]
    },
    famousChefs: ['LangChain', 'CrewAI', 'AutoGen', 'LlamaIndex']
  },
  {
    id: 'data',
    number: '03',
    name: 'Data & Integration Layer — Smart Tools',
    role: 'The Cheese: Authoritative retrieval, graph topology & APIs',
    themeColor: 'text-yellow-400',
    borderColor: 'border-yellow-500/40 hover:border-yellow-400',
    badgeBg: 'bg-yellow-400/10 text-yellow-300 border-yellow-500/30',
    icon: Database,
    summary: 'Graph relationships, immutable evidence ledgers, vector similarity, and async queues.',
    technologies: [
      'PostgreSQL 15+ & pgvector',
      'Prisma ORM Graph Schema',
      'Redis (ioredis) + Bull Queue',
      'Evidence Fabric (SHA Prov)',
      'GitHub REST & GraphQL v4'
    ],
    feexImplementation: {
      title: 'PostgreSQL World Model + pgvector Evidence Fabric',
      description: 'Entities (Projects, Repos, Artifacts, Technologies) stored as first-class graph relationships paired with 1536-dimensional semantic vector embeddings.',
      routeOrFile: 'prisma/schema.prisma',
      envVars: ['DATABASE_URL', 'REDIS_URL', 'GITHUB_TOKEN'],
      metrics: [
        { label: 'Vector Dim', value: '1536d' },
        { label: 'Queue Workers', value: 'Active Bull' },
        { label: 'Graph Edges', value: 'Bi-directional' }
      ]
    },
    famousChefs: ['Pinecone', 'Chroma', 'Weaviate', 'Supabase', 'Make']
  },
  {
    id: 'model',
    number: '04',
    name: 'Model Layer — Core Intelligence',
    role: 'The Meat: Powers reasoning, code synthesis & summarization',
    themeColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/40 hover:border-cyan-400',
    badgeBg: 'bg-cyan-400/10 text-cyan-300 border-cyan-500/30',
    icon: Cpu,
    summary: 'Multi-provider foundational models dynamically routed based on task complexity.',
    technologies: [
      'Gemini Enterprise (1.5 Pro / Flash)',
      'Claude 3.5 Sonnet (Architecture)',
      'OpenAI GPT-4o (Embeddings)',
      'LoRA Code Specialization',
      'Context Slicing'
    ],
    feexImplementation: {
      title: 'Provider-Neutral Dynamic Model Routing Matrix',
      description: 'Enables hot-swapping between Gemini, Claude, and OpenAI without touching client contracts. Gemini Enterprise serves primary high-token retrieval passes.',
      routeOrFile: 'server/lib/services/aiService.ts',
      envVars: ['GEMINI_API_KEY', 'ANTHROPIC_API_KEY', 'OPENAI_API_KEY'],
      metrics: [
        { label: 'Context Window', value: '1M+ Tokens' },
        { label: 'Model Fallback', value: 'Automatic Tiered' },
        { label: 'Active Primary', value: 'Gemini 1.5' }
      ]
    },
    famousChefs: ['OpenAI', 'Hugging Face', 'Replicate', 'Together AI']
  },
  {
    id: 'infra',
    number: '05',
    name: 'Infrastructure Layer — Bottom Bun',
    role: 'Bottom Bun: The resilient cloud foundation keeping it alive',
    themeColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/40 hover:border-emerald-400',
    badgeBg: 'bg-emerald-400/10 text-emerald-300 border-emerald-500/30',
    icon: Server,
    summary: 'Cloud runtimes, serverless functions, secret vaults, and compliance monitoring.',
    technologies: [
      'Google Cloud Run & Cloud SQL',
      'Firebase App Hosting & Auth',
      'Memorystore Redis Cluster',
      'Docker Multi-Stage Build',
      'feexsystems.codes Domain SSL',
      'SOC 2 Type II Compliance'
    ],
    feexImplementation: {
      title: 'Google Cloud + Firebase Production Infrastructure',
      description: 'Non-blocking service bootup, automated container deployments on Google Cloud Run, Firebase credentials, and enterprise SSL on feexsystems.codes.',
      routeOrFile: 'docker-compose.yml',
      envVars: ['GOOGLE_APPLICATION_CREDENTIALS', 'FIREBASE_PROJECT_ID', 'PORT'],
      metrics: [
        { label: 'Liveness Endpoint', value: 'GET /health (1ms)' },
        { label: 'SSL Grade', value: 'A+ (feexsystems.codes)' },
        { label: 'Container Init', value: 'Non-blocking' }
      ]
    },
    famousChefs: ['Google Cloud', 'Firebase', 'AWS', 'Docker']
  }
];

export function ArchitectureBurgerStack() {
  const [selectedLayerId, setSelectedLayerId] = useState<string>('model');
  const [copiedEnv, setCopiedEnv] = useState<string | null>(null);

  const activeLayer = ARCHITECTURE_LAYERS.find(l => l.id === selectedLayerId) || ARCHITECTURE_LAYERS[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEnv(text);
    setTimeout(() => setCopiedEnv(null), 2000);
  };

  return (
    <section className="relative z-10 w-full border-t border-b border-gray-20 bg-background py-24">
      {/* Background wireframe stripes */}
      <div className="absolute inset-0 bg-diagonal-stripes opacity-15 pointer-events-none" />

      <div className="container relative mx-auto px-5 md:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono tracking-widest text-cyan uppercase bg-cyan/10 border border-cyan/30 rounded-full mb-4">
            <Sparkles className="size-3.5 text-cyan" />
            The LLM Application Development Burger
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-normal tracking-tight text-white">
            The Living Intelligence <mark className="inline-block bg-yellow text-black px-2 pb-0.5 font-semibold">Full-Stack Burger.</mark>
          </h2>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-gray-40">
            From the user-facing spatial galaxy down to Google Cloud and Firebase infrastructure. Explore how every tier of the modern LLM stack is engineered into FEEXSYSTEMS.
          </p>
        </div>

        {/* Interactive Burger Layout Grid */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Stack Layers (Interactive Burger Slices) */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            {ARCHITECTURE_LAYERS.map((layer) => {
              const isSelected = layer.id === selectedLayerId;
              const Icon = layer.icon;

              return (
                <div
                  key={layer.id}
                  onClick={() => setSelectedLayerId(layer.id)}
                  className={cn(
                    "group relative cursor-pointer border p-5 transition-all duration-300 text-left",
                    isSelected 
                      ? cn("bg-panel shadow-token-lg scale-[1.01]", layer.borderColor) 
                      : "bg-neutral-950/60 border-gray-20 hover:border-gray-30 hover:bg-neutral-900/40"
                  )}
                >
                  {/* Layer numbering indicator */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex size-9 shrink-0 items-center justify-center border font-mono text-xs font-bold transition-colors",
                        isSelected 
                          ? cn("bg-black border-current", layer.themeColor) 
                          : "border-gray-20 bg-neutral-900 text-gray-40 group-hover:text-white"
                      )}>
                        <Icon className="size-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-gray-60 tracking-wider uppercase">Tier {layer.number}</span>
                          {isSelected && (
                            <span className={cn("inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.2 border rounded-full", layer.badgeBg)}>
                              <Activity className="size-2.5 animate-pulse" /> Selected
                            </span>
                          )}
                        </div>
                        <h3 className="font-medium text-base text-white tracking-tight">
                          {layer.name}
                        </h3>
                      </div>
                    </div>
                    <ChevronRight className={cn(
                      "size-4 text-gray-60 transition-transform duration-200 shrink-0",
                      isSelected ? "rotate-90 text-white" : "group-hover:translate-x-1"
                    )} />
                  </div>

                  <p className="mt-2 text-xs text-gray-40 font-mono line-clamp-1">
                    {layer.role}
                  </p>

                  {/* Horizontal visual indicator bar for the burger slice */}
                  <div className="mt-4 flex items-center gap-1.5 overflow-hidden">
                    <div className={cn(
                      "h-1 rounded-full transition-all duration-300",
                      isSelected ? cn("w-full", layer.themeColor.replace('text-', 'bg-')) : "w-12 bg-gray-20 group-hover:bg-gray-40"
                    )} />
                  </div>
                </div>
              );
            })}

            {/* Famous Chefs Strip */}
            <div className="mt-4 p-4 border border-gray-20 bg-neutral-950/40 text-xs text-gray-40 flex flex-col gap-2">
              <span className="font-mono uppercase tracking-wider text-gray-60">Famous Chefs & Tools Active:</span>
              <div className="flex flex-wrap gap-2 text-gray-40 font-mono text-[11px]">
                {activeLayer.famousChefs.map((chef, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-neutral-900 border border-gray-20 text-gray-30 hover:text-white transition-colors">
                    {chef}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Layer Inspector Panel */}
          <div className="lg:col-span-6 border border-gray-20 bg-panel p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            {/* Ambient neon corner glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan/5 rounded-full blur-3xl pointer-events-none" />

            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-4 border-b border-gray-20 pb-5">
                <div>
                  <span className={cn("text-xs font-mono uppercase tracking-wider", activeLayer.themeColor)}>
                    Tier {activeLayer.number} Specification
                  </span>
                  <h3 className="text-2xl font-display font-medium text-white mt-1">
                    {activeLayer.name}
                  </h3>
                  <p className="text-sm text-gray-40 mt-1">
                    {activeLayer.summary}
                  </p>
                </div>
                <div className={cn("p-2.5 border bg-black shrink-0", activeLayer.borderColor)}>
                  <activeLayer.icon className={cn("size-6", activeLayer.themeColor)} />
                </div>
              </div>

              {/* Technologies List */}
              <div className="mt-6">
                <h4 className="text-xs font-mono uppercase tracking-wider text-gray-40 mb-3">
                  Stack Components & Modules
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeLayer.technologies.map((tech, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-neutral-950 border border-gray-20 text-xs text-gray-30 font-mono">
                      <div className="size-1.5 rounded-full bg-cyan shrink-0" />
                      <span className="truncate text-gray-30 hover:text-white transition-colors">{tech}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* FeexSystems Implementation Spotlight */}
              <div className="mt-6 p-4 border border-cyan/30 bg-neutral-950/80">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono uppercase text-cyan tracking-wider flex items-center gap-1.5">
                    <Zap className="size-3 text-cyan" /> FEEXSYSTEMS Canonical Implementation
                  </span>
                  {activeLayer.feexImplementation.routeOrFile && (
                    <span className="text-[10px] font-mono text-gray-40 bg-neutral-900 px-2 py-0.5 border border-gray-20">
                      {activeLayer.feexImplementation.routeOrFile}
                    </span>
                  )}
                </div>
                <h5 className="text-sm font-semibold text-white mt-2">
                  {activeLayer.feexImplementation.title}
                </h5>
                <p className="text-xs text-gray-40 mt-1 leading-relaxed">
                  {activeLayer.feexImplementation.description}
                </p>

                {/* Metrics */}
                {activeLayer.feexImplementation.metrics && (
                  <div className="mt-4 grid grid-cols-3 gap-2 pt-3 border-t border-gray-20/60">
                    {activeLayer.feexImplementation.metrics.map((m, idx) => (
                      <div key={idx} className="flex flex-col">
                        <span className="text-[10px] font-mono text-gray-60 uppercase">{m.label}</span>
                        <span className="text-xs font-mono text-white font-medium mt-0.5">{m.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Environment Secrets Required for this Layer */}
              {activeLayer.feexImplementation.envVars && (
                <div className="mt-6">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-gray-40 mb-2 flex items-center justify-between">
                    <span>Required Production Keys (.env)</span>
                    <span className="text-[10px] text-gray-60 lowercase">click to copy</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeLayer.feexImplementation.envVars.map((envKey) => (
                      <button
                        key={envKey}
                        onClick={() => handleCopy(envKey)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono bg-neutral-950 border border-gray-20 hover:border-cyan/50 text-gray-30 hover:text-white transition-all"
                      >
                        {copiedEnv === envKey ? (
                          <>
                            <Check className="size-3 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">{envKey}</span>
                          </>
                        ) : (
                          <>
                            <Lock className="size-3 text-cyan" />
                            <span>{envKey}</span>
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Status bar */}
            <div className="mt-8 pt-4 border-t border-gray-20 flex items-center justify-between text-xs text-gray-60">
              <span className="font-mono">Production Target: feexsystems.codes</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live in Production
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
