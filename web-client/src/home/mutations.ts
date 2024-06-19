import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../api/supabase";
import { convertToCamelCase } from "../lib/utils";
import { Session } from "../types";
import { sessionKeys } from "./query-keys";

const createSession = async (
  payload: Pick<Session, "title" | "createdBy" | "description">,
): Promise<Session> => {
  const { data, error } = await supabase
    .from("sessions")
    .insert({
      title: payload.title,
      description: payload.description,
      created_by: payload.createdBy,
    })
    .select()
    .single();

  if (error) throw new Error("Failed to create new session");
  return convertToCamelCase<Session>(data);
};

export const useCreateSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSession,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sessionKeys.list(),
      });
    },
  });
};
