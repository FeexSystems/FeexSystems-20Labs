---
description: Canonical architecture invariants and coding standards for FeexSystems Living Intelligence World
globs: **/*
always_on: true
---

# FeexSystems Living Intelligence Invariants

When developing or refactoring in this codebase, adhere strictly to these canonical principles:

1. **World Model is Authoritative**: The database-backed World Model is the canonical reality. Models (LLMs) interpret, reason, and summarize; they do NOT invent or create canonical facts without provenance.
2. **Evidence Fabric Provenance**: Every entity and relationship must be anchored in verifiable evidence (GitHub repo, branch, commit SHA, file path, artifact, or HMAC-verified webhook event).
3. **Non-Blocking Infrastructure Initialization**: Database and external service connections must never hang the HTTP dev server or readiness checks. Use lazy attachment and non-blocking background initialization.
4. **Provider-Neutral Intelligence**: Model reasoning layers must use provider-agnostic abstractions (`aiService`) so underlying models (OpenAI, Anthropic, Gemini) can interchange without breaking World Model contracts.
5. **Browser as Projection**: The client browser is a read model/view projection. Server state is canonical.
6. **Dual Mode Routing**: Public routes (`/`, `/projects`, `/navigator`, `/world`) must remain accessible to all users (both guests and authenticated users). Only guest auth routes (`/login`, `/register`) redirect authenticated users.
7. **3D Spatial Meaning**: 3D WebGL scenes (`/world`) must reflect real relationships and topology (nodes, edges, domains, artifacts) rather than purely decorative visuals.
