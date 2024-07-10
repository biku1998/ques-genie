import { z } from "zod";

export const QUESTION_LEVEL = ["EASY", "MEDIUM", "HARD"] as const;
const QuestionLevel = z.enum(QUESTION_LEVEL);

export const QUESTION_TYPE = ["RADIO", "CHECKBOX"] as const;
const QuestionType = z.enum(QUESTION_TYPE);

const BaseSessionQuestionSchema = z.object({
  id: z.number(),
  sessionId: z.string().uuid(),
  topicId: z.number(),
  text: z.string(),
  level: QuestionLevel,
  createdBy: z.string().uuid(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
});

const RadioQuestionPayloadSchema = BaseSessionQuestionSchema.and(
  z.object({
    type: QuestionType.extract(["RADIO"]),
    payload: z.object({
      options: z.array(z.object({ id: z.string().uuid(), text: z.string() })),
      correctOptionId: z.string().uuid(),
    }),
  }),
);

const CheckboxQuestionPayloadSchema = BaseSessionQuestionSchema.and(
  z.object({
    type: QuestionType.extract(["CHECKBOX"]),
    payload: z.object({
      options: z.array(z.object({ id: z.string().uuid(), text: z.string() })),
      correctOptionIds: z.array(z.string().uuid()),
    }),
  }),
);

export const SessionQuestionSchema = z.union([
  RadioQuestionPayloadSchema,
  CheckboxQuestionPayloadSchema,
]);

export type SessionQuestion = z.infer<typeof SessionQuestionSchema>;
export type QuestionLevel = z.infer<typeof QuestionLevel>;
export type QuestionType = z.infer<typeof QuestionType>;
