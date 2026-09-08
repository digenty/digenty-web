"use client";

import { refreshSessionToken } from "@/app/actions/auth";
import { useReAutheticateUser } from "@/hooks/queryHooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Staff permissions are baked into the JWT at login time, so a staff member's browser keeps
// using their old permissions until a new token is issued — even after an admin changes their
// role. Silently re-issuing the token on every staff navigation keeps permissions in sync
// without forcing a manual logout.
export const SessionRefresher = () => {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { mutate: reAuthenticate } = useReAutheticateUser();

  useEffect(() => {
    reAuthenticate(undefined, {
      onSuccess: async data => {
        const token = data?.data?.token;
        if (!token) return;
        await refreshSessionToken(token);
        queryClient.invalidateQueries({ queryKey: ["session-user"] });
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
};
