# FEEXSYSTEMS · Brand Assets Library & Design System Specification
### Living Engineering Intelligence · Autonomous World Models · Persona OS
**Version:** 3.4.0 (2026 Release)  
**Classification:** Canonical Identity & Systems Asset Framework  
**Core Domain:** `feexsystems.codes` · `feexsystems.tech`

---

## 1. Brand Philosophy & Core Identity

FEEXSYSTEMS is not a static tech brand or traditional design portfolio; it is a **living operating environment for the future of systems**. The visual identity embodies rigorous computational architecture, sovereign data provenance, and spatial machine-human symbiosis.

### The Canonical Axioms
* **Architectural, not decorative:** Every line, grid coordinate, and lumen serves navigational or evidentiary purpose.
* **Graph, not list:** Visual relationships are networked, multidimensional, and interconnected.
* **Evidence, not claims:** Grounded aesthetic—telemetry badges, commit SHAs, and mathematical clarity over marketing superlatives.
* **Living substrate:** Dynamic states (pulsing signals, synchronized twins, spectral telemetry) reflect real-time runtime truth.

```
          [ CANONICAL TRUTH ]
              World Model
                   │
    ┌──────────────┴──────────────┐
    ▼                             ▼
[ RUNTIME STATE ]        [ REASONING ENGINE ]
  Digital Twin             Hybrid AI Models
    │                             │
    └──────────────┬──────────────┘
                   ▼
          [ SPATIAL INTERFACE ]
          Planetary Persona OS
```

---

## 2. The Master Mark: Anatomy & Geometry

The FEEXSYSTEMS mark is an orthographic synthesis of a **hyper-dimensional coordinate node**, a **closed-loop feedback lattice**, and the letterforms **F** and **X**.

### 2.1 Geometric Grid & Proportions
* **Base Aspect Ratio:** $1:1$ (Master Glyph) and $4.5:1$ (Horizontal Platform Lockup).
* **Grid Unit:** $16 \times 16$ modular matrix with $45^\circ$ isometric cutaways.
* **Concentric Orbital Arc:** Outer sensor circumference angled at $137.5^\circ$ (golden angle telemetry).
* **Clearance Enclosure:** Minimum buffer zone equals $1.5\times$ the glyph core width ($1.5X$).

```
        ┌───────────── 16u ─────────────┐
     ┌  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ┐
     │  ·  ·  ·  ·  ┌──────────────────┐  ·  ·  ·  ·  ·  │
     │  ·  ·  ·  ·  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │  ·  ·  ·  ·  ·  │
     │  ·  ·  ·  ·  │  ▓▓  ┌───────────┘  ·  ·  ·  ·  ·  │
     │  ·  ·  ·  ·  │  ▓▓  │  ·  ·  ·  ·  ·  ·  ·  ·  ·  │
 16u │  ·  ·  ·  ·  │  ▓▓  └───────────┐  ·  ·  ·  ·  ·  │
     │  ·  ·  ·  ·  │  ▓▓▓▓▓▓▓▓▓▓▓▓    │  ·  ·  ·  ·  ·  │
     │  ·  ·  ·  ·  │  ▓▓  ┌───────────┘  ·  ·  ·  ·  ·  │
     │  ·  ·  ·  ·  │  ▓▓  │  ·  ·  ·  ·  ·  ·  ·  ·  ·  │
     │  ·  ·  ·  ·  │  ▓▓  │  ·  ·  [X-NODE CORE]  ·  ·  │
     │  ·  ·  ·  ·  │  ▓▓  │  ·  ·  ·  ·  ·  ·  ·  ·  ·  │
     └  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ┘
```

