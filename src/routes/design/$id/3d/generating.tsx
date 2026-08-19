import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DesignPage } from "@/components/planora/design-page";
import { AIProgress } from "@/components/planora/ai-progress";
import { getProject, upsertProject } from "@/lib/planora";

export const Route = createFileRoute("/design/$id/3d/generating")({
  component: Generating3D,
  head: () => ({
    meta: [
      { title: "Generating 3D — PLANORA" },
      { name: "description", content: "Converting your approved 2D plan into a 3D model." },
      { property: "og:title", content: "Generating 3D — PLANORA" },
      { property: "og:description", content: "Converting the 2D plan into a 3D model." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const STAGES = [
  "Extruding wall geometry",
  "Cutting doors and windows",
  "Assigning materials",
  "Baking lighting",
  "Preparing viewer",
];

function Generating3D() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!done) return;
    const project = getProject(id);
    if (project) upsertProject({ ...project, status: "3D Ready" });
    navigate({ to: "/design/$id/3d", params: { id } });
  }, [done, id, navigate]);

  return (
    <DesignPage id={id} step="3d" title="3D generation" subtitle="Step 9 · Building volumes">
      {() => <AIProgress stages={STAGES} onComplete={() => setDone(true)} interval={600} />}
    </DesignPage>
  );
}
