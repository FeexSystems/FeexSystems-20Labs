import { useState } from "react";
import { AINetworkScene } from "./AINetworkScene";
import { DataFlowScene } from "./DataFlowScene";

interface ResearchArea {
  id: string;
  title: string;
  description: string;
  details: string[];
  metrics: { label: string; value: string }[];
  papers?: number;
}

export function ResearchSection() {
  const [activeArea, setActiveArea] = useState("ai");

  const researchAreas: ResearchArea[] = [
    {
      id: "ai",
      title: "Artificial Intelligence",
      description:
        "Advancing the frontiers of machine learning and neural networks through innovative research and practical applications.",
      details: [
        "Deep learning architectures for complex problem solving",
        "Natural language processing and understanding",
        "Computer vision and image recognition systems",
        "Reinforcement learning for autonomous decision making",
      ],
      metrics: [
        { label: "Models Trained", value: "150+" },
        { label: "Accuracy Rate", value: "96.8%" },
        { label: "Research Papers", value: "12" },
      ],
      papers: 12,
    },
    {
      id: "devops",
      title: "DevOps & Infrastructure",
      description:
        "Building scalable, secure, and efficient systems that power modern AI applications and services.",
      details: [
        "Cloud-native architecture and microservices",
        "Automated CI/CD pipelines and deployment strategies",
        "Container orchestration and Kubernetes management",
        "Infrastructure as Code and monitoring systems",
      ],
      metrics: [
        { label: "Deployments/Day", value: "50+" },
        { label: "System Uptime", value: "99.9%" },
        { label: "Cost Reduction", value: "40%" },
      ],
      papers: 8,
    },
    {
      id: "security",
      title: "Cybersecurity",
      description:
        "Protecting AI systems and infrastructure through advanced threat detection and ethical security practices.",
      details: [
        "AI-powered threat detection and prevention",
        "Vulnerability assessment and penetration testing",
        "Zero-trust security architecture implementation",
        "Compliance and regulatory security frameworks",
      ],
      metrics: [
        { label: "Threats Detected", value: "10K+" },
        { label: "Response Time", value: "<30s" },
        { label: "Success Rate", value: "98.5%" },
      ],
      papers: 6,
    },
  ];

  const activeResearch = researchAreas.find((area) => area.id === activeArea);

  return (
    <section className="py-20 bg-white" id="research">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-medium text-foreground mb-6">
            Research Areas
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our multidisciplinary approach combines AI research with practical
            engineering to solve complex challenges across industries.
          </p>
        </div>

        {/* Research Area Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {researchAreas.map((area) => (
            <button
              key={area.id}
              onClick={() => setActiveArea(area.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeArea === area.id
                  ? "bg-deepmind-blue text-white"
                  : "bg-gray-100 text-muted-foreground hover:bg-gray-200"
              }`}
            >
              {area.title}
            </button>
          ))}
        </div>

        {/* Active Research Area Content */}
        {activeResearch && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Content */}
            <div className="research-paper">
              <h3 className="text-3xl font-medium text-foreground mb-6">
                {activeResearch.title}
              </h3>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {activeResearch.description}
              </p>

              <h4 className="text-xl font-medium text-foreground mb-4">
                Key Focus Areas
              </h4>
              <ul className="space-y-3 mb-8">
                {activeResearch.details.map((detail, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-deepmind-blue rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">{detail}</span>
                  </li>
                ))}
              </ul>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4">
                {activeResearch.metrics.map((metric, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-semibold text-foreground mb-1">
                      {metric.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

                        {/* Visual */}
            <div className="deepmind-card p-0 overflow-hidden">
              <div className="aspect-square rounded-lg overflow-hidden mb-6">
                {activeArea === "ai" && (
                  <AINetworkScene
                    intensity={1.2}
                    color="#3B82F6"
                    nodeCount={120}
                  />
                )}
                {activeArea === "devops" && (
                  <DataFlowScene
                    speed={1.5}
                    complexity={1.2}
                    theme="devops"
                  />
                )}
                {activeArea === "security" && (
                  <DataFlowScene
                    speed={0.8}
                    complexity={1.5}
                    theme="security"
                  />
                )}
              </div>

              <div className="text-center p-6">
                <h4 className="text-lg font-medium text-foreground mb-4">
                  {activeResearch.title} Visualization
                </h4>
                <button className="deepmind-button px-6 py-2 text-sm">
                  View Publications
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
