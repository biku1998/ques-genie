import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getLoggedInUserId, supabase } from "../api/supabase";
import { sessionKeys } from "../home/query-keys";
import { FullSessionPayload, SessionQuestionConfig } from "../types";

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
      text: "Topic 1",
      created_by: userId,
    },
    {
      session_id: sessionId,
      text: "Topic 2",
      created_by: userId,
    },
    {
      session_id: sessionId,
      text: "Topic 3",
      created_by: userId,
    },
    {
      session_id: sessionId,
      text: "Topic 4",
      created_by: userId,
    },
    {
      session_id: sessionId,
      text: "Topic 5",
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

const deleteAllTopics = async (sessionId: string) => {
  const { error } = await supabase
    .from("session_topics")
    .delete()
    .eq("session_id", sessionId);

  if (error)
    throw new Error(`Failed to delete topics for session ${sessionId}`);
};

export const useDeleteAllTopics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAllTopics,
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({
        queryKey: sessionKeys.detail(sessionId),
      });
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
        configs: {
          ...previousData.configs,
          [topicId]: [],
        },
      });
    },
  });
};
