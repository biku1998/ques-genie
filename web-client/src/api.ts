import {
  convertSnakeCaseObjectToCamelCase,
  encodeToBase64,
  getTopicCount,
  getWordCount,
} from "./lib/utils";
import { Question, QuestionConfig, Topic } from "./types";

const BASE_URL = "http://localhost:8000";

export const generateTopics = async (text: string) => {
  const wordCount = getWordCount(text);

  const topicCount = getTopicCount(wordCount);

  const response = await fetch(BASE_URL + "/generate_topics", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: encodeToBase64(text),
      count: topicCount,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate topics");
  }

  const data = (await response.json()) as { data: Array<Topic> };
  return data.data;
};

export const generateQuestions = async ({
  text,
  configs,
}: {
  text: string;
  configs: Array<QuestionConfig>;
}) => {
  const response = await fetch(BASE_URL + "/generate_questions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: encodeToBase64(text),
      configs,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate questions");
  }

  const data = (await response.json()) as { data: Array<Question> };

  console.log("generate questions response", data);

  return convertSnakeCaseObjectToCamelCase<Array<Question>>(data.data);
};
