import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { DesignPage, FooterNav } from "@/components/planora/design-page";
import { Field } from "@/routes/login";

export const Route = createFileRoute("/design/$id/preferences")({
  component: PreferencesPage,
  head: () => ({
    meta: [
      { title: "Preferences — PLANORA" },
      { name: "description", content: "Set style, orientation and comfort preferences." },
      { property: "og:title", content: "Preferences — PLANORA" },
      { property: "og:description", content: "Style, orientation and comfort preferences." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const STYLES = ["Modern Minimal", "Contemporary", "Traditional", "Industrial", "Scandinavian"];
const FACINGS = ["North", "South", "East", "West"];
const BUDGETS = ["Economy", "Standard", "Premium"];

function PreferencesPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  return (
    <DesignPage id={id} step="preferences" title="Preferences" subtitle="Step 3 · Style & constraints">
      {({ project, update }) => {
        const p = project.preferences;
        const set = (patch: Partial<typeof p>) =>
          update({ preferences: { ...p, ...patch } });

        return (
          <>
            <div className="surface-panel max-w-3xl space-y-6 p-6">
              <div className="grid gap-5 sm:grid-cols-3">
                <Field label="Style">
                  <select
                    className="input-base"
                    value={p.style}
                    onChange={(e) => set({ style: e.target.value })}
                  >
                    {STYLES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Entrance facing">
                  <select
                    className="input-base"
                    value={p.facing}
                    onChange={(e) => set({ facing: e.target.value })}
                  >
                    {FACINGS.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Budget tier">
                  <select
                    className="input-base"
                    value={p.budget}
                    onChange={(e) => set({ budget: e.target.value })}
                  >
                    {BUDGETS.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label={`Natural light priority — ${p.naturalLight}%`}>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={p.naturalLight}
                  onChange={(e) => set({ naturalLight: +e.target.value })}
                  className="w-full accent-primary"
                />
              </Field>

              <div className="grid gap-3 sm:grid-cols-2">
                <Toggle
                  label="Open plan living"
                  checked={p.openPlan}
                  onChange={(v) => set({ openPlan: v })}
                />
                <Toggle
                  label="Follow Vastu guidance"
                  checked={p.vastu}
                  onChange={(v) => set({ vastu: v })}
                />
              </div>

              <Field label="Additional notes">
                <textarea
                  rows={3}
                  className="input-base resize-none"
                  value={p.notes}
                  onChange={(e) => set({ notes: e.target.value })}
                  placeholder="Keep the study away from the street side."
                />
              </Field>
            </div>

            <FooterNav
              backTo={
                <Link to="/design/$id/rooms" params={{ id }} className="hover:text-foreground">
                  ← Rooms
                </Link>
              }
            >
              <button
                onClick={() => navigate({ to: "/design/$id/generating", params: { id } })}
                className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
              >
                Generate plans
              </button>
            </FooterNav>
          </>
        );
      }}
    </DesignPage>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between rounded-md border border-border px-4 py-3 text-sm transition-colors hover:border-primary/50"
    >
      {label}
      <span
        className={`relative h-5 w-9 rounded-full transition-colors ${checked ? "bg-primary" : "bg-muted"}`}
      >
        <span
          className={`absolute top-0.5 size-4 rounded-full bg-foreground transition-all ${checked ? "left-4.5" : "left-0.5"}`}
        />
      </span>
    </button>
  );
}
