import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { GlassButton } from "@/components/site/GlassButton";
import { Logo } from "@/components/site/Logo";

const TITLE = "Sign in — RealtyOS";
const DESC = "Create your RealtyOS account and put your autonomous AI employee to work.";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({
    plan: typeof search["plan"] === "string" ? (search["plan"] as string) : undefined,
    mode: search["mode"] === "signin" ? "signin" : "signup",
  }),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth" });
  const [mode, setMode] = useState<"signup" | "signin">(search.mode === "signin" ? "signin" : "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);

  const next = () =>
    navigate({ to: "/onboarding", search: search.plan ? { plan: search.plan } : {} });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/onboarding`,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        const { data: session } = await supabase.auth.getSession();
        if (session.session) next();
        else toast.success("Check your inbox to confirm your email, then sign in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        next();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setBusy(true);
    try {
      if (search.plan) sessionStorage.setItem("realtyos_plan", search.plan);
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw new Error(String(result.error));
      if (result.redirected) return;
      next();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Google sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  const field =
    "h-11 w-full rounded-xl border border-border/70 bg-white/5 px-4 text-[15px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent/50";

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-background px-5 py-14">
      <Link to="/" className="mb-8">
        <Logo />
      </Link>

      <div className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8">
        <h1 className="font-display text-[clamp(1.7rem,6vw,2.2rem)] leading-tight text-foreground">
          {mode === "signup" ? "Hire your AI employee" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signup"
            ? "Create your account, then tell RealtyOS about your company."
            : "Sign in to your RealtyOS operations dashboard."}
        </p>

        <button
          onClick={google}
          disabled={busy}
          className="mt-6 flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-border/70 bg-white/5 text-[15px] font-medium text-foreground transition-colors hover:border-accent/40 disabled:opacity-60"
        >
          Continue with Google
        </button>

        <div className="my-5 flex items-center gap-3 text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
          <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <input
              className={field}
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              maxLength={100}
            />
          )}
          <input
            className={field}
            type="email"
            required
            placeholder="Work email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={255}
          />
          <input
            className={field}
            type="password"
            required
            minLength={8}
            placeholder="Password (min 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength={72}
          />
          <GlassButton variant="primary" size="lg" className="w-full" disabled={busy} type="submit">
            {busy ? "Working…" : mode === "signup" ? "Create account" : "Sign in"}
          </GlassButton>
        </form>

        <button
          onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
          className="mt-5 w-full text-center text-[13px] text-muted-foreground transition-colors hover:text-foreground"
        >
          {mode === "signup" ? "Already have an account? Sign in" : "New here? Create an account"}
        </button>
      </div>
    </main>
  );
}
