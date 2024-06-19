import React from "react";
import ReactDOM from "react-dom/client";
import toast, { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import AuthLoader from "./auth/components/auth-loader.tsx";
import ConfirmationDialog from "./components/confirmation-dialog.tsx";
import DisableSmallScreen from "./components/disable-small-screen.tsx";
import "./index.css";
import router from "./router.tsx";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      const errorDisabled = (query.meta?.errorDisabled as boolean) ?? false;
      if (errorDisabled) return;
      toast.error(error.message);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _, __, mutation) => {
      const errorDisabled =
        (mutation.options.meta?.errorDisabled as boolean) ?? false;

      if (errorDisabled) return;
      toast.error(error.message);
    },
  }),
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DisableSmallScreen>
      <QueryClientProvider client={queryClient}>
        <AuthLoader>
          <Toaster
            position="top-right"
            toastOptions={{
              className:
                "text-sm text-slate-800 border border-solid border-slate-200 text-sans",
            }}
          />
          <ConfirmationDialog />
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </AuthLoader>
      </QueryClientProvider>
    </DisableSmallScreen>
  </React.StrictMode>,
);
