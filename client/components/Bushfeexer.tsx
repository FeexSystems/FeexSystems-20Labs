/**
 * Bushfeexer — FeexSystems Living Intelligence Chat
 *
 * Consolidated from InteractiveChatInterface + LiveChatbot.
 * Primary path: GET /api/world-model/navigator (grounded retrieval + AI explanation).
 * Fallback: local keyword heuristics when the server is unreachable.
 */
import { useState, useRef, useEffect, useCallback } from "react";

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  suggestions?: string[];
  evidenceCount?: number;
  isError?: boolean;
}

interface NavigatorResult {
  explanation: string;
  projects?: Array<{ name: string; description?: string }>;
  technologies?: string[];
  groundedEvidenceCount?: number;
}

/* ─── Heuristic fallback (no-server / graceful degrade) ─── */
function heuristicResponse(query: string): { text: string; suggestions: string[] } {
  const q = query.toLowerCase();

  if (q.match(/pric|cost|plan|\$/)) {
    return {
      text: "💡 FeexSystems offers Starter, Professional, and Enterprise plans. For live pricing backed by the World Model, make sure the server is running so I can fetch the latest data.",
      suggestions: ["Compare plans", "Enterprise features", "Start free trial", "Contact sales"],
    };
  }
  if (q.match(/demo|show|tour/)) {
    return {
      text: "🚀 I'd love to show you FeexSystems in action — AI analytics, real-time threat detection, and automated DevOps workflows. Connect the server for a live, evidence-grounded walkthrough.",
      suggestions: ["Book live demo", "Self-guided tour", "Technical deep-dive"],
    };
  }
  if (q.match(/feature|capabilit|what can/)) {
    return {
      text: "⚡ FeexSystems covers AI Intelligence, DevOps Automation, Security Shield, and Analytics Dashboards. Ask me about any specific area — when the server is live I'll pull real project evidence.",
      suggestions: ["AI features", "DevOps tools", "Security features", "View all features"],
    };
  }
  if (q.match(/security|safe|privacy|soc|iso|gdpr/)) {
    return {
      text: "🔒 Security is our top priority — SOC 2 Type II, ISO 27001, GDPR ready, end-to-end encrypted. Connect the server for evidence-anchored compliance details.",
      suggestions: ["Security whitepaper", "Compliance details", "Data privacy"],
    };
  }
  if (q.match(/integrat|connect|api|webhook/)) {
    return {
      text: "🔗 FeexSystems integrates with GitHub, AWS, Docker, Slack, and 100+ more via REST API and webhooks. I can pull live integration evidence once the server is reachable.",
      suggestions: ["View all integrations", "API documentation", "Custom integration"],
    };
  }
  if (q.match(/support|help|contact/)) {
    return {
      text: "🛟 Support is available 24/7. Reach us at technical@feexsystems.com or via chat. Premium tiers get <2 hr response time.",
      suggestions: ["Technical support", "Billing question", "Report a bug"],
    };
  }
  if (q.match(/hello|hi|hey|start/)) {
    return {
      text: "👋 Hi! I'm Bushfeexer, the FeexSystems Living Intelligence assistant. I'm grounded in the World Model — our live GitHub ecosystem. What would you like to explore?",
      suggestions: ["Tell me about FeexSystems", "Show me pricing plans", "Book a demo", "Technical documentation"],
    };
  }

  return {
    text: "🤔 Great question! I'll give you the most accurate answer when the FeexSystems server is reachable so I can ground my response in real project evidence. In the meantime, here are some popular topics:",
    suggestions: ["Platform overview", "See pricing", "Book demo", "Talk to sales"],
  };
}

