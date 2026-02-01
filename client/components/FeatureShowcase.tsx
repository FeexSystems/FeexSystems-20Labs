import { useState, useEffect, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { Brain, Settings, Shield, BarChart3, Check, ArrowRight } from "lucide-react";

// Lazy load WebGL component
const NeuralNetwork = lazy(() =>
  import('./webgl/NeuralNetwork').then(mod => ({ default: mod.NeuralNetwork }))
);

export function FeatureShowcase() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 },
    );

    const section = document.getElementById("features");
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-cycle through features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      id: "ai-intelligence",
      title: "AI-Powered Intelligence",
      description:
        "Advanced machine learning algorithms that analyze complex data patterns and provide actionable insights in real-time.",
      icon: Brain,
      benefits: [
        "96.8% prediction accuracy",
        "Real-time data processing",
        "Automated decision making",
        "Custom ML model training",
      ],
      gradient: "from-primary to-emerald-400",
    },
    {
      id: "devops",
      title: "Smart DevOps Automation",
      description:
        "Fully integrated CI/CD pipelines with intelligent scaling and predictive infrastructure management.",
      icon: Settings,
      benefits: [
        "Automated deployments",
        "Smart resource scaling",
        "Predictive maintenance",
        "Cost optimization",
      ],
      gradient: "from-blue-500 to-cyan-400",
    },
    {
      id: "security",
      title: "Proactive Security",
      description:
        "Next-generation threat detection and prevention with ML-powered vulnerability scanning and real-time protection.",
      icon: Shield,
      benefits: [
        "Threat detection in 12s",
        "Zero-day protection",
        "Compliance automation",
        "Security insights",
      ],
      gradient: "from-orange-500 to-yellow-400",
    },
    {
      id: "analytics",
      title: "Intelligent Analytics",
      description:
        "Comprehensive dashboards with interactive visualizations that turn complex data into simple, actionable insights.",
      icon: BarChart3,
      benefits: [
        "Custom dashboard builder",
        "Real-time data streaming",
        "Predictive analytics",
        "Automated reporting",
      ],
      gradient: "from-purple-500 to-pink-400",
    },
  ];

  const integrations = [
    { name: "Slack", icon: "💬", connected: true },
    { name: "GitHub", icon: "🐙", connected: true },
    { name: "AWS", icon: "☁️", connected: true },
    { name: "Docker", icon: "🐳", connected: true },
    { name: "Kubernetes", icon: "⚓", connected: false },
    { name: "Terraform", icon: "🏗️", connected: true },
  ];

  const ActiveIcon = features[activeFeature].icon;

  return (
    <section
      id="features"
      className="relative py-24 bg-muted/30 overflow-hidden"
    >
      {/* Neural Network WebGL Background */}
      <Suspense fallback={null}>
        <NeuralNetwork nodeCount={60} className="opacity-40" />
      </Suspense>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div
          className={`text-center mb-20 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-6">
            <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
            <span>Platform Features</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Everything you need to
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
              {" "}scale your business
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Powerful AI-driven tools and automation that help you build, deploy,
            and scale your applications with confidence.
          </p>
        </div>

        {/* Interactive Feature Showcase */}
        <div
          className={`mb-20 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          {/* Feature Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <button
                  key={feature.id}
                  onClick={() => setActiveFeature(index)}
                  className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeFeature === index
                    ? `bg-gradient-to-r ${feature.gradient} text-white shadow-lg transform scale-105`
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                    }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {feature.title}
                </button>
              );
            })}
          </div>

          {/* Active Feature Display */}
          <div className="bg-card border border-border rounded-2xl p-8 lg:p-12 shadow-xl hover:border-primary/20 transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div>
                <div className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${features[activeFeature].gradient} bg-opacity-10 rounded-full text-sm font-medium mb-6`}>
                  <ActiveIcon className="w-5 h-5 mr-2 text-white" />
                  <span className="text-white">{features[activeFeature].title}</span>
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                  {features[activeFeature].title}
                </h3>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {features[activeFeature].description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {features[activeFeature].benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/register"
                    className={`inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r ${features[activeFeature].gradient} text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
                  >
                    Try This Feature
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                  <button className="px-6 py-3 border border-border text-foreground font-semibold rounded-lg hover:bg-muted transition-colors">
                    Learn More
                  </button>
                </div>
              </div>

              {/* Visual */}
              <div className="relative">
                <div className={`aspect-square bg-gradient-to-br ${features[activeFeature].gradient} opacity-10 rounded-2xl p-8 flex items-center justify-center relative overflow-hidden`}>
                  {/* Animated background elements */}
                  <div className="absolute inset-0">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-3 h-3 bg-primary/20 rounded-full animate-pulse"
                        style={{
                          top: `${15 + Math.random() * 70}%`,
                          left: `${15 + Math.random() * 70}%`,
                          animationDelay: `${i * 150}ms`,
                        }}
                      ></div>
                    ))}
                  </div>

                  {/* Main visual element */}
                  <div className="relative z-10 text-center">
                    <div className={`w-32 h-32 bg-gradient-to-br ${features[activeFeature].gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl`}>
                      <ActiveIcon className="w-16 h-16 text-white" />
                    </div>
                    <div className="w-48 h-2 bg-muted rounded-full mx-auto overflow-hidden">
                      <div
                        className={`h-2 bg-gradient-to-r ${features[activeFeature].gradient} rounded-full animate-pulse`}
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Integrations Section */}
        <div
          className={`transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Integrates with your favorite tools
            </h3>
            <p className="text-muted-foreground">
              Connect seamlessly with the tools you already use
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {integrations.map((integration) => (
              <div
                key={integration.name}
                className={`bg-card border rounded-xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${integration.connected
                  ? "border-primary/30 hover:border-primary"
                  : "border-border hover:border-muted-foreground"
                  }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">{integration.icon}</div>
                  <div className="font-medium text-foreground text-sm mb-2">
                    {integration.name}
                  </div>
                  <div
                    className={`text-xs px-3 py-1 rounded-full inline-block ${integration.connected
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                      }`}
                  >
                    {integration.connected ? "Connected" : "Available"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
