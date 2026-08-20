import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/planora/app-shell";
import { clearProjects } from "@/lib/planora";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  head: () => ({
    meta: [
      { title: "Settings — PLANORA" },
      { name: "description", content: "Manage units, AI generation defaults and local design data." },
      { property: "og:title", content: "Settings — PLANORA" },
      { property: "og:description", content: "Workspace preferences for your Planora studio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function SettingsPage() {
  const [unit, setUnit] = useState("ft");
  const [quality, setQuality] = useState("balanced");
  const [autosave, setAutosave] = useState(true);

  return (
    <AppShell title="Settings" subtitle="Workspace preferences">
      <div className="grid max-w-3xl gap-4">
        <section className="surface-panel space-y-5 p-6">
          <p className="tech-label">Design defaults</p>
          <label className="block">
            <span className="text-sm">Default units</span>
            <select
              className="input-base mt-1.5"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            >
              <option value="ft">Feet</option>
              <option value="m">Meters</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm">AI generation quality</span>
            <select
              className="input-base mt-1.5"
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
            >
              <option value="fast">Fast draft</option>
              <option value="balanced">Balanced</option>
              <option value="detailed">Detailed</option>
            </select>
          </label>
          <label className="flex items-center justify-between gap-4 rounded-md border border-border px-3 py-2.5">
            <span className="text-sm">Autosave edits</span>
            <input
              type="checkbox"
              checked={autosave}
              onChange={(e) => setAutosave(e.target.checked)}
              className="size-4 accent-[var(--color-primary)]"
            />
          </label>
          <button
            onClick={() => toast.success("Preferences saved")}
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Save preferences
          </button>
        </section>

        <section className="surface-panel space-y-3 p-6">
          <p className="tech-label">Local data</p>
          <p className="text-sm text-muted-foreground">
            Projects in this prototype are stored in your browser. Clearing removes every
            design permanently.
          </p>
          <button
            onClick={() => {
              clearProjects();
              toast.success("All local designs cleared");
            }}
            className="rounded-md border border-destructive/50 px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
          >
            Clear all designs
          </button>
        </section>
      </div>
    </AppShell>
  );
}