/* ─── API call to World Model navigator ─── */
async function queryNavigator(query: string): Promise<{
  text: string;
  suggestions: string[];
  evidenceCount?: number;
}> {
  const res = await fetch(`/api/world-model/navigator?q=${encodeURIComponent(query)}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (res.status === 429) {
    const rateLimitErr = new Error("RATE_LIMIT_EXCEEDED");
    (rateLimitErr as any).status = 429;
    throw rateLimitErr;
  }

  if (!res.ok) throw new Error(`Navigator returned ${res.status}`);

  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Navigator query failed");

  const data: NavigatorResult = json.data;

  // Build dynamic suggestion chips from returned project / tech names
  const projSuggestions = (data.projects || [])
    .slice(0, 2)
    .map((p) => `Tell me about ${p.name}`);
  const techSuggestions = (data.technologies || [])
    .slice(0, 2)
    .map((t) => `How does ${t} fit in?`);
  const suggestions = [...projSuggestions, ...techSuggestions].slice(0, 4);
  if (!suggestions.length) suggestions.push("Tell me more", "See all projects", "Book a demo");

  return {
    text: data.explanation || "Here's what I found in the FeexSystems World Model.",
    suggestions,
    evidenceCount: data.groundedEvidenceCount,
  };
}

/* ─── Component ─── */
export function Bushfeexer() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(scrollToBottom, [messages, scrollToBottom]);

  // Auto-greet on first open
  useEffect(() => {
    if (isOpen && !hasGreeted) {
      const timer = setTimeout(() => {
        const greeting: ChatMessage = {
          id: `greet-${Date.now()}`,
          text: "👋 Hi! I'm **Bushfeexer**, your FeexSystems Living Intelligence assistant. I'm grounded in the real World Model — synced from our live GitHub ecosystem. What would you like to explore?",
          sender: "bot",
          timestamp: new Date(),
          suggestions: [
            "Tell me about FeexSystems",
            "What projects are in the World Model?",
            "Show me the tech stack",
            "How does Evidence Fabric work?",
          ],
        };
        setMessages([greeting]);
        setHasGreeted(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isOpen, hasGreeted]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isTyping) return;

      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        text,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);

      try {
        const { text: responseText, suggestions, evidenceCount } = await queryNavigator(text);
        setMessages((prev) => [
          ...prev,
          {
            id: `b-${Date.now()}`,
            text: responseText,
            sender: "bot",
            timestamp: new Date(),
            suggestions,
            evidenceCount,
          },
        ]);
      } catch (err: any) {
        if (err?.status === 429 || err?.message === "RATE_LIMIT_EXCEEDED" || err?.message?.includes("429")) {
          setMessages((prev) => [
            ...prev,
            {
              id: `b-${Date.now()}`,
              text: "⚠️ **Rate Limit Reached (Max 5 queries per 15 min)**: You have reached the query limit. Please wait a few minutes before querying again, or explore the interactive 3D Galaxy directly.",
              sender: "bot",
              timestamp: new Date(),
              suggestions: ["Explore 3D Galaxy", "View Projects", "Return to Home"],
              isError: true,
            },
          ]);
        } else {
          // Graceful fallback — heuristic responses
          const fallback = heuristicResponse(text);
          setMessages((prev) => [
            ...prev,
            {
              id: `b-${Date.now()}`,
              text: fallback.text,
              sender: "bot",
              timestamp: new Date(),
              suggestions: fallback.suggestions,
              isError: true,
            },
          ]);
        }
      } finally {
        setIsTyping(false);
      }
    },
    [isTyping]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* ── Launcher button ── */}
      <button
        id="bushfeexer-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Bushfeexer AI assistant"
        aria-expanded={isOpen}
        aria-controls="bushfeexer-window"
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center
          bg-black text-white border border-white/30
          hover:border-white hover:shadow-[0_0_24px_rgba(255,255,255,0.2)] transition-all duration-300
          hover:scale-105 ${isOpen ? "rotate-45" : ""}`}
      >
        {isOpen ? (
          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            {/* Live indicator */}
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-white rounded-full animate-pulse border-2 border-black" />
          </div>
        )}
      </button>

      {/* ── Chat window ── */}
      {isOpen && (
        <div
          id="bushfeexer-window"
          role="dialog"
          aria-label="Bushfeexer AI chat"
          className="fixed bottom-24 right-6 z-50 w-96 h-[32rem] flex flex-col overflow-hidden rounded-2xl
            shadow-[0_8px_64px_rgba(0,0,0,0.8)] border border-white/20
            bg-black/95 backdrop-blur-xl font-mono"
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10
              bg-zinc-950/80"
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold bg-white text-black shrink-0">
              FX
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white text-sm truncate">BUSHFEEXER</h3>
              <p className="text-[10px] text-white/50 truncate uppercase tracking-wider">
                Living Intelligence // Monochrome
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/50 hover:text-white shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[84%] space-y-1.5">
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-line
                      ${
                        msg.sender === "user"
                          ? "bg-white text-black font-medium rounded-br-sm shadow"
                          : msg.isError
                          ? "bg-zinc-900 text-white/90 border border-white/30 rounded-bl-sm"
                          : "bg-zinc-900/90 text-white/90 border border-white/10 rounded-bl-sm"
                      }`}
                  >
                    {msg.text}
                  </div>

                  {/* Evidence badge */}
                  {msg.evidenceCount != null && msg.evidenceCount > 0 && (
                    <p className="text-[10px] text-white/40 flex items-center gap-1.5 pl-1 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
                      {msg.evidenceCount} evidence source{msg.evidenceCount !== 1 ? "s" : ""}
                    </p>
                  )}
                  {msg.isError && (
                    <p className="text-[10px] text-white/60 pl-1 font-mono">
                      [LOCAL FALLBACK - SERVER UNREACHABLE]
                    </p>
                  )}

                  {/* Suggestion chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {msg.suggestions.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => sendMessage(s)}
                          className="px-2.5 py-1 text-[10px] font-mono rounded-full border border-white/20
                            text-white/70 hover:text-white hover:border-white
                            hover:bg-white/10 transition-all duration-200"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}

                  <p className="text-[9px] text-white/30 pl-1 font-mono">
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-zinc-900 border border-white/10 px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "120ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "240ms" }} />
                    <span className="text-[10px] text-white/50 ml-1.5 font-mono">REASONING WORLD MODEL…</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/10 bg-black/60">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                id="bushfeexer-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Query World Model..."
                disabled={isTyping}
                aria-label="Chat input"
                className="flex-1 px-3.5 py-2 text-xs font-mono rounded-xl border border-white/20 bg-zinc-900
                  text-white placeholder-white/30 focus:outline-none focus:ring-1
                  focus:ring-white focus:border-white
                  disabled:opacity-50 transition-all"
              />
              <button
                id="bushfeexer-send"
                onClick={() => sendMessage(input)}
                disabled={isTyping || !input.trim()}
                aria-label="Send message"
                className="px-3.5 py-2 rounded-xl bg-white text-black font-semibold
                  hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed
                  transition-all active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-[9px] text-white/30 text-center mt-2 font-mono uppercase tracking-wider">
              FEEXSYSTEMS · MONOCHROME REASONING
            </p>
          </div>
        </div>
      )}
    </>
  );
}
