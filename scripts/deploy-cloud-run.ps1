# FeexSystems - Google Cloud Run Deployment Script (PowerShell)
# Usage: .\scripts\deploy-cloud-run.ps1 -ProjectId "feexsystems-prod-508304" -Region "us-central1"

param (
    [Parameter(Mandatory=$true)]
    [string]$ProjectId,

    [Parameter(Mandatory=$false)]
    [string]$Region = "us-central1",

    [Parameter(Mandatory=$false)]
    [string]$ServiceName = "feexsystems-server"
)

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  FEEXSYSTEMS — Google Cloud Run Deployment Script  " -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "Target Project: $ProjectId" -ForegroundColor Yellow
Write-Host "Target Region:  $Region" -ForegroundColor Yellow
Write-Host "Service Name:   $ServiceName" -ForegroundColor Yellow
Write-Host ""

# Step 1: Configure active gcloud project
Write-Host "[1/5] Configuring active gcloud project..." -ForegroundColor Green
gcloud config set project $ProjectId
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to set GCP project."
    exit 1
}

# Step 2: Ensure required GCP services are enabled
Write-Host "[2/5] Ensuring required Google Cloud APIs are enabled..." -ForegroundColor Green
$services = @(
    "run.googleapis.com",
    "cloudbuild.googleapis.com",
    "artifactregistry.googleapis.com",
    "secretmanager.googleapis.com",
    "sqladmin.googleapis.com",
    "redis.googleapis.com",
    "bigquery.googleapis.com",
    "storage.googleapis.com"
)
gcloud services enable $services

# Step 3: Ensure Artifact Registry repository exists
Write-Host "[3/5] Verifying Artifact Registry repository..." -ForegroundColor Green
$repoCheck = gcloud artifacts repositories describe feexsystems-docker --location=$Region --format="value(name)" 2>$null
if (-not $repoCheck) {
    Write-Host "Creating Artifact Registry repository: feexsystems-docker..." -ForegroundColor Yellow
    gcloud artifacts repositories create feexsystems-docker --repository-format=docker --location=$Region --description="Docker repository for FeexSystems services"
}

$imageUri = "$Region-docker.pkg.dev/$ProjectId/feexsystems-docker/${ServiceName}:latest"

# Step 4: Build container image using Cloud Build
Write-Host "[4/5] Submitting build to Google Cloud Build: $imageUri..." -ForegroundColor Green
gcloud builds submit --tag $imageUri --timeout=1200s .
if ($LASTEXITCODE -ne 0) {
    Write-Error "Cloud Build failed. Please inspect build logs."
    exit 1
}

# Step 5: Deploy to Cloud Run using argument array (no backticks)
Write-Host "[5/5] Deploying container image to Cloud Run..." -ForegroundColor Green
$secretsMapping = "DATABASE_URL=DATABASE_URL:latest,REDIS_URL=REDIS_URL:latest,GEMINI_API_KEY=GEMINI_API_KEY:latest,GITHUB_ACCESS_TOKEN=GITHUB_ACCESS_TOKEN:latest,GITHUB_WEBHOOK_SECRET=GITHUB_WEBHOOK_SECRET:latest"
$envVars = "NODE_ENV=production,PORT=8080"

$deployArgs = @(
    "run", "deploy", $ServiceName,
    "--image=$imageUri",
    "--platform=managed",
    "--region=$Region",
    "--allow-unauthenticated",
    "--port=8080",
    "--memory=2Gi",
    "--cpu=2",
    "--min-instances=1",
    "--max-instances=10",
    "--concurrency=80",
    "--timeout=300s",
    "--set-secrets=$secretsMapping",
    "--set-env-vars=$envVars"
)

& gcloud @deployArgs

if ($LASTEXITCODE -eq 0) {
    $serviceUrl = gcloud run services describe $ServiceName --platform=managed --region=$Region --format="value(status.url)"
    Write-Host ""
    Write-Host "====================================================" -ForegroundColor Green
    Write-Host " Cloud Run Deployment Succeeded!                   " -ForegroundColor Green
    Write-Host " Live API URL: $serviceUrl                        " -ForegroundColor Cyan
    Write-Host " Health Check: $serviceUrl/health                 " -ForegroundColor Cyan
    Write-Host "====================================================" -ForegroundColor Green
} else {
    Write-Error "Cloud Run deployment encountered an error."
    exit 1
}
