import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        deepmind: {
          blue: "hsl(var(--deepmind-blue))",
          "light-blue": "hsl(var(--deepmind-light-blue))",
          gray: "hsl(var(--deepmind-gray))",
          "light-gray": "hsl(var(--deepmind-light-gray))",
        },
        mint: {
          green: "hsl(var(--mint-green))",
          neon: "hsl(var(--mint-neon))",
          light: "hsl(var(--mint-light))",
          dark: "hsl(var(--mint-dark))",
          accent: "hsl(var(--mint-accent))",
        },
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        feex: {
          void: "#030508",
          obsidian: "#0A0E17",
          surface: "#121826",
          border: "rgba(30, 41, 59, 0.8)",
          cyan: {
            DEFAULT: "#00F5D4",
            glow: "rgba(0, 245, 212, 0.35)",
            dim: "#009688",
            electric: "#00F2FE",
          },
          azure: {
            DEFAULT: "#0066FF",
            glow: "rgba(0, 102, 255, 0.35)",
          },
          violet: {
            DEFAULT: "#7B2CBF",
            glow: "rgba(123, 44, 191, 0.4)",
            deep: "#8A2BE2",
          },
          emerald: {
            DEFAULT: "#00FFA3",
            glow: "rgba(0, 255, 163, 0.35)",
          },
          amber: {
            DEFAULT: "#FFB800",
            dim: "rgba(255, 184, 0, 0.15)",
          },
          crimson: "#FF0055",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        "feex-hud": "0 0 24px -4px rgba(0, 245, 212, 0.12), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)",
        "feex-neon": "0 0 16px rgba(0, 245, 212, 0.45)",
        "feex-glow-emerald": "0 0 25px -5px rgba(0, 255, 163, 0.3)",
        "feex-glow-violet": "0 0 25px -5px rgba(123, 44, 191, 0.35)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
