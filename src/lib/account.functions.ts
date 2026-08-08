import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const OnboardingInput = z.object({
  name: z.string().trim().min(1).max(120),
  website: z.string().trim().max(200).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  market: z.string().trim().max(120).optional().or(z.literal("")),
  teamSize: z.string().trim().max(40).optional().or(z.literal("")),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  timezone: z.string().trim().max(80).optional().or(z.literal("")),
  tools: z.array(z.string().min(1).max(60)).max(40).default([]),
  plan: z.enum(["trial", "pro", "business"]),
});

export const getAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: company } = await supabase
      .from("companies")
      .select("*")
      .eq("owner_id", userId)
      .maybeSingle();

    if (!company) return { company: null, subscription: null, integrations: [] };

    const [{ data: subscription }, { data: integrations }] = await Promise.all([
      supabase.from("subscriptions").select("*").eq("company_id", company.id).maybeSingle(),
      supabase.from("integrations").select("*").eq("company_id", company.id),
    ]);

    return { company, subscription, integrations: integrations ?? [] };
  });

export const saveOnboarding = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => OnboardingInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const fields = {
      owner_id: userId,
      name: data.name,
      website: data.website || null,
      phone: data.phone || null,
      market: data.market || null,
      team_size: data.teamSize || null,
      description: data.description || null,
      timezone: data.timezone || null,
      onboarding_complete: true,
    };

    const { data: existing } = await supabase
      .from("companies")
      .select("id")
      .eq("owner_id", userId)
      .maybeSingle();

    let companyId: string;
    if (existing) {
      const { error } = await supabase.from("companies").update(fields).eq("id", existing.id);
      if (error) throw new Error(error.message);
      companyId = existing.id;
    } else {
      const { data: created, error } = await supabase
        .from("companies")
        .insert(fields)
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      companyId = created.id;
    }

    if (data.tools.length) {
      const rows = data.tools.map((provider) => ({
        company_id: companyId,
        provider,
        status: "connected",
      }));
      const { error } = await supabase
        .from("integrations")
        .upsert(rows, { onConflict: "company_id,provider" });
      if (error) throw new Error(error.message);
    }

    const now = Date.now();
    const period =
      data.plan === "trial"
        ? new Date(now + 7 * 864e5)
        : data.plan === "pro"
          ? new Date(now + 30 * 864e5)
          : new Date(now + 365 * 864e5);

    const { error: subError } = await supabase.from("subscriptions").upsert(
      {
        company_id: companyId,
        plan: data.plan,
        status: "active",
        trial_ends_at: data.plan === "trial" ? period.toISOString() : null,
        current_period_end: period.toISOString(),
      },
      { onConflict: "company_id" },
    );
    if (subError) throw new Error(subError.message);

    return { companyId };
  });

export const setPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({ companyId: z.string().uuid(), plan: z.enum(["trial", "pro", "business"]) })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const now = Date.now();
    const period =
      data.plan === "trial"
        ? new Date(now + 7 * 864e5)
        : data.plan === "pro"
          ? new Date(now + 30 * 864e5)
          : new Date(now + 365 * 864e5);

    const { error } = await context.supabase.from("subscriptions").upsert(
      {
        company_id: data.companyId,
        plan: data.plan,
        status: "active",
        trial_ends_at: data.plan === "trial" ? period.toISOString() : null,
        current_period_end: period.toISOString(),
      },
      { onConflict: "company_id" },
    );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const connectTool = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        companyId: z.string().uuid(),
        provider: z.string().min(1).max(60),
        connected: z.boolean(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    if (!data.connected) {
      const { error } = await context.supabase
        .from("integrations")
        .delete()
        .eq("company_id", data.companyId)
        .eq("provider", data.provider);
      if (error) throw new Error(error.message);
      return { ok: true };
    }
    const { error } = await context.supabase.from("integrations").upsert(
      { company_id: data.companyId, provider: data.provider, status: "connected" },
      { onConflict: "company_id,provider" },
    );
    if (error) throw new Error(error.message);
    return { ok: true };
  });
