import { useState } from "react";

export function SaaSFooter() {
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

  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "AI Intelligence", href: "#intelligence" },
        { name: "DevOps Suite", href: "#devops" },
        { name: "Security Hub", href: "#security" },
        { name: "Analytics", href: "#analytics" },
        { name: "Integrations", href: "#integrations" },
        { name: "API Reference", href: "#api" },
      ],
    },
    {
      title: "Solutions",
      links: [
        { name: "Enterprise", href: "#enterprise" },
        { name: "Startups", href: "#startups" },
        { name: "Developers", href: "#developers" },
        { name: "Consulting", href: "#consulting" },
        { name: "Professional Services", href: "#services" },
        { name: "Training", href: "#training" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "#docs" },
        { name: "Blog", href: "#blog" },
        { name: "Case Studies", href: "#case-studies" },
        { name: "Whitepapers", href: "#whitepapers" },
        { name: "Webinars", href: "#webinars" },
        { name: "Community", href: "#community" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "#help" },
        { name: "Contact Support", href: "#support" },
        { name: "System Status", href: "#status" },
        { name: "Report a Bug", href: "#bug-report" },
        { name: "Feature Requests", href: "#features" },
        { name: "Slack Community", href: "#slack" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#about" },
        { name: "Careers", href: "#careers", badge: "We're hiring!" },
        { name: "Press", href: "#press" },
        { name: "Partners", href: "#partners" },
        { name: "Investors", href: "#investors" },
        { name: "Contact", href: "#contact" },
      ],
    },
  ];

  const socialLinks = [
    { name: "Twitter", icon: "🐦", href: "#twitter" },
    { name: "LinkedIn", icon: "💼", href: "#linkedin" },
    { name: "GitHub", icon: "🐙", href: "#github" },
    { name: "YouTube", icon: "📺", href: "#youtube" },
    { name: "Discord", icon: "���", href: "#discord" },
  ];

  const certifications = [
    { name: "SOC 2", icon: "🔒" },
    { name: "ISO 27001", icon: "🛡️" },
    { name: "GDPR", icon: "🇪🇺" },
    { name: "HIPAA", icon: "🏥" },
  ];

  return (
    <footer className="bg-mint-dark text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-torch rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">FeexSystems</h3>
                <p className="text-sm text-gray-400">AI SaaS Platform</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              Empowering businesses with intelligent AI solutions for automation, 
              security, and data-driven decision making. Transform your operations 
              with our comprehensive platform.
            </p>

            {/* Newsletter Signup */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Stay updated</h4>
              <form onSubmit={handleNewsletterSubmit} className="flex space-x-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-mint-green"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubscribed}
                  className="px-4 py-2 bg-mint-green hover:bg-mint-green/90 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSubscribed ? "✓" : "→"}
                </button>
              </form>
              <p className="text-xs text-gray-400 mt-2">
                Get product updates and insights
              </p>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors group"
                  aria-label={social.name}
                >
                  <span className="text-lg group-hover:scale-110 transition-transform">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="lg:col-span-1">
              <h4 className="font-semibold text-lg mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors text-sm flex items-center group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform">
                        {link.name}
                      </span>
                      {link.badge && (
                        <span className="ml-2 px-2 py-1 bg-success text-white text-xs rounded-full">
                          {link.badge}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Certifications & Trust Indicators */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h4 className="font-semibold mb-4">Security & Compliance</h4>
              <div className="flex space-x-6">
                {certifications.map((cert) => (
                  <div
                    key={cert.name}
                    className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-lg"
                  >
                    <span className="text-lg">{cert.icon}</span>
                    <span className="text-sm font-medium">{cert.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 md:mt-0 text-center md:text-right">
              <div className="text-2xl font-bold text-mint-green mb-1">99.9%</div>
              <div className="text-sm text-gray-400">Uptime SLA</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">🚀</div>
              <h4 className="font-semibold mb-2">Start Free Trial</h4>
              <p className="text-sm text-gray-400 mb-4">
                14 days, no credit card required
              </p>
              <button className="w-full px-4 py-2 bg-mint-green hover:bg-mint-green/90 rounded-lg transition-colors">
                Get Started
              </button>
            </div>

            <div className="bg-white/5 rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">📞</div>
              <h4 className="font-semibold mb-2">Talk to Sales</h4>
              <p className="text-sm text-gray-400 mb-4">
                Custom enterprise solutions
              </p>
              <button className="w-full px-4 py-2 border border-white/20 hover:bg-white/10 rounded-lg transition-colors">
                Contact Sales
              </button>
            </div>

            <div className="bg-white/5 rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">📚</div>
              <h4 className="font-semibold mb-2">Documentation</h4>
              <p className="text-sm text-gray-400 mb-4">
                Guides, tutorials, and API docs
              </p>
              <button className="w-full px-4 py-2 border border-white/20 hover:bg-white/10 rounded-lg transition-colors">
                Browse Docs
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-gray-400 text-sm">
                © 2025 FeexSystems. All rights reserved.
              </p>
              <div className="flex space-x-6 text-sm">
                <a href="#privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="#terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
                <a href="#cookies" className="text-gray-400 hover:text-white transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
              <a href="#status" className="hover:text-white transition-colors">
                Status Page
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
