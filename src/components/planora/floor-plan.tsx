import { useMemo } from "react";
import type { Plan, RoomRect } from "@/lib/planora";
import { cn } from "@/lib/utils";

type Props = {
  plan: Plan;
  plotWidth: number;
  plotLength: number;
  unit?: string;
  showDimensions?: boolean;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  className?: string;
};

/** Simple SVG architectural plan: walls, door swings, windows, labels, dimensions. */
export function FloorPlan({
  plan,
  plotWidth,
  plotLength,
  unit = "ft",
  showDimensions = false,
  selectedId,
  onSelect,
  className,
}: Props) {
  const pad = showDimensions ? 6 : 2;
  const vb = `${-pad} ${-pad} ${plotWidth + pad * 2} ${plotLength + pad * 2}`;
  const stroke = Math.max(plotWidth, plotLength) / 220;

  const openings = useMemo(() => plan.rooms.map(doorFor), [plan]);

  return (
    <svg
      viewBox={vb}
      className={cn("h-full w-full", className)}
      role="img"
      aria-label={`Floor plan option ${plan.label}`}
    >
      <defs>
        <pattern id={`grid-${plan.id}`} width="5" height="5" patternUnits="userSpaceOnUse">
          <path
            d="M 5 0 L 0 0 0 5"
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke / 2}
            className="text-border"
            opacity="0.5"
          />
        </pattern>
      </defs>

      <rect
        x={0}
        y={0}
        width={plotWidth}
        height={plotLength}
        fill={`url(#grid-${plan.id})`}
        className="text-border"
      />
      <rect
        x={0}
        y={0}
        width={plotWidth}
        height={plotLength}
        fill="none"
        stroke="currentColor"
        strokeDasharray={`${stroke * 6} ${stroke * 4}`}
        strokeWidth={stroke}
        className="text-muted-foreground/60"
      />

      {plan.rooms.map((r, i) => {
        const active = selectedId === r.id;
        return (
          <g
            key={r.id}
            onClick={onSelect ? () => onSelect(r.id) : undefined}
            className={onSelect ? "cursor-pointer" : undefined}
          >
            <rect
              x={r.x}
              y={r.y}
              width={r.w}
              height={r.h}
              className={cn(
                "fill-card stroke-foreground",
                active && "fill-primary/20 stroke-primary",
              )}
              fillOpacity={active ? 1 : 0.55}
              strokeWidth={stroke * 3}
            />
            {/* window on the longest outer edge */}
            <line
              x1={r.x + r.w * 0.3}
              y1={r.y + stroke * 1.5}
              x2={r.x + r.w * 0.7}
              y2={r.y + stroke * 1.5}
              className="stroke-accent"
              strokeWidth={stroke * 2}
            />
            {/* door swing */}
            <path
              d={openings[i]}
              fill="none"
              className="stroke-primary"
              strokeWidth={stroke * 1.4}
            />
            <text
              x={r.x + r.w / 2}
              y={r.y + r.h / 2}
              textAnchor="middle"
              className="fill-foreground"
              style={{ fontSize: Math.min(r.w, r.h) * 0.17, letterSpacing: 0.1 }}
            >
              {r.name}
            </text>
            <text
              x={r.x + r.w / 2}
              y={r.y + r.h / 2 + Math.min(r.w, r.h) * 0.22}
              textAnchor="middle"
              className="fill-muted-foreground"
              style={{ fontSize: Math.min(r.w, r.h) * 0.13 }}
            >
              {r.w.toFixed(1)}×{r.h.toFixed(1)}
            </text>
          </g>
        );
      })}

      {showDimensions && (
        <g className="fill-muted-foreground stroke-muted-foreground">
          <line x1={0} y1={-3} x2={plotWidth} y2={-3} strokeWidth={stroke} />
          <text
            x={plotWidth / 2}
            y={-4}
            textAnchor="middle"
            stroke="none"
            style={{ fontSize: plotWidth * 0.045 }}
          >
            {plotWidth} {unit}
          </text>
          <line x1={-3} y1={0} x2={-3} y2={plotLength} strokeWidth={stroke} />
          <text
            x={-4}
            y={plotLength / 2}
            textAnchor="middle"
            stroke="none"
            transform={`rotate(-90 -4 ${plotLength / 2})`}
            style={{ fontSize: plotWidth * 0.045 }}
          >
            {plotLength} {unit}
          </text>
        </g>
      )}
    </svg>
  );
}

function doorFor(r: RoomRect) {
  const d = Math.min(r.w, r.h) * 0.22;
  const x = r.x + r.w * 0.15;
  const y = r.y + r.h;
  return `M ${x} ${y} L ${x + d} ${y} A ${d} ${d} 0 0 0 ${x} ${y - d}`;
}
