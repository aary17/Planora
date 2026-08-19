import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/planora/logo";
import { setUser } from "@/lib/planora";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Log in — PLANORA" },
      { name: "description", content: "Access your PLANORA workspace and designs." },
      { property: "og:title", content: "Log in — PLANORA" },
      { property: "og:description", content: "Access your PLANORA workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Continue where your last plan left off."
      cta="Log in"
      footer={
        <>
          No account?{" "}
          <Link to="/register" className="text-primary hover:underline">
            Create one
          </Link>
        </>
      }
    />
  );
}

export function AuthLayout({
  title,
  subtitle,
  cta,
  withName,
  footer,
}: {
  title: string;
  subtitle: string;
  cta: string;
  withName?: boolean;
  footer: React.ReactNode;
}) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setUser({ name: name || email.split("@")[0] || "Designer", email });
    toast.success("Signed in", { description: "Mock session created locally." });
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="hero-surface relative flex min-h-screen items-center justify-center px-5 py-16">
      <div className="blueprint-grid absolute inset-0 opacity-25" />
      <div className="glass-panel relative w-full max-w-sm p-7">
        <Logo className="text-xs" />
        <h1 className="mt-6 text-xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>

        <form onSubmit={submit} className="mt-7 space-y-4">
          {withName && (
            <Field label="Full name">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Ada Lovelace"
                className="input-base"
              />
            </Field>
          )}
          <Field label="Email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@studio.com"
              className="input-base"
            />
          </Field>
          <Field label="Password">
            <input
              type="password"
              required
              defaultValue="demo1234"
              className="input-base"
            />
          </Field>
          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            {cta}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">{footer}</p>
      </div>
    </div>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="tech-label">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}
