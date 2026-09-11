# FEEXSYSTEMS — Living Engineering Intelligence

**FeexSystems.codes** is the public SaaS experience for FEEXSYSTEMS: an evidence-backed engineering intelligence platform that turns the FeexSystems GitHub ecosystem into an explorable World Model.

> **Building digital worlds, one system at a time.**

## Product model

FEEXSYSTEMS is the application. Projects such as Persona OS, Yurrheeler AI, 3WM Sonik and other FeexSystems repositories are projects/worlds showcased and continuously modeled inside the application.

The canonical pipeline is:

```text
GitHub Organization / Profile
        ↓
Repository Discovery
        ↓
Persistent World Model
        ↓
Evidence Fabric
        ↓
Repository Tree · Artifacts · Technologies · Relationships
        ↓
Webhook + Maintenance · Embeddings
        ↓
Hybrid Navigator Retrieval · Temporal reconstruction
        ↓
Omni-Command (agent → Stage UI) · Voice input
```

The World Model is authoritative. The LLM is an interpreter and reasoning layer; it does not silently create canonical facts.

## MVP capabilities

- SaaS landing experience for FEEXSYSTEMS.CODES
- Public project explorer
- GitHub pinned-project discovery and automated webhook provisioning
- Persistent repository/project records with event history
- Repository tree and artifact discovery (SHA-backed)
- Technology extraction and project → technology relationships
- Incremental GitHub webhook ingestion with HMAC verification
- pgvector embeddings + hybrid graph/vector ranking
- Temporal reconstruction (state at commit / date)
- Autonomous maintenance (re-sync, re-embed, orphan cleanup)
- Grounded Navigator API and public Navigator experience
- **Omni-Command Interface** — Orchestration Contract Stage (graph click-to-focus, CodeViewer, SSE reasoning)
- **Voice navigation** — Web Speech API mic on the Omni command bar (browser-side STT → same pipeline)
- Authentication, dashboard, billing, DevOps and security platform foundations

## Architecture

```text
┌─────────────────────────────────────────────┐
│ EXPERIENCE                                  │
│ Landing · Projects · Navigator · Omni · 3D │
├─────────────────────────────────────────────┤
│ NAVIGATION                                  │
│ Search · Graph · Command Stage · Voice     │
├─────────────────────────────────────────────┤
│ INTELLIGENCE                                │
│ LLM director · Hybrid rank · Orchestration │
├─────────────────────────────────────────────┤
│ WORLD MODEL                                 │
│ Projects · Artifacts · Technologies · Time │
├─────────────────────────────────────────────┤
│ EVIDENCE FABRIC                             │
│ Files · SHAs · URLs · Events · Provenance │
├─────────────────────────────────────────────┤
│ SYNCHRONIZATION                             │
│ Discovery · Webhooks · Maintenance jobs    │
├─────────────────────────────────────────────┤
│ PERSISTENCE                                 │
│ PostgreSQL · Prisma · pgvector · Redis     │
└─────────────────────────────────────────────┘
```

### Canonical principles

1. **Canonical data + model reasoning** — the World Model is authoritative; models interpret it.
2. **Graph, not list** — relationships are first-class information.
3. **Evidence, not claims** — important facts must have traceable implementation evidence.
4. **Provider-neutral intelligence** — model providers can change without replacing the World Model.
5. **Progressive disclosure** — ecosystem → world → repository → artifact → technology → source → evidence.
6. **Spatial meaning** — the 3D interface communicates relationships rather than acting as decoration.
7. **Human + machine** — the Persona is the builder; AI is the navigation and reasoning interface.
8. **Autonomous, not uncontrolled** — mutations follow validation and provenance rules.
9. **Browser as projection** — persistent server state is canonical; client state is a read model/cache.
10. **Agent-driven Stage** — Omni-Command returns an Orchestration Contract; the UI mounts components, it does not invent World Model facts.

## Technology stack

