import { z } from "zod";

export const SOURCE_OPTIONS = ["Google", "Referral", "Social", "Other"] as const;

export const leadSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  company: z.string().optional(),
  source: z.enum(SOURCE_OPTIONS, {
    required_error: "Please select how you heard about us",
    invalid_type_error: "Please select how you heard about us",
  }),
  message: z.string().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
