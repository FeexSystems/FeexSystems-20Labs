import { useState, useEffect } from "react";

interface Repository {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
  topics: string[];
}

export function ProjectCards() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/users/FeexSystems/repos?sort=updated&per_page=6",
          {
            headers: {
              Accept: "application/vnd.github.v3+json",
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch repositories");
        }

        const repos = await response.json();
        setRepositories(repos);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        // Fallback data for demo
        setRepositories([
          {
            id: 1,
            name: "ai-chatbot-v2",
            description:
              "Next-generation conversational AI with advanced reasoning capabilities",
            html_url: "https://github.com/FeexSystems/ai-chatbot-v2",
            stargazers_count: 342,
            forks_count: 87,
            language: "TypeScript",
            updated_at: "2025-01-01T00:00:00Z",
            topics: ["ai", "chatbot", "typescript"],
          },
          {
            id: 2,
            name: "devops-automation-suite",
            description:
              "Comprehensive DevOps automation tools for CI/CD pipelines",
            html_url: "https://github.com/FeexSystems/devops-automation-suite",
            stargazers_count: 156,
            forks_count: 43,
            language: "Python",
            updated_at: "2024-12-28T00:00:00Z",
            topics: ["devops", "automation", "cicd"],
          },
          {
            id: 3,
            name: "security-scanner",
            description:
              "Advanced vulnerability scanner with ethical hacking tools",
            html_url: "https://github.com/FeexSystems/security-scanner",
            stargazers_count: 298,
            forks_count: 72,
            language: "Go",
            updated_at: "2024-12-30T00:00:00Z",
            topics: ["security", "scanner", "ethical-hacking"],
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, []);

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      TypeScript: "#3178c6",
      JavaScript: "#f7df1e",
      Python: "#3776ab",
      Go: "#00add8",
      Java: "#ed8b00",
      "C++": "#00599c",
      Rust: "#000000",
    };
    return colors[language] || "#6b7280";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-lg p-6 animate-pulse"
          >
            <div className="h-4 bg-muted rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-muted rounded w-full mb-2"></div>
            <div className="h-3 bg-muted rounded w-2/3 mb-4"></div>
            <div className="flex space-x-4">
              <div className="h-3 bg-muted rounded w-16"></div>
              <div className="h-3 bg-muted rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-destructive mb-2">
            Error Loading Projects
          </h3>
          <p className="text-sm text-muted-foreground">{error}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Please check our{" "}
            <a
              href="https://github.com/FeexSystems"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              GitHub page
            </a>{" "}
            directly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {repositories.map((repo) => (
        <div
          key={repo.id}
          className="bg-card border border-border rounded-lg p-6 transition-all duration-300 hover:transform hover:scale-105 hover:-translate-y-2 hover:shadow-lg hover:border-primary/30 group"
          style={{
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          }}
          role="article"
          aria-labelledby={`repo-title-${repo.id}`}
        >
          <div className="flex items-start justify-between mb-3">
            <h3
              id={`repo-title-${repo.id}`}
              className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors"
            >
              {repo.name}
            </h3>
            <div className="flex space-x-2">
              <span
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${getLanguageColor(repo.language)}20`,
                  color: getLanguageColor(repo.language),
                }}
              >
                {repo.language}
              </span>
            </div>
          </div>

          <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
            {repo.description}
          </p>

          <div className="flex flex-wrap gap-1 mb-4">
            {repo.topics.slice(0, 3).map((topic) => (
              <span
                key={topic}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-secondary text-secondary-foreground"
              >
                #{topic}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <div className="flex space-x-4">
              <div className="flex items-center space-x-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2L13.09 8.26L20 9.27L15 14.14L16.18 21.02L10 17.77L3.82 21.02L5 14.14L0 9.27L6.91 8.26L10 2Z"
                  />
                </svg>
                <span>{repo.stargazers_count}</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414L2.586 7l3.707-3.707a1 1 0 011.414 0z"
                  />
                </svg>
                <span>{repo.forks_count}</span>
              </div>
            </div>
            <span className="text-xs">
              Updated {formatDate(repo.updated_at)}
            </span>
          </div>

          <div className="flex space-x-3">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-center py-2 px-4 rounded-md transition-colors text-sm font-medium"
              aria-label={`View ${repo.name} on GitHub`}
            >
              View on GitHub
            </a>
            <button
              className="px-4 py-2 border border-border hover:border-primary text-muted-foreground hover:text-primary transition-colors rounded-md text-sm"
              aria-label={`View details for ${repo.name}`}
            >
              Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
