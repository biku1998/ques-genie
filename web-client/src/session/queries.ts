import { useQuery } from "@tanstack/react-query";
import _groupBy from "lodash/groupBy";
import { z } from "zod";
import { supabase } from "../api/supabase";
import { sessionKeys } from "../home/query-keys";
import { convertToCamelCase } from "../lib/utils";
import { FullSessionPayload, FullSessionPayloadSchema } from "../types";

const fetchFullSession = async (id: string): Promise<FullSessionPayload> => {
  try {
    const { data, error } = await supabase
      .from("sessions")
      .select(
        `
        id, title, source_text,
        topics:session_topics (
          id,
          text
          ),
        configs:session_question_configs (
          id,
          level,
          type,
          count,
          topic_id
          ),
        questions:session_questions (
          *
          )
        `,
      )
      .eq("id", id)
      .single();

    if (error) throw new Error("Failed to fetch session with id " + id);

    const session = convertToCamelCase<FullSessionPayload>({
      ...data,
      configs: _groupBy(data.configs, "topic_id"),
    });

    // parse the data for type safety
    FullSessionPayloadSchema.parse(session);

    return session;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error("Invalid session payload");
    }
    throw error;
  }
};

export const useFetchFullSession = (id: string) =>
  useQuery({
    queryKey: sessionKeys.detail(id),
    queryFn: () => fetchFullSession(id),
  });
