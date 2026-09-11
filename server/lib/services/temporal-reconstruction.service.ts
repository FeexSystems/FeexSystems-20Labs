/**
 * Commit-level / date-level temporal reconstruction over world_model_events.
 *
 * Reconstructs a best-effort project snapshot: events up to a cutoff,
 * last-known artifacts, and related technologies at that point.
 */

import { prisma } from "../database";
import { ensureWorldModelTables } from "./github-pinned.service";

export interface TemporalQuery {
  projectId: string;
  /** ISO date or commit SHA */
  at?: string;
  commitSha?: string;
  limit?: number;
}

export interface TemporalSnapshot {
  projectId: string;
  cutoff: {
    mode: "commit" | "date" | "latest";
    value: string | null;
  };
  project: Record<string, unknown> | null;
  events: Array<{
    id: string;
    eventType: string;
    commitSha: string | null;
    changedPaths: unknown;
    occurredAt: string;
  }>;
  artifactsAsOf: Array<{
    path: string;
    sha: string;
    kind: string;
    updatedAt: string;
  }>;
  technologies: string[];
  explanation: string;
}

export async function reconstructProjectState(query: TemporalQuery): Promise<TemporalSnapshot> {
  await ensureWorldModelTables();
  const projectId = query.projectId.trim();
  const limit = Math.min(query.limit ?? 50, 200);

  let project: any = null;
  try {
    const rows: any[] = await prisma.$queryRawUnsafe(
      `SELECT id, repository, name, owner, url, description, metadata, last_observed_at AS "lastObservedAt"
       FROM world_model_projects WHERE id = $1 LIMIT 1`,
      projectId
    );
    project = rows[0] || null;
  } catch {
    project = null;
  }

  let cutoffMode: TemporalSnapshot["cutoff"]["mode"] = "latest";
  let cutoffValue: string | null = null;
  let events: any[] = [];

  try {
    if (query.commitSha) {
      cutoffMode = "commit";
      cutoffValue = query.commitSha;
      // Events at or before the first matching commit event, else all events with that sha
      events = await prisma.$queryRawUnsafe(
        `
        SELECT id, event_type AS "eventType", commit_sha AS "commitSha",
               changed_paths AS "changedPaths", payload, occurred_at AS "occurredAt"
        FROM world_model_events
        WHERE project_id = $1
          AND (
            commit_sha = $2
            OR occurred_at <= COALESCE(
              (SELECT occurred_at FROM world_model_events WHERE project_id = $1 AND commit_sha = $2 ORDER BY occurred_at ASC LIMIT 1),
              NOW()
            )
          )
        ORDER BY occurred_at ASC
        LIMIT $3
        `,
        projectId,
        query.commitSha,
        limit
      );
    } else if (query.at) {
      cutoffMode = "date";
      cutoffValue = query.at;
      const at = new Date(query.at);
      events = await prisma.$queryRawUnsafe(
        `
        SELECT id, event_type AS "eventType", commit_sha AS "commitSha",
               changed_paths AS "changedPaths", payload, occurred_at AS "occurredAt"
        FROM world_model_events
        WHERE project_id = $1 AND occurred_at <= $2::timestamptz
        ORDER BY occurred_at ASC
        LIMIT $3
        `,
        projectId,
        at.toISOString(),
        limit
      );
    } else {
      events = await prisma.$queryRawUnsafe(
        `
        SELECT id, event_type AS "eventType", commit_sha AS "commitSha",
               changed_paths AS "changedPaths", payload, occurred_at AS "occurredAt"
        FROM world_model_events
        WHERE project_id = $1
        ORDER BY occurred_at DESC
        LIMIT $2
        `,
        projectId,
        limit
      );
      events = [...events].reverse();
    }
  } catch {
    events = [];
  }

  // Artifacts: best-effort current set filtered by paths seen in events before cutoff
  const pathsSeen = new Set<string>();
  for (const e of events) {
    const paths = Array.isArray(e.changedPaths) ? e.changedPaths : [];
    for (const p of paths) if (typeof p === "string") pathsSeen.add(p);
  }

  let artifacts: any[] = [];
  try {
    if (pathsSeen.size) {
      artifacts = await prisma.$queryRawUnsafe(
        `
        SELECT path, sha, kind, updated_at AS "updatedAt"
        FROM world_model_artifacts
        WHERE project_id = $1 AND path = ANY($2::text[])
        ORDER BY path ASC
        `,
        projectId,
        [...pathsSeen]
      );
    } else {
      artifacts = await prisma.$queryRawUnsafe(
        `
        SELECT path, sha, kind, updated_at AS "updatedAt"
        FROM world_model_artifacts
        WHERE project_id = $1
        ORDER BY updated_at DESC
        LIMIT 40
        `,
        projectId
      );
    }
  } catch {
    artifacts = [];
  }

  let technologies: string[] = [];
  try {
    const techRows: any[] = await prisma.$queryRawUnsafe(
      `
      SELECT t.name
      FROM world_model_relationships r
      JOIN world_model_technologies t ON t.id = r.target_id
      WHERE r.source_id = $1 AND r.relation = 'USES'
      ORDER BY t.name ASC
      `,
      projectId
    );
    technologies = techRows.map((t) => t.name);
  } catch {
    technologies = [];
  }

  const explanation = project
    ? `Temporal reconstruction for ${project.name} (${projectId}): mode=${cutoffMode}` +
      (cutoffValue ? ` at ${cutoffValue}` : "") +
      `. ${events.length} event(s), ${artifacts.length} artifact path(s), ${technologies.length} technology relation(s). ` +
      `Note: artifact SHAs reflect last observed state for paths seen in the event window; full historical blob replay is not yet available.`
    : `Project ${projectId} was not found in the World Model.`;

  return {
    projectId,
    cutoff: { mode: cutoffMode, value: cutoffValue },
    project,
    events: events.map((e) => ({
      id: e.id,
      eventType: e.eventType,
      commitSha: e.commitSha,
      changedPaths: e.changedPaths,
      occurredAt: e.occurredAt instanceof Date ? e.occurredAt.toISOString() : String(e.occurredAt),
    })),
    artifactsAsOf: artifacts.map((a) => ({
      path: a.path,
      sha: a.sha,
      kind: a.kind,
      updatedAt: a.updatedAt instanceof Date ? a.updatedAt.toISOString() : String(a.updatedAt),
    })),
    technologies,
    explanation,
  };
}

export async function listProjectEvents(projectId: string, limit = 50) {
  await ensureWorldModelTables();
  try {
    return await prisma.$queryRawUnsafe(
      `
      SELECT id, event_type AS "eventType", commit_sha AS "commitSha",
             changed_paths AS "changedPaths", occurred_at AS "occurredAt"
      FROM world_model_events
      WHERE project_id = $1
      ORDER BY occurred_at DESC
      LIMIT $2
      `,
      projectId,
      Math.min(limit, 200)
    );
  } catch {
    return [];
  }
}
