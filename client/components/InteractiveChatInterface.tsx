import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
  typing?: boolean;
}

export function InteractiveChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Welcome to FeexSystems AI IntelliSense! I'm here to help you explore our platform. What would you like to know?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes("pricing") || lowerInput.includes("cost") || lowerInput.includes("price")) {
      return "💰 Our pricing is flexible! We offer Starter ($29/month), Professional ($79/month), and Enterprise ($299/month) plans. All include AI analytics, with annual discounts of 20%. Which plan interests you most?";
    }
    
    if (lowerInput.includes("demo") || lowerInput.includes("try") || lowerInput.includes("test")) {
      return "🚀 Absolutely! You can start a 14-day free trial right now - no credit card required. Would you like me to guide you through our key features or help you set up a personalized demo?";
    }
    
    if (lowerInput.includes("feature") || lowerInput.includes("capability") || lowerInput.includes("what can")) {
      return "⚡ FeexSystems offers AI Intelligence for predictive analytics, DevOps Automation for seamless workflows, Security Shield for threat detection, and comprehensive Analytics Dashboards. Which area would you like to explore first?";
    }
    
    if (lowerInput.includes("security") || lowerInput.includes("safe") || lowerInput.includes("privacy")) {
      return "🔒 Security is our top priority! We're SOC 2 Type II certified, ISO 27001 compliant, GDPR ready, and HIPAA compliant. Your data is encrypted end-to-end with enterprise-grade protection.";
    }
    
    if (lowerInput.includes("integration") || lowerInput.includes("connect") || lowerInput.includes("api")) {
      return "🔗 We integrate with 200+ tools including Slack, GitHub, AWS, Docker, and more. Our REST API and webhooks make custom integrations seamless. Need help with a specific integration?";
    }
    
    if (lowerInput.includes("support") || lowerInput.includes("help") || lowerInput.includes("contact")) {
      return "🛟 Our support team is here 24/7! Premium users get priority support with <2 hour response time. You can reach us via chat, email, or schedule a call. What can I help you with?";
    }

    if (lowerInput.includes("hello") || lowerInput.includes("hi") || lowerInput.includes("hey")) {
      return "👋 Hello! Great to meet you! I'm your AI assistant for FeexSystems. I can help you learn about our platform, pricing, features, or answer any questions. What interests you most?";
    }
    
    return "🤔 That's an interesting question! I'd love to help you with that. Could you tell me more about what you're looking for? I can provide information about our features, pricing, integrations, or schedule a demo with our team.";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = generateResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const suggestionChips = [
    "Show me pricing plans",
    "Schedule a demo",
    "Security features",
    "Available integrations",
    "How does AI work?",
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="glass-card p-4 text-mint-green hover:text-white hover:bg-mint-green/20 transition-all duration-300 animate-glassmorphism-float group"
        >
          <div className="relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-mint-green rounded-full animate-pulse"></div>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] glass-card animate-glassmorphism-float">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-mint-green to-mint-neon rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm mono">AI</span>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI Assistant</h3>
            <p className="text-xs text-muted-foreground">Online • Usually responds in minutes</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[400px] matrix-bg">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                message.sender === "user"
                  ? "bg-mint-green text-white ml-4"
                  : "glass-card mr-4"
              } transition-all duration-300 hover:scale-105`}
            >
              <p className="text-sm">{message.text}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="glass-card p-3 rounded-2xl mr-4">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-mint-green rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-mint-green rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-mint-green rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="px-4 py-2 border-t border-white/10">
        <div className="flex flex-wrap gap-2">
          {suggestionChips.map((chip, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(chip)}
              className="px-3 py-1 text-xs glass rounded-full hover:bg-mint-green/20 hover:text-mint-green transition-all duration-300 transform hover:scale-105"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="flex-1 p-3 glass rounded-xl focus:outline-none focus:ring-2 focus:ring-mint-green focus:border-transparent placeholder-muted-foreground/50"
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className="p-3 bg-mint-green text-white rounded-xl hover:bg-mint-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 animate-pulse-green"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
