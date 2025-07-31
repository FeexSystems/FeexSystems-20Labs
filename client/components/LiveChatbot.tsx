import { useState, useRef, useEffect } from "react";

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  suggestions?: string[];
}

export function LiveChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Auto-greet when chatbot opens for the first time
  useEffect(() => {
    if (isOpen && !hasGreeted) {
      setTimeout(() => {
        const greeting: ChatMessage = {
          id: Date.now().toString(),
          text: "👋 Hi! I'm Felix, your AI assistant. I can help you learn about FeexSystems, answer questions about our platform, or guide you to the right resources. What would you like to know?",
          sender: "bot",
          timestamp: new Date(),
          suggestions: [
            "Tell me about FeexSystems",
            "Show me pricing plans",
            "Book a demo",
            "Technical documentation",
          ],
        };
        setMessages([greeting]);
        setHasGreeted(true);
      }, 1000);
    }
  }, [isOpen, hasGreeted]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: textToSend,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateBotResponse(textToSend);
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userInput: string): ChatMessage => {
    const lowerInput = userInput.toLowerCase();

    let responseText = "";
    let suggestions: string[] = [];

    if (
      lowerInput.includes("pricing") ||
      lowerInput.includes("cost") ||
      lowerInput.includes("plan")
    ) {
      responseText =
        "🔥 Great question! FeexSystems offers flexible pricing plans:\n\n💡 **Starter**: $29/month - Perfect for small teams\n🚀 **Professional**: $79/month - Our most popular plan\n🏢 **Enterprise**: $299/month - For large organizations\n\nAll plans include a 14-day free trial and 30-day money-back guarantee. Would you like to start a free trial or learn more about a specific plan?";
      suggestions = [
        "Start free trial",
        "Compare plans",
        "Contact sales",
        "Enterprise features",
      ];
    } else if (lowerInput.includes("demo") || lowerInput.includes("show")) {
      responseText =
        "📅 I'd love to show you FeexSystems in action! Our interactive demos showcase:\n\n• AI-powered analytics dashboard\n• Real-time threat detection\n• Automated DevOps workflows\n• Custom integrations\n\nWould you prefer a live demo with our team or explore our self-guided product tour?";
      suggestions = [
        "Book live demo",
        "Self-guided tour",
        "Watch video demo",
        "Technical deep-dive",
      ];
    } else if (
      lowerInput.includes("feature") ||
      lowerInput.includes("what") ||
      lowerInput.includes("capability")
    ) {
      responseText =
        "🎯 FeexSystems is a comprehensive AI platform offering:\n\n🧠 **AI Intelligence**: Predictive analytics, automated insights\n⚙️ **DevOps Automation**: CI/CD, infrastructure scaling\n🛡️ **Security Suite**: Threat detection, compliance automation\n📊 **Analytics Dashboard**: Real-time monitoring, custom reports\n\nWhich area interests you most?";
      suggestions = [
        "AI features",
        "DevOps tools",
        "Security features",
        "View all features",
      ];
    } else if (
      lowerInput.includes("integrat") ||
      lowerInput.includes("connect") ||
      lowerInput.includes("api")
    ) {
      responseText =
        "🔌 FeexSystems integrates seamlessly with 100+ tools including:\n\n• **Development**: GitHub, GitLab, Bitbucket\n• **Cloud**: AWS, Azure, Google Cloud\n• **Monitoring**: Datadog, New Relic, Splunk\n• **Communication**: Slack, Teams, Discord\n\nWe also provide robust APIs and webhooks for custom integrations. Need help with a specific integration?";
      suggestions = [
        "View all integrations",
        "API documentation",
        "Custom integration",
        "Setup help",
      ];
    } else if (
      lowerInput.includes("support") ||
      lowerInput.includes("help") ||
      lowerInput.includes("contact")
    ) {
      responseText =
        "🤝 We're here to help! FeexSystems offers multiple support channels:\n\n📚 **Documentation**: Comprehensive guides and tutorials\n💬 **Live Chat**: 24/7 support (that's me!)\n📧 **Email Support**: technical@feexsystems.com\n📞 **Phone Support**: For Professional and Enterprise plans\n\nWhat specific help do you need?";
      suggestions = [
        "Technical support",
        "Billing question",
        "Report a bug",
        "Feature request",
      ];
    } else if (
      lowerInput.includes("security") ||
      lowerInput.includes("safe") ||
      lowerInput.includes("privacy")
    ) {
      responseText =
        "🔒 Security is our top priority at FeexSystems:\n\n• **SOC 2 Type II** certified\n• **ISO 27001** compliant\n• **End-to-end encryption** for all data\n• **Zero-trust architecture**\n• **Regular security audits**\n• **GDPR & CCPA** compliant\n\nYour data is protected with bank-level security. Want to learn more about our security measures?";
      suggestions = [
        "Security whitepaper",
        "Compliance details",
        "Data privacy",
        "Audit reports",
      ];
    } else if (
      lowerInput.includes("free") ||
      lowerInput.includes("trial") ||
      lowerInput.includes("start")
    ) {
      responseText =
        "🎉 Yes! You can start with FeexSystems completely free:\n\n✅ **14-day free trial** - Full access to all features\n✅ **No credit card required** to start\n✅ **Free onboarding** and setup assistance\n✅ **Cancel anytime** during trial\n\nReady to transform your business with AI? I can help you get started right now!";
      suggestions = [
        "Start free trial",
        "Setup assistance",
        "Onboarding guide",
        "Pricing details",
      ];
    } else {
      responseText =
        "🤔 That's a great question! I'd be happy to help you learn more about FeexSystems. Our AI-powered platform helps businesses automate their workflows, enhance security, and gain valuable insights from their data.\n\nI can provide information about our features, pricing, demos, or connect you with our team. What would you like to explore?";
      suggestions = [
        "Platform overview",
        "See pricing",
        "Book demo",
        "Talk to sales",
      ];
    }

    return {
      id: (Date.now() + 1).toString(),
      text: responseText,
      sender: "bot",
      timestamp: new Date(),
      suggestions,
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-torch text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 ${
          isOpen ? "rotate-45" : ""
        }`}
        aria-label="Open chat"
      >
        {isOpen ? (
          <svg
            className="w-6 h-6 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <div className="relative">
            <svg
              className="w-6 h-6 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full animate-pulse border-2 border-white"></div>
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[32rem] glass-card z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-torch p-4 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-mint-green/20 rounded-full flex items-center justify-center">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <h3 className="font-semibold">Felix AI Assistant</h3>
                <p className="text-sm opacity-90">
                  Online • Typically replies instantly
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] ${message.sender === "user" ? "order-2" : ""}`}
                >
                  <div
                    className={`p-3 rounded-2xl ${
                      message.sender === "user"
                        ? "bg-mint-green text-white"
                        : "bg-gray-100 text-foreground"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-line">
                      {message.text}
                    </p>
                  </div>

                  {/* Suggestions */}
                  {message.suggestions && (
                    <div className="mt-3 space-y-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="block w-full text-left p-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-mint-green focus:border-transparent"
                disabled={isTyping}
              />
              <button
                onClick={() => handleSend()}
                disabled={isTyping || !input.trim()}
                className="p-3 bg-mint-green text-white rounded-xl hover:bg-mint-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg
                  className="w-5 h-5"
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
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Powered by FeexSystems AI • Available 24/7
            </p>
          </div>
        </div>
      )}
    </>
  );
}
