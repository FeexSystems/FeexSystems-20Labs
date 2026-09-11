# Omni-Command

## Purpose

Omni-Command is the agent-driven **Stage** interface over the FEEXSYSTEMS World Model.

Unlike traditional page routing, the UI is a dumb canvas. The server returns a validated **Orchestration Contract**; the client mounts the component named in `ui_directive.component`.

Principles preserved:

1. World Model is authoritative
2. Evidence, not claims
3. Provider-neutral intelligence
4. LLM interprets; it does not invent canonical facts

## User experience

| Surface | Route / API |
|---------|-------------|
| Command UI | `/omni` |
| Deep link | `/omni?q=Show+me+the+backend+architecture` |
| Voice | Mic button on command bar (Web Speech API) |
| Sync API | `POST /api/world-model/omni-command` |
| Streaming API | `POST /api/world-model/omni-command/stream` (SSE) |

The persistent command bar accepts natural language (typed or spoken). A live **Reasoning Trace** streams on the right. **Context chips** show focused node IDs and previous intent for multi-turn follow-ups.

Example commands:

```text
Show me the backend architecture
Which projects use PostgreSQL?
Run a health check on the platform
Show evidence for the knowledge graph
Zoom into the focused node
```

## Pipeline

```text
User query (type or voice transcript) (+ optional context)
        ↓
Intent classification (heuristic + context)
        ↓
World Model retrieval
   ├── retrieveWorld(query)
   └── getWorldModelGraph()   // nodes + links
        ↓
LLM director (Gemini → OpenAI) with few-shot contract examples
   or deterministic heuristic if no provider keys
        ↓
Build ui_directive props (graph / markdown / metrics)
        ↓
Zod validate Orchestration Contract
        ↓
Response (+ SSE trace events)
        ↓
Stage mounts ComponentRegistry[component]
```

Voice transcription is **browser-side only** (see `docs/VOICE_NAVIGATION.md`). Only the final text transcript is sent to the API.

## Orchestration Contract (v1.0)

Shared types: `shared/orchestration.ts`  
Zod schemas: `shared/orchestration-schema.ts`

### Request

```json
{
  "query": "Show me the backend architecture",
  "context": {
    "sessionId": "omni-…",
    "focusedNodeIds": ["github:FeexSystems/…"],
    "previousIntent": "VISUALIZE_ARCHITECTURE",
    "lastQuery": "Which projects use PostgreSQL?"
  }
}
```

### Response (abbreviated)

```json
{
  "version": "1.0",
  "requestId": "…",
  "intent": "VISUALIZE_ARCHITECTURE",
  "status": "success",
  "confidence": 0.9,
  "groundedEvidenceCount": 4,
  "reasoning_trace": [
    { "id": "…", "type": "parse", "message": "…", "timestamp": "…" }
  ],
  "ui_directive": {
    "component": "GraphVisualizer",
    "layoutHint": "full",
    "props": {
      "layout": "force-directed",
      "nodes": [],
      "edges": [],
      "focusNodeId": "…"
    }
  },
  "context": {
    "previousIntent": "VISUALIZE_ARCHITECTURE",
    "focusedNodeIds": ["…"],
    "lastQuery": "Show me the backend architecture"
  },
  "suggestions": ["…"],
  "evidence_anchors": []
}
```

### Allowed Stage components

| Component | Typical use |
|-----------|-------------|
| `GraphVisualizer` | Architecture, topology, relationships (React Flow + grid fallback) |
| `MarkdownViewer` | Explanations, digests |
| `MetricsDashboard` | Health / latency; also fetches `GET /health` |
| `EvidencePanel` | Provenance narrative (currently rendered via MarkdownViewer) |
| `CodeViewer` | Source inspection (mapped to MarkdownViewer until dedicated viewer) |
| `EmptyStage` | Idle |
| `ErrorStage` | Recoverable client/server errors |

## Streaming (SSE)

`POST /api/world-model/omni-command/stream`

| Event | Payload |
|-------|---------|
| `trace` | `ReasoningStep` |
| `result` | Full `OmniCommandResponse` |
| `error` | `{ message }` |

The non-stream endpoint remains available for simple clients.

## Multi-turn context

The client store (`client/stores/omniStore.ts`) keeps:

- `sessionId`
- `focusedNodeIds`
- `previousIntent`
- `lastQuery`

Follow-ups such as “zoom into that node” bias retrieval and prefer `GraphVisualizer` when focus IDs are present.

## Implementation map

| Layer | Path |
|-------|------|
| Contract types | `shared/orchestration.ts` |
| Zod schemas | `shared/orchestration-schema.ts` |
| Service | `server/lib/services/omni-command.service.ts` |
| Routes | `server/routes/omni-command.ts` |
| Stage + registry | `client/components/omni/` |
| Voice hook | `client/hooks/useSpeechNavigation.ts` |
| Page | `client/pages/OmniCommand.tsx` |
| Tests | `server/lib/__tests__/omni-command.schema.test.ts` |

## Environment

| Variable | Role |
|----------|------|
| `GEMINI_API_KEY` | Preferred LLM director |
| `OPENAI_API_KEY` | Fallback LLM director |

Without either key, Omni still runs using deterministic heuristics grounded in the World Model.

## Relationship to Navigator

| | Navigator | Omni-Command |
|--|-----------|--------------|
| Goal | Answer + evidence | Answer **and** choose UI |
| Output | Text / structured retrieval | Orchestration Contract |
| UI | Dedicated Navigator page | Dynamic Stage |
| Grounding | Same World Model APIs | Same (`retrieveWorld`, graph) |
| Input | Text / typed | Typed + voice |

Omni reuses Navigator-grade retrieval; it adds the director layer and Stage mounting.

## Future

- Click-to-focus graph nodes → update `focusedNodeIds`
- Dedicated CodeViewer with syntax highlighting
- Secondary directive (split layout)
- Continuous voice mode / wake phrase
- Hybrid graph/vector ranking for better grounding
