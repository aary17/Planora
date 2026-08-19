import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/planora/app-shell";
import { Field } from "@/routes/login";
import { createProject, upsertProject } from "@/lib/planora";

export const Route = createFileRoute("/design/new")({
  component: NewDesign,
  head: () => ({
    meta: [
      { title: "New design — PLANORA" },
      { name: "description", content: "Enter plot dimensions to start a new AI space design." },
      { property: "og:title", content: "New design — PLANORA" },
      { property: "og:description", content: "Start a new AI-generated space design." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function NewDesign() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    location: "",
    plotWidth: 40,
    plotLength: 60,
    floors: 1,
    unit: "ft" as "ft" | "m",
    description: "",
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const project = createProject({ ...form, name: form.name || "Untitled Design" });
    upsertProject(project);
    toast.success("Project created");
    navigate({ to: "/design/$id/rooms", params: { id: project.id } });
  }

  return (
    <AppShell title="Create new design" subtitle="Step 1 · Plot details">
      <form onSubmit={submit} className="surface-panel max-w-2xl space-y-5 p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Project name">
            <input
              className="input-base"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Hillside Residence"
            />
          </Field>
          <Field label="Location">
            <input
              className="input-base"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Pune, IN"
            />
          </Field>
          <Field label="Plot width">
            <input
              type="number"
              min={10}
              className="input-base"
              value={form.plotWidth}
              onChange={(e) => setForm({ ...form, plotWidth: +e.target.value })}
            />
          </Field>
          <Field label="Plot length">
            <input
              type="number"
              min={10}
              className="input-base"
              value={form.plotLength}
              onChange={(e) => setForm({ ...form, plotLength: +e.target.value })}
            />
          </Field>
          <Field label="Units">
            <select
              className="input-base"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value as "ft" | "m" })}
            >
              <option value="ft">Feet</option>
              <option value="m">Meters</option>
            </select>
          </Field>
          <Field label="Floors">
            <input
              type="number"
              min={1}
              max={4}
              className="input-base"
              value={form.floors}
              onChange={(e) => setForm({ ...form, floors: +e.target.value })}
            />
          </Field>
        </div>
        <Field label="Description" hint="Tell the AI about the site, users and intent.">
          <textarea
            rows={4}
            className="input-base resize-none"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Family of four, north-facing plot, prefers open kitchen and a quiet study."
          />
        </Field>
        <div className="flex justify-end">
          <button className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
            Continue to rooms
          </button>
        </div>
      </form>
    </AppShell>
  );
}
