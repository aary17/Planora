import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Check, Download, Mail } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/planora/app-shell";
import { FloorPlan } from "@/components/planora/floor-plan";
import { useProject } from "@/hooks/use-planora";

export const Route = createFileRoute("/design/$id/share")({
  component: SharePage,
  head: () => ({
    meta: [
      { title: "Save & share — PLANORA" },
      { name: "description", content: "Share your Planora design with a link, email or export." },
      { property: "og:title", content: "Save & share — PLANORA" },
      { property: "og:description", content: "Share your design with collaborators." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function SharePage() {
  const { id } = Route.useParams();
  const { project } = useProject(id);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");

  const link = `https://planora.app/s/${id.slice(0, 8)}`;
  const plan = project?.plans.find((p) => p.id === project.selectedPlanId);

  return (
    <AppShell title="Save & share" subtitle="Distribute your design">
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="surface-panel p-5">
          {project && plan ? (
            <div className="aspect-4/3 rounded-md bg-background/60 p-3">
              <FloorPlan
                plan={plan}
                plotWidth={project.plotWidth}
                plotLength={project.plotLength}
                unit={project.unit}
                showDimensions
              />
            </div>
          ) : (
            <p className="tech-label">No plan selected yet.</p>
          )}
        </div>

        <div className="surface-panel h-fit space-y-6 p-6">
          <div>
            <p className="tech-label">Shareable link</p>
            <div className="mt-2 flex gap-2">
              <input readOnly value={link} className="input-base font-mono text-xs" />
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(link);
                  setCopied(true);
                  toast.success("Link copied");
                  setTimeout(() => setCopied(false), 1600);
                }}
                className="rounded-md border border-border px-3 hover:border-primary/60"
                aria-label="Copy link"
              >
                {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
              </button>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success(`Invite sent to ${email || "your collaborator"}`);
              setEmail("");
            }}
          >
            <label className="tech-label" htmlFor="invite">
              Invite by email
            </label>
            <div className="mt-2 flex gap-2">
              <input
                id="invite"
                type="email"
                required
                placeholder="architect@studio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-base"
              />
              <button className="rounded-md bg-primary px-3 text-primary-foreground" aria-label="Send invite">
                <Mail className="size-4" />
              </button>
            </div>
          </form>

          <div className="space-y-2">
            <p className="tech-label">Export</p>
            {["PDF drawing set", "DXF (CAD)", "GLB (3D model)"].map((f) => (
              <button
                key={f}
                onClick={() => toast.success(`${f} export queued`, { description: "Mocked in this prototype." })}
                className="flex w-full items-center justify-between rounded-md border border-border px-3 py-2 text-sm hover:border-primary/60"
              >
                {f} <Download className="size-4 text-muted-foreground" />
              </button>
            ))}
          </div>

          <Link
            to="/dashboard"
            className="block rounded-md bg-primary px-5 py-2.5 text-center text-sm font-medium text-primary-foreground"
          >
            Done — back to dashboard
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
