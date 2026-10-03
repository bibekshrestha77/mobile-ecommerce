import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const client = new QueryClient({
  defaultOptions: {
    queries: {
      // Don't retry auth errors (401) — retrying won't help without a login
      retry: (failureCount, error: any) => {
        if (error?.status === "fail" && /unauthorized/i.test(error?.message || "")) {
          return false;
        }
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
