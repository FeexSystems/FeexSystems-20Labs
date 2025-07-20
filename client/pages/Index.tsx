import { useState, useCallback } from "react";
import { Navigation } from "../components/Navigation";
import { Enhanced3DScene } from "../components/Enhanced3DScene";
import { ChatInterface } from "../components/ChatInterface";
import { ProjectCards } from "../components/ProjectCards";
import { AIImageCarousel } from "../components/AIImageCarousel";
import { AboutSection } from "../components/AboutSection";
import { ContactSection } from "../components/ContactSection";
import { Footer } from "../components/Footer";

interface SceneData {
  repositories: any[];
  chartData: {
    stars: number[];
    forks: number[];
    categories: { name: string; value: number; color: string }[];
  };
}

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [sceneData, setSceneData] = useState<SceneData | null>(null);

  const handleSectionChange = useCallback((section: string) => {
    setActiveSection(section);
    // Smooth scroll to section
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleSceneDataReady = useCallback((data: SceneData) => {
    setSceneData(data);
  }, []);

  const renderCurrentSection = () => {
    switch (activeSection) {
      case "home":
        return (
          <div id="home" className="relative min-h-screen">
            {/* Hero Section with Enhanced 3D Scene */}
            <div className="h-screen relative overflow-hidden">
              <Enhanced3DScene onDataReady={handleSceneDataReady} />
              <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center px-4">
                <div className="max-w-4xl">
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
                    <span className="bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
                      FeexSystems
                    </span>
                  </h1>
                  <h2 className="text-2xl md:text-4xl font-semibold mb-4 text-foreground/90">
                    Refining AI for the Universe
                  </h2>
                  <p className="text-lg md:text-xl leading-relaxed mb-8 text-muted-foreground max-w-3xl mx-auto">
                    Pioneering AI-powered web applications and software with
                    expertise in DevOps, full-stack development, and ethical
                    hacking. Interact with our AI assistant to explore our work.
                  </p>
                  <button
                    onClick={() => handleSectionChange("projects")}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                    style={{
                      boxShadow: "0 0 20px rgba(0, 170, 255, 0.3)",
                    }}
                  >
                    Explore Projects
                  </button>
                </div>
              </div>

              {/* Repository Analytics Overlay */}
              {sceneData && (
                <div className="absolute bottom-8 left-8 bg-card/90 backdrop-blur-lg border border-primary/30 rounded-lg p-4 z-10">
                  <h3 className="text-lg font-semibold text-primary mb-2">
                    Repository Analytics
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Total Projects:
                      </span>
                      <span className="text-foreground">
                        {sceneData.repositories.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Total Stars:
                      </span>
                      <span className="text-foreground">
                        {sceneData.chartData.stars.reduce(
                          (sum, stars) => sum + stars,
                          0,
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Active Repos:
                      </span>
                      <span className="text-green-400">
                        {sceneData.chartData.forks.length}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Capabilities Section */}
            <div className="py-20 px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold text-center mb-12">
                  Our Capabilities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/30 transition-all duration-300 hover:transform hover:scale-105">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                      <svg
                        className="w-6 h-6 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">
                      AI-Driven Web Apps
                    </h3>
                    <p className="text-muted-foreground">
                      Building intelligent systems like chatbots, recommendation
                      engines, and analytics platforms that drive engagement and
                      insights.
                    </p>
                  </div>

                  <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/30 transition-all duration-300 hover:transform hover:scale-105">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                      <svg
                        className="w-6 h-6 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">
                      DevOps Automation
                    </h3>
                    <p className="text-muted-foreground">
                      Streamlining workflows with CI/CD pipelines,
                      containerization, and cloud infrastructure for faster,
                      reliable deployments.
                    </p>
                  </div>

                  <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/30 transition-all duration-300 hover:transform hover:scale-105">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                      <svg
                        className="w-6 h-6 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">
                      Ethical Hacking & Security
                    </h3>
                    <p className="text-muted-foreground">
                      Fortifying applications with proactive threat detection,
                      vulnerability scanning, and robust cybersecurity measures.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "projects":
        return (
          <div id="projects" className="min-h-screen pt-20 pb-16">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Our Projects
                </h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Discover our latest AI-driven projects, powered by
                  cutting-edge technology and real-time data from GitHub.
                </p>
              </div>

              {/* AI Image Carousel */}
              <div className="mb-16">
                <AIImageCarousel />
              </div>

              {/* Project Cards */}
              <ProjectCards />
            </div>
          </div>
        );

      case "about":
        return (
          <div id="about" className="min-h-screen pt-20 pb-16">
            <AboutSection />
          </div>
        );

      case "contact":
        return (
          <div id="contact" className="min-h-screen pt-20 pb-16">
            <ContactSection />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      {renderCurrentSection()}

      <Footer />

      {/* Chat Interface - Always visible */}
      <ChatInterface />
    </div>
  );
}
