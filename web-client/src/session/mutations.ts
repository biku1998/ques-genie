import { useMutation, useQueryClient } from "@tanstack/react-query";
import _omit from "lodash/omit";
import { getLoggedInUserId, supabase } from "../api/supabase";
import { sessionKeys } from "../home/query-keys";
import { convertToSnakeCase, generateUUID } from "../lib/utils";
import {
  FullSessionPayload,
  SessionQuestion,
  SessionQuestionConfig,
} from "../types";

const updateSessionSourceText = async ({
  id,
  sourceText,
}: {
  id: string;
  sourceText: string;
}) => {
  const { error } = await supabase
    .from("sessions")
    .update({
      source_text: sourceText,
    })
    .eq("id", id);

  if (error) throw new Error(`Failed to update session with id ${id}`);
};

export const useUpdateSessionSourceText = ({
  onSuccess,
}: {
  onSuccess?: () => void;
} = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSessionSourceText,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: sessionKeys.detail(id),
      });
      if (onSuccess) onSuccess();
    },
  });
};

const generateTopics = async (sessionId: string) => {
  // wait for 5 seconds to simulate the generation process
  const userId = await getLoggedInUserId();

  await new Promise((resolve) => setTimeout(resolve, 5000));
  await supabase.from("session_topics").insert([
    {
      session_id: sessionId,
      text: "snake-related",
      created_by: userId,
    },
    {
      session_id: sessionId,
      text: "reptiles",
      created_by: userId,
    },
    {
      session_id: sessionId,
      text: "mammals",
      created_by: userId,
    },
    {
      session_id: sessionId,
      text: "insects",
      created_by: userId,
    },
    {
      session_id: sessionId,
      text: "birds-stuff",
      created_by: userId,
    },
  ]);
};

export const useGenerateTopics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateTopics,
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({
        queryKey: sessionKeys.detail(sessionId),
      });
    },
  });
};

const deleteTopics = async ({
  sessionId,
  topicIds,
}: {
  sessionId: string;
  topicIds: Array<number>;
}) => {
  const { error } = await supabase
    .from("session_topics")
    .delete()
    .eq("session_id", sessionId)
    .in("id", topicIds);

  if (error)
    throw new Error(`Failed to delete topics for session ${sessionId}`);
};

export const useDeleteTopics = ({
  onSuccess,
}: {
  onSuccess?: (deletedTopicIds: Array<number>) => void;
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTopics,
    onSuccess: (_, { sessionId, topicIds }) => {
      queryClient.invalidateQueries({
        queryKey: sessionKeys.detail(sessionId),
      });

      if (onSuccess) onSuccess(topicIds);
    },
  });
};

const addQuestionConfig = async ({
  sessionId,
  topicId,
  level,
  type,
  count,
}: Pick<
  SessionQuestionConfig,
  "sessionId" | "topicId" | "count" | "level" | "type"
>) => {
  const userId = await getLoggedInUserId();

  const { error } = await supabase.from("session_question_configs").insert({
    session_id: sessionId,
    count,
    level,
    type,
    topic_id: topicId,
    created_by: userId,
  });

  if (error) throw new Error("Failed to add question config");
};

export const useAddQuestionConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addQuestionConfig,
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({
        queryKey: sessionKeys.detail(sessionId),
      });
    },
  });
};

const updateQuestionConfig = async ({
  id,
  count,
  level,
  type,
}: Pick<SessionQuestionConfig, "id" | "sessionId" | "topicId"> &
  Partial<Pick<SessionQuestionConfig, "count" | "level" | "type">>) => {
  const { error } = await supabase
    .from("session_question_configs")
    .update({
      count,
      level,
      type,
    })
    .eq("id", id);

  if (error) throw new Error("Failed to update question config");
};

export const useUpdateQuestionConfig = () => {
  // do optimistic update
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateQuestionConfig,
    onMutate: async ({ id, sessionId, topicId, count, level, type }) => {
      const previousData = queryClient.getQueryData<FullSessionPayload>(
        sessionKeys.detail(sessionId),
      );

      if (!previousData) return;

      queryClient.setQueryData(sessionKeys.detail(sessionId), {
        ...previousData,
        configs: {
          ...previousData.configs,
          [topicId]: previousData.configs[topicId].map((config) =>
            config.id === id
              ? {
                  ...config,
                  count: count ? count : config.count,
                  level: level ? level : config.level,
                  type: type ? type : config.type,
                }
              : config,
          ),
        },
      });
    },
  });
};

const deleteQuestionConfig = async ({
  id,
}: Pick<SessionQuestionConfig, "id" | "sessionId" | "topicId">) => {
  const { error } = await supabase
    .from("session_question_configs")
    .delete()
    .eq("id", id);

  if (error) throw new Error("Failed to delete question config");
};

