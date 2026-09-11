const { execSync } = require('child_process');

const PROJECT_ID = 'feexsystems-prod-508304';
const REGION = 'us-central1';
const SERVICE_NAME = 'feexsystems-server';
const IMAGE_URI = `${REGION}-docker.pkg.dev/${PROJECT_ID}/feexsystems-docker/${SERVICE_NAME}:latest`;

console.log('====================================================');
console.log('  FEEXSYSTEMS — Cloud Build & Cloud Run Deployment  ');
console.log('====================================================');
console.log(`Target Project: ${PROJECT_ID}`);
console.log(`Target Region:  ${REGION}`);
console.log(`Service Name:   ${SERVICE_NAME}`);
console.log(`Image URI:      ${IMAGE_URI}`);
console.log('');

function run(cmd) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: 'inherit', shell: true });
}

try {
  console.log('[1/4] Setting active GCP project...');
  run(`gcloud config set project ${PROJECT_ID}`);

  console.log('[2/4] Ensuring Artifact Registry repository exists...');
  try {
    run(`gcloud artifacts repositories create feexsystems-docker --repository-format=docker --location=${REGION} --description="Docker repository for FeexSystems services"`);
  } catch {
    console.log('Artifact repository already exists, continuing...');
  }

  console.log('[3/4] Submitting container build to Google Cloud Build...');
  run(`gcloud builds submit --tag ${IMAGE_URI} --timeout=1200s .`);

  console.log('[4/4] Deploying container image to Cloud Run with all platform & Paystack secrets...');
  const secrets = 'DATABASE_URL=DATABASE_URL:latest,REDIS_URL=REDIS_URL:latest,GEMINI_API_KEY=GEMINI_API_KEY:latest,GITHUB_ACCESS_TOKEN=GITHUB_ACCESS_TOKEN:latest,GITHUB_WEBHOOK_SECRET=GITHUB_WEBHOOK_SECRET:latest,PAYSTACK_SECRET_KEY=PAYSTACK_SECRET_KEY:latest,PAYSTACK_PUBLIC_KEY=PAYSTACK_PUBLIC_KEY:latest,JWT_SECRET=JWT_SECRET:latest,ENCRYPTION_KEY=ENCRYPTION_KEY:latest';
  const envVars = 'NODE_ENV=production';

  run(`gcloud run deploy ${SERVICE_NAME} --image=${IMAGE_URI} --platform=managed --region=${REGION} --allow-unauthenticated --port=8080 --memory=2Gi --cpu=2 --min-instances=1 --max-instances=10 --concurrency=80 --timeout=300s --set-secrets="${secrets}" --set-env-vars="${envVars}"`);

  console.log('');
  console.log('====================================================');
  console.log('  FeexSystems Deployment Succeeded!                 ');
  console.log('====================================================');
} catch (error) {
  console.error('Deployment failed:', error.message);
  process.exit(1);
}
