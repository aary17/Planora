import { useCallback, useEffect, useState } from "react";
import {
  getProject,
  loadProjects,
  upsertProject,
  type Project,
} from "@/lib/planora";

export function useProjects() {
  const [projects, setProjects] = useState<Project[] | null>(null);

  useEffect(() => {
    const sync = () => setProjects(loadProjects());
    sync();
    window.addEventListener("planora:projects", sync);
    return () => window.removeEventListener("planora:projects", sync);
  }, []);

  return projects;
}

export function useProject(id: string) {
  const [project, setProject] = useState<Project | null | undefined>(undefined);

  useEffect(() => {
    const sync = () => setProject(getProject(id) ?? null);
    sync();
    window.addEventListener("planora:projects", sync);
    return () => window.removeEventListener("planora:projects", sync);
  }, [id]);

  const update = useCallback(
    (patch: Partial<Project> | ((p: Project) => Project)) => {
      const current = getProject(id);
      if (!current) return;
      const next =
        typeof patch === "function" ? patch(current) : { ...current, ...patch };
      upsertProject(next);
      setProject(next);
    },
    [id],
  );

  return { project, update };
}
