import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useGetUser } from "../user-store";

const excludedPaths = ["/auth/login", "/auth/register"];
const redirectPath = "/auth/login";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const user = useGetUser();

  const location = useLocation();
  const currentPathName = location.pathname;

  return user ? (
    children
  ) : excludedPaths.includes(currentPathName) ? (
    children
  ) : (
    <Navigate
      to={`${redirectPath}?redirect_uri=${currentPathName}`}
      replace={true}
    />
  );
}
