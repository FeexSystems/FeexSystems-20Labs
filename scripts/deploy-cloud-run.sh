#!/usr/bin/env bash
# FeexSystems - Google Cloud Run Deployment Script (Bash)
# Usage: ./scripts/deploy-cloud-run.sh <PROJECT_ID> [REGION] [SERVICE_NAME]

set -euo pipefail

PROJECT_ID="${1:-${GCP_PROJECT_ID:-}}"
REGION="${2:-us-central1}"
SERVICE_NAME="${3:-feexsystems-server}"

if [ -z "$PROJECT_ID" ]; then
    echo "Error: GCP Project ID is required."
    echo "Usage: ./scripts/deploy-cloud-run.sh <PROJECT_ID> [REGION] [SERVICE_NAME]"
    exit 1
fi

echo "===================================================="
echo "  FEEXSYSTEMS — Google Cloud Run Deployment Script  "
echo "===================================================="
echo "Target Project: $PROJECT_ID"
echo "Target Region:  $REGION"
echo "Service Name:   $SERVICE_NAME"
echo ""

echo "[1/5] Configuring active gcloud project..."
gcloud config set project "$PROJECT_ID"

echo "[2/5] Ensuring required Google Cloud APIs are enabled..."
gcloud services enable \
    run.googleapis.com \
    cloudbuild.googleapis.com \
    artifactregistry.googleapis.com \
    secretmanager.googleapis.com \
    sqladmin.googleapis.com \
    redis.googleapis.com \
    bigquery.googleapis.com \
    storage.googleapis.com

echo "[3/5] Verifying Artifact Registry repository..."
if ! gcloud artifacts repositories describe feexsystems-docker --location="$REGION" &>/dev/null; then
    echo "Creating Artifact Registry repository: feexsystems-docker..."
    gcloud artifacts repositories create feexsystems-docker \
        --repository-format=docker \
        --location="$REGION" \
        --description="Docker repository for FeexSystems services"
fi

IMAGE_URI="$REGION-docker.pkg.dev/$PROJECT_ID/feexsystems-docker/$SERVICE_NAME:latest"

echo "[4/5] Building container image via Cloud Build: $IMAGE_URI..."
gcloud builds submit --tag "$IMAGE_URI" --timeout=1200s .

echo "[5/5] Deploying container to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
    --image="$IMAGE_URI" \
    --platform=managed \
    --region="$REGION" \
    --allow-unauthenticated \
    --port=8080 \
    --memory=2Gi \
    --cpu=2 \
    --min-instances=1 \
    --max-instances=10 \
    --concurrency=80 \
    --timeout=300s \
    --set-secrets="DATABASE_URL=DATABASE_URL:latest,REDIS_URL=REDIS_URL:latest,GEMINI_API_KEY=GEMINI_API_KEY:latest,GITHUB_ACCESS_TOKEN=GITHUB_ACCESS_TOKEN:latest,GITHUB_WEBHOOK_SECRET=GITHUB_WEBHOOK_SECRET:latest" \
    --set-env-vars="NODE_ENV=production,PORT=8080"

SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --platform=managed --region="$REGION" --format="value(status.url)")
echo ""
echo "===================================================="
echo " Cloud Run Deployment Succeeded!"
echo " Live API URL: $SERVICE_URL"
echo " Health Check: $SERVICE_URL/health"
echo "===================================================="
