import { z } from "zod";
import { LEVEL, QUESTION_TYPE } from "./session-question";

const SessionQuestionConfigSchema = z.object({
  id: z.string().uuid(),
  level: z.enum(LEVEL),
  type: z.enum(QUESTION_TYPE),
  count: z.number(),
  topicId: z.string().uuid(),
  sessionId: z.string().uuid(),
  createdBy: z.string().uuid(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
});

export type SessionQuestionConfig = z.infer<typeof SessionQuestionConfigSchema>;
