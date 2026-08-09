import { z } from "zod";

export const createJobInputSchema = z.object({
  companyId: z.string().uuid(),
  action: z.string().min(1).max(64),
  title: z.string().min(1).max(120),
  payload: z.record(z.unknown()).optional(),
});

export const companyIdInputSchema = z.object({ companyId: z.string().uuid() });
export const jobIdInputSchema = z.object({ jobId: z.string().uuid() });