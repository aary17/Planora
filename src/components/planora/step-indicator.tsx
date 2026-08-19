import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const DESIGN_STEPS = [
  { key: "rooms", label: "Rooms" },
  { key: "preferences", label: "Preferences" },
  { key: "generating", label: "Generate" },
  { key: "plans", label: "Plans" },
  { key: "edit", label: "Edit" },
  { key: "validation", label: "Validate" },
  { key: "final", label: "Final 2D" },
  { key: "3d", label: "3D" },
] as const;

export function StepIndicator({ current }: { current: string }) {
  const index = DESIGN_STEPS.findIndex((s) => s.key === current);
  return (
    <ol className="flex flex-wrap items-center gap-x-3 gap-y-2">
      {DESIGN_STEPS.map((step, i) => {
        const done = i < index;
        const active = i === index;
        return (
          <li key={step.key} className="flex items-center gap-2">
            <span
              className={cn(
                "flex size-5 items-center justify-center rounded-full border text-[10px] font-medium",
                done && "border-primary/60 bg-primary/15 text-primary",
                active && "border-primary bg-primary text-primary-foreground",
                !done && !active && "border-border text-muted-foreground",
              )}
            >
              {done ? <Check className="size-3" /> : i + 1}
            </span>
            <span
              className={cn(
                "text-xs",
                active ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {step.label}
            </span>
            {i < DESIGN_STEPS.length - 1 && (
              <span className="hidden h-px w-6 bg-border sm:block" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export function WizardNav({
  backTo,
  backLabel = "Back",
}: {
  backTo: string;
  backLabel?: string;
}) {
  return (
    <Link
      to={backTo}
      className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
    >
      ← {backLabel}
    </Link>
  );
}
