import { Session, User } from "@supabase/gotrue-js/src/lib/types";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "../../api/supabase";

export type AuthSuccessResponse = {
  user: User;
  session: Session;
};

const register = async (payload: {
  email: string;
  password: string;
}): Promise<AuthSuccessResponse> => {
  const { email, password } = payload;
  const resp = await supabase.auth.signUp({ email, password });

  if (resp.error) throw new Error("Failed to register");

  if (!resp.data.user || !resp.data.session)
    throw new Error("Failed to register");

  return {
    user: resp.data.user,
    session: resp.data.session,
  };
};

export const useRegister = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (resp: AuthSuccessResponse) => void;
  onError?: (error: Error) => void;
} = {}) =>
  useMutation({
    mutationFn: register,
    onSuccess,
    onError,
  });

const login = async (payload: {
  email: string;
  password: string;
}): Promise<AuthSuccessResponse> => {
  const { email, password } = payload;
  const resp = await supabase.auth.signInWithPassword({ email, password });

  if (resp.error) throw new Error("Failed to login");

  if (!resp.data.user || !resp.data.session) throw new Error("Failed to login");

  return {
    user: resp.data.user,
    session: resp.data.session,
  };
};

export const useLogin = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (resp: AuthSuccessResponse) => void;
  onError?: (error: Error) => void;
} = {}) =>
  useMutation({
    mutationFn: login,
    onSuccess,
    onError,
  });

export const logout = () => {
  supabase.auth.signOut();
};
