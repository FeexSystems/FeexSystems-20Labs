# GitHub Ingestion

## Goal

Keep the FEEXSYSTEMS World Model synchronized with the FeexSystems GitHub ecosystem.

## Discovery

The initial project set comes from the FeexSystems GitHub pinned-project surface. A deterministic configured repository list may be used as a fallback when public profile discovery is unavailable.

## Repository crawl

For each discovered repository:

1. Persist repository identity and metadata.
2. Resolve the default branch.
3. Read the repository tree.
4. Identify relevant source, documentation, configuration and manifest artifacts.
5. Persist artifact paths and SHAs.
6. Extract technology candidates.
7. Reconcile project/technology relationships.
8. Attach evidence records.
9. Record an observation/event.

## Incremental webhook

GitHub webhook requests must be authenticated using HMAC verification with the configured webhook secret.

Relevant push events identify changed commits and paths. The ingestion service records those changes as World Model events and should process only affected repository state.

## Idempotency

Repeated delivery of the same webhook must not create duplicate entities, relationships or evidence records.

Use stable repository IDs, commit SHAs, blob SHAs and normalized paths as reconciliation keys where applicable.

## Failure handling

- Invalid signatures are rejected.
- Unsupported event types are ignored safely.
- GitHub/API failures must not corrupt canonical state.
- Startup synchronization should be non-blocking.
- Failed asynchronous work should be observable and retryable.

## Production target

The current MVP provides the discovery, crawl, evidence and webhook foundation. The production target is an asynchronous event-driven pipeline:

```text
GitHub
  ↓
Webhook
  ↓
Queue / durable job
  ↓
Repository sync worker
  ↓
Artifact reconciliation
  ↓
World Model mutation
  ↓
Evidence + temporal event
  ↓
Embedding update
```
