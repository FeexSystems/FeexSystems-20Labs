import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Index from "@/pages/Index";

// Mock Three.js / WebGL heavy canvases in jsdom
vi.mock("@/components/webgl/StippledPointillistShape", () => ({
  default: () => <div data-testid="stippled-pointillist-canvas" />,
  StippledPointillistShape: () => <div data-testid="stippled-pointillist-canvas" />,
}));

vi.mock("@/components/webgl/ProjectMini3DCard", () => ({
  default: () => <div data-testid="project-mini-3d-mock" />,
  ProjectMini3DCard: () => <div data-testid="project-mini-3d-mock" />,
}));

vi.mock("@/components/framer/HeroTunnel", () => ({
  HeroTunnel: () => <div data-testid="hero-tunnel-mock" />,
}));

vi.mock("@/components/framer/WarpStarfield", () => ({
  WarpStarfield: () => <div data-testid="warp-starfield-mock" />,
}));

describe("Landing Page (Index.tsx) Verification", () => {
  it("renders Hero headline and canonical thesis", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <Index />
        </MemoryRouter>
      );
    });

    expect(screen.getByText(/Canonical systems hold facts/i)).toBeInTheDocument();
    expect(screen.getByText(/AI models interpret those facts/i)).toBeInTheDocument();
    expect(
      screen.getByText(/DIGITAL SYSTEMS ARCHITECT \/ FULL-STACK AI ENGINEER \/ CREATIVE TECHNOLOGIST/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Deploy Your World Model/i)).toBeInTheDocument();
  });

  it("renders Section // 01 Problem framing", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <Index />
        </MemoryRouter>
      );
    });

    expect(screen.getByText(/Why Traditional Engineering Intelligence Fails/i)).toBeInTheDocument();
    expect(screen.getByText(/STATUS: CRITICAL INDUSTRY BOTTLENECK/i)).toBeInTheDocument();
  });

  it("renders Section // 02 Solution and Evidence grounding", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <Index />
        </MemoryRouter>
      );
    });

    expect(screen.getByText(/Deterministic Grounding over Raw Claims/i)).toBeInTheDocument();
    expect(screen.getByText(/Start Free Synchronization/i)).toBeInTheDocument();
  });

  it("renders pricing tiers and enterprise plans", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <Index />
        </MemoryRouter>
      );
    });

    expect(screen.getByText("Community Explorer")).toBeInTheDocument();
    expect(screen.getByText("Engineer Pro")).toBeInTheDocument();
    expect(screen.getByText("Enterprise Sovereign")).toBeInTheDocument();
  });

  it("renders FAQ section with anti-hallucination answers", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <Index />
        </MemoryRouter>
      );
    });

    expect(
      screen.getByText(/How does FeexSystems prevent AI hallucinations\?/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Does FeexSystems train AI models on our proprietary source code\?/i)
    ).toBeInTheDocument();
  });

  it("renders final CTA block with FeexSystems dual-mode routing links", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <Index />
        </MemoryRouter>
      );
    });

    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));

    expect(hrefs).toContain("/world");
    expect(hrefs).toContain("/omni");
    expect(hrefs).toContain("/projects");
    expect(hrefs).toContain("/register");
  });
});
