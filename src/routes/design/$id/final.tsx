import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Download, Share2 } from "lucide-react";
import { toast } from "sonner";
import { DesignPage, FooterNav } from "@/components/planora/design-page";
import { FloorPlan } from "@/components/planora/floor-plan";
import { NoPlan } from "./edit";
import { planArea } from "@/lib/planora";

export const Route = createFileRoute("/design/$id/final")({
  component: FinalPage,
  head: () => ({
    meta: [
      { title: "Final 2D plan — PLANORA" },
      { name: "description", content: "Your approved blueprint-style 2D floor plan." },
      { property: "og:title", content: "Final 2D plan — PLANORA" },
      { property: "og:description", content: "Approved blueprint-style 2D floor plan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function FinalPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  return (
    <DesignPage id={id} step="final" title="Final 2D plan" subtitle="Step 8 · Approved blueprint">
      {({ project }) => {
        const plan = project.plans.find((p) => p.id === project.selectedPlanId);
        if (!plan) return <NoPlan id={id} />;

        return (
          <>
            <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
              <div className="surface-panel blueprint-grid p-5">
                <div className="aspect-4/3 rounded-md p-2">
                  <FloorPlan
                    plan={plan}
                    plotWidth={project.plotWidth}
                    plotLength={project.plotLength}
                    unit={project.unit}
                    showDimensions
                  />
                </div>
              </div>
              <aside className="surface-panel h-fit space-y-4 p-5">
                <p className="tech-label">Drawing info</p>
                <dl className="space-y-2 text-sm">
                  <Row label="Project">{project.name}</Row>
                  <Row label="Plan">
                    {plan.label} · {plan.title}
                  </Row>
                  <Row label="Plot">
                    {project.plotWidth}×{project.plotLength} {project.unit}
                  </Row>
                  <Row label="Built">
                    {Math.round(planArea(plan))} {project.unit}²
                  </Row>
                  <Row label="Spaces">{plan.rooms.length}</Row>
                  <Row label="Status">{project.validated ? "Validated" : "Draft"}</Row>
                </dl>
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => toast.success("Export queued", { description: "PDF export is mocked in this prototype." })}
                    className="flex w-full items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:border-primary/60"
                  >
                    <Download className="size-4" /> Export PDF
                  </button>
                  <Link
                    to="/design/$id/share"
                    params={{ id }}
                    className="flex w-full items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:border-primary/60"
                  >
                    <Share2 className="size-4" /> Save & share
                  </Link>
                </div>
              </aside>
            </div>

            <FooterNav
              backTo={
                <Link to="/design/$id/validation" params={{ id }} className="hover:text-foreground">
                  ← Validation
                </Link>
              }
            >
              <button
                onClick={() => navigate({ to: "/design/$id/3d/generating", params: { id } })}
                className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
              >
                Generate 3D model
              </button>
            </FooterNav>
          </>
        );
      }}
    </DesignPage>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="truncate font-mono text-xs">{children}</dd>
    </div>
  );
}
