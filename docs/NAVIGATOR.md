# Navigator

## Purpose

Navigator is the human-facing reasoning and exploration interface over the FEEXSYSTEMS World Model.

It is grounded in persistent data and evidence before any model-generated explanation is produced.

## Retrieval contract

```text
User query
   ↓
Intent / entity extraction
   ↓
World Model retrieval
   ├── entity search
   ├── relationship traversal
   └── semantic vector search
   ↓
Evidence attachment
   ↓
Context assembly
   ↓
Model interpretation
   ↓
Answer + evidence/path
```

## Example queries

- Which projects use PostgreSQL?
- What technologies are used by Persona OS?
- What evidence supports this relationship?
- Which repositories changed recently?
- How are two projects connected?

## Grounding rules

Navigator must distinguish observed facts from inference. If evidence is missing, the response should say so rather than inventing a source.

The model provider is replaceable. Navigator depends on a stable World Model retrieval contract rather than a provider-specific database representation.

## Future capabilities

- pgvector semantic retrieval
- hybrid graph/vector rank fusion
- multi-hop path reasoning
- evidence-aware answers
- temporal queries
- dependency impact analysis
- source-level inspection
- voice navigation
