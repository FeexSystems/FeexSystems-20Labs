# Evidence Fabric

## Purpose

The Evidence Fabric prevents FEEXSYSTEMS from turning generated descriptions into unsupported canonical facts.

## Evidence sources

- GitHub repository metadata
- Repository tree
- Branch
- Commit
- Blob/file SHA
- Source file
- README/documentation
- Package manifests
- Webhook event
- Observation timestamp

## Evidence record

Conceptually:

```text
Evidence
├── sourceType
├── sourceUrl
├── repository
├── branch
├── commitSha
├── path
├── artifactId
├── observedAt
└── metadata
```

## Evidence lifecycle

```text
OBSERVE
  ↓
NORMALIZE
  ↓
STORE
  ↓
LINK TO ENTITY
  ↓
LINK TO RELATIONSHIP
  ↓
RECONCILE ON CHANGE
  ↓
RETAIN HISTORY
```

## Evidence-first rules

1. Do not present an unverified repository claim as observed fact.
2. Do not use LLM output as provenance.
3. Preserve source URLs and commit/blob identifiers where available.
4. Record observation timestamps.
5. Reconcile stale evidence when a repository changes.
6. Keep enough provenance to explain why a World Model fact exists.

## User-facing explainability

The target experience supports:

- `Why is this here?`
- `Show evidence`
- `Where is it implemented?`
- `What changed?`
- `What depends on it?`

Evidence should be retrievable alongside Navigator results rather than hidden in a separate administrative system.
