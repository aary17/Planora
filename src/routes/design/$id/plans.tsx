import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { DesignPage, FooterNav } from "@/components/planora/design-page";
import { PlanCard } from "@/components/planora/cards";

export const Route = createFileRoute("/design/$id/plans")({
  component: PlansPage,
  head: () => ({
    meta: [
      { title: "Generated plans — PLANORA" },
      { name: "description", content: "Review AI-generated floor plan options for your plot." },
      { property: "og:title", content: "Generated plans — PLANORA" },
      { property: "og:description", content: "Review AI-generated floor plan options." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function PlansPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  return (
    <DesignPage
      id={id}
      step="plans"
      title="Generated plans"
      subtitle="Step 5 · Three viable layouts"
      actions={
        <Link
          to="/design/$id/compare"
          params={{ id }}
          className="rounded-md border border-border px-3.5 py-2 text-sm hover:border-primary/60"
        >
          Compare
        </Link>
      }
    >
      {({ project, update }) => {
        const best = project.plans.reduce(
          (a, b) => (b.score > a.score ? b : a),
          project.plans[0]!,
        );
        return (
          <>
            <div className="grid gap-4 lg:grid-cols-3">
              {project.plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  project={project}
                  best={plan.id === best?.id}
                  selected={project.selectedPlanId === plan.id}
                  onSelect={() => {
                    update({ selectedPlanId: plan.id });
                    toast.success(`Plan ${plan.label} selected`);
                  }}
                />
              ))}
            </div>
            <FooterNav
              backTo={
                <Link
                  to="/design/$id/preferences"
                  params={{ id }}
                  className="hover:text-foreground"
                >
                  ← Preferences
                </Link>
              }
            >
              <button
                disabled={!project.selectedPlanId}
                onClick={() => navigate({ to: "/design/$id/edit", params: { id } })}
                className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-40"
              >
                Edit selected plan
              </button>
            </FooterNav>
          </>
        );
      }}
    </DesignPage>
  );
}
