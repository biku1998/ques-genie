import { Navigate, createBrowserRouter } from "react-router-dom";
import AuthGuard from "./auth/components/auth-guard";
import LoginPage from "./auth/pages/login";
import RegisterPage from "./auth/pages/register";
import RootLayout from "./components/root-layout";
import HomePage from "./home/pages";
import PageNotFound from "./pages/404";
import RootErrorPage from "./pages/root-error-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthGuard>
        <RootLayout />
      </AuthGuard>
    ),
    errorElement: <RootErrorPage />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
    ],
  },
  {
    path: "/auth",
    element: <Navigate to="/auth/login" replace={true} />,
  },
  {
    path: "/auth/register",
    element: <RegisterPage />,
    errorElement: <RootErrorPage />,
  },
  {
    path: "/auth/login",
    element: <LoginPage />,
    errorElement: <RootErrorPage />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

export default router;
