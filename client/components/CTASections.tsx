import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Play, BookOpen, GraduationCap, MessageCircle } from "lucide-react";

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
      <section className="py-24 bg-gradient-to-b from-background to-muted/50 overflow-hidden relative">
        {/* Subtle background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
            Ready to transform your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
              {" "}business with AI?
            </span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Join thousands of companies already using FeexSystems to automate
            workflows, enhance security, and drive growth. Start your free trial
            today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/register"
              className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary to-emerald-400 text-primary-foreground font-semibold rounded-xl hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-8 py-4 bg-card border border-border text-foreground font-semibold rounded-xl hover:bg-muted hover:border-primary/30 transition-all duration-300">
              Schedule Demo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-card border border-border rounded-xl">
              <div className="text-3xl font-bold text-primary mb-2">
                14 Days
              </div>
              <div className="text-muted-foreground">Free Trial</div>
            </div>
            <div className="p-6 bg-card border border-border rounded-xl">
              <div className="text-3xl font-bold text-emerald-400 mb-2">
                No Setup
              </div>
              <div className="text-muted-foreground">Fees Required</div>
            </div>
            <div className="p-6 bg-card border border-border rounded-xl">
              <div className="text-3xl font-bold text-foreground mb-2">24/7</div>
              <div className="text-muted-foreground">Expert Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-emerald-400">
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
              className="flex-1 px-4 py-3 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-white/50 text-foreground bg-white"
              required
            />
            <button
              type="submit"
              disabled={isSubscribed}
              className="px-6 py-3 bg-background text-primary font-semibold rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
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
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-card border border-border rounded-3xl p-8 lg:p-12 shadow-xl">
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
                      <div className="flex-shrink-0 w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-foreground">{item}</span>
                    </div>
                  ))}
                </div>

                <button className="px-8 py-4 bg-gradient-to-r from-primary to-emerald-400 text-primary-foreground font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105">
                  Book Demo Now
                </button>
              </div>

              <div className="relative">
                <div className="aspect-video bg-muted rounded-2xl p-8 flex items-center justify-center border border-border hover:border-primary/30 transition-colors cursor-pointer group">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <Play className="w-10 h-10 text-primary" />
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
      <section className="py-16 bg-muted/30">
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
                icon: BookOpen,
                title: "Documentation",
                description:
                  "Comprehensive guides, API references, and tutorials",
                action: "Browse Docs",
              },
              {
                icon: GraduationCap,
                title: "Learning Center",
                description:
                  "Video tutorials, webinars, and certification courses",
                action: "Start Learning",
              },
              {
                icon: MessageCircle,
                title: "Community",
                description:
                  "Connect with developers, share ideas, and get help",
                action: "Join Community",
              },
            ].map((resource, index) => {
              const Icon = resource.icon;
              return (
                <div
                  key={index}
                  className="bg-card border border-border rounded-xl p-8 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground mb-3">
                    {resource.title}
                  </h4>
                  <p className="text-muted-foreground mb-6">
                    {resource.description}
                  </p>
                  <button className="w-full py-3 px-6 bg-primary/10 text-primary font-semibold rounded-lg hover:bg-primary/20 transition-colors">
                    {resource.action}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-br from-muted via-card to-muted rounded-3xl p-8 lg:p-12 border border-border relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <h3 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Ready to get started?
              </h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join the AI revolution and transform your business today. No
                credit card required, cancel anytime.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-gradient-to-r from-primary to-emerald-400 text-primary-foreground font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105"
                >
                  Start Your Free Trial
                </Link>
                <button className="px-8 py-4 border border-border text-foreground font-semibold rounded-xl hover:bg-muted transition-colors">
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
