import { z } from "zod";
import { LabelSchema } from "./label";
import { SessionQuestionSchema } from "./session-question";
import { SessionQuestionConfigSchema } from "./session-question-config";
import { SessionTopicSchema } from "./session-topic";

export const SessionSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  sourceText: z.string().min(1200).nullable(),
  createdBy: z.string().uuid(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
});

export type Session = z.infer<typeof SessionSchema>;

export const SessionPayloadSchema = SessionSchema.omit({
  createdBy: true,
  sourceText: true,
}).and(
  z.object({
    topics: z.array(SessionTopicSchema.pick({ id: true })),
    labels: z.array(LabelSchema.pick({ id: true, text: true })),
    questionCount: z.number(),
  }),
);

export type SessionPayload = z.infer<typeof SessionPayloadSchema>;

export const FullSessionPayloadSchema = SessionSchema.omit({
  description: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
}).and(
  z.object({
    topics: z.array(
      SessionTopicSchema.pick({
        id: true,
        text: true,
      }),
    ),
    configs: z.record(
      z.string(),
      z.array(
        SessionQuestionConfigSchema.pick({
          id: true,
          level: true,
          type: true,
          count: true,
          topicId: true,
        }),
      ),
    ),
    questions: z.array(SessionQuestionSchema),
  }),
);

export type FullSessionPayload = z.infer<typeof FullSessionPayloadSchema>;
