-- FeexSystems BigQuery Analytics & Evidence Fabric DDL Schema
-- Dataset: feexsystems_analytics

CREATE SCHEMA IF NOT EXISTS `feexsystems_analytics`
OPTIONS (
  location = 'us-central1',
  description = 'Authoritative telemetry, audit ledger, and World Model graph analytics'
);

-- Table 1: World Model Graph Events
CREATE TABLE IF NOT EXISTS `feexsystems_analytics.world_model_events` (
  event_id STRING NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  event_type STRING NOT NULL, -- 'NODE_CLICK', 'QUERY_NAVIGATOR', 'TEMPORAL_RECONSTRUCT', 'ECOSYSTEM_SYNC'
  project_id STRING,
  query_text STRING,
  grounded_entities_count INT64,
  client_ip STRING,
  user_agent STRING,
  latency_ms INT64
)
PARTITION BY DATE(timestamp)
CLUSTER BY event_type, project_id
OPTIONS (
  description = 'Real-time telemetry of World Model explorations and queries'
);

-- Table 2: Evidence Fabric Verification Ledger
CREATE TABLE IF NOT EXISTS `feexsystems_analytics.evidence_verification_ledger` (
  verification_id STRING NOT NULL,
  verified_at TIMESTAMP NOT NULL,
  project_id STRING NOT NULL,
  repository_name STRING NOT NULL,
  commit_sha STRING NOT NULL,
  artifact_path STRING,
  evidence_type STRING NOT NULL, -- 'GITHUB_COMMIT', 'WEBHOOK_HMAC', 'BUILD_ARTIFACT', 'SPATIAL_TOPOLOGY'
  signature_valid BOOLEAN NOT NULL,
  verifier_version STRING NOT NULL
)
PARTITION BY DATE(verified_at)
CLUSTER BY project_id, repository_name
OPTIONS (
  description = 'Immutable audit ledger of cryptographic and evidence provenance verifications'
);

-- Table 3: Platform & AI Telemetry
CREATE TABLE IF NOT EXISTS `feexsystems_analytics.platform_telemetry` (
  metric_id STRING NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  service_name STRING NOT NULL,
  endpoint STRING NOT NULL,
  status_code INT64 NOT NULL,
  duration_ms FLOAT64 NOT NULL,
  tokens_used INT64,
  cache_hit BOOLEAN,
  environment STRING NOT NULL
)
PARTITION BY DATE(timestamp)
CLUSTER BY service_name, status_code
OPTIONS (
  description = 'High-frequency latency, cost, and health telemetry'
);
