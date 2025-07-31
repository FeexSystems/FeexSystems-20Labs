import { useState, useEffect } from "react";

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
      icon: "🧠",
      benefits: [
        "96.8% prediction accuracy",
        "Real-time data processing",
        "Automated decision making",
        "Custom ML model training",
      ],
      image:
        "https://cdn.builder.io/o/assets%2Fd861c8115257469c9c2c0c03f0272845%2F829ecb38245545d78ffe1d8294c0db86?alt=media&token=7d184244-f3a0-4645-aa56-0a5be870d6b5&apiKey=d861c8115257469c9c2c0c03f0272845",
      color: "mint-green",
    },
    {
      id: "devops-automation",
      title: "DevOps Automation Suite",
      description:
        "Streamline your entire development lifecycle with intelligent automation, from code deployment to infrastructure scaling.",
      icon: "⚙️",
      benefits: [
        "45% faster deployments",
        "99.9% uptime guarantee",
        "Auto-scaling infrastructure",
        "Zero-downtime deployments",
      ],
      color: "mint-neon",
    },
    {
      id: "security-shield",
      title: "Advanced Security Shield",
      description:
        "Proactive threat detection and prevention using AI-powered security algorithms that protect your systems 24/7.",
      icon: "🛡️",
      benefits: [
        "Real-time threat detection",
        "98.5% attack prevention",
        "Compliance automation",
        "Zero-trust architecture",
      ],
      color: "deepmind-blue",
    },
    {
      id: "analytics-dashboard",
      title: "Intelligent Analytics",
      description:
        "Comprehensive dashboards with interactive visualizations that turn complex data into simple, actionable insights.",
      icon: "📊",
      benefits: [
        "Custom dashboard builder",
        "Real-time data streaming",
        "Predictive analytics",
        "Automated reporting",
      ],
      color: "success",
    },
  ];

  const integrations = [
    { name: "Slack", logo: "💬", connected: true },
    { name: "GitHub", logo: "🐙", connected: true },
    { name: "AWS", logo: "☁️", connected: true },
    { name: "Docker", logo: "🐳", connected: true },
    { name: "Kubernetes", logo: "⚓", connected: false },
    { name: "Terraform", logo: "🏗️", connected: true },
  ];

  return (
    <section
      id="features"
      className="py-24 bg-gradient-to-br from-gray-50 to-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div
          className={`text-center mb-20 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center px-4 py-2 glass-card text-mint-green font-medium mb-6 animate-glassmorphism-float">
            <span className="w-2 h-2 bg-mint-green rounded-full mr-2 animate-pulse-green"></span>
            <span className="mono-medium">Platform Features</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Everything you need to
            <span className="text-transparent bg-clip-text bg-gradient-torch">
              {" "}
              scale your business
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Powerful AI-driven tools and automation that help you build, deploy,
            and scale your applications with confidence.
          </p>
        </div>

        {/* Interactive Feature Showcase */}
        <div
          className={`mb-20 transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Feature Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {features.map((feature, index) => (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(index)}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeFeature === index
                    ? `bg-${feature.color} text-white shadow-lg transform scale-105`
                    : "bg-white text-muted-foreground hover:text-foreground hover:bg-gray-50 border border-gray-200"
                }`}
              >
                <span className="text-2xl mr-3">{feature.icon}</span>
                {feature.title}
              </button>
            ))}
          </div>

          {/* Active Feature Display */}
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-2xl border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div>
                <div
                  className={`inline-block px-4 py-2 bg-${features[activeFeature].color}/10 text-${features[activeFeature].color} rounded-full text-sm font-medium mb-6`}
                >
                  <span className="text-2xl mr-2">
                    {features[activeFeature].icon}
                  </span>
                  {features[activeFeature].title}
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                  {features[activeFeature].title}
                </h3>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {features[activeFeature].description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {features[activeFeature].benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div
                        className={`w-2 h-2 bg-${features[activeFeature].color} rounded-full`}
                      ></div>
                      <span className="text-sm font-medium text-foreground">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="px-6 py-3 bg-gradient-torch text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                    Try This Feature
                  </button>
                  <button className="px-6 py-3 border border-gray-300 text-foreground font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                    Learn More
                  </button>
                </div>
              </div>

              {/* Visual */}
              <div className="relative">
                {activeFeature === 0 && features[activeFeature].image ? (
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src={features[activeFeature].image}
                      alt={features[activeFeature].title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className={`aspect-square bg-gradient-to-br from-${features[activeFeature].color}/10 to-${features[activeFeature].color}/5 rounded-2xl p-8 flex items-center justify-center relative overflow-hidden`}
                  >
                    {/* Animated background elements */}
                    <div className="absolute inset-0">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className={`absolute w-2 h-2 bg-${features[activeFeature].color}/30 rounded-full animate-pulse`}
                          style={{
                            top: `${20 + Math.random() * 60}%`,
                            left: `${20 + Math.random() * 60}%`,
                            animationDelay: `${i * 200}ms`,
                          }}
                        ></div>
                      ))}
                    </div>

                    {/* Main visual element */}
                    <div className="relative z-10 text-center">
                      <div
                        className={`w-32 h-32 bg-${features[activeFeature].color}/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse`}
                      >
                        <span className="text-6xl">
                          {features[activeFeature].icon}
                        </span>
                      </div>
                      <div
                        className={`w-48 h-2 bg-${features[activeFeature].color}/30 rounded-full mx-auto`}
                      >
                        <div
                          className={`h-2 bg-${features[activeFeature].color} rounded-full animate-pulse`}
                          style={{ width: "75%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Integrations Section */}
        <div
          className={`transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
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
            {integrations.map((integration, index) => (
              <div
                key={integration.name}
                className={`bg-white rounded-xl p-6 border border-gray-200 hover:border-mint-green/30 hover:shadow-lg transition-all duration-300 transform hover:scale-105 ${
                  integration.connected ? "ring-2 ring-success/20" : ""
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">{integration.logo}</div>
                  <div className="font-medium text-foreground text-sm mb-2">
                    {integration.name}
                  </div>
                  <div
                    className={`text-xs px-2 py-1 rounded-full ${
                      integration.connected
                        ? "bg-success/10 text-success"
                        : "bg-gray-100 text-muted-foreground"
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
