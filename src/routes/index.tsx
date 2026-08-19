import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Boxes, Cpu, Layers, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/planora/logo";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "PLANORA — AI-Powered Space Design" },
      {
        name: "description",
        content:
          "PLANORA turns plot dimensions and room requirements into validated 2D floor plans and explorable 3D spaces.",
      },
      { property: "og:title", content: "PLANORA — AI-Powered Space Design" },
      {
        property: "og:description",
        content:
          "Generate, compare, validate and explore architectural floor plans with AI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const FEATURES = [
  {
    icon: Cpu,
    title: "AI plan generation",
    body: "Describe the plot and program. Get multiple viable layouts in seconds.",
  },
  {
    icon: Layers,
    title: "Compare & edit",
    body: "Weigh options side by side, then refine rooms directly on the plan.",
  },
  {
    icon: ShieldCheck,
    title: "Constraint validation",
    body: "Coverage, clearances, daylight and circulation checked automatically.",
  },
  {
    icon: Boxes,
    title: "2D to 3D",
    body: "Convert the approved plan into a walkable 3D space instantly.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Logo className="text-sm" />
          <nav className="flex items-center gap-4 text-sm">
            <Link
              to="/login"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="rounded-md bg-primary px-3.5 py-1.5 font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <section className="hero-surface relative overflow-hidden border-b border-border">
        <div className="blueprint-grid absolute inset-0 opacity-30" />
        <div className="relative mx-auto max-w-6xl px-5 py-24 sm:py-32">
          <p className="tech-label">AI-Powered Space Design</p>
          <h1 className="mt-5 max-w-3xl text-4xl leading-tight font-semibold tracking-tight sm:text-6xl">
            DESIGN YOUR SPACE.
            <br />
            LET <span className="text-primary">AI</span> BUILD THE PLAN.
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted-foreground">
            Enter your plot, rooms and preferences. PLANORA generates architectural
            floor plans, validates them against real constraints, and turns the final
            layout into an explorable 3D space.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Get Started <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary/60"
            >
              I have an account
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="tech-label">Workflow</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="surface-panel p-5">
              <f.icon className="size-5 text-primary" />
              <h2 className="mt-4 text-sm font-medium">{f.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="surface-panel flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                From plot dimensions to a walkable space.
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                No CAD experience required.
              </p>
            </div>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
            >
              Start designing <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-8">
          <Logo className="text-xs" />
          <p className="tech-label">Prototype · Mock data</p>
        </div>
      </footer>
    </div>
  );
}
