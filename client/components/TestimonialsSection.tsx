import { useState, useEffect } from "react";

export function TestimonialsSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
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

    const section = document.getElementById("testimonials");
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-cycle through testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      id: "sarah-johnson",
      name: "Sarah Johnson",
      role: "CTO",
      company: "TechCorp",
      avatar: "👩‍💼",
      rating: 5,
      quote:
        "FeexSystems transformed our entire development workflow. We've seen a 40% increase in deployment efficiency and our security posture has never been stronger.",
      metrics: {
        improvement: "+40%",
        metric: "Deployment Efficiency",
      },
    },
    {
      id: "michael-chen",
      name: "Michael Chen",
      role: "VP of Engineering",
      company: "DataFlow Inc",
      avatar: "👨‍💻",
      rating: 5,
      quote:
        "The AI-powered insights have been game-changing. We can predict and prevent issues before they impact our customers. The ROI has been incredible.",
      metrics: {
        improvement: "99.9%",
        metric: "System Uptime",
      },
    },
    {
      id: "emma-williams",
      name: "Emma Williams",
      role: "DevOps Lead",
      company: "ScaleUp Solutions",
      avatar: "👩‍🔬",
      rating: 5,
      quote:
        "Integration was seamless and the learning curve was minimal. Our team was productive from day one. The support team is exceptional.",
      metrics: {
        improvement: "75%",
        metric: "Time to Market",
      },
    },
    {
      id: "david-kumar",
      name: "David Kumar",
      role: "Head of Security",
      company: "FinTech Pro",
      avatar: "👨‍🔒",
      rating: 5,
      quote:
        "Security compliance used to take weeks. Now it's automated and we pass audits with confidence. FeexSystems is essential to our operations.",
      metrics: {
        improvement: "-85%",
        metric: "Security Incidents",
      },
    },
  ];

  const trustIndicators = [
    {
      icon: "🔒",
      title: "SOC 2 Certified",
      description: "Security and compliance you can trust",
    },
    {
      icon: "🌍",
      title: "Global Scale",
      description: "Serving customers in 50+ countries",
    },
    {
      icon: "⚡",
      title: "99.9% Uptime",
      description: "Reliable infrastructure you can count on",
    },
    {
      icon: "🛡️",
      title: "Enterprise Security",
      description: "Bank-level security for your data",
    },
  ];

  const companies = [
    { name: "TechCorp", logo: "🏢" },
    { name: "DataFlow", logo: "📊" },
    { name: "ScaleUp", logo: "🚀" },
    { name: "FinTech", logo: "💰" },
    { name: "CloudSys", logo: "☁️" },
    { name: "SecureNet", logo: "🔐" },
  ];

  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div
          className={`text-center mb-20 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center px-4 py-2 bg-success/10 rounded-full text-success font-medium mb-6">
            <span className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse"></span>
            Customer Success
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Trusted by industry
            <span className="text-transparent bg-clip-text bg-gradient-torch">
              {" "}
              leaders worldwide
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of companies that have transformed their operations
            with FeexSystems.
          </p>
        </div>

        {/* Featured Testimonial */}
        <div
          className={`mb-20 transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-100 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-torch opacity-5 rounded-full blur-3xl"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              {/* Testimonial Content */}
              <div>
                <div className="flex items-center mb-6">
                  {[...Array(testimonials[activeTestimonial].rating)].map(
                    (_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-mint-neon fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ),
                  )}
                </div>

                <blockquote className="text-2xl font-medium text-foreground mb-8 leading-relaxed">
                  "{testimonials[activeTestimonial].quote}"
                </blockquote>

                <div className="flex items-center space-x-4">
                  <div className="text-4xl">
                    {testimonials[activeTestimonial].avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonials[activeTestimonial].name}
                    </div>
                    <div className="text-muted-foreground">
                      {testimonials[activeTestimonial].role} at{" "}
                      {testimonials[activeTestimonial].company}
                    </div>
                  </div>
                </div>
              </div>

              {/* Metrics Card */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <div className="text-center">
                  <div className="text-5xl font-bold text-mint-green mb-2">
                    {testimonials[activeTestimonial].metrics.improvement}
                  </div>
                  <div className="text-muted-foreground font-medium">
                    {testimonials[activeTestimonial].metrics.metric}
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="text-sm text-muted-foreground">
                      Results achieved with FeexSystems
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial Navigation */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeTestimonial
                      ? "bg-mint-green"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div
          className={`mb-20 transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Built for enterprise-grade reliability
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustIndicators.map((indicator, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-mint-green/30 hover:shadow-lg transition-all duration-300 text-center group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {indicator.icon}
                </div>
                <h4 className="font-semibold text-foreground mb-2">
                  {indicator.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {indicator.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Company Logos */}
        <div
          className={`transition-all duration-1000 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center mb-12">
            <p className="text-muted-foreground font-medium">
              Trusted by leading companies worldwide
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {companies.map((company, index) => (
              <div
                key={index}
                className="flex flex-col items-center space-y-3 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-300 group"
              >
                <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                  {company.logo}
                </div>
                <div className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {company.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div
          className={`mt-20 bg-gradient-to-br from-mint-dark to-gray-900 rounded-3xl p-8 lg:p-12 text-white transition-all duration-1000 delay-900 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">
              Delivering results at scale
            </h3>
            <p className="text-gray-300">Numbers that speak for themselves</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { value: "500+", label: "Enterprise Customers" },
              { value: "99.9%", label: "System Uptime" },
              { value: "50M+", label: "Data Points Processed" },
              { value: "$2.5B", label: "Cost Savings Generated" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-mint-green mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
