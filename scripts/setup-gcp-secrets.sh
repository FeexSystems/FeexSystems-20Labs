#!/usr/bin/env bash
# FeexSystems - GCP Secret Manager Provisioning Script (Bash)
# Usage: ./scripts/setup-gcp-secrets.sh <PROJECT_ID> [ENV_FILE]

set -euo pipefail

PROJECT_ID="${1:-${GCP_PROJECT_ID:-}}"
ENV_FILE="${2:-.env.production}"

if [ -z "$PROJECT_ID" ]; then
    echo "Error: GCP Project ID is required."
    echo "Usage: ./scripts/setup-gcp-secrets.sh <PROJECT_ID> [ENV_FILE]"
    exit 1
fi

echo "===================================================="
echo "  FEEXSYSTEMS — GCP Secret Manager Setup Script     "
echo "===================================================="
echo "Target Project: $PROJECT_ID"

gcloud config set project "$PROJECT_ID"
gcloud services enable secretmanager.googleapis.com

set_gcp_secret() {
    local secret_name="$1"
    local secret_val="$2"

    if [ -z "$secret_val" ]; then
        echo "[-] Skipping empty secret: $secret_name"
        return
    fi

    if ! gcloud secrets describe "$secret_name" --project="$PROJECT_ID" &>/dev/null; then
        echo "[+] Creating secret: $secret_name"
        gcloud secrets create "$secret_name" --replication-policy="automatic" --project="$PROJECT_ID"
    fi

    echo "    Adding new version for: $secret_name"
    printf "%s" "$secret_val" | gcloud secrets versions add "$secret_name" --data-file=- --project="$PROJECT_ID"
}

SENSITIVE_KEYS="DATABASE_URL REDIS_URL GEMINI_API_KEY GITHUB_ACCESS_TOKEN GITHUB_WEBHOOK_SECRET JWT_SECRET FIREBASE_SERVICE_ACCOUNT_KEY"

if [ -f "$ENV_FILE" ]; then
    echo "Loading secrets from env file: $ENV_FILE"
    while IFS='=' read -r key val || [ -n "$key" ]; do
        # Trim leading/trailing whitespace
        key=$(echo "$key" | xargs || true)
        val=$(echo "$val" | xargs || true)

        # Skip comments and empty lines
        if [[ -z "$key" || "$key" == \#* ]]; then
            continue
        fi

        for sensitive in $SENSITIVE_KEYS; do
            if [ "$key" = "$sensitive" ]; then
                set_gcp_secret "$key" "$val"
            fi
        done
    done < "$ENV_FILE"
else
    echo "No $ENV_FILE found. Prompting interactively for required keys..."
    for key in DATABASE_URL REDIS_URL GEMINI_API_KEY GITHUB_ACCESS_TOKEN GITHUB_WEBHOOK_SECRET; do
        read -rsp "Enter value for $key (press Enter to skip): " val
        echo ""
        if [ -n "$val" ]; then
            set_gcp_secret "$key" "$val"
        fi
    done
fi

echo "Secret Manager provisioning complete for project $PROJECT_ID!"
