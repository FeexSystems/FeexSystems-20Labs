import { useState } from "react";

export function CTASections() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <>
      {/* Main CTA Section */}
      <section className="py-24 bg-gradient-to-br from-mint-dark via-gray-900 to-mint-dark text-white overflow-hidden relative">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-mint-green/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-mint-neon/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to transform your
            <span className="text-transparent bg-clip-text bg-gradient-torch">
              {" "}
              business with AI?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Join thousands of companies already using FeexSystems to automate
            workflows, enhance security, and drive growth. Start your free trial
            today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="group px-8 py-4 bg-gradient-torch text-white font-semibold rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <span className="flex items-center justify-center">
                Start Free Trial
                <svg
                  className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </button>
            <button className="px-8 py-4 glass-card text-foreground font-semibold rounded-xl hover:bg-mint-green/20 transition-all duration-300">
              Schedule Demo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-mint-green mb-2">
                14 Days
              </div>
              <div className="text-gray-300">Free Trial</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-mint-neon mb-2">
                No Setup
              </div>
              <div className="text-gray-300">Fees Required</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-300">Expert Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gradient-to-r from-mint-green to-mint-neon">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Stay ahead of the AI revolution
          </h3>
          <p className="text-lg text-white/90 mb-8">
            Get weekly insights on AI trends, product updates, and exclusive
            content from our experts.
          </p>

          <form
            onSubmit={handleNewsletterSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-white/50"
              required
            />
            <button
              type="submit"
              disabled={isSubscribed}
              className="px-6 py-3 bg-mint-dark text-mint-green font-semibold rounded-lg hover:bg-mint-green hover:text-white transition-colors disabled:opacity-50"
            >
              {isSubscribed ? "✓ Subscribed!" : "Subscribe"}
            </button>
          </form>

          <p className="text-sm text-white/80 mt-4">
            Join 25,000+ subscribers. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* Demo CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 lg:p-12 border border-gray-200 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                  See FeexSystems in action
                </h3>
                <p className="text-lg text-muted-foreground mb-8">
                  Book a personalized demo with our team and discover how
                  FeexSystems can transform your specific use case.
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    "Personalized product walkthrough",
                    "Custom use case discussion",
                    "Integration planning session",
                    "ROI analysis and pricing",
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-foreground">{item}</span>
                    </div>
                  ))}
                </div>

                <button className="px-8 py-4 bg-gradient-torch text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  Book Demo Now
                </button>
              </div>

              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-mint-green/10 to-mint-neon/10 rounded-2xl p-8 flex items-center justify-center border border-mint-green/20">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-mint-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-10 h-10 text-mint-green"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-muted-foreground font-medium">
                      Watch Product Demo
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resource CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Explore our resources
            </h3>
            <p className="text-lg text-muted-foreground">
              Everything you need to get started and succeed with FeexSystems
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "📚",
                title: "Documentation",
                description:
                  "Comprehensive guides, API references, and tutorials",
                action: "Browse Docs",
                color: "deepmind-blue",
              },
              {
                icon: "🎓",
                title: "Learning Center",
                description:
                  "Video tutorials, webinars, and certification courses",
                action: "Start Learning",
                color: "mint-green",
              },
              {
                icon: "💬",
                title: "Community",
                description:
                  "Connect with developers, share ideas, and get help",
                action: "Join Community",
                color: "success",
              },
            ].map((resource, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-mint-green/30 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {resource.icon}
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-3">
                  {resource.title}
                </h4>
                <p className="text-muted-foreground mb-6">
                  {resource.description}
                </p>
                <button
                  className={`w-full py-3 px-6 bg-${resource.color}/10 text-${resource.color} font-semibold rounded-lg hover:bg-${resource.color}/20 transition-colors`}
                >
                  {resource.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-br from-mint-light via-white to-mint-light rounded-3xl p-8 lg:p-12 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-mint-green/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-mint-neon/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <h3 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Ready to get started?
              </h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join the AI revolution and transform your business today. No
                credit card required, cancel anytime.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-gradient-torch text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  Start Your Free Trial
                </button>
                <button className="px-8 py-4 border border-gray-300 text-foreground font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                  Contact Sales
                </button>
              </div>

              <p className="text-sm text-muted-foreground mt-6">
                Trusted by 500+ companies • 99.9% uptime • 24/7 support
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
