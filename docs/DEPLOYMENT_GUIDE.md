# FeexSystems Enterprise Cloud Deployment & Operations Runbook

This guide details the complete production deployment procedures for **FeexSystems Living Intelligence World** (`feexsystems.codes`) across Google Cloud Platform (Cloud Run, Cloud SQL, Memorystore Redis, BigQuery, Cloud Storage) and Firebase (Hosting, Auth, Remote Config).

---

## 1. Architecture Summary

- **Frontend**: Vite React SPA hosted on **Firebase Hosting** with global edge CDN, HTTP/2 multiplexing, and `/api/**` rewrites to Cloud Run.
- **Backend**: Express 5 container running on **Google Cloud Run** (`feexsystems-server`), auto-scaling with concurrency 80 and min-instances 1 to eliminate cold starts for the 3D WebGL World Model API.
- **Primary Database**: **Google Cloud SQL** (PostgreSQL 15) managed with Prisma ORM.
- **Cache & Message Broker**: **Google Cloud Memorystore Redis** for sessions, Bull queues, and rate-limiting.
- **Analytics & Telemetry**: **Google BigQuery** (`feexsystems_analytics`) with real-time streaming ingestion.
- **Orchestration**: **Managed Service for Apache Airflow (MSAA / Cloud Composer)** for scheduled GitHub ecosystem crawls and Evidence Fabric validation.
- **Storage**: **Google Cloud Storage** (`feexsystems-evidence-artifacts`) with object versioning for evidence persistence.
- **AI Reasoning**: Provider-neutral **Gemini API** (`gemini-2.5-flash`) and **Gemini Live WebSocket** streaming.

---

## 2. Pre-Deployment Setup & Prerequisites

### 2.1 Authenticate and Select Project
```bash
# Authenticate with Google Cloud
gcloud auth login
gcloud config set project feexsystems-prod

# Authenticate with Firebase
firebase login
firebase use prod
```

### 2.2 Enable Required GCP Services
```bash
gcloud services enable \
    run.googleapis.com \
    cloudbuild.googleapis.com \
    artifactregistry.googleapis.com \
    secretmanager.googleapis.com \
    sqladmin.googleapis.com \
    redis.googleapis.com \
    bigquery.googleapis.com \
    storage.googleapis.com \
    composer.googleapis.com
```

---

## 3. Database & Secret Provisioning

### 3.1 Provision Secrets in Secret Manager
Copy `.env.production.template` to `.env.production` and fill in your production values, then run:

**On Windows PowerShell:**
```powershell
.\scripts\setup-gcp-secrets.ps1 -ProjectId "feexsystems-prod" -EnvFile ".env.production"
```

**On Linux/macOS:**
```bash
chmod +x ./scripts/setup-gcp-secrets.sh
./scripts/setup-gcp-secrets.sh "feexsystems-prod" ".env.production"
```

### 3.2 Cloud SQL Schema Migrations (Accidental Data Loss Prevention)
> [!CAUTION]
> Before applying database migrations to production, ensure automated backups are active:
> `gcloud sql instances patch <INSTANCE_NAME> --backup-start-time 02:00`

Run migrations via the Cloud SQL Auth Proxy or temporary migration job:
```bash
npm run db:migrate
```

### 3.3 Initialize BigQuery Analytics Schema
Execute the DDL schema in BigQuery:
```bash
bq query --use_legacy_sql=false < server/lib/services/bigquery/schema.sql
```

---

## 4. Building & Deploying the Backend to Cloud Run

Run the automated deployment script:

**On Windows PowerShell:**
```powershell
.\scripts\deploy-cloud-run.ps1 -ProjectId "feexsystems-prod" -Region "us-central1"
```

**On Linux/macOS:**
```bash
chmod +x ./scripts/deploy-cloud-run.sh
./scripts/deploy-cloud-run.sh "feexsystems-prod" "us-central1"
```

This will:
1. Ensure Artifact Registry repository `feexsystems-docker` exists.
2. Build the production multi-stage image using Cloud Build (`Dockerfile.prod`).
3. Deploy to Cloud Run with Secret Manager environment references and non-root security.

---

## 5. Deploying the Frontend to Firebase Hosting

```bash
# 1. Build the production client bundle
npm run build:client

# 2. Deploy static SPA and routing rules to Firebase Hosting
firebase deploy --only hosting
```

---

## 6. Verification & Health Monitoring

### 6.1 Liveness & Readiness Checks
```bash
# Check basic application health
curl -s https://feexsystems.codes/health | jq

# Check readiness and database/redis connectivity
curl -s https://feexsystems.codes/health/ready | jq
```

Expected output:
```json
{
  "status": "healthy",
  "timestamp": "2026-09-11T04:00:00.000Z",
  "services": {
    "database": "connected",
    "redis": "connected"
  }
}
```

### 6.2 World Model API Verification
```bash
# Verify synchronized project graph
curl -s https://feexsystems.codes/api/world-model/projects | jq '.count'

# Verify Navigator grounded reasoning
curl -s "https://feexsystems.codes/api/world-model/navigator?q=ecosystem" | jq '.success'
```

---

## 7. Rollback & Disaster Recovery Procedures

### 7.1 Cloud Run Instant Rollback
```bash
# List previous revisions
gcloud run revisions list --service=feexsystems-server --region=us-central1

# Revert traffic to known good revision
gcloud run services update-traffic feexsystems-server \
    --region=us-central1 \
    --to-revisions=feexsystems-server-00001-abc=100
```

### 7.2 Firebase Hosting Rollback
```bash
# Roll back to the previous hosting release immediately
firebase hosting:rollback
```

### 7.3 Point-in-Time Database Recovery
If an accidental data loss event occurs:
```bash
gcloud sql backups restore <BACKUP_ID> \
    --restore-instance=feexsystems-postgres-prod \
    --backup-instance=feexsystems-postgres-prod
```
