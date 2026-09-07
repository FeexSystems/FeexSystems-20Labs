import { prisma } from "../database";

type PinnedRepository = {
  name: string;
  fullName: string;
  url: string;
  description: string | null;
  source: "github-profile-pinned" | "environment";
};

const PROFILE_URL = "https://github.com/FeexSystems";

function configuredPinnedRepositories(): PinnedRepository[] {
  const raw = process.env.GITHUB_PINNED_REPOSITORIES?.trim();
  if (!raw) return [];

  return raw.split(",").map((value) => value.trim()).filter(Boolean).map((repository) => ({
    name: repository.split("/").pop() || repository,
    fullName: repository.includes("/") ? repository : `FeexSystems/${repository}`,
    url: `https://github.com/${repository.includes("/") ? repository : `FeexSystems/${repository}`}`,
    description: null,
    source: "environment" as const,
  }));
}

/** GitHub REST has no pinned-repository endpoint, so the MVP reads the public profile markup and keeps an explicit env fallback. */
export async function discoverPinnedRepositories(): Promise<PinnedRepository[]> {
  const configured = configuredPinnedRepositories();
  if (configured.length > 0) return configured;

  const response = await fetch(PROFILE_URL, {
    headers: { Accept: "text/html", "User-Agent": "FEEXSYSTEMS-World-Model/1.0" },
  });
  if (!response.ok) throw new Error(`GitHub profile request failed: ${response.status}`);

  const html = await response.text();
  const pinnedSection = html.match(/pinned-item-list[^>]*>([\s\S]*?)<\/ol>/i)?.[1] || html;
  const repositories = new Map<string, PinnedRepository>();
  const linkPattern = /href=["']\/FeexSystems\/([^"'#?]+)["'][^>]*>/gi;
  let match: RegExpExecArray | null;

  while ((match = linkPattern.exec(pinnedSection)) !== null) {
    const name = match[1].replace(/\/$/, "");
    if (!name || name.startsWith(".") || repositories.has(name)) continue;
    repositories.set(name, { name, fullName: `FeexSystems/${name}`, url: `https://github.com/FeexSystems/${name}`, description: null, source: "github-profile-pinned" });
  }

  return Array.from(repositories.values()).slice(0, 6);
}

export async function ensureWorldModelTables() {
  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS world_model_projects (
    id TEXT PRIMARY KEY,
    repository TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    owner TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    visibility TEXT,
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    source TEXT NOT NULL DEFAULT 'github',
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    first_observed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_observed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);

  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS world_model_evidence (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES world_model_projects(id) ON DELETE CASCADE,
    evidence_type TEXT NOT NULL,
    source_url TEXT NOT NULL,
    source_ref TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    observed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);

  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS world_model_projects_pinned_idx ON world_model_projects(is_pinned)`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS world_model_evidence_project_idx ON world_model_evidence(project_id)`);
}

export async function syncPinnedProjects() {
  await ensureWorldModelTables();
  const repositories = await discoverPinnedRepositories();

  for (const repository of repositories) {
    const id = `github:${repository.fullName}`;
    const metadata = JSON.stringify({ discovery: repository.source, profile: PROFILE_URL });

    await prisma.$executeRawUnsafe(
      `INSERT INTO world_model_projects
        (id, repository, name, owner, url, description, is_pinned, source, metadata, last_observed_at)
       VALUES ($1, $2, $3, $4, $5, $6, TRUE, $7, $8::jsonb, NOW())
       ON CONFLICT (repository) DO UPDATE SET
         name = EXCLUDED.name,
         url = EXCLUDED.url,
         description = COALESCE(EXCLUDED.description, world_model_projects.description),
         is_pinned = TRUE,
         source = EXCLUDED.source,
         metadata = EXCLUDED.metadata,
         last_observed_at = NOW()`,
      id,
      repository.fullName,
      repository.name,
      "FeexSystems",
      repository.url,
      repository.description,
      repository.source,
      metadata,
    );

    await prisma.$executeRawUnsafe(
      `INSERT INTO world_model_evidence (id, project_id, evidence_type, source_url, source_ref, metadata)
       VALUES ($1, $2, 'repository-discovery', $3, $4, $5::jsonb)
       ON CONFLICT (id) DO UPDATE SET observed_at = NOW(), metadata = EXCLUDED.metadata`,
      `evidence:${repository.fullName}`,
      id,
      repository.url,
      "profile-pinned",
      metadata,
    );
  }

  return repositories;
}

export async function getPinnedWorldModelProjects() {
  await ensureWorldModelTables();
  return prisma.$queryRawUnsafe(`SELECT id, repository, name, owner, url, description, visibility,
    is_pinned AS "isPinned", source, metadata, first_observed_at AS "firstObservedAt",
    last_observed_at AS "lastObservedAt"
    FROM world_model_projects WHERE is_pinned = TRUE ORDER BY last_observed_at DESC`);
}
