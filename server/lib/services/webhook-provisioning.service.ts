/**
 * Automated GitHub webhook provisioning for World Model repos.
 * Requires GITHUB_TOKEN with admin:repo_hook (or repo) scope and
 * WORLD_MODEL_WEBHOOK_URL + GITHUB_WEBHOOK_SECRET.
 */

import { prisma } from "../database";
import { ensureWorldModelTables } from "./github-pinned.service";

const API = "https://api.github.com";

function ghHeaders() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is required for webhook provisioning");
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function gh(path: string, init?: RequestInit) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { ...ghHeaders(), ...(init?.headers || {}) },
  });
  const text = await res.text();
  let body: any = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!res.ok) {
    throw new Error(`GitHub ${res.status}: ${typeof body === "string" ? body : JSON.stringify(body)}`);
  }
  return body;
}

export interface WebhookRecord {
  repository: string;
  hookId: number | null;
  url: string;
  active: boolean;
  events: string[];
  status: "created" | "exists" | "updated" | "error" | "skipped";
  message?: string;
}

export function getConfiguredWebhookUrl(): string | null {
  return (
    process.env.WORLD_MODEL_WEBHOOK_URL ||
    process.env.GITHUB_WEBHOOK_CALLBACK_URL ||
    null
  );
}

export async function listRepoWebhooks(fullName: string) {
  return gh(`/repos/${fullName}/hooks`);
}

export async function createOrUpdateWorldModelWebhook(fullName: string): Promise<WebhookRecord> {
  const callbackUrl = getConfiguredWebhookUrl();
  const secret = process.env.GITHUB_WEBHOOK_SECRET;

  if (!callbackUrl) {
    return {
      repository: fullName,
      hookId: null,
      url: "",
      active: false,
      events: [],
      status: "skipped",
      message: "WORLD_MODEL_WEBHOOK_URL not configured",
    };
  }
  if (!secret) {
    return {
      repository: fullName,
      hookId: null,
      url: callbackUrl,
      active: false,
      events: [],
      status: "skipped",
      message: "GITHUB_WEBHOOK_SECRET not configured",
    };
  }

  try {
    const hooks: any[] = await listRepoWebhooks(fullName);
    const existing = hooks.find(
      (h) => h.config?.url === callbackUrl || String(h.config?.url || "").includes("/api/world-model/webhook")
    );

    const payload = {
      name: "web",
      active: true,
      events: ["push", "create", "delete"],
      config: {
        url: callbackUrl,
        content_type: "json",
        secret,
        insecure_ssl: "0",
      },
    };

    if (existing) {
      const updated = await gh(`/repos/${fullName}/hooks/${existing.id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      return {
        repository: fullName,
        hookId: updated.id,
        url: callbackUrl,
        active: true,
        events: payload.events,
        status: "updated",
      };
    }

    const created = await gh(`/repos/${fullName}/hooks`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return {
      repository: fullName,
      hookId: created.id,
      url: callbackUrl,
      active: true,
      events: payload.events,
      status: "created",
    };
  } catch (err) {
    return {
      repository: fullName,
      hookId: null,
      url: callbackUrl,
      active: false,
      events: [],
      status: "error",
      message: err instanceof Error ? err.message : String(err),
    };
  }
}

/** Provision webhooks for all World Model projects (or pinned only). */
export async function provisionWebhooksForWorldModel(opts?: {
  pinnedOnly?: boolean;
}): Promise<{ results: WebhookRecord[]; summary: Record<string, number> }> {
  await ensureWorldModelTables();
  let repos: string[] = [];
  try {
    const rows: any[] = await prisma.$queryRawUnsafe(
      opts?.pinnedOnly
        ? `SELECT repository FROM world_model_projects WHERE is_pinned = TRUE ORDER BY last_observed_at DESC`
        : `SELECT repository FROM world_model_projects ORDER BY last_observed_at DESC LIMIT 50`
    );
    repos = rows.map((r) => r.repository).filter(Boolean);
  } catch {
    repos = [];
  }

  const results: WebhookRecord[] = [];
  for (const repository of repos) {
    results.push(await createOrUpdateWorldModelWebhook(repository));
  }

  const summary: Record<string, number> = {};
  for (const r of results) {
    summary[r.status] = (summary[r.status] || 0) + 1;
  }
  return { results, summary };
}