### 2.2 Production SVG: The Master Glyph (`feex-core-glyph.svg`)

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none">
  <defs>
    <!-- Core Linear Gradients -->
    <linearGradient id="feexCoreGrad" x1="16" y1="16" x2="112" y2="112" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#00F5D4" />
      <stop offset="50%" stop-color="#0066FF" />
      <stop offset="100%" stop-color="#7B2CBF" />
    </linearGradient>
    <linearGradient id="feexAccentGrad" x1="16" y1="64" x2="112" y2="64" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#80E5FF" />
    </linearGradient>
    <!-- Sensor Ring Glow Filter -->
    <filter id="telemetryGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Ground Plane Sensor Grid / Hex Base -->
  <circle cx="64" cy="64" r="58" stroke="#121826" stroke-width="1.5" stroke-dasharray="2 4" />
  <circle cx="64" cy="64" r="48" stroke="#1F293D" stroke-width="1" />

  <!-- Dynamic World Model Node Connectors -->
  <path d="M64 8 L64 24 M64 104 L64 120 M8 64 L24 64 M104 64 L120 64" 
        stroke="#00F5D4" stroke-opacity="0.4" stroke-width="1.5" stroke-linecap="round"/>

  <!-- Living Geometry: The 'F-X' Hyper-Structure -->
  <path d="M38 32 H90 V44 H52 V58 H84 V70 H52 V96 H38 V32Z" 
        fill="url(#feexCoreGrad)" />
  
  <!-- Vector Provenance Node & Trajectory Line (The X Coordinate Vector) -->
  <path d="M72 70 L96 96 M96 70 L78 88" 
        stroke="url(#feexAccentGrad)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />

  <!-- Active Quantum State Indicator (Central Anchor) -->
  <circle cx="64" cy="64" r="3.5" fill="#00F5D4" filter="url(#telemetryGlow)" />
  <circle cx="96" cy="96" r="2.5" fill="#FFFFFF" />
</svg>
```

---

## 3. Chromatic System & Color Science

The color space is calibrated for ultra-high-contrast OLED displays, WebGL viewports, and deep HUD data layers. It rejects muddy grays in favor of deep space chromas ($0.015$ lightness void) punctuated by hyper-luminescent coherent lasers.

### 3.1 Color Palette Matrix

| Token Name | Hex Code | RGB | HSL | Semantic Role |
| :--- | :--- | :--- | :--- | :--- |
| `void-black` | `#05070A` | $5, 7, 10$ | $216^\circ, 33\%, 3\%$ | Base Spatial Canvas / Background |
| `substrate-obsidian` | `#0A0E17` | $10, 14, 23$ | $222^\circ, 39\%, 6\%$ | Primary Surface / Canvas Panel |
| `substrate-surface` | `#121826` | $18, 24, 38$ | $222^\circ, 36\%, 11\%$ | Elevated HUD Panels / Card Matrix |
| `substrate-border` | `#1E293B` | $30, 41, 59$ | $217^\circ, 33\%, 17\%$ | Wireframe Edges / Dividers |
| `phosphor-cyan` | `#00F5D4` | $0, 245, 212$ | $172^\circ, 100\%, 48\%$ | Canonical Truth / Validated Node / Primary |
| `ion-azure` | `#0066FF` | $0, 102, 255$ | $216^\circ, 100\%, 50\%$ | World Model Edge / Active Query Path |
| `quantum-violet` | `#7B2CBF` | $123, 44, 191$ | $272^\circ, 63\%, 46\%$ | AI Reasoning Substrate / Hybrid Vector |
| `telemetry-amber` | `#FFB703` | $255, 183, 3$ | $43^\circ, 100\%, 51\%$ | Runtime Event / Dynamic Mutation / Alert |
| `synapse-white` | `#F8FAFC` | $248, 250, 252$ | $210^\circ, 40\%, 98\%$ | High-order Text / Sovereign Data Value |
| `signal-dim` | `#64748B` | $100, 116, 139$ | $215^\circ, 16\%, 47\%$ | Secondary Spec / Provenance Hashes |

### 3.2 Tailored Design Tokens (CSS & Tailwind Configuration)

```typescript
// tailwind.brand.config.ts
export const feexBrandTokens = {
  theme: {
    extend: {
      colors: {
        feex: {
          void: '#05070A',
          obsidian: '#0A0E17',
          surface: '#121826',
          border: 'rgba(30, 41, 59, 0.8)',
          cyan: {
            DEFAULT: '#00F5D4',
            glow: 'rgba(0, 245, 212, 0.35)',
            dim: '#009688',
          },
          azure: {
            DEFAULT: '#0066FF',
            glow: 'rgba(0, 102, 255, 0.35)',
          },
          violet: {
            DEFAULT: '#7B2CBF',
            glow: 'rgba(123, 44, 191, 0.4)',
          },
          amber: {
            DEFAULT: '#FFB703',
            dim: 'rgba(255, 183, 3, 0.15)',
          },
          text: {
            primary: '#F8FAFC',
            secondary: '#94A3B8',
            telemetry: '#64748B',
          }
        }
      },
      boxShadow: {
        'feex-hud': '0 0 24px -4px rgba(0, 245, 212, 0.12), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
        'feex-neon': '0 0 16px rgba(0, 245, 212, 0.45)',
        'feex-violet-glow': '0 0 20px rgba(123, 44, 191, 0.35)',
      },
      backgroundImage: {
        'radial-void': 'radial-gradient(circle at 50% 0%, #0F172A 0%, #05070A 75%)',
        'grid-pattern': 'linear-gradient(to right, #121826 1px, transparent 1px), linear-gradient(to bottom, #121826 1px, transparent 1px)',
      }
    }
  }
};
```

