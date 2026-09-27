import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  country: z.string().default(""),
  language: z.string().default("en"),
  role: z.enum(["patient", "caregiver", "translator", "coordinator", "admin"]).default("patient"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const requestSchema = z.object({
  type: z.enum(["translator", "coordinator", "appointment", "cost_estimate", "support"]),
  languageNeeded: z.string().default(""),
  hospitalId: z.string().optional().nullable(),
  specialty: z.string().default(""),
  message: z.string().min(5).max(2000),
});

export const estimateSchema = z.object({
  requestId: z.string().min(1),
  treatmentId: z.string().min(1),
  hospitalId: z.string().min(1),
  minCost: z.number().nonnegative(),
  maxCost: z.number().nonnegative(),
  currency: z.string().default("USD"),
  notes: z.string().default(""),
}).refine((d) => d.minCost <= d.maxCost, { message: "minCost must be <= maxCost" });

export const ratingSchema = z.object({
  requestId: z.string().min(1),
  score: z.number().int().min(1).max(5),
});
