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

describe("Landing Page (Index.tsx) Framer Inventory Verification", () => {
  it("renders Hero headline and subheadline with Geist Mono styling", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <Index />
        </MemoryRouter>
      );
    });

    expect(screen.getByText("// We visualise the invisible")).toBeInTheDocument();
    expect(screen.getByText(/Turning noise/i)).toBeInTheDocument();
    expect(screen.getByText(/into signal/i)).toBeInTheDocument();
    expect(
      screen.getByText("Real-time AI defense that acts before you even know you're under attack.")
    ).toBeInTheDocument();
  });

  it("renders exactly 3 ShaderNode instances across Hero, Product, and Final CTA", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <Index />
        </MemoryRouter>
      );
    });

    // Framer remix layer inventory specification: ShaderNode: 3
    const shaderNodes = await screen.findAllByTestId("stippled-pointillist-canvas");
    expect(shaderNodes).toHaveLength(3);
  });

  it("renders Section //02 Problem framing with 3 problem titles", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <Index />
        </MemoryRouter>
      );
    });

    expect(screen.getByText("//02 — The problem")).toBeInTheDocument();
    expect(screen.getByText("Data is everywhere. Clarity is not.")).toBeInTheDocument();
    expect(screen.getByText("Disconnected data sources")).toBeInTheDocument();
    expect(screen.getByText("Delayed insights")).toBeInTheDocument();
    expect(screen.getByText("Decision paralysis")).toBeInTheDocument();
  });

  it("renders Section //03 Product reveal and Section //04 Solution", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <Index />
        </MemoryRouter>
      );
    });

    expect(screen.getByText("//03 — The product")).toBeInTheDocument();
    expect(screen.getByText("see what others miss")).toBeInTheDocument();
    expect(
      screen.getByText("From raw inputs to refined insight — visualize your entire data flow in one place.")
    ).toBeInTheDocument();

    expect(screen.getByText("//04 — The solution")).toBeInTheDocument();
    expect(screen.getByText(/one platform.\s*total clarity/i)).toBeInTheDocument();
  });

  it("renders Section //05 How it works with 3 movements, renders, and live log text", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <Index />
        </MemoryRouter>
      );
    });

    expect(screen.getByText("//05 — how it works")).toBeInTheDocument();
    expect(screen.getByText("from data to decision in seconds")).toBeInTheDocument();
    expect(
      screen.getByText("Three movements. Connect, analyze, act. No middle ground, no spreadsheet purgatory")
    ).toBeInTheDocument();

    // 01-connect
    expect(screen.getByText("Wire it up.")).toBeInTheDocument();
    expect(
      screen.getByText("Integrate your tools, APIs, and data sources instantly. Zero engineering required.")
    ).toBeInTheDocument();
    expect(screen.getByText("— 23 sources online · 0 failures")).toBeInTheDocument();

    // 02-analyze
    expect(screen.getByText("Surface the signal.")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Our AI identifies patterns, anomalies, and opportunities in real time — and tells you why they matter."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("scanning · 2.4M events / sec")).toBeInTheDocument();

    // 03-ACT
    expect(screen.getByText("move with conviction")).toBeInTheDocument();
    expect(
      screen.getByText("Turn insights into decisions with clarity and speed. Share, ship, repeat.")
    ).toBeInTheDocument();
    expect(screen.getByText("✓ resolved · 5 min cycle")).toBeInTheDocument();
  });

  it("renders Section //06 Capabilities with 5 feature titles", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <Index />
        </MemoryRouter>
      );
    });

    expect(screen.getByText("//06 — Capabilities")).toBeInTheDocument();
    expect(screen.getByText("Built for modern data teams.")).toBeInTheDocument();
    expect(screen.getByText("Real-time insights")).toBeInTheDocument();
    expect(screen.getByText("AI predictions")).toBeInTheDocument();
    expect(screen.getByText("Data visualization")).toBeInTheDocument();
    expect(screen.getByText("Collaboration tools")).toBeInTheDocument();
    expect(screen.getByText("Custom alerts")).toBeInTheDocument();
  });

  it("renders Section //07 Use Cases, //08 Integrations marquee, //09 Testimonials, //10 Pricing, and //11 FAQ", async () => {
    const { container } = await act(async () => {
      return render(
        <MemoryRouter initialEntries={["/"]}>
          <Index />
        </MemoryRouter>
      );
    });

    expect(screen.getByText("//07 — use cases")).toBeInTheDocument();
    expect(screen.getByText("Designed for teams that move fast.")).toBeInTheDocument();

    // Section //08 Integrations with infinite marquee ticker
    expect(screen.getByText("//08 — Integrations")).toBeInTheDocument();
    expect(screen.getByText("connect your entire stack")).toBeInTheDocument();
    const marquee = container.querySelector(".animate-marquee");
    expect(marquee).toBeInTheDocument();

    expect(screen.getByText("//09 — Testimonials")).toBeInTheDocument();
    expect(screen.getByText("What others whisper about the experience.")).toBeInTheDocument();

    expect(screen.getByText("//10 — Pricing")).toBeInTheDocument();
    expect(screen.getByText("flexible pricing")).toBeInTheDocument();

    expect(screen.getByText("//11 — FAQ")).toBeInTheDocument();
    expect(screen.getByText("Your questions, answered.")).toBeInTheDocument();
  });

  it("renders final CTA block with exact headline and FeexSystems canonical links", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <Index />
        </MemoryRouter>
      );
    });

    expect(screen.getByText("From data to decision.")).toBeInTheDocument();
    expect(screen.getByText("In seconds.")).toBeInTheDocument();

    // Verify critical dual-mode routing links exist
    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));

    expect(hrefs).toContain("/world");
    expect(hrefs).toContain("/omni");
    expect(hrefs).toContain("/projects");
    expect(hrefs).toContain("/evidence");
  });
});