---

## 4. Typography Architecture

The typography operates on two concurrent frequency layers: **The Machine Telemetry Channel** and **The Sovereign Systems Channel**.

```
LAYER 1: Precision Monospace ───[ TELEMETRY / RUNTIME / PROVENANCE ]
LAYER 2: Structural Geometric ──[ IDENTITY / NAVIGATION / NARRATIVE ]
```

### 4.1 Type Families
1. **Primary Structural Sans:** `Space Grotesk` or `Syne` (Headers, System Axioms, World Names)
   * *Qualities:* Uncompromising geometric cutaways, modernist architectural rhythm.
2. **Telemetry & Execution Mono:** `JetBrains Mono` or `Fira Code` (Code, SHAs, Edges, Graphs)
   * *Qualities:* High x-height, clear ligatures, optimized tabular alignment.
3. **Readable Interface Sans:** `Inter` (Documentation, Deep Summaries, Extended Analysis)
   * *Qualities:* Neutral, ultra-legible at small spatial projections.

### 4.2 Typographic Hierarchy Scale

| Hierarchy Tag | Font Family | Weight | Size (Desktop) | Tracking | Line Height | Case |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `SYS-DISPLAY-01` | Space Grotesk | 700 Bold | `56px` | `-0.03em` | `1.05` | Sentence / Title |
| `SYS-HEADER-02` | Space Grotesk | 600 Semi | `32px` | `-0.02em` | `1.15` | Sentence |
| `SYS-SUBHEADER-03` | Inter | 500 Med | `18px` | `-0.01em` | `1.40` | Sentence |
| `SYS-BODY` | Inter | 400 Reg | `14px` | `0` | `1.60` | Normal |
| `TELEMETRY-LABEL` | JetBrains Mono | 600 Semi | `11px` | `+0.12em` | `1.0` | ALL CAPS |
| `TELEMETRY-DATA` | JetBrains Mono | 400 Reg | `12px` | `0` | `1.30` | Normal |
| `PROVENANCE-HASH`| JetBrains Mono | 400 Reg | `10px` | `+0.05em` | `1.0` | Lowercase |

---

## 5. Iconographic System: The Living System Glyphs

The icons represent real entities inside the FEEXSYSTEMS World Model graph. They are delivered with crisp $24 \times 24$ viewBox dimensions and continuous $1.5\text{px}$ stroke geometry.

### 5.1 World Model Node (`icon-world-model.svg`)
*Represents canonical ontological ground truth.*
```xml
<svg viewBox="0 0 24 24" fill="none" stroke="#00F5D4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <polygon points="12 2 2 7 12 12 22 7 12 2" />
  <polyline points="2 17 12 22 22 17" />
  <polyline points="2 12 12 17 22 12" />
  <circle cx="12" cy="12" r="1.5" fill="#00F5D4" />
</svg>
```

### 5.2 Digital Twin Indicator (`icon-digital-twin.svg`)
*Represents runtime mirror state separated from reasoning.*
```xml
<svg viewBox="0 0 24 24" fill="none" stroke="#0066FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <rect x="2" y="5" width="8" height="14" rx="2" />
  <rect x="14" y="5" width="8" height="14" rx="2" stroke-dasharray="3 2" />
  <path d="M10 12h4" />
  <circle cx="6" cy="12" r="1" fill="#0066FF" />
  <circle cx="18" cy="12" r="1" fill="#00F5D4" />
</svg>
```

### 5.3 Hybrid Retrieval Engine (`icon-hybrid-retrieval.svg`)
*Represents vector space intersect with symbolic graph traversal.*
```xml
<svg viewBox="0 0 24 24" fill="none" stroke="#7B2CBF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="7" cy="7" r="4" />
  <circle cx="17" cy="17" r="4" />
  <line x1="10" y1="10" x2="14" y2="14" />
  <path d="M14 6h4v4M10 18H6v-4" stroke="#00F5D4" />
</svg>
```

