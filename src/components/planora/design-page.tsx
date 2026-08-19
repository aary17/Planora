import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { AppShell } from "./app-shell";
import { StepIndicator } from "./step-indicator";
import { useProject } from "@/hooks/use-planora";
import type { Project } from "@/lib/planora";

type Ctx = {
  project: Project;
  update: (patch: Partial<Project> | ((p: Project) => Project)) => void;
};

export function DesignPage({
  id,
  step,
  title,
  subtitle,
  actions,
  children,
}: {
  id: string;
  step: string;
  title: string;
  subtitle?: string | undefined;
  actions?: ReactNode | undefined;
  children: (ctx: Ctx) => ReactNode;
}) {
  const { project, update } = useProject(id);

  return (
    <AppShell title={title} subtitle={subtitle} actions={actions}>
      <div className="mb-8">
        <StepIndicator current={step} />
      </div>
      {project === undefined ? (
        <p className="tech-label">Loading…</p>
      ) : project === null ? (
        <div className="surface-panel p-8 text-center">
          <p className="text-sm text-muted-foreground">This project no longer exists.</p>
          <Link
            to="/dashboard"
            className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Back to dashboard
          </Link>
        </div>
      ) : (
        children({ project, update })
      )}
    </AppShell>
  );
}

export function FooterNav({
  backTo,
  children,
}: {
  backTo?: ReactNode | undefined;
  children?: ReactNode | undefined;
}) {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
      <div className="text-sm text-muted-foreground">{backTo}</div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
