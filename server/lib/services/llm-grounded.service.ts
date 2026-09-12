/**
 * LLM Grounded Answer Service — FeexSystems Living Intelligence
 *
 * Provider-neutral grounded answer generation over World Model retrieval context.
 * Uses raw fetch (no SDK dependency) alongside gemini.service.ts.
 *
 * Invariants:
 * - World Model is Authoritative: only explains retrieval, never invents facts.
 * - Provider-Neutral: Gemini → OpenAI → template, order driven by DEFAULT_AI_PROVIDER.
 * - Non-Blocking: missing keys → graceful template fallback, explicit provider: "none".
 * - Honest UI: always returns usedFallback flag for client badge display.
 */

export type LlmProviderId = "gemini" | "openai" | "none";

export interface GroundedContext {
  query: string;
  explanation?: string;
  projects?: Array<{
    id?: string;
    name: string;
    repository?: string;
    description?: string;
    url?: string;
  }>;
  technologies?: Array<{ name: string; projectCount?: number }>;
  artifacts?: Array<{ path: string; sha?: string; kind?: string }>;
  ranking?: { mode?: string; vectorHits?: number };
}

export interface GroundedAnswer {
  text: string;
  provider: LlmProviderId;
  model?: string;
  usedFallback: boolean;
  suggestions: string[];
}

// ── System prompt ────────────────────────────────────────────────────────────

const SYSTEM = `You are Bushfeexer / FEEXSYSTEMS Living Intelligence assistant.
You answer ONLY from the provided World Model context.
Rules:
- Do not invent repositories, SHAs, or projects absent from context.
- If context is thin, say so and suggest syncing the World Model.
- Prefer short, structured answers with bullet evidence.
- Tone: precise, engineering, confident but honest.`;

// ── Prompt builder ───────────────────────────────────────────────────────────

function buildUserPrompt(ctx: GroundedContext): string {
  return [
    `User query: ${ctx.query}`,
    ``,
    `Retrieval mode: ${ctx.ranking?.mode || "unknown"} (vectorHits=${ctx.ranking?.vectorHits ?? 0})`,
    `Template note: ${ctx.explanation || "(none)"}`,
    ``,
    `Projects:`,
    ...(ctx.projects || []).slice(0, 12).map(
      (p) =>
        `- ${p.name} | ${p.repository || p.id || ""} | ${p.description || ""} | ${p.url || ""}`
    ),
    ``,
    `Technologies:`,
    ...(ctx.technologies || []).slice(0, 12).map(
      (t) => `- ${t.name} (${t.projectCount ?? "?"} projects)`
    ),
    ``,
    `Artifacts:`,
    ...(ctx.artifacts || []).slice(0, 12).map(
      (a) => `- ${a.path} sha:${a.sha?.slice(0, 12) || "—"} (${a.kind || "file"})`
    ),
    ``,
    `Write a grounded answer for the user.`,
  ].join("\n");
}

// ── Template fallback (no LLM keys) ─────────────────────────────────────────

function templateAnswer(ctx: GroundedContext): GroundedAnswer {
  const lines: string[] = [];
  if (ctx.explanation) lines.push(ctx.explanation);
  if (ctx.projects?.length) {
    lines.push("", "**Projects**");
    for (const p of ctx.projects.slice(0, 5)) {
      lines.push(
        `- **${p.name}**${p.repository ? ` (\`${p.repository}\`)` : ""}`
      );
    }
  }
  if (ctx.technologies?.length) {
    lines.push("", "**Technologies**");
    for (const t of ctx.technologies.slice(0, 6)) lines.push(`- ${t.name}`);
  }
  if (!ctx.projects?.length && !ctx.technologies?.length) {
    lines.push(
      "No strong World Model matches yet. Run GitHub sync / embedding reindex, or try a project or technology name."
    );
  }
  const suggestions = [
    ...(ctx.projects || []).slice(0, 2).map((p) => `Tell me about ${p.name}`),
    "Show me the architecture graph",
    "What evidence backs this?",
  ].slice(0, 4);

  return {
    text: lines.join("\n"),
    provider: "none",
    usedFallback: true,
    suggestions,
  };
}

// ── Provider call helpers ────────────────────────────────────────────────────

async function callGemini(
  system: string,
  user: string
): Promise<{ text: string; model: string } | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  // Default to gemini-2.0-flash for the grounded REST path
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: `${system}\n\n${user}` }] }],
        generationConfig: { temperature: 0.25, maxOutputTokens: 1024 },
      }),
    });
    if (!res.ok) {
      console.warn(
        "[llm-grounded] Gemini HTTP",
        res.status,
        await res.text().catch(() => "")
      );
      return null;
    }
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text ? { text, model } : null;
  } catch (e) {
    console.warn("[llm-grounded] Gemini fetch error:", e);
    return null;
  }
}

async function callOpenAI(
  system: string,
  user: string
): Promise<{ text: string; model: string } | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  const model = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.25,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
    if (!res.ok) {
      console.warn("[llm-grounded] OpenAI HTTP", res.status);
      return null;
    }
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;
    return text ? { text, model } : null;
  } catch (e) {
    console.warn("[llm-grounded] OpenAI fetch error:", e);
    return null;
  }
}

// ── Main export ──────────────────────────────────────────────────────────────

export async function generateGroundedAnswer(
  ctx: GroundedContext
): Promise<GroundedAnswer> {
  const user = buildUserPrompt(ctx);
  const preferred = (
    process.env.DEFAULT_AI_PROVIDER || "gemini"
  ).toLowerCase();

  // Build try order: preferred provider first, then the other
  type ProviderFn = () => Promise<{ text: string; model: string } | null>;
  const geminiFirst: [ProviderFn, LlmProviderId][] = [
    [() => callGemini(SYSTEM, user), "gemini"],
    [() => callOpenAI(SYSTEM, user), "openai"],
  ];
  const openaiFirst: [ProviderFn, LlmProviderId][] = [
    [() => callOpenAI(SYSTEM, user), "openai"],
    [() => callGemini(SYSTEM, user), "gemini"],
  ];
  const tryOrder = preferred === "openai" ? openaiFirst : geminiFirst;

  for (const [fn, providerId] of tryOrder) {
    try {
      const out = await fn();
      if (out?.text) {
        const suggestions = [
          ...(ctx.projects || [])
            .slice(0, 2)
            .map((p) => `Tell me about ${p.name}`),
          "Show architecture",
          "Show evidence",
        ].slice(0, 4);
        return {
          text: out.text,
          provider: providerId,
          model: out.model,
          usedFallback: false,
          suggestions,
        };
      }
    } catch (e) {
      console.warn("[llm-grounded] provider error", e);
    }
  }

  return templateAnswer(ctx);
}

/** Returns a status object describing which LLM providers are configured. */
export async function getLlmProviderStatus(): Promise<{
  gemini: boolean;
  openai: boolean;
  anthropic: boolean;
  default: string;
  geminiModel: string;
}> {
  return {
    gemini: Boolean(process.env.GEMINI_API_KEY),
    openai: Boolean(process.env.OPENAI_API_KEY),
    anthropic: Boolean(process.env.ANTHROPIC_API_KEY),
    default: process.env.DEFAULT_AI_PROVIDER || "gemini",
    geminiModel: process.env.GEMINI_MODEL || "gemini-2.0-flash",
  };
}
