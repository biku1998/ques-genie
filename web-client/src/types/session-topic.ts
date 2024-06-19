import { z } from "zod";

export const SessionTopicSchema = z.object({
  id: z.string().uuid(),
  text: z.string(),
  sessionId: z.string().uuid(),
  createdBy: z.string().uuid(),
  createdAt: z.string(),
});

export type SessionTopic = z.infer<typeof SessionTopicSchema>;
