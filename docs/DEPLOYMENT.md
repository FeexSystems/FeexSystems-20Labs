# Deployment

## Public target

The public FEEXSYSTEMS experience is intended for `FeexSystems.codes`.

## Required services

- Node.js application runtime
- PostgreSQL
- Redis
- GitHub API access for discovery and synchronization

## Environment configuration

At minimum configure the existing application secrets plus the World Model/GitHub synchronization settings used by the server.

Never commit secrets to the repository.

## GitHub webhook

Configure a GitHub webhook for the FEEXSYSTEMS ingestion endpoint using the same secret configured by the server. Enable the event types required by the ingestion implementation, with push events as the primary incremental synchronization signal.

The server validates webhook signatures before accepting mutation events.

## Production checklist

- [ ] Production database with backups and SSL/TLS
- [ ] Redis authentication and persistence policy
- [ ] Strong JWT secrets
- [ ] Production CORS origin set to FeexSystems.codes
- [ ] GitHub webhook secret configured
- [ ] HTTPS enabled
- [ ] Rate limits configured
- [ ] Structured logs and error monitoring enabled
- [ ] Database migrations applied
- [ ] Health/readiness endpoints verified
- [ ] World Model synchronization verified
- [ ] Navigator retrieval verified against persistent data

## Operational principle

A GitHub synchronization failure must not make the public application unavailable. Synchronization is an asynchronous capability; canonical state remains durable and observable.
