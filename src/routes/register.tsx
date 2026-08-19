import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout } from "./login";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
  head: () => ({
    meta: [
      { title: "Create account — PLANORA" },
      {
        name: "description",
        content: "Create a PLANORA account and generate your first AI floor plan.",
      },
      { property: "og:title", content: "Create account — PLANORA" },
      {
        property: "og:description",
        content: "Start generating AI-powered floor plans with PLANORA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function RegisterPage() {
  return (
    <AuthLayout
      title="Create your workspace"
      subtitle="Mock account — everything is stored on this device."
      cta="Create account"
      withName
      footer={
        <>
          Already registered?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </>
      }
    />
  );
}
