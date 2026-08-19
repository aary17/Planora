import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function AIProgress({
  stages,
  onComplete,
  interval = 700,
}: {
  stages: string[];
  onComplete: () => void;
  interval?: number;
}) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= stages.length) {
      const t = setTimeout(onComplete, 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), interval);
    return () => clearTimeout(t);
  }, [step, stages.length, interval, onComplete]);

  const pct = Math.round((Math.min(step, stages.length) / stages.length) * 100);

  return (
    <div className="surface-panel relative mx-auto max-w-xl overflow-hidden p-8">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-20" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 animate-scan bg-linear-to-b from-transparent via-primary/15 to-transparent" />
      <div className="relative">
        <p className="tech-label">AI Status</p>
        <p className="mt-3 font-mono text-4xl">{pct}%</p>
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <ul className="mt-7 space-y-3">
          {stages.map((s, i) => (
            <li
              key={s}
              className={cn(
                "flex items-center gap-3 text-sm",
                i < step ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {i < step ? (
                <Check className="size-4 text-success" />
              ) : i === step ? (
                <Loader2 className="size-4 animate-spin text-primary" />
              ) : (
                <span className="size-4 rounded-full border border-border" />
              )}
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
