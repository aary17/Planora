import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DesignPage, FooterNav } from "@/components/planora/design-page";
import { FloorPlan } from "@/components/planora/floor-plan";
import type { Plan, Project, RoomRect } from "@/lib/planora";

export const Route = createFileRoute("/design/$id/edit")({
  component: EditPage,
  head: () => ({
    meta: [
      { title: "Edit plan — PLANORA" },
      { name: "description", content: "Move, resize, add or remove rooms on your floor plan." },
      { property: "og:title", content: "Edit plan — PLANORA" },
      { property: "og:description", content: "Refine rooms directly on the floor plan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function EditPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  return (
    <DesignPage id={id} step="edit" title="Edit plan" subtitle="Step 6 · Refine the layout">
      {({ project, update }) => {
        const plan = project.plans.find((p) => p.id === project.selectedPlanId);
        if (!plan) return <NoPlan id={id} />;

        const room = plan.rooms.find((r) => r.id === selected) ?? null;

        const writeRooms = (rooms: RoomRect[]) =>
          update({
            plans: project.plans.map((p) => (p.id === plan.id ? { ...p, rooms } : p)),
          });

        const patchRoom = (patch: Partial<RoomRect>) => {
          if (!room) return;
          writeRooms(
            plan.rooms.map((r) => (r.id === room.id ? clamp({ ...r, ...patch }, project) : r)),
          );
        };

        const drag = (e: React.PointerEvent) => {
          if (!room || !wrapRef.current) return;
          const rect = wrapRef.current.getBoundingClientRect();
          const scale = project.plotWidth / rect.width;
          const startX = e.clientX;
          const startY = e.clientY;
          const origin = { x: room.x, y: room.y };
          const move = (ev: PointerEvent) => {
            patchRoom({
              x: +(origin.x + (ev.clientX - startX) * scale).toFixed(2),
              y: +(origin.y + (ev.clientY - startY) * scale).toFixed(2),
            });
          };
          const up = () => {
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", up);
          };
          window.addEventListener("pointermove", move);
          window.addEventListener("pointerup", up);
        };

        return (
          <>
            <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
              <div className="surface-panel p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="tech-label">
                    Plan {plan.label} · {plan.title}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const next: RoomRect = {
                          id: `r-${Date.now()}`,
                          name: "New Space",
                          x: 2,
                          y: 2,
                          w: Math.min(12, project.plotWidth / 3),
                          h: Math.min(12, project.plotLength / 3),
                        };
                        writeRooms([...plan.rooms, next]);
                        setSelected(next.id);
                        toast.success("Room added");
                      }}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs hover:border-primary/60"
                    >
                      <Plus className="size-3.5" /> Add room
                    </button>
                    <button
                      disabled={!room}
                      onClick={() => {
                        if (!room) return;
                        writeRooms(plan.rooms.filter((r) => r.id !== room.id));
                        setSelected(null);
                        toast.success("Room removed");
                      }}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs hover:border-destructive/60 disabled:opacity-40"
                    >
                      <Trash2 className="size-3.5" /> Delete
                    </button>
                  </div>
                </div>
                <div
                  ref={wrapRef}
                  onPointerDown={drag}
                  className="aspect-square touch-none rounded-md bg-background/60 p-3 sm:aspect-4/3"
                >
                  <FloorPlan
                    plan={plan}
                    plotWidth={project.plotWidth}
                    plotLength={project.plotLength}
                    selectedId={selected}
                    onSelect={setSelected}
                  />
                </div>
                <p className="tech-label mt-3">
                  Click a room to select · drag to move · resize below
                </p>
              </div>

              <aside className="surface-panel h-fit space-y-4 p-5">
                <p className="tech-label">Inspector</p>
                {!room ? (
                  <p className="text-sm text-muted-foreground">No room selected.</p>
                ) : (
                  <div className="space-y-3">
                    <label className="block">
                      <span className="tech-label">Name</span>
                      <input
                        className="input-base mt-1.5"
                        value={room.name}
                        onChange={(e) => patchRoom({ name: e.target.value })}
                      />
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {(["x", "y", "w", "h"] as const).map((k) => (
                        <label key={k} className="block">
                          <span className="tech-label">{k.toUpperCase()}</span>
                          <input
                            type="number"
                            step={0.5}
                            className="input-base mt-1.5"
                            value={room[k]}
                            onChange={(e) => patchRoom({ [k]: +e.target.value })}
                          />
                        </label>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Area {(room.w * room.h).toFixed(1)} {project.unit}²
                    </p>
                  </div>
                )}
              </aside>
            </div>

            <FooterNav
              backTo={
                <Link to="/design/$id/plans" params={{ id }} className="hover:text-foreground">
                  ← Plans
                </Link>
              }
            >
              <button
                onClick={() => navigate({ to: "/design/$id/validation", params: { id } })}
                className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
              >
                Validate plan
              </button>
            </FooterNav>
          </>
        );
      }}
    </DesignPage>
  );
}

function clamp(r: RoomRect, project: Project): RoomRect {
  const w = Math.max(3, Math.min(r.w, project.plotWidth));
  const h = Math.max(3, Math.min(r.h, project.plotLength));
  return {
    ...r,
    w,
    h,
    x: Math.max(0, Math.min(r.x, project.plotWidth - w)),
    y: Math.max(0, Math.min(r.y, project.plotLength - h)),
  };
}

export function NoPlan({ id }: { id: string }) {
  return (
    <div className="surface-panel p-8 text-center">
      <p className="text-sm text-muted-foreground">Select a plan first.</p>
      <Link
        to="/design/$id/plans"
        params={{ id }}
        className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        View generated plans
      </Link>
    </div>
  );
}

export type { Plan };
