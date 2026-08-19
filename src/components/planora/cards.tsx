import { Link } from "@tanstack/react-router";
import { ArrowRight, Box, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import type { Plan, Project, ValidationResult } from "@/lib/planora";
import { STATUS_STYLES } from "@/lib/planora";
import { FloorPlan } from "./floor-plan";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: Project["status"] }) {
  return (
    <span
      className={cn(
        "rounded-full border px-2.5 py-0.5 text-[11px] tracking-wide",
        STATUS_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  const plan = project.plans.find((p) => p.id === project.selectedPlanId) ?? project.plans[0];
  return (
    <Link
      to="/design/$id/rooms"
      params={{ id: project.id }}
      className="surface-panel group flex flex-col overflow-hidden transition-colors hover:border-primary/50"
    >
      <div className="aspect-4/3 border-b border-border bg-background/60 p-3">
        {plan ? (
          <FloorPlan
            plan={plan}
            plotWidth={project.plotWidth}
            plotLength={project.plotLength}
          />
        ) : (
          <div className="blueprint-grid flex h-full items-center justify-center rounded-md">
            <Box className="size-6 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="flex items-start justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{project.name}</p>
          <p className="tech-label mt-1">
            {project.plotWidth}×{project.plotLength} {project.unit} · {project.floors}F
          </p>
        </div>
        <StatusBadge status={project.status} />
      </div>
    </Link>
  );
}

export function PlanCard({
  plan,
  project,
  selected,
  best,
  onSelect,
  href,
}: {
  plan: Plan;
  project: Project;
  selected?: boolean;
  best?: boolean;
  onSelect?: () => void;
  href?: string;
}) {
  const body = (
    <div
      className={cn(
        "surface-panel flex h-full flex-col overflow-hidden transition-all",
        selected ? "border-primary glow-ring" : "hover:border-primary/40",
      )}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="tech-label text-primary">Plan {plan.label}</span>
          <span className="text-sm font-medium">{plan.title}</span>
        </div>
        {best && (
          <span className="rounded-full border border-success/40 px-2 py-0.5 text-[10px] text-success">
            Strongest
          </span>
        )}
      </div>
      <div className="aspect-4/3 bg-background/60 p-3">
        <FloorPlan
          plan={plan}
          plotWidth={project.plotWidth}
          plotLength={project.plotLength}
        />
      </div>
      <div className="space-y-3 p-4">
        <div className="flex flex-wrap gap-1.5">
          {plan.tags.map((t) => (
            <span
              key={t}
              className="rounded-md border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
        <Metrics plan={plan} />
        {onSelect && (
          <button
            onClick={onSelect}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              selected
                ? "bg-primary text-primary-foreground"
                : "border border-border text-foreground hover:border-primary/60",
            )}
          >
            {selected ? "Selected" : "Select plan"} <ArrowRight className="size-3.5" />
          </button>
        )}
      </div>
    </div>
  );
  return href ? <div>{body}</div> : body;
}

export function Metrics({ plan }: { plan: Plan }) {
  const rows = [
    ["Efficiency", plan.efficiency],
    ["Daylight", plan.daylight],
    ["Circulation", plan.circulation],
  ] as const;
  return (
    <div className="space-y-2">
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-center gap-3">
          <span className="w-20 shrink-0 text-[11px] text-muted-foreground">{label}</span>
          <span className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
            <span
              className="block h-full rounded-full bg-primary"
              style={{ width: `${value}%` }}
            />
          </span>
          <span className="w-8 text-right font-mono text-[11px] text-muted-foreground">
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ValidationItem({ item }: { item: ValidationResult }) {
  const Icon =
    item.status === "pass" ? CheckCircle2 : item.status === "warn" ? AlertTriangle : XCircle;
  const tone =
    item.status === "pass"
      ? "text-success"
      : item.status === "warn"
        ? "text-warning"
        : "text-destructive";
  return (
    <li className="flex items-start gap-3 border-b border-border py-3 last:border-0">
      <Icon className={cn("mt-0.5 size-4 shrink-0", tone)} />
      <div className="min-w-0">
        <p className="text-sm">{item.label}</p>
        <p className="text-xs text-muted-foreground">{item.detail}</p>
      </div>
    </li>
  );
}
