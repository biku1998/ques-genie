import { z } from "zod";

export const LEVEL = ["EASY", "MEDIUM", "HARD"] as const;
const Level = z.enum(LEVEL);

export const QUESTION_TYPE = ["RADIO", "CHECKBOX"] as const;
const QuestionType = z.enum(QUESTION_TYPE);

const BaseSessionQuestionSchema = z.object({
  id: z.string().uuid(),
  text: z.string(),
  level: Level,
  createdBy: z.string().uuid(),
  createdAt: z.string(),
  updateAt: z.string().nullable(),
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

const SessionQuestionSchema = z.union([
  RadioQuestionPayloadSchema,
  CheckboxQuestionPayloadSchema,
]);

export type SessionQuestion = z.infer<typeof SessionQuestionSchema>;
export type Level = z.infer<typeof Level>;
