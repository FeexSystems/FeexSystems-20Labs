import { useState, useEffect } from "react";

type Theme = "light" | "dark" | "system";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  if (!mounted) return null;

  return (
    <div className="glass-card p-2 flex items-center space-x-1 animate-glassmorphism-float">
      {/* Light Mode */}
      <button
        onClick={() => handleThemeChange("light")}
        className={`p-2 rounded-lg transition-all duration-300 relative overflow-hidden group ${
          theme === "light"
            ? "bg-mint-green text-white shadow-lg"
            : "hover:bg-white/10 text-foreground/70 hover:text-foreground"
        }`}
        aria-label="Light mode"
      >
        <div className="relative z-10">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </div>
        {theme !== "light" && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        )}
      </button>

      {/* Dark Mode */}
      <button
        onClick={() => handleThemeChange("dark")}
        className={`p-2 rounded-lg transition-all duration-300 relative overflow-hidden group ${
          theme === "dark"
            ? "bg-mint-green text-white shadow-lg"
            : "hover:bg-white/10 text-foreground/70 hover:text-foreground"
        }`}
        aria-label="Dark mode"
      >
        <div className="relative z-10">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        </div>
        {theme !== "dark" && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        )}
      </button>

      {/* System Mode */}
      <button
        onClick={() => handleThemeChange("system")}
        className={`p-2 rounded-lg transition-all duration-300 relative overflow-hidden group ${
          theme === "system"
            ? "bg-mint-green text-white shadow-lg"
            : "hover:bg-white/10 text-foreground/70 hover:text-foreground"
        }`}
        aria-label="System mode"
      >
        <div className="relative z-10">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        {theme !== "system" && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        )}
      </button>

      {/* Active indicator */}
      <div className="absolute inset-0 rounded-lg border border-mint-green/20 animate-pulse-green pointer-events-none opacity-30"></div>
    </div>
  );
}
