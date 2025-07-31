import { useState, useEffect } from "react";
import { TorchDataVisualization } from "./TorchDataVisualization";

export function ActionableInsights() {
  const [activeInsight, setActiveInsight] = useState(0);
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

    const section = document.getElementById("insights");
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  const insights = [
    {
      category: "AI Intelligence",
      title: "Predictive Analytics at Scale",
      description:
        "Our AI models process millions of data points to predict trends, anomalies, and opportunities before they happen.",
      metrics: [
        { label: "Prediction Accuracy", value: "96.8%", trend: "+5.2%" },
        { label: "Processing Speed", value: "50ms", trend: "-12ms" },
        { label: "Data Points", value: "2.4M", trend: "+340K" },
      ],
      color: "mint-green",
    },
    {
      category: "DevOps Optimization",
      title: "Intelligent Infrastructure Management",
      description:
        "Automated scaling, predictive maintenance, and real-time optimization reduce costs while improving performance.",
      metrics: [
        { label: "Cost Reduction", value: "45%", trend: "+8%" },
        { label: "Uptime", value: "99.97%", trend: "+0.12%" },
        { label: "Deploy Speed", value: "3.2min", trend: "-45%" },
      ],
      color: "mint-neon",
    },
    {
      category: "Security Intelligence",
      title: "Proactive Threat Detection",
      description:
        "Advanced ML algorithms identify and neutralize security threats in real-time, before they impact your systems.",
      metrics: [
        { label: "Threat Detection", value: "98.5%", trend: "+2.1%" },
        { label: "Response Time", value: "12s", trend: "-8s" },
        { label: "False Positives", value: "0.03%", trend: "-0.12%" },
      ],
      color: "deepmind-blue",
    },
  ];

  return (
    <section
      id="insights"
      className="py-24 bg-gradient-to-br from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center px-4 py-2 bg-mint-light rounded-full text-mint-green font-medium mb-6">
            <span className="w-2 h-2 bg-mint-green rounded-full mr-2"></span>
            Actionable Intelligence
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Transform data into
            <span className="text-transparent bg-clip-text bg-gradient-torch">
              {" "}
              decisions
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our AI-powered platform analyzes complex data patterns and delivers
            clear, actionable insights that drive intelligent business
            decisions.
          </p>
        </div>

        {/* Interactive Torch Visualization */}
        <div
          className={`mb-20 transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <TorchDataVisualization />
        </div>

        {/* Insight Cards */}
        <div
          className={`transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Navigation */}
          <div className="flex justify-center mb-12">
            <div className="glass-card rounded-full p-2">
              {insights.map((insight, index) => (
                <button
                  key={index}
                  onClick={() => setActiveInsight(index)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    activeInsight === index
                      ? `bg-${insight.color} text-white shadow-lg`
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {insight.category}
                </button>
              ))}
            </div>
          </div>

          {/* Active Insight Card */}
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-2xl border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div>
                <div
                  className={`inline-block px-4 py-2 bg-${insights[activeInsight].color}/10 text-${insights[activeInsight].color} rounded-full text-sm font-medium mb-6`}
                >
                  {insights[activeInsight].category}
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                  {insights[activeInsight].title}
                </h3>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {insights[activeInsight].description}
                </p>

                <div className="space-y-6">
                  {insights[activeInsight].metrics.map((metric, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                    >
                      <span className="font-medium text-foreground">
                        {metric.label}
                      </span>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl font-bold text-foreground">
                          {metric.value}
                        </span>
                        <span
                          className={`text-sm font-medium px-2 py-1 rounded-full ${
                            metric.trend.startsWith("+")
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {metric.trend}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visualization */}
              <div className="relative">
                <div
                  className={`aspect-square bg-gradient-to-br from-${insights[activeInsight].color}/10 to-${insights[activeInsight].color}/5 rounded-3xl p-8 flex items-center justify-center`}
                >
                  {/* Dynamic Chart Based on Category */}
                  {activeInsight === 0 && (
                    <div className="relative w-full h-full">
                      {/* AI Brain Visualization */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className={`w-32 h-32 bg-${insights[activeInsight].color}/20 rounded-full animate-pulse`}
                        ></div>
                        <div
                          className={`absolute w-24 h-24 bg-${insights[activeInsight].color}/30 rounded-full animate-ping`}
                        ></div>
                        <div
                          className={`absolute w-16 h-16 bg-${insights[activeInsight].color} rounded-full`}
                        ></div>
                      </div>
                      {/* Neural Network Lines */}
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className={`absolute w-2 h-2 bg-${insights[activeInsight].color} rounded-full animate-pulse`}
                          style={{
                            top: `${20 + Math.random() * 60}%`,
                            left: `${20 + Math.random() * 60}%`,
                            animationDelay: `${i * 200}ms`,
                          }}
                        ></div>
                      ))}
                    </div>
                  )}

                  {activeInsight === 1 && (
                    <div className="w-full h-full flex items-end justify-center space-x-3">
                      {/* DevOps Pipeline Bars */}
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className={`bg-${insights[activeInsight].color} rounded-t-lg animate-pulse`}
                          style={{
                            width: "20px",
                            height: `${30 + Math.random() * 70}%`,
                            animationDelay: `${i * 300}ms`,
                          }}
                        ></div>
                      ))}
                    </div>
                  )}

                  {activeInsight === 2 && (
                    <div className="relative w-full h-full">
                      {/* Security Shield */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className={`w-40 h-40 bg-${insights[activeInsight].color}/10 rounded-full`}
                        ></div>
                        <div
                          className={`absolute w-32 h-32 bg-${insights[activeInsight].color}/20 rounded-full`}
                        ></div>
                        <div
                          className={`absolute w-24 h-24 bg-${insights[activeInsight].color}/30 rounded-full`}
                        ></div>
                        <div className="absolute text-4xl">🛡️</div>
                      </div>
                      {/* Threat Indicators */}
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-3 h-3 bg-red-400 rounded-full animate-ping"
                          style={{
                            top: `${10 + Math.random() * 80}%`,
                            left: `${10 + Math.random() * 80}%`,
                            animationDelay: `${i * 400}ms`,
                          }}
                        ></div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div
          className={`text-center mt-16 transition-all duration-1000 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <button className="px-8 py-4 bg-gradient-torch text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            Explore Our Intelligence Platform
          </button>
        </div>
      </div>
    </section>
  );
}