### 5.4 Evidence Fabric SHA Pin (`icon-evidence-provenance.svg`)
*Represents verifiable source provenance (GitHub Webhooks, commit trees).*
```xml
<svg viewBox="0 0 24 24" fill="none" stroke="#FFB703" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="6" cy="6" r="3" />
  <circle cx="18" cy="18" r="3" />
  <path d="M6 9v9a3 3 0 0 0 3 3h6" />
  <path d="M18 9V6" />
  <line x1="6" y1="15" x2="12" y2="15" stroke-dasharray="2 2" />
</svg>
```

---

## 6. System Worlds Identity Matrix

FEEXSYSTEMS orchestrates six sovereign child worlds, each possessing distinct chromas and coordinate designations within the Persona OS constellation:

```
                  [ FEEXSYSTEMS CORE ]
                           │
       ┌───────────┬───────┴───────┬───────────┐
       ▼           ▼               ▼           ▼
   [3WM SONIK] [HOLOKAI]     [YURRHEELER] [KAPPAX]
    AI-Audio    Spatial-3D     Healthcare   Fintech
       │                           │
   [VYRA LABS]             [RENTAL PARADISE]
   Conversation                Discovery
```

| World Identity | Primary Chroma | System Specialization | Spatial Archetype | Status |
| :--- | :--- | :--- | :--- | :--- |
| **3WM SONIK LABS** | `#FF0055` Neon Magenta | AI-native audio / DSP / Neural sound synthesis | Frequency Oscillation Matrix | Active |
| **HoloKai** | `#7928CA` Deep Ultraviolet | Cultural intelligence / 3D World Models | Spatial Geodesic Sphere | Active |
| **Yurrheeler AI** | `#00E5FF` Bio-Electric Cyan | Multi-agent autonomous healthcare intelligence | Hexagonal Synaptic Lattice | Active |
| **KappaXchangefin** | `#00FF66` Terminal Emerald | ISO 20022 Financial infrastructure / Algorithmic exchange | Vector Flow Hyper-Grid | Canonical |
| **VYRA LABS** | `#FF7700` Solar Flare Amber | Conversational interfaces / Intelligent media agents | Waveform Resonance Node | Active |
| **Rental Paradise** | `#0070F3` Oceanic Cobalt | Real-world property discovery / Digital commerce | Orthogonal Floorplan Wireframe | Active |

---

## 7. UI Micro-Components & Telemetry Artifacts

These micro-components form the core of the living dashboard and planetary HUD interfaces.

### 7.1 Provenance Status Pill (`component-provenance.html`)

```html
<div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-feex-surface border border-feex-border text-xs font-mono">
  <span class="relative flex h-2 w-2">
    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-feex-cyan opacity-75"></span>
    <span class="relative inline-flex rounded-full h-2 w-2 bg-feex-cyan"></span>
  </span>
  <span class="text-feex-text-telemetry uppercase tracking-wider text-[10px]">EVIDENCE:</span>
  <span class="text-feex-text-primary font-medium hover:text-feex-cyan cursor-pointer transition-colors">sha-9f82d1c</span>
  <span class="text-feex-text-telemetry">|</span>
  <span class="text-feex-cyan text-[10px]">SYNC 100%</span>
</div>
```

### 7.2 Telemetry HUD Panel (`component-hud-panel.html`)

```html
<div class="relative p-5 rounded-lg bg-[#0A0E17]/90 border border-[#1E293B] backdrop-blur-md shadow-feex-hud">
  <!-- Top Corner Mechanical Accents -->
  <div class="absolute -top-px -left-px w-2 h-2 border-t-2 border-l-2 border-[#00F5D4]"></div>
  <div class="absolute -top-px -right-px w-2 h-2 border-t-2 border-r-2 border-[#00F5D4]"></div>
  <div class="absolute -bottom-px -left-px w-2 h-2 border-b-2 border-l-2 border-[#00F5D4]"></div>
  <div class="absolute -bottom-px -right-px w-2 h-2 border-b-2 border-r-2 border-[#00F5D4]"></div>

  <div class="flex items-center justify-between pb-3 border-b border-[#1E293B]/60 mb-3">
    <div class="flex items-center gap-2">
      <div class="w-1.5 h-1.5 bg-[#00F5D4]"></div>
      <span class="font-mono text-[11px] tracking-widest text-[#94A3B8] uppercase">NODE TELEMETRY · RUNTIME TRUTH</span>
    </div>
    <span class="font-mono text-[10px] text-[#00F5D4] bg-[#00F5D4]/10 px-2 py-0.5 rounded">v3.4-LIVE</span>
  </div>

  <div class="space-y-2 font-mono text-xs">
    <div class="flex justify-between">
      <span class="text-[#64748B]">CANONICAL_ENTITIES</span>
      <span class="text-[#F8FAFC]">1,428 GRAPH_NODES</span>
    </div>
    <div class="flex justify-between">
      <span class="text-[#64748B]">RETRIEVAL_LATENCY</span>
      <span class="text-[#00F5D4]">12.4ms (HNSW_COSINE)</span>
    </div>
    <div class="flex justify-between">
      <span class="text-[#64748B]">ACTIVE_WORLD</span>
      <span class="text-[#FFB703]">KappaXchangefin [ISO 20022]</span>
    </div>
  </div>
</div>
```

