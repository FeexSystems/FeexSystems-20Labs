# Repository Hygiene

The repository is production-oriented. Every committed file should have a current owner and an active purpose.

## Keep

- Application source under `client/` and `server/`
- Shared contracts under `shared/`
- Prisma schema/migrations under `prisma/`
- Canonical documentation under `docs/`
- Active operational scripts under `scripts/`
- Active infrastructure under `docker/`
- Active CI/CD under `.github/`
- Required product assets under `public/`

## Remove or relocate

- Historical task-verification scripts
- One-off test runners that duplicate the real test suite
- Temporary audit files and generated reports
- Unused vendor deployment configuration
- Loose TXT/HTML/JSON artifacts with no active consumer
- Screenshots and generated verification output
- Duplicate documentation at the repository root
- Bundled runtimes or binaries that belong in the development environment, not source control

## Decision rule

A file should remain only when at least one of these is true:

1. It is imported by application code.
2. It is consumed by an npm script, test runner, build, migration, CI workflow, or deployment process.
3. It is required configuration for an active dependency or platform.
4. It is canonical documentation or a required product asset.

Otherwise it is a removal candidate. Verify references before deleting anything ambiguous.
