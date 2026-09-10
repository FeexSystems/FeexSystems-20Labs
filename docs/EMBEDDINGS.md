# World Model Embeddings & Hybrid Ranking

## Purpose

Semantic retrieval over the FEEXSYSTEMS World Model using **pgvector**, fused with keyword and graph evidence scores for Navigator and Omni-Command grounding.

## Prerequisites

1. PostgreSQL with the **`vector`** extension (pgvector)
2. Embedding provider key:
   - `OPENAI_API_KEY` (preferred, `text-embedding-3-small`, 1536-d)
   - or `GEMINI_API_KEY` (`text-embedding-004`, padded/truncated to schema dim)

Optional env:

```bash
WORLD_MODEL_EMBEDDING_DIM=1536
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
GEMINI_EMBEDDING_MODEL=text-embedding-004
```

Without pgvector or keys, hybrid mode **falls back to keyword-only** ranking (existing behaviour).

## Schema

Created at runtime by `ensureEmbeddingTables()`:

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE world_model_embeddings (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,      -- project | technology | artifact
  entity_id TEXT NOT NULL,
  content TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  embedding vector(1536),
  model TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(entity_type, entity_id)
);
```

Cosine distance operator: `<=>` (pgvector).

## APIs

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/world-model/navigator?q=…&hybrid=true` | Hybrid ranked retrieval (default) |
| `POST` | `/api/world-model/navigator` | Body `{ "query": "…", "hybrid": true }` |
| `POST` | `/api/world-model/embeddings/reindex` | Embed all projects + technologies |
| `POST` | `/api/world-model/sync/github-pinned` | Sync then best-effort reindex |

## Score fusion

```text
final = 0.35 * keyword + 0.40 * vector + 0.15 * graphEvidence + 0.10 * recency
```

- **keyword** — token overlap on name / repo / description  
- **vector** — `1 - cosine_distance` from pgvector  
- **graphEvidence** — normalized artifact count per project  
- **recency** — decay on `last_observed_at`

Response includes:

```json
{
  "ranking": {
    "mode": "hybrid",
    "vectorHits": 8,
    "weights": { "keyword": 0.35, "vector": 0.4, "graph": 0.15, "recency": 0.1 }
  }
}
```

## Implementation

| Module | Role |
|--------|------|
| `server/lib/services/embedding.service.ts` | embed, upsert, similarity, reindex |
| `server/lib/services/hybrid-retrieval.service.ts` | `retrieveWorldHybrid` |
| `server/routes/world-model.ts` | routes |

Omni-Command uses the same hybrid path via `retrieveWorldHybrid` when wired in the Omni service.

## Ops checklist

```bash
# 1. Ensure Postgres has pgvector
# 2. Set OPENAI_API_KEY or GEMINI_API_KEY
# 3. Sync World Model
curl -X POST http://localhost:8080/api/world-model/sync/github-pinned

# 4. Or explicit reindex
curl -X POST http://localhost:8080/api/world-model/embeddings/reindex

# 5. Query
curl "http://localhost:8080/api/world-model/navigator?q=healthcare+advisor"
```

## Future

- Artifact-level embeddings (README / package.json bodies)
- Incremental re-embed on webhook path change
- HNSW index when row counts grow
- Tunable weights via env
