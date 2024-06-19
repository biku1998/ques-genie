export * from "./user";
export * from "./session";
export * from "./label";
export * from "./session-label";
export * from "./session-question";
export * from "./session-question-config";
export * from "./session-topic";

export type Topic = {
  id: number;
  text: string;
};

export type QuestionType = "mcq" | "checkbox";
export type QuestionLevel = "easy" | "medium" | "hard";

type Option = {
  id: number;
  text: string;
};

interface QuestionBase {
  id: number;
  text: string;
  topic: Topic;
  options: Array<Option>;
  level: QuestionLevel;
}

export interface McqQuestion extends QuestionBase {
  type: Extract<QuestionType, "mcq">;
  correctOptionId: number;
}

export interface CheckboxQuestion extends QuestionBase {
  type: Extract<QuestionType, "checkbox">;
  correctOptionIds: Array<number>;
}

export type Question = McqQuestion | CheckboxQuestion;

export type QuestionConfig = {
  topic: Topic;
  count: number;
  level: QuestionLevel;
  type: QuestionType;
};
