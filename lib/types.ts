import type { LeadInput } from "./validations";

export type Lead = LeadInput & {
  id: string;
  created_at: string;
};