export const useDeleteQuestionConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteQuestionConfig,
    onMutate: async ({ id, sessionId, topicId }) => {
      const previousData = queryClient.getQueryData<FullSessionPayload>(
        sessionKeys.detail(sessionId),
      );

      if (!previousData) return;

      queryClient.setQueryData(sessionKeys.detail(sessionId), {
        ...previousData,
        configs: {
          ...previousData.configs,
          [topicId]: previousData.configs[topicId].filter(
            (config) => config.id !== id,
          ),
        },
      });
    },
  });
};

const deleteAllQuestionConfigs = async ({
  sessionId,
  topicId,
}: Pick<SessionQuestionConfig, "sessionId" | "topicId">) => {
  const { error } = await supabase
    .from("session_question_configs")
    .delete()
    .match({
      session_id: sessionId,
      topic_id: topicId,
    });

  if (error) throw new Error("Failed to delete question configs");
};

export const useDeleteAllQuestionConfigs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAllQuestionConfigs,
    onMutate: async ({ sessionId, topicId }) => {
      const previousData = queryClient.getQueryData<FullSessionPayload>(
        sessionKeys.detail(sessionId),
      );

      if (!previousData) return;

      queryClient.setQueryData(sessionKeys.detail(sessionId), {
        ...previousData,
        configs: _omit(previousData.configs, topicId),
      });
    },
  });
};

const generateQuestions = async (sessionId: string) => {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const userId = await getLoggedInUserId();

  await supabase.from("session_questions").insert([
    {
      text: "Which of the following is nit a poisonous snake?",
      level: "EASY",
      type: "RADIO",
      topic_id: 1,
      session_id: sessionId,
      created_by: userId,
      payload: {
        options: [
          {
            id: "764e1b0e-9459-40ea-a41d-a08a2e95475c",
            text: "King Cobra",
          },
          {
            id: generateUUID(),
            text: "Krait",
          },
          {
            id: generateUUID(),
            text: "Python",
          },
          {
            id: generateUUID(),
            text: "Viper",
          },
        ],
        correct_option_id: "764e1b0e-9459-40ea-a41d-a08a2e95475c",
      },
    },
    {
      text: "Which of the following is nit a poisonous snake?",
      level: "EASY",
      type: "RADIO",
      session_id: sessionId,
      topic_id: 2,
      created_by: userId,
      payload: {
        options: [
          {
            id: "764e1b0e-9459-40ea-a41d-a08a2e95475c",
            text: "King Cobra",
          },
          {
            id: generateUUID(),
            text: "Krait",
          },
          {
            id: generateUUID(),
            text: "Python",
          },
          {
            id: generateUUID(),
            text: "Viper",
          },
        ],
        correct_option_id: "764e1b0e-9459-40ea-a41d-a08a2e95475c",
      },
    },
    {
      text: "Which of the following is nit a poisonous snake?",
      level: "EASY",
      type: "CHECKBOX",
      session_id: sessionId,
      topic_id: 3,
      created_by: userId,
      payload: {
        options: [
          {
            id: "764e1b0e-9459-40ea-a41d-a08a2e95475c",
            text: "King Cobra",
          },
          {
            id: generateUUID(),
            text: "Krait",
          },
          {
            id: generateUUID(),
            text: "Python",
          },
          {
            id: "d7416a09-1342-4c2f-af3e-d787461e0ed5",
            text: "Viper",
          },
        ],
        correct_option_ids: [
          "764e1b0e-9459-40ea-a41d-a08a2e95475c",
          "d7416a09-1342-4c2f-af3e-d787461e0ed5",
        ],
      },
    },
    {
      text: "Which of the following is nit a poisonous snake?",
      level: "EASY",
      type: "CHECKBOX",
      session_id: sessionId,
      topic_id: 4,
      created_by: userId,
      payload: {
        options: [
          {
            id: "764e1b0e-9459-40ea-a41d-a08a2e95475c",
            text: "King Cobra",
          },
          {
            id: generateUUID(),
            text: "Krait",
          },
          {
            id: "aed58e29-9c23-4d3a-893c-13667d7c6b25",
            text: "Python",
          },
          {
            id: generateUUID(),
            text: "Viper",
          },
        ],
        correct_option_ids: [
          "764e1b0e-9459-40ea-a41d-a08a2e95475c",
          "aed58e29-9c23-4d3a-893c-13667d7c6b25",
        ],
      },
    },
  ]);
};

export const useGenerateQuestions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateQuestions,
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({
        queryKey: sessionKeys.detail(sessionId),
      });
    },
  });
};

const upsertQuestions = async (questions: Array<SessionQuestion>) => {
  const { error } = await supabase
    .from("session_questions")
    .upsert(convertToSnakeCase(questions));

  if (error) throw new Error("Failed to upsert questions");
};

export const useUpsertQuestions = () =>
  useMutation({
    mutationFn: upsertQuestions,
  });
