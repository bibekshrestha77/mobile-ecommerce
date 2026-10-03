import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const isApiResponseError = (error: unknown): error is { status?: unknown; message?: unknown } =>
  typeof error === "object" && error !== null && "status" in error;

const client = new QueryClient({
  defaultOptions: {
    queries: {
      // Backend error responses won't improve on retry; retry transport failures only.
      retry: (failureCount, error: unknown) => {
        if (isApiResponseError(error) && (error.status === "fail" || error.status === "error")) return false;
        return failureCount < 2;
      },
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

const ReactQueryProvider = ({ children }: Props) => {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

export default ReactQueryProvider;
