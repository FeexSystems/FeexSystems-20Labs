# World Model Maintenance

## Purpose

Autonomous upkeep: re-sync pinned repos, re-embed, orphan cleanup, event retention trim.

## API

```http
POST /api/world-model/maintenance/run
GET  /api/world-model/maintenance/status
```

Body options for run:

```json
{ "skipSync": false, "skipEmbed": false, "eventRetentionDays": 90 }
```

## Scheduler

```bash
WORLD_MODEL_MAINTENANCE_HOURS=6
WORLD_MODEL_MAINTENANCE_ON_BOOT=true
```

Started from server infrastructure init when hours > 0.

## Webhook provisioning

```http
POST /api/world-model/webhooks/provision
POST /api/world-model/webhooks/provision/:owner/:repo
GET  /api/world-model/webhooks/:owner/:repo
```

Requires `GITHUB_TOKEN`, `GITHUB_WEBHOOK_SECRET`, and `WORLD_MODEL_WEBHOOK_URL` (public URL to `POST /api/world-model/webhook`).