- **Frontend:** React 18, React Router 7, TypeScript, Vite, Tailwind CSS 3, Three.js, React Flow, Zustand, Web Speech API, Radix UI, Lucide Icons
- **Backend:** Express 5, TypeScript
- **Database & Retrieval:** PostgreSQL 15+, Prisma ORM, pgvector, hybrid ranking
- **Cache & Queues:** Redis (ioredis), Bull queue
- **Authentication:** JWT, refresh tokens, RBAC
- **Testing:** Vitest, MSW, Playwright E2E
- **Infrastructure:** Docker / Docker Compose
- **Intelligence:** Gemini / OpenAI Omni director, Zod Orchestration Contract, embeddings

## Project structure

```text
FeexSystems-Living-Intelligence-World/
├── client/                 # SaaS UI, Omni Stage, 3D World
│   ├── components/omni/
│   ├── hooks/useSpeechNavigation.ts
│   └── pages/
├── server/
│   ├── routes/world-model.ts
│   ├── lib/services/       # github-pinned, embedding, hybrid, temporal, webhooks, maintenance, omni
│   └── lib/world-model/    # discovery / sync / retrieve facades
├── shared/                 # Orchestration contract + Zod
├── prisma/
├── docs/
└── docker/
```

## Development

```bash
git clone https://github.com/FeexSystems/FeexSystems-Living-Intelligence-World.git
cd FeexSystems-Living-Intelligence-World
npm install && cp .env.example .env && npm run dev
```

Useful env:

```bash
GEMINI_API_KEY=...          # or OPENAI_API_KEY — Omni + embeddings
GITHUB_TOKEN=...            # sync + webhook provisioning
GITHUB_WEBHOOK_SECRET=...
WORLD_MODEL_WEBHOOK_URL=https://your.host/api/world-model/webhook
WORLD_MODEL_MAINTENANCE_HOURS=6
WORLD_MODEL_MAINTENANCE_ON_BOOT=true
```

### Key UI routes

| Route | Experience |
|-------|------------|
| `/` | Landing |
| `/navigator` | Hybrid grounded Navigator |
| `/omni` | Omni-Command (type or voice) |
| `/omni?q=Show+architecture` | Deep-link auto-execute |
| `/world` | 3D Knowledge Galaxy |
| `/evidence` | Evidence explorer |

### Key World Model APIs

| Method | Path | Purpose |
|--------|------|--------|
| GET/POST | `/api/world-model/navigator` | Hybrid retrieval |
| POST | `/api/world-model/embeddings/reindex` | Rebuild vectors |
| GET | `/api/world-model/temporal/:projectId` | State at commit/date |
| POST | `/api/world-model/webhooks/provision` | Create/update GitHub hooks |
| POST | `/api/world-model/maintenance/run` | Re-sync + cleanup |
| POST | `/api/world-model/omni-command` | Orchestration Contract |
| POST | `/api/world-model/omni-command/stream` | SSE reasoning + result |

## Roadmap

### Phase III — Living Engineering Intelligence

- [x] GitHub repository discovery
- [x] Persistent World Model + Evidence Fabric
- [x] Technology extraction & relationships
- [x] Incremental webhook ingestion
- [x] Grounded Navigator
- [x] Omni-Command (Stage + SSE + multi-turn)
- [x] Evidence explorer & Spatial World
- [x] pgvector embeddings
- [x] Hybrid graph/vector ranking
- [x] Commit-level temporal reconstruction
- [x] Automated GitHub webhook provisioning
- [x] Autonomous World Model maintenance
- [x] Omni polish (graph focus, CodeViewer, contract eval tests)
- [x] Voice navigation (Web Speech API on Omni)

Phase III Living Engineering Intelligence is **complete on main**.

## Documentation

- `docs/ARCHITECTURE.md` · `docs/WORLD_MODEL.md` · `docs/EVIDENCE_FABRIC.md`
- `docs/GITHUB_INGESTION.md` · `docs/NAVIGATOR.md` · `docs/EMBEDDINGS.md`
- `docs/OMNI_COMMAND.md` · `docs/VOICE_NAVIGATION.md`
- `docs/TEMPORAL.md` · `docs/MAINTENANCE.md` · `docs/API.md`

## License

Proprietary software owned by FeexSystems. All rights reserved.

---

**Product:** FEEXSYSTEMS — Living Engineering Intelligence  
**Public domain:** FeexSystems.codes  
**Repository:** FeexSystems/FeexSystems-Living-Intelligence-World
