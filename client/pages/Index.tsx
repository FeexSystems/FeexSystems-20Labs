import { useState, useCallback } from "react";
import { ProfessionalNav } from "../components/ProfessionalNav";
import { ProfessionalHero } from "../components/ProfessionalHero";
import { ResearchSection } from "../components/ResearchSection";
import { ProfessionalProjects } from "../components/ProfessionalProjects";
import { AboutSection } from "../components/AboutSection";
import { Footer } from "../components/Footer";

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");

  const handleSectionChange = useCallback((section: string) => {
    setActiveSection(section);
    // Smooth scroll to section
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ProfessionalNav
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      {/* Hero Section */}
      <div id="home">
        <ProfessionalHero />
      </div>

      {/* Research Section */}
      <ResearchSection />

      {/* Projects Section */}
      <ProfessionalProjects />

      {/* About Section */}
      <section className="py-20 bg-white" id="about">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-medium text-foreground mb-6">
              About FeexSystems
            </h2>
            <p className="text-lg text-muted-foreground">
              Founded by experts in AI research, DevOps engineering, and
              cybersecurity
            </p>
          </div>

          <div className="research-paper mx-auto">
            <p className="text-lg leading-relaxed mb-8">
              FeexSystems represents a convergence of cutting-edge artificial
              intelligence research and practical engineering excellence. Our
              laboratory was founded with the mission of advancing the
              theoretical foundations of AI while delivering tangible solutions
              that address real-world challenges.
            </p>

            <h3 className="text-2xl font-medium text-foreground mb-4">
              Our Approach
            </h3>
            <p className="mb-6">
              We believe that the most impactful AI systems emerge from the
              intersection of rigorous research and engineering discipline. Our
              team combines deep expertise in machine learning, systems
              engineering, and cybersecurity to build solutions that are not
              only innovative but also reliable, scalable, and secure.
            </p>

            <h3 className="text-2xl font-medium text-foreground mb-4">
              Research Philosophy
            </h3>
            <p className="mb-6">
              Our research is guided by the principle that artificial
              intelligence should augment human capabilities rather than replace
              them. We focus on developing transparent, interpretable AI systems
              that can work alongside human experts to solve complex problems
              across domains.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-deepmind-light-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-deepmind-blue"
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
                <h4 className="font-medium text-foreground mb-2">Innovation</h4>
                <p className="text-sm text-muted-foreground">
                  Pushing the boundaries of what's possible with AI
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-deepmind-light-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-deepmind-blue"
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
                <h4 className="font-medium text-foreground mb-2">Security</h4>
                <p className="text-sm text-muted-foreground">
                  Building trustworthy and secure AI systems
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-deepmind-light-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-deepmind-blue"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h4 className="font-medium text-foreground mb-2">Impact</h4>
                <p className="text-sm text-muted-foreground">
                  Delivering measurable value to organizations and society
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-deepmind-light-gray">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-medium text-foreground mb-6">
            Collaborate With Us
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Interested in advancing AI research or implementing intelligent
            solutions? We'd love to explore potential collaborations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://github.com/FeexSystems"
              target="_blank"
              rel="noopener noreferrer"
              className="deepmind-button px-8 py-3 text-base font-medium rounded-lg inline-block"
            >
              View Our Code
            </a>
            <a
              href="https://gamma.app/docs/FEEXSYSTEMS-HQ-jvm6gb3pbjss40a"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 text-base font-medium border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors inline-block"
            >
              Research Papers
            </a>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-300">
            <p className="text-sm text-muted-foreground">
              For research collaborations, technical partnerships, or general
              inquiries, please reach out through our GitHub organization or
              research portal.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