---

## 8. Spatial 3D & Shader Design Tokens

When projecting the FEEXSYSTEMS identity into Three.js or WebGL viewports, use the following standardized material and post-processing variables.

```javascript
// feex-three-theme.js
import * as THREE from 'three';

export const FEEX_SPATIAL_CONSTANTS = {
  // Planetary Core Shader Parameters
  coreSphere: {
    radius: 4.2,
    segments: 64,
    material: new THREE.MeshPhysicalMaterial({
      color: 0x05070A,
      emissive: 0x001428,
      roughness: 0.12,
      metalness: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: false
    })
  },

  // Connection Arcs / Relationship Edges
  edgeArcs: {
    colorValid: 0x00F5D4,       // OWNS / IMPLEMENTS
    colorInference: 0x7B2CBF,   // REASONED_PATH
    colorRuntime: 0x0066FF,     // RUNTIME_SYNC
    opacity: 0.45,
    blending: THREE.AdditiveBlending,
    pulseSpeed: 1.8
  },

  // Atmospheric Bloom Post-Processing
  bloomPass: {
    threshold: 0.18,
    strength: 1.45,
    radius: 0.85
  },

  // Starfield Coordinate Grid
  gridSize: 200,
  gridDivisions: 40,
  gridColorCenter: 0x00F5D4,
  gridColorSecondary: 0x121826
};
```

---

## 9. Voice & Lexicon Blueprint

FEEXSYSTEMS uses a distinct linguistic cadence: authoritative, mathematically clear, architectural, and strictly devoid of hollow marketing buzzwords.

### 9.1 Lexicon Table

| Prohibited Superlative | Authorized Engineering Term | Reason |
| :--- | :--- | :--- |
| "Revolutionary AI" | **"Autonomous Model-Backed Substrate"** | Describes mechanism, not emotion. |
| "Fast search" | **"Hybrid Vector-Graph Retrieval ($Top\text{-}K$)"** | Specifies pipeline architecture. |
| "Portfolio projects" | **"Sovereign System Worlds & Artifacts"** | Replaces static list with living ontology. |
| "Showcase" | **"Runtime Operating Projection"** | Reflects dynamic synchronization. |
| "We believe / Our vision" | **"System Axioms / Canonical Constraints"** | Anchors direction in verifiable logic. |

### 9.2 The Three Canonical Boilerplates

#### Micro (X/GitHub Header · 120 Characters)
> `FEEXSYSTEMS: Living Engineering Intelligence. Turning complex architectures into explorable 3D World Models.`

#### Medium (Product Meta / SaaS Landing)
> `FEEXSYSTEMS is an evidence-backed engineering intelligence platform. We unite canonical world models, digital twins, and explainable graph retrieval to turn code ecosystems into living, navigable operating environments.`

#### Structural (Executive / Investor / Technical Whitepaper)
> `FEEXSYSTEMS addresses the friction between code creation and systemic understanding. By decoupling the canonical World Model from reasoning models, and streaming runtime state via digital twins, FEEXSYSTEMS enables continuous, inspectable, and evidence-grounded intelligence across complex software ecosystems.`

---

## 10. Brand Asset Deployment Checklist

When publishing new interfaces, repositories, or documentation under the FEEXSYSTEMS namespace:
- [ ] **Vector Check:** Master Glyph SVGs must use non-scaling strokes (`vector-effect="non-scaling-stroke"`).
- [ ] **Background Contrast:** Primary viewports must maintain `#05070A` as absolute canvas ground.
- [ ] **Evidence Provenance:** Any presented metric must display a verifiable commit SHA, path, or telemetry status indicator.
- [ ] **World Mapping:** Child worlds must use their designated primary chroma (e.g., `#00FF66` for KappaXchangefin, `#7928CA` for HoloKai).
- [ ] **Typography Rigor:** Strict separation between `Space Grotesk` (Headers) and `JetBrains Mono` (Data/Telemetry).