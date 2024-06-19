import { z } from "zod";

export const LabelSchema = z.object({
  id: z.string().uuid(),
  text: z.string(),
  createdBy: z.string().uuid(),
  createdAt: z.string(),
});

export type Label = z.infer<typeof LabelSchema>;
