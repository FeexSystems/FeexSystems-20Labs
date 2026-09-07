# FEEXSYSTEMS Architecture

## Purpose

FEEXSYSTEMS is the application hosted at `FeexSystems.codes`. Its purpose is to turn the FeexSystems engineering ecosystem into an evidence-backed, continuously synchronized World Model that people can explore through a SaaS interface and Navigator.

## System boundary

```text
FeexSystems GitHub ecosystem
        ↓
Repository discovery
        ↓
Ingestion / normalization
        ↓
Persistent World Model
        ↓
Evidence Fabric + relationships
        ↓
Graph / vector retrieval
        ↓
Navigator / reasoning
        ↓
Project Explorer / spatial experience
```

The Persona OS project is a project represented inside FEEXSYSTEMS. It is not the parent application.

## Architectural planes

### Experience

Public landing page, project explorer, Navigator, command center and future spatial/voice interfaces.

### Navigation

A common navigation contract for search, project traversal, graph exploration, voice and direct links.

### Intelligence

Provider-neutral model adapters, grounded retrieval, reasoning, summarization and controlled agents.

### World Model

Canonical projects, repositories, artifacts, technologies, capabilities, relationships and temporal events.

### Evidence Fabric

Provenance records connecting World Model facts to GitHub repositories, branches, commits, files, artifacts, URLs and observation timestamps.

### Synchronization

GitHub discovery, repository crawling, webhook handling and incremental reconciliation.

### Persistence

PostgreSQL/Prisma for durable state and Redis for caching/session workloads. pgvector is the planned semantic retrieval layer.

## Source-of-truth rule

The persistent World Model is authoritative. Browser state, generated prose and LLM output are not authoritative data sources.

A model may interpret or propose changes, but canonical mutations must pass through the World Model mutation path and retain provenance.

## Runtime flow

1. Discover repositories from the FeexSystems GitHub ecosystem.
2. Persist repository identity and discovery evidence.
3. Crawl the repository tree.
4. Classify relevant artifacts.
5. Extract technology candidates.
6. Create or reconcile graph relationships.
7. Record evidence and World Model events.
8. Process future webhook changes incrementally.
9. Retrieve grounded context for Navigator requests.
10. Present explanations with paths/evidence where available.

## Future production evolution

```text
GitHub webhook
    ↓
Event queue
    ↓
Idempotent ingestion job
    ↓
Artifact reconciliation
    ↓
Entity / relationship mutation
    ↓
Embedding invalidation + regeneration
    ↓
Temporal event
    ↓
Read-model refresh
    ↓
Navigator
```

The browser should remain a projection of server state rather than the canonical persistence layer.
