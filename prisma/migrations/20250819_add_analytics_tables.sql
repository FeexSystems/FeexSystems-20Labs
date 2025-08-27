-- CreateEnum
CREATE TYPE "EventType" AS ENUM (
  'session_start',
  'session_end',
  'feature_used',
  'error',
  'conversion',
  'subscription_changed'
);

-- CreateTable
CREATE TABLE "user_events" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "event_type" "EventType" NOT NULL,
  "event_data" JSONB NOT NULL DEFAULT '{}',
  "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "user_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_metrics" (
  "id" TEXT NOT NULL,
  "metric_name" TEXT NOT NULL,
  "metric_value" DOUBLE PRECISION NOT NULL,
  "dimensions" JSONB NOT NULL DEFAULT '{}',
  "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "analytics_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_events_user_id_idx" ON "user_events"("user_id");
CREATE INDEX "user_events_event_type_idx" ON "user_events"("event_type");
CREATE INDEX "user_events_timestamp_idx" ON "user_events"("timestamp");
CREATE INDEX "analytics_metrics_metric_name_idx" ON "analytics_metrics"("metric_name");
CREATE INDEX "analytics_metrics_timestamp_idx" ON "analytics_metrics"("timestamp");

-- AddForeignKey
ALTER TABLE "user_events" ADD CONSTRAINT "user_events_user_id_fkey" 
FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
