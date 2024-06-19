import { useQuery } from "@tanstack/react-query";
import _omit from "lodash/omit";
import { z } from "zod";
import { supabase } from "../api/supabase";
import { convertToCamelCase } from "../lib/utils";
import { SessionPayload, SessionPayloadSchema } from "../types";
import { sessionKeys } from "./query-keys";

const fetchSessions = async (): Promise<Array<SessionPayload>> => {
  try {
    const { data, error } = await supabase.from("sessions").select(`
        *,
        topics:session_topics (
          id
        ),
        configs:session_question_configs (
          count
        ),
        session_labels (
          labels (
            id,
            text
          )
        )
        `);

    if (error) throw new Error("Failed to fetch sessions");

    const sessions = convertToCamelCase<SessionPayload[]>(
      data.map((session) =>
        _omit(
          {
            ...session,
            questionCount: session.configs.reduce(
              (acc, config) => acc + config.count,
              0,
            ),
            labels: session.session_labels.map((label) => label.labels),
          },
          ["configs"],
        ),
      ),
    );

    if (sessions.length === 0) return [];

    // parse the schema for type safety
    SessionPayloadSchema.parse(sessions);

    return sessions;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error("Invalid session payload");
    }
    throw error;
  }
};

export const useFetchSessions = () =>
  useQuery({
    queryKey: sessionKeys.list(),
    queryFn: fetchSessions,
  });
