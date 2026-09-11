# FeexSystems - GCP Secret Manager Provisioning Script (PowerShell)
# Sets up required secrets in GCP Secret Manager with interactive or file-based entry.
# Usage: .\scripts\setup-gcp-secrets.ps1 -ProjectId "your-gcp-project-id"

param (
    [Parameter(Mandatory=$true)]
    [string]$ProjectId,

    [Parameter(Mandatory=$false)]
    [string]$EnvFile = ".env.production"
)

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  FEEXSYSTEMS — GCP Secret Manager Setup Script     " -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "Target Project: $ProjectId" -ForegroundColor Yellow

gcloud config set project $ProjectId
gcloud services enable secretmanager.googleapis.com

function Set-GcpSecret {
    param(
        [string]$SecretName,
        [string]$SecretValue
    )

    if ([string]::IsNullOrWhiteSpace($SecretValue)) {
        Write-Host "[-] Skipping empty secret: $SecretName" -ForegroundColor DarkGray
        return
    }

    $exists = gcloud secrets describe $SecretName --project=$ProjectId 2>$null
    if (-not $exists) {
        Write-Host "[+] Creating secret: $SecretName" -ForegroundColor Green
        gcloud secrets create $SecretName --replication-policy="automatic" --project=$ProjectId
    }

    Write-Host "    Adding new version for: $SecretName" -ForegroundColor Cyan
    $SecretValue | gcloud secrets versions add $SecretName --data-file=- --project=$ProjectId
}

if (Test-Path $EnvFile) {
    Write-Host "Loading secrets from env file: $EnvFile" -ForegroundColor Green
    Get-Content $EnvFile | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#") -and $line.Contains("=")) {
            $parts = $line.Split("=", 2)
            $key = $parts[0].Trim()
            $val = $parts[1].Trim()

            # Filter for sensitive keys that should be in Secret Manager
            $sensitiveKeys = @(
                "DATABASE_URL",
                "REDIS_URL",
                "GEMINI_API_KEY",
                "GITHUB_ACCESS_TOKEN",
                "GITHUB_WEBHOOK_SECRET",
                "JWT_SECRET",
                "FIREBASE_SERVICE_ACCOUNT_KEY"
            )

            if ($sensitiveKeys -contains $key) {
                Set-GcpSecret -SecretName $key -SecretValue $val
            }
        }
    }
} else {
    Write-Host "No $EnvFile found. Prompting interactively for required keys..." -ForegroundColor Yellow
    $keys = @("DATABASE_URL", "REDIS_URL", "GEMINI_API_KEY", "GITHUB_ACCESS_TOKEN", "GITHUB_WEBHOOK_SECRET")
    foreach ($k in $keys) {
        $val = Read-Host -Prompt "Enter value for $k (press Enter to skip)"
        if ($val) {
            Set-GcpSecret -SecretName $k -SecretValue $val
        }
    }
}

Write-Host ""
Write-Host "Secret Manager provisioning complete for project $ProjectId!" -ForegroundColor Green
