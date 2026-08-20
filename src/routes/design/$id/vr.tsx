import { createFileRoute, Link } from "@tanstack/react-router";
import { Glasses, Clock } from "lucide-react";
import { AppShell } from "@/components/planora/app-shell";

export const Route = createFileRoute("/design/$id/vr")({
  component: VrPage,
  head: () => ({
    meta: [
      { title: "VR mode — PLANORA" },
      { name: "description", content: "Immersive VR walkthrough of your Planora design — coming soon." },
      { property: "og:title", content: "VR mode — PLANORA" },
      { property: "og:description", content: "Immersive VR walkthrough — coming soon." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function VrPage() {
  const { id } = Route.useParams();
  return (
    <AppShell title="VR mode" subtitle="Immersive walkthrough">
      <div className="surface-panel blueprint-grid mx-auto max-w-2xl p-10 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-xl border border-primary/40 bg-primary/10">
          <Glasses className="size-6 text-primary" />
        </div>
        <p className="tech-label mt-6 inline-flex items-center gap-2">
          <Clock className="size-3.5" /> Coming soon
        </p>
        <h2 className="mt-3 text-2xl font-semibold">Step inside your space</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          Headset streaming with room-scale navigation, live material swaps and shared
          walkthroughs is in development. Your 3D model will be VR-ready automatically.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-2">
          <Link
            to="/design/$id/3d"
            params={{ id }}
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Back to 3D viewer
          </Link>
          <Link
            to="/dashboard"
            className="rounded-md border border-border px-5 py-2.5 text-sm hover:border-primary/60"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
