import { encodeToBase64 } from "./lib/utils";

const BASE_URL = "http://localhost:8000";

export const generateTopics = async (text: string) => {
  const wordCount = text.trim().split(/\s+/).length;

  let topicCount = 5;

  if (wordCount > 3000 && wordCount <= 6000) {
    topicCount = 10;
  } else if (wordCount > 6000 && wordCount <= 12000) {
    topicCount = 15;
  } else if (wordCount > 12000 && wordCount <= 24000) {
    topicCount = 24;
  }

  const response = await fetch(BASE_URL + "/generate_topics", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: encodeToBase64(text),
      count: topicCount,
      content_type: "PLAIN_TEXT",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate topics");
  }

  return response.json() as Promise<{ topics: Array<string> }>;
};

export const generateMcqQuestions = async ({
  text,
  topics,
}: {
  text: string;
  topics: Array<string>;
}) => {
  const response = await fetch(BASE_URL + "/generate_mcq_questions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: encodeToBase64(text),
      topics,
      count: topics.length,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate mcq questions");
  }

  return response.json() as Promise<{
    questions: Array<{
      question: string;
      options: Array<{
        id: number;
        option: string;
      }>;
      correct_option_id: number;
    }>;
  }>;
};
