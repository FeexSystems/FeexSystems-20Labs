import { useState, useEffect } from "react";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "active" | "completed" | "research";
  impact: string;
  technologies: string[];
  metrics?: { label: string; value: string }[];
  github?: string;
  paper?: string;
}

export function ProfessionalProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated project data - would come from GitHub API in real implementation
    const mockProjects: Project[] = [
      {
        id: "neural-chat",
        title: "Neural Conversation Engine",
        description:
          "Advanced conversational AI system with multi-modal understanding and contextual reasoning capabilities.",
        category: "AI Research",
        status: "active",
        impact:
          "Improved user engagement by 340% and response accuracy by 96.8%",
        technologies: ["PyTorch", "Transformers", "CUDA", "FastAPI"],
        metrics: [
          { label: "Accuracy", value: "96.8%" },
          { label: "Response Time", value: "< 200ms" },
          { label: "Languages", value: "12" },
        ],
        github: "https://github.com/FeexSystems/neural-chat",
      },
      {
        id: "devops-suite",
        title: "Intelligent DevOps Platform",
        description:
          "AI-powered platform for automated deployment, monitoring, and optimization of cloud infrastructure.",
        category: "DevOps",
        status: "completed",
        impact:
          "Reduced deployment time by 75% and infrastructure costs by 40%",
        technologies: ["Kubernetes", "Terraform", "Go", "Prometheus"],
        metrics: [
          { label: "Deployments", value: "10K+" },
          { label: "Uptime", value: "99.9%" },
          { label: "Cost Savings", value: "40%" },
        ],
        github: "https://github.com/FeexSystems/devops-suite",
      },
      {
        id: "security-ai",
        title: "AI Security Guardian",
        description:
          "Real-time threat detection system using machine learning to identify and prevent cybersecurity attacks.",
        category: "Security",
        status: "active",
        impact: "Detected 98.5% of threats with < 30 second response time",
        technologies: ["TensorFlow", "Redis", "Docker", "Python"],
        metrics: [
          { label: "Threat Detection", value: "98.5%" },
          { label: "False Positives", value: "< 0.1%" },
          { label: "Response Time", value: "< 30s" },
        ],
        github: "https://github.com/FeexSystems/security-ai",
      },
      {
        id: "quantum-ml",
        title: "Quantum Machine Learning",
        description:
          "Research project exploring quantum computing applications in machine learning optimization.",
        category: "Research",
        status: "research",
        impact: "Potential 1000x speedup in specific optimization problems",
        technologies: ["Qiskit", "Cirq", "NumPy", "Jupyter"],
        paper: "https://arxiv.org/example",
      },
    ];

    setTimeout(() => {
      setProjects(mockProjects);
      setLoading(false);
    }, 1000);
  }, []);

  const categories = ["all", "AI Research", "DevOps", "Security", "Research"];

  const filteredProjects =
    selectedCategory === "all"
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "active":
        return "bg-success text-white";
      case "completed":
        return "bg-deepmind-blue text-white";
      case "research":
        return "bg-warning text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50" id="projects">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-deepmind-blue border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50" id="projects">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-medium text-foreground mb-6">
            Featured Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our portfolio showcases cutting-edge solutions that bridge
            theoretical research with practical applications, delivering
            measurable impact across industries.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-deepmind-blue text-white"
                  : "bg-white text-muted-foreground hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {category === "all" ? "All Projects" : category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="deepmind-card p-8 hover:shadow-lg transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {project.title}
                  </h3>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      project.status,
                    )}`}
                  >
                    {project.status.charAt(0).toUpperCase() +
                      project.status.slice(1)}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground bg-gray-100 px-3 py-1 rounded-full">
                  {project.category}
                </span>
              </div>

              {/* Description */}
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {project.description}
              </p>

              {/* Impact */}
              <div className="bg-deepmind-light-blue rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-deepmind-blue">
                  📊 Impact: {project.impact}
                </p>
              </div>

              {/* Technologies */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              {project.metrics && (
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {project.metrics.map((metric, index) => (
                    <div key={index} className="text-center">
                      <div className="text-lg font-semibold text-foreground">
                        {metric.value}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="deepmind-button px-4 py-2 text-sm flex items-center space-x-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Code</span>
                  </a>
                )}
                {project.paper && (
                  <a
                    href={project.paper}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span>Paper</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
