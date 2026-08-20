export type ProjectStatus = "Draft" | "Generating" | "Validated" | "3D Ready";

export type RoomSpec = { type: string; count: number };

export type RoomRect = {
  id: string;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

export type Plan = {
  id: string;
  label: string;
  title: string;
  score: number;
  efficiency: number;
  daylight: number;
  circulation: number;
  tags: string[];
  rooms: RoomRect[];
};

export type Preferences = {
  style: string;
  facing: string;
  vastu: boolean;
  openPlan: boolean;
  naturalLight: number;
  budget: string;
  notes: string;
};

export type Project = {
  id: string;
  name: string;
  location: string;
  plotWidth: number;
  plotLength: number;
  floors: number;
  unit: "ft" | "m";
  description: string;
  rooms: RoomSpec[];
  preferences: Preferences;
  plans: Plan[];
  selectedPlanId: string | null;
  status: ProjectStatus;
  validated: boolean;
  createdAt: number;
  updatedAt: number;
};

export const ROOM_TYPES = [
  "Bedroom",
  "Living Room",
  "Kitchen",
  "Bathroom",
  "Dining",
  "Study",
  "Balcony",
  "Utility",
];

export const defaultPreferences: Preferences = {
  style: "Modern Minimal",
  facing: "North",
  vastu: false,
  openPlan: true,
  naturalLight: 70,
  budget: "Standard",
  notes: "",
};

const KEY = "planora.projects";
const AUTH_KEY = "planora.user";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function loadProjects(): Project[] {
  if (typeof window === "undefined") return [];
  return safeParse<Project[]>(localStorage.getItem(KEY), []);
}

export function saveProjects(projects: Project[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(projects));
  window.dispatchEvent(new Event("planora:projects"));
}

export function getProject(id: string): Project | undefined {
  return loadProjects().find((p) => p.id === id);
}

export function upsertProject(project: Project) {
  const all = loadProjects();
  const i = all.findIndex((p) => p.id === project.id);
  project.updatedAt = Date.now();
  if (i >= 0) all[i] = project;
  else all.unshift(project);
  saveProjects(all);
}

export function deleteProject(id: string) {
  saveProjects(loadProjects().filter((p) => p.id !== id));
}

export function createProject(input: Partial<Project>): Project {
  return {
    id: Math.random().toString(36).slice(2, 9),
    name: input.name || "Untitled Design",
    location: input.location || "",
    plotWidth: input.plotWidth ?? 40,
    plotLength: input.plotLength ?? 60,
    floors: input.floors ?? 1,
    unit: input.unit ?? "ft",
    description: input.description || "",
    rooms: input.rooms || [
      { type: "Bedroom", count: 2 },
      { type: "Living Room", count: 1 },
      { type: "Kitchen", count: 1 },
      { type: "Bathroom", count: 2 },
    ],
    preferences: input.preferences || defaultPreferences,
    plans: [],
    selectedPlanId: null,
    status: "Draft",
    validated: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

/* ---------------- mock auth ---------------- */

export type User = { name: string; email: string };

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  return safeParse<User | null>(localStorage.getItem(AUTH_KEY), null);
}

export function setUser(user: User | null) {
  if (typeof window === "undefined") return;
  if (user) localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  else localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event("planora:user"));
}

/* ---------------- mock plan generation ---------------- */

function mulberry(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Cell = { x: number; y: number; w: number; h: number };

function slice(area: Cell, n: number, rand: () => number, horizontal: boolean): Cell[] {
  if (n <= 1) return [area];
  const a = Math.floor(n / 2);
  const b = n - a;
  const ratio = a / n + (rand() - 0.5) * 0.12;
  if (horizontal) {
    const hA = area.h * ratio;
    return [
      ...slice({ ...area, h: hA }, a, rand, !horizontal),
      ...slice({ ...area, y: area.y + hA, h: area.h - hA }, b, rand, !horizontal),
    ];
  }
  const wA = area.w * ratio;
  return [
    ...slice({ ...area, w: wA }, a, rand, !horizontal),
    ...slice({ ...area, x: area.x + wA, w: area.w - wA }, b, rand, !horizontal),
  ];
}

export function expandRooms(rooms: RoomSpec[]): string[] {
  const out: string[] = [];
  rooms.forEach((r) => {
    for (let i = 0; i < r.count; i++)
      out.push(r.count > 1 ? `${r.type} ${i + 1}` : r.type);
  });
  return out.length ? out : ["Living Room"];
}

export function generatePlans(project: Project): Plan[] {
  const names = expandRooms(project.rooms);
  const labels = ["A", "B", "C"];
  const titles = ["Open Core", "Linear Flow", "Courtyard Split"];
  const tagSets = [
    ["Open plan", "Central living", "Max daylight"],
    ["Efficient corridor", "Compact", "Low cost"],
    ["Private zones", "Cross ventilation", "Balanced"],
  ];

  return labels.map((label, i) => {
    const rand = mulberry(
      project.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) + i * 97,
    );
    const margin = 1.2;
    const area: Cell = {
      x: margin,
      y: margin,
      w: project.plotWidth - margin * 2,
      h: project.plotLength - margin * 2,
    };
    const cells = slice(area, names.length, rand, i % 2 === 0);
    const rooms: RoomRect[] = cells.map((c, idx) => ({
      id: `${label}-${idx}`,
      name: names[idx] ?? `Space ${idx + 1}`,
      x: +c.x.toFixed(2),
      y: +c.y.toFixed(2),
      w: +c.w.toFixed(2),
      h: +c.h.toFixed(2),
    }));
    const efficiency = 78 + Math.round(rand() * 16);
    const daylight = 70 + Math.round(rand() * 26);
    const circulation = 68 + Math.round(rand() * 28);
    return {
      id: `${project.id}-${label}`,
      label,
      title: titles[i]!,
      score: Math.round((efficiency + daylight + circulation) / 3),
      efficiency,
      daylight,
      circulation,
      tags: tagSets[i]!,
      rooms,
    };
  });
}

export function planArea(plan: Plan) {
  return plan.rooms.reduce((a, r) => a + r.w * r.h, 0);
}

export type ValidationResult = {
  id: string;
  label: string;
  detail: string;
  status: "pass" | "warn" | "fail";
};

export function validatePlan(project: Project, plan: Plan): ValidationResult[] {
  const min = Math.min(...plan.rooms.map((r) => Math.min(r.w, r.h)));
  const total = planArea(plan);
  const plot = project.plotWidth * project.plotLength;
  return [
    {
      id: "coverage",
      label: "Plot coverage within limits",
      detail: `${Math.round((total / plot) * 100)}% of plot used`,
      status: total / plot < 0.95 ? "pass" : "warn",
    },
    {
      id: "minwidth",
      label: "Minimum room dimension",
      detail: `Smallest span ${min.toFixed(1)} ${project.unit}`,
      status: min >= 6 ? "pass" : min >= 4 ? "warn" : "fail",
    },
    {
      id: "circulation",
      label: "Circulation & access",
      detail: `Circulation score ${plan.circulation}/100`,
      status: plan.circulation >= 75 ? "pass" : "warn",
    },
    {
      id: "light",
      label: "Natural light & ventilation",
      detail: `Daylight score ${plan.daylight}/100`,
      status: plan.daylight >= 75 ? "pass" : "warn",
    },
    {
      id: "wet",
      label: "Wet areas grouped",
      detail: "Kitchen and bathrooms share service wall",
      status: "pass",
    },
    {
      id: "egress",
      label: "Egress path clearance",
      detail: "Primary exit reachable from every zone",
      status: "pass",
    },
  ];
}

export const STATUS_STYLES: Record<ProjectStatus, string> = {
  Draft: "border-border text-muted-foreground",
  Generating: "border-warning/40 text-warning",
  Validated: "border-success/40 text-success",
  "3D Ready": "border-primary/50 text-primary",
};

export function clearProjects() {
  saveProjects([]);
}
