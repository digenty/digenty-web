import { SESSION_CHANGED_CODE } from "@/lib/session-identity";
import { QueryClient } from "@tanstack/react-query";

export const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        // A request refused because another tab changed the shared login session will be refused again; don't retry it.
        retry: (failureCount, error) => failureCount < 2 && (error as { errorCode?: string } | null)?.errorCode !== SESSION_CHANGED_CODE,
        refetchOnWindowFocus: false,
      },
    },
  });
