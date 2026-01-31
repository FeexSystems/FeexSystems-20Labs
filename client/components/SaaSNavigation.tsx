import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

interface SaaSNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function SaaSNavigation({
  activeSection,
  onSectionChange,
}: SaaSNavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Home" },
    {
      id: "platform",
      label: "Platform",
      dropdown: [
        {
          id: "intelligence",
          label: "AI Intelligence",
          description: "Advanced AI analytics and insights",
        },
        {
          id: "research",
          label: "Research Lab",
          description: "Cutting-edge AI research",
        },
        {
          id: "security",
          label: "Security Hub",
          description: "Cybersecurity solutions",
        },
        {
          id: "devops",
          label: "DevOps Suite",
          description: "Automated infrastructure",
        },
      ],
    },
    {
      id: "solutions",
      label: "Solutions",
      dropdown: [
        {
          id: "enterprise",
          label: "Enterprise",
          description: "For large organizations",
        },
        {
          id: "startups",
          label: "Startups",
          description: "Scale your business",
        },
        {
          id: "developers",
          label: "Developers",
          description: "Build with our APIs",
        },
        {
          id: "consulting",
          label: "Consulting",
          description: "Expert guidance",
        },
      ],
    },
    { id: "pricing", label: "Pricing" },
    {
      id: "resources",
      label: "Resources",
      dropdown: [
        {
          id: "documentation",
          label: "Documentation",
          description: "Technical guides",
        },
        { id: "blog", label: "Blog", description: "Latest insights" },
        {
          id: "case-studies",
          label: "Case Studies",
          description: "Success stories",
        },
        { id: "support", label: "Support", description: "Get help" },
      ],
    },
    { id: "about", label: "About" },
  ];

  const handleDropdownToggle = (itemId: string) => {
    setActiveDropdown(activeDropdown === itemId ? null : itemId);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-lg border-b border-border"
          : "bg-transparent"
        }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-emerald-400 rounded-xl flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                <span className="text-primary-foreground font-bold text-lg">F</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-background"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">FeexSystems</h1>
              <p className="text-xs text-muted-foreground -mt-1">
                AI IntelliSense Labs
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => {
                    if (item.dropdown) {
                      handleDropdownToggle(item.id);
                    } else {
                      onSectionChange(item.id);
                      setActiveDropdown(null);
                    }
                  }}
                  className={`flex items-center px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${activeSection === item.id
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  aria-current={activeSection === item.id ? "page" : undefined}
                  aria-expanded={
                    item.dropdown ? activeDropdown === item.id : undefined
                  }
                >
                  {item.label}
                  {item.dropdown && (
                    <svg
                      className={`ml-1 w-4 h-4 transition-transform ${activeDropdown === item.id ? "rotate-180" : ""
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </button>

                {/* Dropdown Menu - Clean solid design */}
                {item.dropdown && activeDropdown === item.id && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-xl py-2 z-50">
                    {item.dropdown.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => {
                          onSectionChange(subItem.id);
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-muted transition-colors"
                      >
                        <div className="font-medium text-foreground text-sm">
                          {subItem.label}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {subItem.description}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Buttons - Properly routed */}
          <div className="hidden lg:flex items-center space-x-4">
            <ThemeToggle />
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-6 py-2.5 bg-gradient-to-r from-primary to-emerald-400 text-primary-foreground font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/25 transform hover:scale-105 transition-all duration-200"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu - Clean solid design */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-card border-t border-border shadow-xl">
            <div className="px-6 py-4 space-y-2">
              {navItems.map((item) => (
                <div key={item.id}>
                  <button
                    onClick={() => {
                      if (item.dropdown) {
                        handleDropdownToggle(item.id);
                      } else {
                        onSectionChange(item.id);
                        setIsMobileMenuOpen(false);
                      }
                    }}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                  >
                    {item.label}
                  </button>
                  {item.dropdown && activeDropdown === item.id && (
                    <div className="ml-4 mt-2 space-y-2">
                      {item.dropdown.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => {
                            onSectionChange(subItem.id);
                            setIsMobileMenuOpen(false);
                            setActiveDropdown(null);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                        >
                          {subItem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 border-t border-border space-y-2">
                <Link
                  to="/login"
                  className="block w-full px-4 py-2 text-sm font-medium text-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block w-full px-4 py-2.5 bg-gradient-to-r from-primary to-emerald-400 text-primary-foreground font-semibold rounded-lg text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Start Free Trial
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Background overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[-1] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
}
