import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/planora/app-shell";
import { ProjectCard } from "@/components/planora/cards";
import { useProjects } from "@/hooks/use-planora";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Dashboard — PLANORA" },
      {
        name: "description",
        content: "Your recent PLANORA designs, their status and next steps.",
      },
      { property: "og:title", content: "Dashboard — PLANORA" },
      { property: "og:description", content: "Recent designs and their status." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Dashboard() {
  const projects = useProjects();
  const recent = projects?.slice(0, 6) ?? [];

  return (
    <AppShell
      title="Dashboard"
      subtitle="Recent designs and pipeline status"
      actions={
        <Link
          to="/design/new"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground"
        >
          <Plus className="size-4" /> New design
        </Link>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {(["Draft", "Generating", "Validated", "3D Ready"] as const).map((s) => (
          <div key={s} className="surface-panel p-4">
            <p className="tech-label">{s}</p>
            <p className="mt-2 font-mono text-2xl">
              {projects?.filter((p) => p.status === s).length ?? 0}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-sm font-medium">Recent projects</h2>
        <Link to="/projects" className="text-xs text-muted-foreground hover:text-foreground">
          View all
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="surface-panel mt-4 flex flex-col items-center gap-3 px-6 py-16 text-center">
          <p className="text-sm text-muted-foreground">
            No designs yet. Start with your plot dimensions.
          </p>
          <Link
            to="/design/new"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Create new design
          </Link>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {recent.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </AppShell>
  );
}
