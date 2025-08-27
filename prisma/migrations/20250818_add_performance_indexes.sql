-- Add indexes for frequently queried fields
CREATE INDEX IF NOT EXISTS "sessions_expires_at_idx" ON "sessions" ("expires_at");
CREATE INDEX IF NOT EXISTS "refresh_tokens_expires_at_idx" ON "refresh_tokens" ("expires_at");
CREATE INDEX IF NOT EXISTS "subscriptions_current_period_end_idx" ON "subscriptions" ("current_period_end");
CREATE INDEX IF NOT EXISTS "subscriptions_status_idx" ON "subscriptions" ("status");
CREATE INDEX IF NOT EXISTS "ai_requests_created_at_idx" ON "ai_requests" ("created_at");
CREATE INDEX IF NOT EXISTS "security_scans_status_idx" ON "security_scans" ("status");
CREATE INDEX IF NOT EXISTS "usage_metrics_timestamp_idx" ON "usage_metrics" ("timestamp");
CREATE INDEX IF NOT EXISTS "activity_logs_timestamp_idx" ON "activity_logs" ("timestamp");

-- Add composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS "subscriptions_user_status_idx" ON "subscriptions" ("user_id", "status");
CREATE INDEX IF NOT EXISTS "ai_requests_user_status_idx" ON "ai_requests" ("user_id", "status");
CREATE INDEX IF NOT EXISTS "security_scans_user_status_idx" ON "security_scans" ("user_id", "status");
CREATE INDEX IF NOT EXISTS "usage_metrics_user_type_idx" ON "usage_metrics" ("user_id", "type");

-- Add partial indexes for common filters
CREATE INDEX IF NOT EXISTS "active_subscriptions_idx" ON "subscriptions" ("user_id") WHERE "status" = 'active';
CREATE INDEX IF NOT EXISTS "pending_security_scans_idx" ON "security_scans" ("created_at") WHERE "status" = 'pending';
CREATE INDEX IF NOT EXISTS "active_sessions_idx" ON "sessions" ("user_id") WHERE "expires_at" > NOW();

-- Optimize for full-text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS "users_name_search_idx" ON "users" USING gin ((first_name || ' ' || last_name) gin_trgm_ops);

-- Add indexes for foreign key relationships that are frequently joined
CREATE INDEX IF NOT EXISTS "team_members_team_id_idx" ON "team_members" ("team_id");
CREATE INDEX IF NOT EXISTS "team_members_user_role_idx" ON "team_members" ("user_id", "role");
