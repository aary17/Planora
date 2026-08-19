import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DesignPage } from "@/components/planora/design-page";
import { AIProgress } from "@/components/planora/ai-progress";
import { generatePlans, getProject, upsertProject } from "@/lib/planora";

export const Route = createFileRoute("/design/$id/generating")({
  component: GeneratingPage,
  head: () => ({
    meta: [
      { title: "Generating plans — PLANORA" },
      { name: "description", content: "The AI is drafting floor plan options for your plot." },
      { property: "og:title", content: "Generating plans — PLANORA" },
      { property: "og:description", content: "AI is drafting your floor plan options." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const STAGES = [
  "Reading plot constraints",
  "Zoning public and private areas",
  "Allocating room areas",
  "Routing circulation",
  "Placing openings and services",
  "Scoring layout options",
];

function GeneratingPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!done) return;
    const project = getProject(id);
    if (!project) return;
    upsertProject({
      ...project,
      plans: generatePlans(project),
      status: "Generating",
    });
    navigate({ to: "/design/$id/plans", params: { id } });
  }, [done, id, navigate]);

  return (
    <DesignPage id={id} step="generating" title="AI generation" subtitle="Step 4 · Synthesising layouts">
      {() => <AIProgress stages={STAGES} onComplete={() => setDone(true)} />}
    </DesignPage>
  );
}
