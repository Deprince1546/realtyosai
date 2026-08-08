import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const CreateJobInput = z.object({
  companyId: z.string().uuid(),
  action: z.string().min(1).max(64),
  title: z.string().min(1).max(120),
  payload: z.record(z.unknown()).optional(),
});

export const createJob = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => CreateJobInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: job, error } = await supabase
      .from("jobs")
      .insert({
        company_id: data.companyId,
        created_by: userId,
        action: data.action,
        title: data.title,
        payload: (data.payload ?? {}) as never,
        status: "queued",
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    await supabase
      .from("job_logs")
      .insert({ job_id: job.id, level: "info", message: "Job queued." });

    return { jobId: job.id as string };
  });

export const runJob = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ jobId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { executeJob } = await import("./jobs.server");
    return executeJob(context.supabase, data.jobId);
  });

export const listJobs = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ companyId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: jobs, error } = await context.supabase
      .from("jobs")
      .select("id, action, title, status, attempts, max_attempts, progress, error, created_at, completed_at")
      .eq("company_id", data.companyId)
      .order("created_at", { ascending: false })
      .limit(30);
    if (error) throw new Error(error.message);
    return { jobs: jobs ?? [] };
  });

export const getJobLogs = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ jobId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: logs, error } = await context.supabase
      .from("job_logs")
      .select("id, level, message, created_at")
      .eq("job_id", data.jobId)
      .order("created_at", { ascending: true })
      .limit(100);
    if (error) throw new Error(error.message);
    return { logs: logs ?? [] };
  });
