/**
 * Hybrid graph + vector + keyword ranking for Navigator / Omni grounding.
 *
 * Score fusion:
 *   final = w_keyword * keyword + w_vector * vector + w_graph * graphEvidence + w_recency * recency
 */

import { retrieveWorld } from "./github-pinned.service";
import { similaritySearch, type SimilarityHit } from "./embedding.service";
import { prisma } from "../database";

const W_KEYWORD = 0.35;
const W_VECTOR = 0.4;
const W_GRAPH = 0.15;
const W_RECENCY = 0.1;

export interface HybridRetrievalResult {
  query: string;
  explanation: string;
  projects: any[];
  technologies: any[];
  artifacts: any[];
  groundedEvidenceCount: number;
  ranking: {
    mode: "hybrid" | "keyword-only";
    vectorHits: number;
    weights: { keyword: number; vector: number; graph: number; recency: number };
  };
}

function clamp01(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function keywordScore(query: string, text: string): number {
  const q = query.toLowerCase().split(/\W+/).filter((t) => t.length > 2);
  if (!q.length) return 0;
  const hay = (text || "").toLowerCase();
  let hits = 0;
  for (const t of q) if (hay.includes(t)) hits++;
  return clamp01(hits / q.length);
}

function recencyScore(iso?: string | Date | null): number {
  if (!iso) return 0.3;
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return 0.3;
  const days = (Date.now() - t) / (1000 * 60 * 60 * 24);
  if (days < 7) return 1;
  if (days < 30) return 0.8;
  if (days < 90) return 0.6;
  if (days < 365) return 0.4;
  return 0.25;
}

async function graphEvidenceScores(projectIds: string[]): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  if (!projectIds.length) return map;
  try {
    const rows: any[] = await prisma.$queryRawUnsafe(
      `
      SELECT project_id AS id, COUNT(*)::int AS c
      FROM world_model_artifacts
      WHERE project_id = ANY($1::text[])
      GROUP BY project_id
      `,
      projectIds
    );
    const max = Math.max(1, ...rows.map((r) => r.c || 0));
    for (const r of rows) map.set(r.id, clamp01((r.c || 0) / max));
  } catch {
    /* offline */
  }
  return map;
}

export async function retrieveWorldHybrid(
  query: string,
  limit = 12
): Promise<HybridRetrievalResult> {
  const trimmed = query.trim();

  // Keyword / structured path (existing World Model retrieval)
  const base = await retrieveWorld(trimmed, limit * 2);

  // Vector path
  let vectorHits: SimilarityHit[] = [];
  try {
    vectorHits = await similaritySearch(trimmed, { limit: limit * 2 });
  } catch {
    vectorHits = [];
  }

  const vectorByProject = new Map<string, number>();
  const vectorByTechName = new Map<string, number>();
  for (const h of vectorHits) {
    if (h.entityType === "project") {
      vectorByProject.set(h.entityId, Math.max(vectorByProject.get(h.entityId) || 0, h.score));
    }
    if (h.entityType === "technology") {
      const name = (h.metadata as any)?.name || h.content.split("\n")[0];
      if (name) vectorByTechName.set(String(name).toLowerCase(), Math.max(vectorByTechName.get(String(name).toLowerCase()) || 0, h.score));
    }
  }

  // Merge project candidates from keyword + vector ids
  const projectMap = new Map<string, any>();
  for (const p of base.projects || []) projectMap.set(p.id, { ...p });

  // Fetch any vector-only project ids not in keyword results
  const missingIds = [...vectorByProject.keys()].filter((id) => !projectMap.has(id));
  if (missingIds.length) {
    try {
      const extra: any[] = await prisma.$queryRawUnsafe(
        `SELECT id,repository,name,description,url,metadata,last_observed_at AS "lastObservedAt"
         FROM world_model_projects WHERE id = ANY($1::text[])`,
        missingIds
      );
      for (const p of extra) projectMap.set(p.id, p);
    } catch {
      /* ignore */
    }
  }

  const graphScores = await graphEvidenceScores([...projectMap.keys()]);

  const rankedProjects = [...projectMap.values()]
    .map((p) => {
      const kw = keywordScore(
        trimmed,
        `${p.name} ${p.repository} ${p.description || ""} ${JSON.stringify(p.metadata || {})}`
      );
      const vec = vectorByProject.get(p.id) || 0;
      const graph = graphScores.get(p.id) || 0;
      const rec = recencyScore(p.lastObservedAt);
      const score =
        W_KEYWORD * kw + W_VECTOR * vec + W_GRAPH * graph + W_RECENCY * rec;
      return { ...p, _hybridScore: score, _scores: { keyword: kw, vector: vec, graph, recency: rec } };
    })
    .sort((a, b) => b._hybridScore - a._hybridScore)
    .slice(0, limit);

  const rankedTechs = (base.technologies || [])
    .map((t: any) => {
      const kw = keywordScore(trimmed, t.name || "");
      const vec = vectorByTechName.get(String(t.name || "").toLowerCase()) || 0;
      const score = W_KEYWORD * kw + W_VECTOR * vec + 0.2;
      return { ...t, _hybridScore: score };
    })
    .sort((a: any, b: any) => b._hybridScore - a._hybridScore)
    .slice(0, limit);

  const mode = vectorHits.length > 0 ? "hybrid" : "keyword-only";

  let explanation = base.explanation || "";
  if (mode === "hybrid" && rankedProjects.length) {
    explanation = `Hybrid retrieval (keyword + vector + graph) for "${trimmed}" ranked ${rankedProjects.length} project(s). Top match: ${rankedProjects[0]?.name} (score ${rankedProjects[0]?._hybridScore?.toFixed?.(3) ?? "?"}). ${vectorHits.length} vector hit(s) contributed to ranking.`;
  }

  return {
    query: trimmed,
    explanation,
    projects: rankedProjects,
    technologies: rankedTechs,
    artifacts: base.artifacts || [],
    groundedEvidenceCount: rankedProjects.length + (base.artifacts?.length || 0),
    ranking: {
      mode,
      vectorHits: vectorHits.length,
      weights: {
        keyword: W_KEYWORD,
        vector: W_VECTOR,
        graph: W_GRAPH,
        recency: W_RECENCY,
      },
    },
  };
}
