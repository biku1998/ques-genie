import { z } from "zod";
import { QUESTION_LEVEL, QUESTION_TYPE } from "./session-question";

export const SessionQuestionConfigSchema = z.object({
  id: z.number(),
  level: z.enum(QUESTION_LEVEL),
  type: z.enum(QUESTION_TYPE),
  count: z.number(),
  topicId: z.number(),
  sessionId: z.string().uuid(),
  createdBy: z.string().uuid(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
});

export type SessionQuestionConfig = z.infer<typeof SessionQuestionConfigSchema>;
