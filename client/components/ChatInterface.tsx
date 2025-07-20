import { useState, useRef, useEffect } from "react";

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  citations?: string[];
}

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: "Hello! I'm FeexAI, your AI assistant powered by Grok 4 Heavy. I can help you explore our projects, discuss AI development, DevOps, and cybersecurity. What would you like to know?",
      sender: "ai",
      timestamp: new Date(),
      citations: ["Internal Knowledge Base"],
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Simulate API call to backend
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: data.reply,
          sender: "ai",
          timestamp: new Date(),
          citations: [
            "GitHub API",
            "Internal Database",
            "FeexSystems Projects",
          ],
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        throw new Error("Failed to get response");
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm experiencing technical difficulties. Our DevOps team is working on it. Meanwhile, you can explore our GitHub repositories or check our project documentation.",
        sender: "ai",
        timestamp: new Date(),
        citations: ["Error Handler"],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={`fixed ${
        isMinimized
          ? "bottom-4 right-4 w-16 h-16"
          : "bottom-4 right-4 w-96 h-[32rem]"
      } bg-card border border-primary/30 rounded-lg shadow-2xl transition-all duration-300 z-50`}
      style={{
        boxShadow: "0 0 20px rgba(0, 170, 255, 0.3)",
        backdropFilter: "blur(10px)",
      }}
      role="dialog"
      aria-label="FeexAI Chat Assistant"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-3 bg-primary/10 rounded-t-lg border-b border-primary/20 cursor-pointer"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-primary">
            FeexAI Assistant (Grok 4 Clone)
          </span>
        </div>
        <button
          className="text-primary hover:text-primary/80 transition-colors"
          aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
        >
          {isMinimized ? "⬆" : "⬇"}
        </button>
      </div>

      {/* Chat Content */}
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-3 space-y-3 h-80">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground border border-primary/20"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  {message.citations && (
                    <div className="mt-2 pt-2 border-t border-current/20">
                      <p className="text-xs opacity-70">
                        Sources: {message.citations.join(", ")}
                      </p>
                    </div>
                  )}
                  <p className="text-xs opacity-60 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted p-3 rounded-lg border border-primary/20">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-primary/20">
            <div className="flex space-x-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about our AI projects, DevOps, or security..."
                className="flex-1 bg-background border border-primary/30 rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                rows={2}
                disabled={isLoading}
                aria-label="Chat input"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground p-2 rounded-lg transition-colors"
                aria-label="Send message"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Powered by Grok 4 Heavy • DeepSearch Enabled
            </p>
          </div>
        </>
      )}
    </div>
  );
}
