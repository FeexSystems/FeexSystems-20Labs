import { useEffect, useState } from "react";
import { SolarSystemScene } from "./SolarSystemScene";

export function EnhancedHero() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeMetric, setActiveMetric] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Cycle through metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    { value: "99.9%", label: "System Accuracy", color: "text-mint-green" },
    { value: "50ms", label: "Response Time", color: "text-mint-neon" },
    { value: "1M+", label: "Data Points", color: "text-deepmind-blue" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-mint-light/20 matrix-bg">
      {/* Animated Solar System Background */}
      <div className="absolute inset-0 opacity-20">
        <SolarSystemScene autoCamera={true} scale={0.2} speed={1.5} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center px-6 py-3 glass-card text-sm font-medium text-foreground mb-8 animate-glassmorphism-float">
            <div className="w-2 h-2 bg-mint-green rounded-full mr-3 animate-pulse-green"></div>
            <span className="mono-medium">Actionable AI Insights</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight">
            Turn complex{" "}
            <span className="text-transparent bg-clip-text bg-gradient-torch">
              AI data
            </span>
            <br />
            into simple{" "}
            <span className="text-transparent bg-clip-text bg-gradient-data">
              decisions
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
            FeexSystems transforms complex artificial intelligence, DevOps, and
            cybersecurity data into actionable insights that drive intelligent
            decision-making across your organization.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="px-8 py-4 bg-gradient-to-r from-mint-green to-mint-neon text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl animate-glow">
              <span className="mono-medium">Explore Our Intelligence</span>
            </button>
            <button className="px-8 py-4 glass-card text-foreground font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 interactive-card">
              <span className="mono-medium">View Case Studies</span>
            </button>
          </div>

          {/* Animated Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  activeMetric === index
                    ? "scale-110 opacity-100"
                    : "scale-100 opacity-70"
                }`}
              >
                <div className="glass-card p-8">
                  <div
                    className={`text-4xl md:text-5xl font-bold mb-2 ${metric.color}`}
                  >
                    {metric.value}
                  </div>
                  <div className="text-muted-foreground font-medium">
                    {metric.label}
                  </div>
                  {activeMetric === index && (
                    <div className="mt-3 h-1 bg-gradient-torch rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Visualization Preview */}
        <div
          className={`mt-20 transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="glass-card p-8 interactive-card animate-glassmorphism-float">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground mono-medium">
                Real-Time Analytics Dashboard
              </h3>
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-mint-green rounded-full animate-pulse-green"></div>
                <div className="w-3 h-3 bg-mint-neon rounded-full animate-pulse-green delay-100"></div>
                <div className="w-3 h-3 bg-deepmind-blue rounded-full animate-pulse-green delay-200"></div>
              </div>
            </div>

            {/* Mini Chart Preview */}
            <div className="grid grid-cols-4 gap-4 h-32">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-end space-x-1 h-20">
                    {[...Array(5)].map((_, j) => (
                      <div
                        key={j}
                        className="bg-gradient-torch rounded-sm opacity-70 hover:opacity-100 transition-opacity duration-300"
                        style={{
                          height: `${Math.random() * 60 + 20}%`,
                          width: "12px",
                          animationDelay: `${(i * 5 + j) * 100}ms`,
                        }}
                      ></div>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground text-center">
                    Q{i + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-mint-green/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-mint-green rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-mint-neon/10 to-mint-green/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-tr from-deepmind-blue/5 to-mint-green/10 rounded-full blur-3xl"></div>
    </section>
  );
}
