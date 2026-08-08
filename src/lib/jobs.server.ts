import type { SupabaseClient } from "@supabase/supabase-js";
import { runCoastyAction } from "./coasty.server";

type AnyClient = SupabaseClient<any, any, any>;

async function log(supabase: AnyClient, jobId: string, level: string, message: string) {
  await supabase.from("job_logs").insert({ job_id: jobId, level, message });
}

/**
 * Executes a queued job against Coasty AI with bounded retries,
 * writing status transitions and execution logs as it goes.
 */
export async function executeJob(supabase: AnyClient, jobId: string) {
  const { data: job, error } = await supabase.from("jobs").select("*").eq("id", jobId).single();
  if (error || !job) throw new Error("Job not found");
  if (job.status === "running" || job.status === "succeeded") return { status: job.status };

  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("id", job.company_id)
    .single();

  await supabase
    .from("jobs")
    .update({ status: "running", started_at: new Date().toISOString(), progress: 10 })
    .eq("id", jobId);
  await log(supabase, jobId, "info", `Dispatching "${job.action}" to the AI employee.`);

  const maxAttempts: number = job.max_attempts ?? 3;
  let attempt: number = job.attempts ?? 0;
  let lastMessage = "";

  while (attempt < maxAttempts) {
    attempt += 1;
    await supabase
      .from("jobs")
      .update({ attempts: attempt, progress: Math.min(85, 20 + attempt * 25) })
      .eq("id", jobId);
    await log(supabase, jobId, "info", `Attempt ${attempt} of ${maxAttempts} started.`);

    const result = await runCoastyAction({
      action: job.action,
      company: {
        id: job.company_id,
        name: company?.name ?? null,
        website: company?.website ?? null,
        market: company?.market ?? null,
        timezone: company?.timezone ?? null,
      },
      payload: (job.payload ?? {}) as Record<string, unknown>,
    });

    lastMessage = result.message;

    if (result.ok) {
      await log(supabase, jobId, "success", result.message);
      await supabase
        .from("jobs")
        .update({
          status: "succeeded",
          progress: 100,
          result: result.data ?? {},
          error: null,
          completed_at: new Date().toISOString(),
        })
        .eq("id", jobId);
      return { status: "succeeded" };
    }

    await log(supabase, jobId, "error", result.message);

    if (attempt < maxAttempts) {
      await supabase.from("jobs").update({ status: "retrying" }).eq("id", jobId);
      await new Promise((r) => setTimeout(r, Math.min(4000, 800 * attempt)));
    }
  }

  await supabase
    .from("jobs")
    .update({
      status: "failed",
      error: lastMessage,
      progress: 100,
      completed_at: new Date().toISOString(),
    })
    .eq("id", jobId);
  await log(supabase, jobId, "error", `Job failed after ${maxAttempts} attempts.`);
  return { status: "failed" };
}
