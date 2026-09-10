# FEEXSYSTEMS API

## Base URL

Development: Vite dev server (typically `http://localhost:8080`) with Express mounted as middleware  
Production: `https://FeexSystems.codes` (deployment may proxy `/api` to the application server)

## Public World Model endpoints

### `GET /api/world-model/projects`

Returns persisted FEEXSYSTEMS project entities for the public Project Explorer.

### `POST /api/world-model/sync/github-pinned`

Discovers the FeexSystems pinned-project set and reconciles discovered projects into the persistent World Model.

### `POST /api/world-model/webhook/github`

Receives GitHub webhook events for incremental synchronization. Requests must include a valid GitHub HMAC signature configured by the server.

### `POST /api/world-model/navigator`

Runs grounded Navigator retrieval over the persistent World Model.

Example request:

```json
{
  "query": "Which projects use PostgreSQL?"
}
```

The response should identify the grounded records used for the answer. Model-generated prose is not itself canonical data.

### `POST /api/world-model/omni-command`

Runs Omni-Command: World Model retrieval + LLM/heuristic director → validated **Orchestration Contract** for the Stage UI.

Example request:

```json
{
  "query": "Show me the backend architecture",
  "context": {
    "sessionId": "omni-session-1",
    "focusedNodeIds": [],
    "previousIntent": null
  }
}
```

Example response shape:

```json
{
  "success": true,
  "data": {
    "version": "1.0",
    "requestId": "…",
    "intent": "VISUALIZE_ARCHITECTURE",
    "status": "success",
    "confidence": 0.9,
    "groundedEvidenceCount": 3,
    "reasoning_trace": [],
    "ui_directive": {
      "component": "GraphVisualizer",
      "props": { "nodes": [], "edges": [], "layout": "force-directed" },
      "layoutHint": "full"
    },
    "context": {},
    "suggestions": [],
    "evidence_anchors": []
  }
}
```

Request and response bodies are validated with Zod (`shared/orchestration-schema.ts`). Invalid requests return HTTP 400.

### `POST /api/world-model/omni-command/stream`

Same body as `/omni-command`. Responds with **Server-Sent Events**:

| Event | Data |
|-------|------|
| `trace` | `ReasoningStep` JSON |
| `result` | Full `OmniCommandResponse` JSON |
| `error` | `{ "message": "…" }` |

See `docs/OMNI_COMMAND.md` for the full contract and component list.

### `GET /health`

Process and dependency health (database, Redis, uptime, memory). Used by Omni `MetricsDashboard` and ops probes.

## Existing platform endpoints

Authentication, profile, AI, subscription, health, DevOps, analytics, billing, security and administrative endpoints remain part of the existing FEEXSYSTEMS application. The canonical endpoint definitions should be maintained in `docs/api-spec.yaml` as the OpenAPI source where available.

## Security

- Authenticated endpoints require the platform's JWT/session mechanism.
- World Model webhook ingestion requires HMAC verification.
- Validate request bodies and query parameters server-side (Zod for Omni).
- Apply rate limits to public and authenticated API surfaces.
- Do not expose provider secrets or internal database credentials.

## API evolution rule

New World Model APIs must preserve the separation:

```text
Evidence → Persistent World Model → Retrieval → Reasoning / Orchestration → UI
```

They must not make the LLM or browser state the source of truth.
