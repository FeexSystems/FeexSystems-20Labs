import { useEffect, useState } from "react";
import { Professional3DScene } from "./Professional3DScene";

export function ProfessionalHero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="deepmind-hero relative min-h-screen flex items-center justify-center overflow-hidden">
      <Professional3DScene />

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-sm text-muted-foreground mb-8 shadow-sm">
            <div className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse"></div>
            Advancing AI Research and Development
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium text-foreground mb-6 tracking-tight">
            Building the future of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-deepmind-blue to-blue-600">
              Artificial Intelligence
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            FeexSystems combines cutting-edge AI research with practical
            applications in DevOps, full-stack development, and cybersecurity.
            We're building intelligent systems that solve real-world challenges.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="deepmind-button px-8 py-3 text-base font-medium rounded-lg">
              Explore Our Research
            </button>
            <button className="px-8 py-3 text-base font-medium border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
              View Projects
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div
          className={`mt-20 transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-semibold text-foreground mb-2">
                25+
              </div>
              <div className="text-sm text-muted-foreground">
                AI Models Deployed
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-semibold text-foreground mb-2">
                100K+
              </div>
              <div className="text-sm text-muted-foreground">Lines of Code</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-semibold text-foreground mb-2">
                99.9%
              </div>
              <div className="text-sm text-muted-foreground">System Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}
