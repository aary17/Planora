import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn(
        "inline-flex items-baseline font-semibold tracking-[0.28em] text-foreground",
        className,
      )}
    >
      <span>PLANOR</span>
      <span className="text-primary">A</span>
    </Link>
  );
}
