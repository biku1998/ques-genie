import React from "react";
import ReactDOM from "react-dom/client";
import toast, { Toaster } from "react-hot-toast";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App from "./App.tsx";
import "./index.css";

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
    <QueryClientProvider client={queryClient}>
      <Toaster
        position="top-right"
        toastOptions={{
          className:
            "text-sm text-slate-800 border border-solid border-slate-200 text-sans",
        }}
      />
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
);
