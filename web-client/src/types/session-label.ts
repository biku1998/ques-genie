import { z } from "zod";

const SessionLabelSchema = z.object({
  id: z.string().uuid(),
  labelId: z.string().uuid(),
  sessionId: z.string().uuid(),
  createdBy: z.string().uuid(),
  createdAt: z.string(),
});

export type SessionLabel = z.infer<typeof SessionLabelSchema>;
