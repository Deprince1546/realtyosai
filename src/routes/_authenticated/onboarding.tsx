import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { GlassButton } from "@/components/site/GlassButton";
import { Logo } from "@/components/site/Logo";
import { PLANS, WORKFLOW_TOOLS, type PlanId } from "@/lib/actions";
import { getAccount, saveOnboarding } from "@/lib/account.functions";

export const Route = createFileRoute("/_authenticated/onboarding")({
  validateSearch: (search: Record<string, unknown>) => ({
    plan: typeof search["plan"] === "string" ? (search["plan"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Set up your brokerage — RealtyOS" },
      {
        name: "description",
        content: "Tell RealtyOS about your company and connect your real estate workflow tools.",
      },
      { property: "og:title", content: "Set up your brokerage — RealtyOS" },
      {
        property: "og:description",
        content: "Company details, workflow tools and plan selection for your AI employee.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Onboarding,
});

const field =
  "h-11 w-full rounded-xl border border-border/70 bg-white/5 px-4 text-[15px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent/50";

function Onboarding() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/_authenticated/onboarding" });
  const load = useServerFn(getAccount);
  const save = useServerFn(saveOnboarding);

  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    name: "",
    website: "",
    phone: "",
    market: "",
    teamSize: "",
    description: "",
    timezone: typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "",
  });
  const [tools, setTools] = useState<string[]>([]);
  const [plan, setPlan] = useState<PlanId>("trial");

  useEffect(() => {
    const stored = search.plan ?? sessionStorage.getItem("realtyos_plan");
    if (stored === "pro" || stored === "business" || stored === "trial") setPlan(stored);
    void load({ data: undefined }).then((res) => {
      if (res.company) {
        setForm((f) => ({
          ...f,
          name: res.company.name ?? "",
          website: res.company.website ?? "",
          phone: res.company.phone ?? "",
          market: res.company.market ?? "",
          teamSize: res.company.team_size ?? "",
          description: res.company.description ?? "",
          timezone: res.company.timezone ?? f.timezone,
        }));
        setTools(res.integrations.map((i: { provider: string }) => i.provider));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function finish() {
    setBusy(true);
    try {
      await save({ data: { ...form, tools, plan } });
      sessionStorage.removeItem("realtyos_plan");
      toast.success("RealtyOS is now operating for your company.");
      navigate({ to: "/dashboard" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save your setup");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="inline-flex">
          <Logo />
        </Link>

        <div className="mt-6 flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? "bg-accent" : "bg-border"}`}
            />
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="glass-panel mt-6 rounded-3xl p-5 sm:p-8"
        >
          {step === 0 && (
            <>
              <h1 className="font-display text-[clamp(1.6rem,5.5vw,2.3rem)] leading-tight text-foreground">
                About your company
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                RealtyOS uses this to operate your brokerage on your behalf.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <input
                  className={`${field} sm:col-span-2`}
                  placeholder="Company / brokerage name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  maxLength={120}
                />
                <input
                  className={`${field} sm:col-span-2`}
                  placeholder="Company website (https://…)"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  maxLength={200}
                />
                <input
                  className={field}
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  maxLength={40}
                />
                <input
                  className={field}
                  placeholder="Primary market / city"
                  value={form.market}
                  onChange={(e) => setForm({ ...form, market: e.target.value })}
                  maxLength={120}
                />
                <input
                  className={field}
                  placeholder="Team size"
                  value={form.teamSize}
                  onChange={(e) => setForm({ ...form, teamSize: e.target.value })}
                  maxLength={40}
                />
                <input
                  className={field}
                  placeholder="Timezone"
                  value={form.timezone}
                  onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                  maxLength={80}
                />
                <textarea
                  className="min-h-24 w-full rounded-xl border border-border/70 bg-white/5 px-4 py-3 text-[15px] text-foreground outline-none placeholder:text-muted-foreground focus:border-accent/50 sm:col-span-2"
                  placeholder="What should RealtyOS know about how you operate?"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  maxLength={1000}
                />
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h1 className="font-display text-[clamp(1.6rem,5.5vw,2.3rem)] leading-tight text-foreground">
                Connect your workflow
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Select the tools RealtyOS should operate on your behalf.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {WORKFLOW_TOOLS.map((tool) => {
                  const active = tools.includes(tool);
                  return (
                    <button
                      key={tool}
                      onClick={() =>
                        setTools(active ? tools.filter((t) => t !== tool) : [...tools, tool])
                      }
                      className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-[14px] transition-colors ${
                        active
                          ? "border-accent/50 bg-accent/10 text-foreground"
                          : "border-border/70 bg-white/5 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span className="min-w-0 truncate">{tool}</span>
                      {active && <Check className="h-4 w-4 shrink-0 text-accent" />}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="font-display text-[clamp(1.6rem,5.5vw,2.3rem)] leading-tight text-foreground">
                Choose your plan
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Start with one free week, then continue on Pro or Business.
              </p>
              <div className="mt-6 grid gap-3">
                {PLANS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPlan(p.id)}
                    className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border px-4 py-4 text-left transition-colors ${
                      plan === p.id
                        ? "border-accent/50 bg-accent/10"
                        : "border-border/70 bg-white/5 hover:border-accent/30"
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block text-[15px] font-medium text-foreground">{p.name}</span>
                      <span className="mt-1 block text-[13px] text-muted-foreground">{p.blurb}</span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="font-display block text-[19px] text-foreground">{p.price}</span>
                      <span className="block text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
                        {p.cadence}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
            <GlassButton
              variant="ghost"
              size="lg"
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0 || busy}
            >
              Back
            </GlassButton>
            {step < 2 ? (
              <GlassButton
                variant="primary"
                size="lg"
                disabled={busy}
                onClick={() => setStep(step + 1)}
              >
                Continue
              </GlassButton>
            ) : (
              <GlassButton variant="primary" size="lg" disabled={busy} onClick={finish}>
                {busy ? "Activating…" : "Activate RealtyOS"}
              </GlassButton>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
