import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus } from "lucide-react";
import { DesignPage, FooterNav } from "@/components/planora/design-page";
import { ROOM_TYPES } from "@/lib/planora";

export const Route = createFileRoute("/design/$id/rooms")({
  component: RoomsPage,
  head: () => ({
    meta: [
      { title: "Rooms & requirements — PLANORA" },
      { name: "description", content: "Define the room program for your AI floor plan." },
      { property: "og:title", content: "Rooms & requirements — PLANORA" },
      { property: "og:description", content: "Define the room program for your design." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function RoomsPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  return (
    <DesignPage id={id} step="rooms" title="Rooms & requirements" subtitle="Step 2 · Program">
      {({ project, update }) => {
        const countOf = (type: string) =>
          project.rooms.find((r) => r.type === type)?.count ?? 0;

        const setCount = (type: string, next: number) => {
          const rooms = project.rooms.filter((r) => r.type !== type);
          if (next > 0) rooms.push({ type, count: next });
          update({ rooms });
        };

        const total = project.rooms.reduce((a, r) => a + r.count, 0);

        return (
          <>
            <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
              <div className="surface-panel divide-y divide-border">
                {ROOM_TYPES.map((type) => {
                  const count = countOf(type);
                  return (
                    <div
                      key={type}
                      className="flex items-center justify-between gap-4 px-5 py-4"
                    >
                      <div>
                        <p className="text-sm">{type}</p>
                        <p className="tech-label mt-0.5">
                          {count > 0 ? `${count} planned` : "not included"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          aria-label={`Remove ${type}`}
                          onClick={() => setCount(type, Math.max(0, count - 1))}
                          className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-5 text-center font-mono text-sm">{count}</span>
                        <button
                          aria-label={`Add ${type}`}
                          onClick={() => setCount(type, Math.min(8, count + 1))}
                          className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <aside className="surface-panel h-fit p-5">
                <p className="tech-label">Summary</p>
                <dl className="mt-4 space-y-2 text-sm">
                  <Row label="Plot">
                    {project.plotWidth}×{project.plotLength} {project.unit}
                  </Row>
                  <Row label="Area">
                    {project.plotWidth * project.plotLength} {project.unit}²
                  </Row>
                  <Row label="Floors">{project.floors}</Row>
                  <Row label="Spaces">{total}</Row>
                </dl>
              </aside>
            </div>

            <FooterNav
              backTo={
                <Link to="/design/new" className="hover:text-foreground">
                  ← Plot details
                </Link>
              }
            >
              <button
                disabled={total === 0}
                onClick={() =>
                  navigate({ to: "/design/$id/preferences", params: { id } })
                }
                className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-40"
              >
                Continue to preferences
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
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-mono">{children}</dd>
    </div>
  );
}
