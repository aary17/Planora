import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { DesignPage, FooterNav } from "@/components/planora/design-page";
import { FloorPlan } from "@/components/planora/floor-plan";
import { Metrics } from "@/components/planora/cards";
import { planArea } from "@/lib/planora";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/design/$id/compare")({
  component: ComparePage,
  head: () => ({
    meta: [
      { title: "Compare plans — PLANORA" },
      { name: "description", content: "Compare floor plan options side by side before choosing." },
      { property: "og:title", content: "Compare plans — PLANORA" },
      { property: "og:description", content: "Compare floor plan options side by side." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function ComparePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  return (
    <DesignPage id={id} step="plans" title="Compare plans" subtitle="Side-by-side evaluation">
      {({ project, update }) => {
        const best = project.plans.reduce(
          (a, b) => (b.score > a.score ? b : a),
          project.plans[0]!,
        );
        return (
          <>
            <div className="grid gap-4 lg:grid-cols-3">
              {project.plans.map((plan) => {
                const strongest = plan.id === best?.id;
                const selected = project.selectedPlanId === plan.id;
                return (
                  <div
                    key={plan.id}
                    className={cn(
                      "surface-panel overflow-hidden",
                      strongest && "border-success/50",
                      selected && "glow-ring border-primary",
                    )}
                  >
                    <div className="flex items-center justify-between border-b border-border px-4 py-3">
                      <span className="text-sm font-medium">
                        Plan {plan.label} · {plan.title}
                      </span>
                      <span className="font-mono text-sm text-primary">{plan.score}</span>
                    </div>
                    <div className="aspect-4/3 bg-background/60 p-3">
                      <FloorPlan
                        plan={plan}
                        plotWidth={project.plotWidth}
                        plotLength={project.plotLength}
                      />
                    </div>
                    <div className="space-y-3 p-4">
                      <Metrics plan={plan} />
                      <dl className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Built area</dt>
                          <dd className="font-mono">
                            {Math.round(planArea(plan))} {project.unit}²
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Spaces</dt>
                          <dd className="font-mono">{plan.rooms.length}</dd>
                        </div>
                      </dl>
                      {strongest && (
                        <p className="rounded-md border border-success/40 px-3 py-2 text-xs text-success">
                          Strongest overall balance of daylight, efficiency and flow.
                        </p>
                      )}
                      <button
                        onClick={() => {
                          update({ selectedPlanId: plan.id });
                          toast.success(`Plan ${plan.label} selected`);
                        }}
                        className={cn(
                          "w-full rounded-md px-3 py-2 text-sm font-medium",
                          selected
                            ? "bg-primary text-primary-foreground"
                            : "border border-border hover:border-primary/60",
                        )}
                      >
                        {selected ? "Selected" : "Choose this plan"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <FooterNav
              backTo={
                <Link to="/design/$id/plans" params={{ id }} className="hover:text-foreground">
                  ← Plans
                </Link>
              }
            >
              <button
                disabled={!project.selectedPlanId}
                onClick={() => navigate({ to: "/design/$id/edit", params: { id } })}
                className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-40"
              >
                Continue to editor
              </button>
            </FooterNav>
          </>
        );
      }}
    </DesignPage>
  );
}
