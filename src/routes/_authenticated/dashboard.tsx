import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Play, RefreshCw, LogOut, CheckCircle2, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { GlassButton } from "@/components/site/GlassButton";
import { Logo } from "@/components/site/Logo";
import { AGENT_ACTIONS, PLANS, type PlanId } from "@/lib/actions";
import { getAccount, setPlan } from "@/lib/account.functions";
import { createJob, runJob, listJobs, getJobLogs } from "@/lib/jobs.functions";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Operations dashboard — RealtyOS" },
      {
        name: "description",
        content: "Live execution center for your autonomous RealtyOS AI employee.",
      },
      { property: "og:title", content: "Operations dashboard — RealtyOS" },
      {
        property: "og:description",
        content: "Dispatch autonomous tasks and watch live job progress and execution logs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const statusStyle: Record<string, string> = {
  queued: "text-muted-foreground",
  running: "text-accent",
  retrying: "text-accent",
  succeeded: "text-emerald-400",
  failed: "text-destructive",
};

function Dashboard() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const account = useServerFn(getAccount);
  const create = useServerFn(createJob);
  const run = useServerFn(runJob);
  const jobsFn = useServerFn(listJobs);
  const logsFn = useServerFn(getJobLogs);
  const planFn = useServerFn(setPlan);

  const [pending, setPending] = useState<string | null>(null);
  const [openJob, setOpenJob] = useState<string | null>(null);

  const accountQuery = useQuery({
    queryKey: ["account"],
    queryFn: () => account({ data: undefined }),
  });

  const company = accountQuery.data?.company ?? null;
  const subscription = accountQuery.data?.subscription ?? null;

  const jobsQuery = useQuery({
    queryKey: ["jobs", company?.id],
    enabled: Boolean(company?.id),
    refetchInterval: 3000,
    queryFn: () => jobsFn({ data: { companyId: company!.id } }),
  });

  const logsQuery = useQuery({
    queryKey: ["logs", openJob],
    enabled: Boolean(openJob),
    refetchInterval: 3000,
    queryFn: () => logsFn({ data: { jobId: openJob! } }),
  });

  if (accountQuery.isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (!company) {
    navigate({ to: "/onboarding" });
    return null;
  }

  async function dispatch(actionKey: string, title: string) {
    setPending(actionKey);
    try {
      const { jobId } = await create({
        data: { companyId: company!.id, action: actionKey, title },
      });
      setOpenJob(jobId);
      await qc.invalidateQueries({ queryKey: ["jobs"] });
      await run({ data: { jobId } });
      await qc.invalidateQueries({ queryKey: ["jobs"] });
      await qc.invalidateQueries({ queryKey: ["logs", jobId] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not dispatch the task");
    } finally {
      setPending(null);
    }
  }

  async function changePlan(plan: PlanId) {
    try {
      await planFn({ data: { companyId: company!.id, plan } });
      await qc.invalidateQueries({ queryKey: ["account"] });
      toast.success("Plan updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update plan");
    }
  }

  const jobs = jobsQuery.data?.jobs ?? [];

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
          <Link to="/" className="min-w-0">
            <Logo />
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <GlassButton
              variant="ghost"
              onClick={() => {
                void qc.invalidateQueries();
              }}
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </GlassButton>
            <GlassButton
              variant="ghost"
              onClick={async () => {
                await supabase.auth.signOut();
                navigate({ to: "/" });
              }}
            >
              <LogOut className="mr-2 h-3.5 w-3.5" /> Sign out
            </GlassButton>
          </div>
        </header>

        <section className="glass-panel mt-6 rounded-3xl p-5 sm:p-7">
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <div className="min-w-0">
              <p className="text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
                AI employee active
              </p>
              <h1 className="font-display mt-2 truncate text-[clamp(1.7rem,6vw,2.6rem)] leading-tight text-foreground">
                {company.name}
              </h1>
              {company.website && (
                <p className="mt-1 truncate text-[13px] text-muted-foreground">{company.website}</p>
              )}
            </div>
            <div className="shrink-0 rounded-2xl border border-border/70 bg-white/5 px-4 py-3">
              <p className="text-[11px] tracking-[0.18em] text-muted-foreground uppercase">Plan</p>
              <p className="font-display text-[18px] text-foreground">
                {PLANS.find((p) => p.id === subscription?.plan)?.name ?? "Free trial"}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {PLANS.map((p) => (
              <button
                key={p.id}
                onClick={() => changePlan(p.id)}
                className={`rounded-full border px-4 py-2 text-[12.5px] transition-colors ${
                  subscription?.plan === p.id
                    ? "border-accent/50 bg-accent/10 text-foreground"
                    : "border-border/70 text-muted-foreground hover:text-foreground"
                }`}
              >
                {p.name} · {p.price} {p.cadence}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
            Autonomous actions
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {AGENT_ACTIONS.map(({ key, title, description, Icon }) => (
              <motion.button
                key={key}
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                onClick={() => dispatch(key, title)}
                disabled={pending !== null}
                className="glass-soft flex flex-col items-start rounded-2xl p-4 text-left transition-colors hover:border-accent/40 disabled:opacity-60"
              >
                <span className="flex w-full items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0 text-accent" />
                  <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-foreground">
                    {title}
                  </span>
                  {pending === key ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin text-accent" />
                  ) : (
                    <Play className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  )}
                </span>
                <span className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  {description}
                </span>
              </motion.button>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div className="glass-panel rounded-3xl p-4 sm:p-6">
            <h2 className="text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
              Execution history
            </h2>
            <div className="mt-4 space-y-2">
              {jobs.length === 0 && (
                <p className="text-[13px] text-muted-foreground">
                  No tasks yet. Dispatch an action above to put your AI employee to work.
                </p>
              )}
              {jobs.map((job) => (
                <button
                  key={job.id}
                  onClick={() => setOpenJob(job.id)}
                  className={`grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
                    openJob === job.id
                      ? "border-accent/50 bg-accent/10"
                      : "border-border/70 bg-white/5 hover:border-accent/30"
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[14.5px] text-foreground">{job.title}</span>
                    <span className="mt-1 block text-[11.5px] text-muted-foreground">
                      {new Date(job.created_at).toLocaleString()} · attempt {job.attempts}/
                      {job.max_attempts}
                    </span>
                    <span className="mt-2 block h-1 w-full overflow-hidden rounded-full bg-border">
                      <span
                        className="block h-full rounded-full bg-accent transition-all duration-500"
                        style={{ width: `${job.progress ?? 0}%` }}
                      />
                    </span>
                  </span>
                  <span
                    className={`flex shrink-0 items-center gap-1.5 text-[12px] ${statusStyle[job.status] ?? "text-muted-foreground"}`}
                  >
                    {job.status === "succeeded" ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : job.status === "failed" ? (
                      <XCircle className="h-3.5 w-3.5" />
                    ) : job.status === "running" || job.status === "retrying" ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Clock className="h-3.5 w-3.5" />
                    )}
                    {job.status}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-4 sm:p-6">
            <h2 className="text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
              Execution log
            </h2>
            {!openJob && (
              <p className="mt-4 text-[13px] text-muted-foreground">
                Select a task to inspect its live log.
              </p>
            )}
            <div className="mt-4 space-y-2">
              {(logsQuery.data?.logs ?? []).map((entry) => (
                <div key={entry.id} className="rounded-xl border border-border/60 bg-white/5 p-3">
                  <p
                    className={`text-[11px] tracking-[0.16em] uppercase ${
                      entry.level === "error"
                        ? "text-destructive"
                        : entry.level === "success"
                          ? "text-emerald-400"
                          : "text-muted-foreground"
                    }`}
                  >
                    {entry.level} · {new Date(entry.created_at).toLocaleTimeString()}
                  </p>
                  <p className="mt-1 text-[13.5px] leading-relaxed break-words text-foreground">
                    {entry.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
