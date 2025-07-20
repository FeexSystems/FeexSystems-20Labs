import { useState, useEffect } from "react";

interface ProfessionalNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function ProfessionalNav({
  activeSection,
  onSectionChange,
}: ProfessionalNavProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "research", label: "Research" },
    { id: "projects", label: "Projects" },
    { id: "about", label: "About" },
  ];

  return (
    <nav
      className={`deepmind-nav transition-all duration-300 ${
        isScrolled ? "py-3 shadow-sm" : "py-4"
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-deepmind-blue to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-semibold text-lg">F</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                FeexSystems
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">
                AI Research Lab
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md ${
                  activeSection === item.id
                    ? "text-deepmind-blue bg-deepmind-light-blue"
                    : "text-muted-foreground hover:text-foreground hover:bg-gray-50"
                }`}
                aria-current={activeSection === item.id ? "page" : undefined}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <button className="deepmind-button px-4 py-2 text-sm">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-gray-50 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
