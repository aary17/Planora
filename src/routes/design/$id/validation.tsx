import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { DesignPage, FooterNav } from "@/components/planora/design-page";
import { ValidationItem } from "@/components/planora/cards";
import { FloorPlan } from "@/components/planora/floor-plan";
import { NoPlan } from "./edit";
import { validatePlan } from "@/lib/planora";

export const Route = createFileRoute("/design/$id/validation")({
  component: ValidationPage,
  head: () => ({
    meta: [
      { title: "Validation — PLANORA" },
      { name: "description", content: "Check your floor plan against coverage, light and access rules." },
      { property: "og:title", content: "Validation — PLANORA" },
      { property: "og:description", content: "Constraint checks for your floor plan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function ValidationPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  return (
    <DesignPage id={id} step="validation" title="Validation" subtitle="Step 7 · Constraint checks">
      {({ project, update }) => {
        const plan = project.plans.find((p) => p.id === project.selectedPlanId);
        if (!plan) return <NoPlan id={id} />;
        const results = validatePlan(project, plan);
        const failed = results.filter((r) => r.status === "fail").length;
        const warned = results.filter((r) => r.status === "warn").length;

        return (
          <>
            <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
              <div className="surface-panel p-4">
                <div className="aspect-4/3 rounded-md bg-background/60 p-3">
                  <FloorPlan
                    plan={plan}
                    plotWidth={project.plotWidth}
                    plotLength={project.plotLength}
                  />
                </div>
              </div>
              <div className="surface-panel p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="tech-label">Checklist</p>
                  <p className="text-xs text-muted-foreground">
                    {results.length - failed - warned} passed · {warned} warnings ·{" "}
                    {failed} blocking
                  </p>
                </div>
                <ul className="mt-4">
                  {results.map((r) => (
                    <ValidationItem key={r.id} item={r} />
                  ))}
                </ul>
              </div>
            </div>

            <FooterNav
              backTo={
                <Link to="/design/$id/edit" params={{ id }} className="hover:text-foreground">
                  ← Edit plan
                </Link>
              }
            >
              <button
                disabled={failed > 0}
                onClick={() => {
                  update({ validated: true, status: "Validated" });
                  toast.success("Plan validated");
                  navigate({ to: "/design/$id/final", params: { id } });
                }}
                className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-40"
              >
                Approve final 2D plan
              </button>
            </FooterNav>
          </>
        );
      }}
    </DesignPage>
  );
}
