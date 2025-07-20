export function CapabilitiesSection() {
  const capabilities = [
    {
      title: "AI-Driven Web Apps",
      description:
        "Building intelligent systems like chatbots, recommendation engines, and analytics platforms that drive engagement and insights.",
    },
    {
      title: "DevOps Automation",
      description:
        "Streamlining workflows with CI/CD pipelines, containerization, and cloud infrastructure for faster, reliable deployments.",
    },
    {
      title: "Ethical Hacking & Security",
      description:
        "Fortifying applications with proactive threat detection, vulnerability scanning, and robust cybersecurity measures.",
    },
  ];

  return (
    <div className="section py-20 px-5 max-w-6xl mx-auto" id="capabilities">
      <h2 className="text-4xl font-bold mb-6 text-center">Our Capabilities</h2>
      <p className="text-lg text-muted-foreground text-center max-w-4xl mx-auto mb-12">
        From intelligent web apps to secure software systems, our work reflects
        a commitment to excellence. Explore our capabilities below and check out
        our projects on{" "}
        <a
          href="https://github.com/FeexSystems?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 underline"
        >
          GitHub
        </a>
        .
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {capabilities.map((capability, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-lg p-6 transition-transform hover:scale-105 hover:-translate-y-2"
          >
            <h3 className="text-2xl font-semibold mb-4">{capability.title}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {capability.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
