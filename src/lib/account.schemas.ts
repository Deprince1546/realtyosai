import { z } from "zod";

export const onboardingInputSchema = z.object({
  name: z.string().trim().max(120).optional().default(""),
  website: z.string().trim().max(200).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  market: z.string().trim().max(120).optional().or(z.literal("")),
  teamSize: z.string().trim().max(40).optional().or(z.literal("")),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  timezone: z.string().trim().max(80).optional().or(z.literal("")),
  tools: z.array(z.string().min(1).max(60)).max(40).default([]),
  plan: z.enum(["trial", "pro", "business"]),
});

export const setPlanInputSchema = z.object({
  companyId: z.string().uuid(),
  plan: z.enum(["trial", "pro", "business"]),
});

export const connectToolInputSchema = z.object({
  companyId: z.string().uuid(),
  provider: z.string().min(1).max(60),
  connected: z.boolean(),
});