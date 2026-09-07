# FEEXSYSTEMS API

## Base URL

Development: `http://localhost:3001`  
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

## Existing platform endpoints

Authentication, profile, AI, subscription, health, DevOps, analytics, billing, security and administrative endpoints remain part of the existing FEEXSYSTEMS application. The canonical endpoint definitions should be maintained in `docs/api-spec.yaml` as the OpenAPI source where available.

## Security

- Authenticated endpoints require the platform's JWT/session mechanism.
- World Model webhook ingestion requires HMAC verification.
- Validate request bodies and query parameters server-side.
- Apply rate limits to public and authenticated API surfaces.
- Do not expose provider secrets or internal database credentials.

## API evolution rule

New World Model APIs must preserve the separation:

```text
Evidence → Persistent World Model → Retrieval → Reasoning
```

They must not make the LLM or browser state the source of truth.
