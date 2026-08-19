import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/planora/app-shell";
import { ProjectCard } from "@/components/planora/cards";
import { useProjects } from "@/hooks/use-planora";
import { deleteProject } from "@/lib/planora";

export const Route = createFileRoute("/projects")({
  component: Projects,
  head: () => ({
    meta: [
      { title: "Projects — PLANORA" },
      { name: "description", content: "All of your saved PLANORA space designs." },
      { property: "og:title", content: "Projects — PLANORA" },
      { property: "og:description", content: "All of your saved space designs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Projects() {
  const projects = useProjects();

  return (
    <AppShell
      title="Projects"
      subtitle={`${projects?.length ?? 0} saved designs`}
      actions={
        <Link
          to="/design/new"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground"
        >
          <Plus className="size-4" /> New
        </Link>
      }
    >
      {projects && projects.length === 0 && (
        <p className="text-sm text-muted-foreground">Nothing here yet.</p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {projects?.map((p) => (
          <div key={p.id} className="relative">
            <ProjectCard project={p} />
            <button
              aria-label={`Delete ${p.name}`}
              onClick={() => {
                deleteProject(p.id);
                toast.success("Project deleted");
              }}
              className="absolute top-3 right-3 rounded-md border border-border bg-background/80 p-1.5 text-muted-foreground transition-colors hover:text-destructive"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
