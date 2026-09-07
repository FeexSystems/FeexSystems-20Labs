---
name: feex-world-model
description: Operational runbook and troubleshooting procedures for FeexSystems World Model synchronization, GitHub webhook ingestion, and Evidence Fabric queries.
---

# FeexSystems World Model Runbook

Use this skill when synchronizing GitHub repositories, debugging webhook ingestion, querying the Evidence Fabric, or inspecting the 3D graph model.

## Core Endpoints
- `GET /api/world-model/projects` — List synchronized World Model projects
- `GET /api/world-model/graph` — Retrieve 3D graph nodes and relationships
- `GET /api/world-model/evidence/:projectId` — Retrieve provenance ledger and artifacts for a project
- `GET /api/world-model/navigator?q=<query>` — Grounded multi-dimensional retrieval with AI explanation
- `POST /api/world-model/sync/github-pinned` — Trigger manual GitHub profile sync
- `POST /api/world-model/webhook` — GitHub webhook receiver with HMAC SHA-256 verification

## Database Models (Prisma)
- `WorldModelProject` (`world_model_projects`)
- `WorldModelEvidence` (`world_model_evidence`)
- `WorldModelArtifact` (`world_model_artifacts`)
- `WorldModelTechnology` (`world_model_technologies`)
- `WorldModelRelationship` (`world_model_relationships`)
- `WorldModelEvent` (`world_model_events`)

## Webhook Verification Testing
GitHub webhooks must include an `x-hub-signature-256` header computed using HMAC SHA-256 with `GITHUB_WEBHOOK_SECRET`. Raw request body is captured in `(req as any).rawBody` before JSON parsing to guarantee signature accuracy.
