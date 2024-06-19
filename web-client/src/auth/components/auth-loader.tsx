import React from "react";
import { supabase } from "../../api/supabase";
import { useUserStore } from "../user-store";

export default function AuthLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, setUser } = useUserStore();
  const [isAuthLoading, setIsAuthLoading] = React.useState(() =>
    user === null ? true : false,
  );

  const loadAuth = React.useCallback(async () => {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      setIsAuthLoading(false);
      return;
    }

    if (data.session === null) {
      setIsAuthLoading(false);
      return;
    }

    setUser({
      email: data.session.user.email ?? "",
      id: data.session.user.id,
    });

    setIsAuthLoading(false);
  }, [setUser]);

  React.useEffect(() => {
    loadAuth();
  }, [loadAuth]);

  return user ? (
    children
  ) : isAuthLoading ? (
    <div>
      <h1>Auth loading...</h1>
    </div>
  ) : (
    children
  );
}
