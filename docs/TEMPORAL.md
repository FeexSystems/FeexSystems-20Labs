# Temporal Reconstruction

## Purpose

Answer “what did this project look like at commit X / date Y?” using `world_model_events` plus artifact path sets observed in that window.

## API

```http
GET /api/world-model/temporal/:projectId?commit=<sha>
GET /api/world-model/temporal/:projectId?at=<ISO-8601>
GET /api/world-model/temporal/:projectId/events?limit=50
```

`projectId` is the World Model id (e.g. `github:FeexSystems/yurrheeler-med-advisor`).

## Response

- `cutoff` — mode `commit` | `date` | `latest`
- `events` — ordered event history in the window
- `artifactsAsOf` — artifact paths/SHAs associated with paths seen in events (best-effort)
- `technologies` — current USES relations (full historical tech graph not yet versioned)
- `explanation` — grounded narrative of reconstruction limits

## Limits

Full historical blob replay is not implemented. Artifact SHAs reflect the last observed state for paths in the event window. Events must be written by sync/webhook paths with `commit_sha` for commit-mode accuracy.
