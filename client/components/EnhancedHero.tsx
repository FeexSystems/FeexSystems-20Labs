import { useEffect, useState, lazy, Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, BarChart3, Zap, Shield } from "lucide-react";

// Lazy load WebGL component for performance
const ImmersiveHeroBackground = lazy(() =>
  import('./webgl/ImmersiveHeroBackground').then(mod => ({ default: mod.ImmersiveHeroBackground }))
);

export function EnhancedHero() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeMetric, setActiveMetric] = useState(0);
  const navigate = useNavigate();

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
    { value: "99.9%", label: "System Accuracy", icon: Shield },
    { value: "50ms", label: "Response Time", icon: Zap },
    { value: "1M+", label: "Data Points Analyzed", icon: BarChart3 },
  ];

  const handleExploreClick = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCaseStudiesClick = () => {
    const testimonialsSection = document.getElementById("testimonials");
    if (testimonialsSection) {
      testimonialsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-20">
      {/* Immersive WebGL Background */}
      <Suspense fallback={null}>
        <ImmersiveHeroBackground quality="high" particleCount={3000} />
      </Suspense>

      {/* Fallback gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20" style={{ zIndex: -1 }}></div>

      {/* Additional gradient orbs for depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <div
          className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-8">
            <Sparkles className="w-4 h-4 mr-2" />
            <span>Actionable AI Insights</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight">
            Turn complex{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-primary">
              AI data
            </span>
            <br />
            into simple{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-primary to-emerald-400">
              decisions
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
            FeexSystems transforms complex artificial intelligence, DevOps, and
            cybersecurity data into actionable insights that drive intelligent
            decision-making across your organization.
          </p>

          {/* CTA Buttons - Properly routed */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/dashboard"
              className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary to-emerald-400 text-primary-foreground font-bold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 hover:scale-105"
            >
              <span>ENTER THE PLAYGROUND</span>
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              onClick={handleCaseStudiesClick}
              className="inline-flex items-center justify-center px-8 py-4 bg-card border border-border text-foreground font-semibold rounded-xl transition-all duration-300 hover:bg-muted hover:border-primary/30 hover:scale-105"
            >
              <span>View Case Studies</span>
            </button>
          </div>

          {/* Animated Metrics - Clean card design */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div
                  key={index}
                  className={`transition-all duration-500 ${activeMetric === index
                    ? "scale-105"
                    : "scale-100 opacity-80"
                    }`}
                >
                  <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center justify-center mb-4">
                      <div className={`p-3 rounded-xl ${activeMetric === index
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                        } transition-all duration-300`}>
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                    <div
                      className={`text-4xl md:text-5xl font-bold mb-2 ${activeMetric === index
                        ? "text-primary"
                        : "text-foreground"
                        } transition-colors duration-300`}
                    >
                      {metric.value}
                    </div>
                    <div className="text-muted-foreground font-medium">
                      {metric.label}
                    </div>
                    {activeMetric === index && (
                      <div className="mt-4 h-1 bg-gradient-to-r from-primary to-emerald-400 rounded-full"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-time Dashboard Preview - Clean design */}
        <div
          className={`mt-20 transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <div className="bg-card border border-border rounded-2xl p-8 shadow-xl max-w-4xl mx-auto hover:border-primary/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Real-Time Analytics Dashboard
                </h3>
              </div>
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>

            {/* Mini Chart Preview */}
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-end space-x-1 h-24 bg-muted/50 rounded-lg p-2">
                    {[...Array(6)].map((_, j) => (
                      <div
                        key={j}
                        className="flex-1 bg-gradient-to-t from-primary/60 to-emerald-400/60 rounded-sm hover:from-primary hover:to-emerald-400 transition-all duration-300"
                        style={{
                          height: `${Math.random() * 60 + 30}%`,
                        }}
                      ></div>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground text-center font-medium">
                    Q{i + 1} 2025
                  </div>
                </div>
              ))}
            </div>

            {/* Feature badges */}
            <div className="flex flex-wrap justify-center gap-3 mt-6 pt-6 border-t border-border">
              {["AI-Powered", "Real-Time", "Secure", "Scalable"].map((feature) => (
                <span
                  key={feature}
                  className="px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
