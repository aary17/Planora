import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { Orbit, Move, ZoomIn, Footprints, Boxes } from "lucide-react";
import { DesignPage, FooterNav } from "@/components/planora/design-page";
import { NoPlan } from "../edit";
import { cn } from "@/lib/utils";

const Viewer3D = lazy(() => import("@/components/planora/viewer-3d"));

export const Route = createFileRoute("/design/$id/3d/")({
  component: Explore3D,
  head: () => ({
    meta: [
      { title: "Explore 3D — PLANORA" },
      { name: "description", content: "Explore your generated space in an interactive 3D viewer." },
      { property: "og:title", content: "Explore 3D — PLANORA" },
      { property: "og:description", content: "Interactive 3D walkthrough of your plan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const MODES = [
  { key: "orbit", label: "Orbit", icon: Orbit },
  { key: "zoom", label: "Zoom", icon: ZoomIn },
  { key: "pan", label: "Pan", icon: Move },
  { key: "walk", label: "Walk", icon: Footprints },
] as const;

function Explore3D() {
  const { id } = Route.useParams();
  const [mode, setMode] = useState<(typeof MODES)[number]["key"]>("orbit");
  const [mounted, setMounted] = useState(false);

  return (
    <DesignPage
      id={id}
      step="3d"
      title="Explore 3D"
      subtitle="Step 10 · Interactive walkthrough"
      actions={
        <Link
          to="/design/$id/vr"
          params={{ id }}
          className="rounded-md border border-border px-3.5 py-2 text-sm hover:border-primary/60"
        >
          VR mode
        </Link>
      }
    >
      {({ project }) => {
        const plan = project.plans.find((p) => p.id === project.selectedPlanId);
        if (!plan) return <NoPlan id={id} />;

        return (
          <>
            <div className="surface-panel overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
                <span className="tech-label">
                  {project.name} · Plan {plan.label}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {MODES.map((m) => (
                    <button
                      key={m.key}
                      onClick={() => setMode(m.key)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors",
                        mode === m.key
                          ? "border-primary bg-primary/15 text-primary"
                          : "border-border text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <m.icon className="size-3.5" /> {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-[420px] w-full sm:h-[560px]">
                {mounted ? (
                  <Suspense fallback={<ViewerFallback loading />}>
                    <Viewer3D plan={plan} project={project} mode={mode} />
                  </Suspense>
                ) : (
                  <ViewerFallback onStart={() => setMounted(true)} />
                )}
              </div>
            </div>

            <FooterNav
              backTo={
                <Link to="/design/$id/final" params={{ id }} className="hover:text-foreground">
                  ← Final 2D plan
                </Link>
              }
            >
              <Link
                to="/design/$id/share"
                params={{ id }}
                className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
              >
                Save & share
              </Link>
            </FooterNav>
          </>
        );
      }}
    </DesignPage>
  );
}

function ViewerFallback({
  onStart,
  loading,
}: {
  onStart?: () => void;
  loading?: boolean;
}) {
  return (
    <div className="blueprint-grid flex h-full flex-col items-center justify-center gap-4">
      <Boxes className="size-7 text-primary" />
      <p className="text-sm text-muted-foreground">
        {loading ? "Loading 3D scene…" : "Interactive 3D model ready"}
      </p>
      {onStart && (
        <button
          onClick={onStart}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Enter 3D viewer
        </button>
      )}
    </div>
  );
}
