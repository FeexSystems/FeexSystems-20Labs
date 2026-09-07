# World Model

## Definition

The FEEXSYSTEMS World Model is the persistent canonical representation of the FeexSystems engineering ecosystem.

## Core entities

- Project
- Repository
- Artifact
- Technology
- Capability
- Evidence
- Event
- Commit
- Branch

## Core relationships

```text
PROJECT ── HAS_REPOSITORY ──> REPOSITORY
REPOSITORY ── CONTAINS ──> ARTIFACT
PROJECT ── USES ──> TECHNOLOGY
ARTIFACT ── EVIDENCED_BY ──> EVIDENCE
REPOSITORY ── CHANGED_BY ──> EVENT
EVENT ── REFERENCES ──> COMMIT
PROJECT ── IMPLEMENTS ──> CAPABILITY
```

Relationships are first-class data and must not be represented only as UI tags.

## Canonical state

A World Model record should have stable identity, current state, provenance and observation timestamps. Derived descriptions are replaceable; provenance is not.

## Reconciliation

Ingestion is idempotent. Re-processing the same repository state should update existing entities rather than create duplicates.

Repository/file identity should use stable GitHub identifiers and paths plus commit/blob SHAs where applicable.

## Temporal model

World Model events record changes over time. Future temporal reconstruction should support:

- state at a point in time
- changed artifacts
- changed technologies
- relationship changes
- originating commit/event
- evidence for the change

## Mutation policy

```text
OBSERVATIONAL → automatic when mechanically verified
DERIVED       → validation required
SEMANTIC      → confidence/review gate
IDENTITY      → human approval
DESTRUCTIVE   → never silently autonomous
```

The mutation engine must preserve the source event and evidence responsible for every autonomous mutation.

## Retrieval

Navigator retrieval should combine entity search, graph traversal and pgvector semantic retrieval when embeddings are enabled. Retrieval results should retain evidence references so generated explanations can be grounded.
