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
Repository Tree
        ↓
Artifacts
        ↓
Technologies
        ↓
Relationships
        ↓
Incremental GitHub Webhook
        ↓
World Model Mutation
        ↓
Navigator Retrieval
```

The World Model is authoritative. The LLM is an interpreter and reasoning layer; it does not silently create canonical facts.

## MVP capabilities

- SaaS landing experience for FEEXSYSTEMS.CODES
- Public project explorer
- GitHub pinned-project discovery
- Persistent repository/project records
- Repository tree and artifact discovery
- SHA-backed evidence provenance
- Technology extraction from repository metadata and manifests
- Project → technology relationships
- Incremental GitHub webhook ingestion with HMAC verification
- World Model event history
- Grounded Navigator API and public Navigator experience
- Existing authentication, dashboard, billing, DevOps and security platform foundations

## Architecture

```text
┌─────────────────────────────────────────────┐
│ EXPERIENCE                                  │
│ Landing · Projects · Navigator · 3D World  │
├─────────────────────────────────────────────┤
│ NAVIGATION                                  │
│ Search · Graph traversal · Exploration     │
├─────────────────────────────────────────────┤
│ INTELLIGENCE                                │
│ LLM · Agents · Reasoning · Explanation     │
├─────────────────────────────────────────────┤
│ WORLD MODEL                                 │
│ Projects · Artifacts · Technologies        │
├─────────────────────────────────────────────┤
│ EVIDENCE FABRIC                             │
│ Files · SHAs · URLs · Events · Provenance │
├─────────────────────────────────────────────┤
│ SYNCHRONIZATION                             │
│ GitHub discovery · Webhooks · Incremental  │
├─────────────────────────────────────────────┤
│ PERSISTENCE                                 │
│ PostgreSQL · Prisma · Redis                 │
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

## Technology stack

- **Frontend:** React 18, React Router 7, TypeScript, Vite, Tailwind CSS 3, Three.js (`@react-three/fiber` & `@react-three/drei`), Procedural GLSL Planetary Core Shaders, Radix UI, Lucide Icons
- **Backend:** Express 5 server integrated with Vite dev server, TypeScript
- **Database & Retrieval:** PostgreSQL 15+, Prisma ORM, pgvector semantic retrieval
- **Cache & Queues:** Redis (ioredis), Bull queue
- **Authentication:** JWT, refresh tokens, role-based access control (RBAC)
- **Testing:** Vitest, MSW, Playwright E2E
- **Infrastructure:** Docker / Docker Compose
- **Intelligence & AI:** Provider-neutral model adapters (`aiService`), Gemini API (Interactions & Live), Evidence Fabric grounded retrieval

## Project structure

```text
FeexSystems-Living-Intelligence-World/
├── client/                  # Public SaaS UI, 3D Spatial World & authenticated application
├── server/                  # Express 5 API, World Model, and ingestion services
├── shared/                  # Shared TypeScript contracts and schema types
├── prisma/                  # Prisma schema and PostgreSQL migrations
├── docs/                    # Architecture, World Model, Evidence Fabric & Brand library
├── docker/                  # Container configuration
└── .agents/                 # Antigravity agent rules, skills, and spatial standards
```

## Development

### Prerequisites

- Node.js 18+
- npm
- PostgreSQL 15+
- Redis 7+
- Docker / Docker Compose (recommended)

### Setup

```bash
git clone https://github.com/FeexSystems/FeexSystems-Living-Intelligence-World.git
cd FeexSystems-Living-Intelligence-World
npm install
cp .env.example .env
npm run dev
```

### Useful commands

```bash
npm run dev
npm test
npm run test:coverage
npm run build
npm run db:init
npm run db:migrate
npm run db:seed
npm run db:studio
npm run docker:dev
npm run docker:down
```

## World Model synchronization

The GitHub synchronization layer is designed around observation rather than manual content authoring.

### Discovery

The MVP discovers the FeexSystems public GitHub ecosystem and uses the pinned-project set as the initial project showcase. A deterministic configured repository list may be used as an evidence-safe fallback when public profile discovery is unavailable.

### Repository analysis

For each discovered repository the system can record:

- repository identity and metadata
- default branch
- repository tree
- source/documentation/configuration artifacts
- file paths and blob SHAs
- technology candidates
- project → technology relationships
- source URLs and discovery provenance

### Incremental updates

GitHub webhook events are validated using the configured webhook secret. Relevant commit/change paths are converted into World Model events so future synchronization can process only affected repository state.

## Navigator

The Navigator is a grounded exploration interface over the World Model.

Example questions:

```text
Which projects use PostgreSQL?

What technologies are used by Persona OS?

What evidence supports this technology relationship?

Which repositories changed recently?

How is one project connected to another?
```

The intended retrieval architecture is:

```text
User intent
   ↓
Navigator
   ↓
World Model retrieval
   ├── entity search
   ├── graph traversal
   └── vector search
   ↓
Evidence ranking
   ↓
Grounded context
   ↓
Model reasoning / explanation
```

## Evidence model

FEEXSYSTEMS treats provenance as a first-class system concern.

A canonical fact should be traceable to evidence such as:

- GitHub repository
- branch
- commit SHA
- file path
- artifact
- README/documentation
- package manifest
- webhook event
- observation timestamp

This enables future `Why?`, `Show evidence`, temporal reconstruction and dependency-impact features.

## Roadmap

### Phase I — SaaS Foundation

- Public landing page
- Authentication
- User dashboard
- Core platform services

### Phase II — Ecosystem Experience

- Project explorer
- World navigation
- Persona/project presentation
- Responsive command center

### Phase III — Living Engineering Intelligence

- [x] GitHub repository discovery
- [x] Persistent World Model project records
- [x] Evidence Fabric foundation
- [x] Repository tree/artifact discovery
- [x] Technology extraction
- [x] Project → technology relationships
- [x] Incremental webhook event ingestion
- [x] Grounded Navigator endpoint
- [ ] pgvector embeddings
- [ ] Hybrid graph/vector ranking
- [ ] Commit-level temporal reconstruction
- [x] Source/evidence explorer (`/evidence`)
- [ ] Automated GitHub webhook provisioning
- [ ] Autonomous World Model maintenance
- [x] Spatial graph reasoning & 3D Knowledge Galaxy (`/world`)
- [ ] Voice navigation

## Documentation

- `docs/ARCHITECTURE.md` — system architecture and boundaries
- `docs/WORLD_MODEL.md` — canonical entities, relationships and persistence model
- `docs/EVIDENCE_FABRIC.md` — provenance and evidence lifecycle
- `docs/GITHUB_INGESTION.md` — discovery, repository analysis and webhook synchronization
- `docs/NAVIGATOR.md` — grounded retrieval and reasoning contract
- `docs/DEPLOYMENT.md` — production deployment and environment configuration

## Security

- JWT authentication and refresh-token handling
- Role-based access control
- Rate limiting
- Zod/input validation
- Configurable CORS
- GitHub webhook HMAC verification
- Environment-based secret configuration
- Audit logging foundations

Never commit production secrets, private keys, webhook secrets or provider API keys.

## Deployment target

The public FEEXSYSTEMS experience is intended for:

**<https://FeexSystems.codes>**

Production infrastructure may use the existing Docker/PostgreSQL/Redis stack and a managed deployment platform as appropriate.

## License

Proprietary software owned by FeexSystems. All rights reserved.

---

**Product:** FEEXSYSTEMS — Living Engineering Intelligence  
**Public domain:** FeexSystems.codes  
**Repository:** FeexSystems/FeexSystems-Living-Intelligence-World
