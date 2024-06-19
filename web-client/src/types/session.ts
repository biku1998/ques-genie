import { z } from "zod";
import { LabelSchema } from "./label";
import { SessionTopicSchema } from "./session-topic";

const SessionSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  createdBy: z.string().uuid(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
});

export type Session = z.infer<typeof SessionSchema>;

export const SessionPayloadSchema = SessionSchema.omit({ createdBy: true }).and(
  z.object({
    topics: z.array(SessionTopicSchema.pick({ id: true })),
    labels: z.array(LabelSchema.pick({ id: true, text: true })),
    questionCount: z.number(),
  }),
);

export type SessionPayload = z.infer<typeof SessionPayloadSchema>;
