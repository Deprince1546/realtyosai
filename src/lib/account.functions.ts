import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  connectToolInputSchema,
  onboardingInputSchema,
  setPlanInputSchema,
} from "./account.schemas";

export const getAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: existingCompany, error: companyReadError } = await supabase
      .from("companies")
      .select("*")
      .eq("owner_id", userId)
      .maybeSingle();
    if (companyReadError) throw new Error(companyReadError.message);

    let company = existingCompany;
    if (!company) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", userId)
        .maybeSingle();
      const fallbackName = profile?.full_name?.trim() || "My brokerage";
      const { data: createdCompany, error: createError } = await supabase
        .from("companies")
        .insert({ owner_id: userId, name: fallbackName, onboarding_complete: false })
        .select("*")
        .single();
      if (createError) throw new Error(createError.message);
      company = createdCompany;

      const trialEnd = new Date(Date.now() + 7 * 864e5).toISOString();
      const { error: trialError } = await supabase.from("subscriptions").insert({
        company_id: company.id,
        plan: "trial",
        status: "active",
        trial_ends_at: trialEnd,
        current_period_end: trialEnd,
      });
      if (trialError) throw new Error(trialError.message);
    }

    const [{ data: subscription, error: subscriptionError }, { data: integrations, error: integrationsError }] = await Promise.all([
      supabase.from("subscriptions").select("*").eq("company_id", company.id).maybeSingle(),
      supabase.from("integrations").select("*").eq("company_id", company.id),
    ]);
    if (subscriptionError) throw new Error(subscriptionError.message);
    if (integrationsError) throw new Error(integrationsError.message);

    return { company, subscription, integrations: integrations ?? [] };
  });

export const saveOnboarding = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => onboardingInputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const fields = {
      owner_id: userId,
      name: data.name || "My brokerage",
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
  .inputValidator((input: unknown) => setPlanInputSchema.parse(input))
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
  .inputValidator((input: unknown) => connectToolInputSchema.parse(input))
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
