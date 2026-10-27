"use client";

import { toast } from "@/components/Toast";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { checkSession, endTabSession, getTabUser } from "@/lib/session-client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

// setTimeout caps at ~24.8 days (2^31 - 1 ms); session lifetimes here are well under that, but
// clamp defensively so a bad/huge `exp` never overflows into firing immediately.
const MAX_TIMEOUT_MS = 2 ** 31 - 1;

// A 401 (next API call) or middleware (next navigation) only catches an expired token reactively —
// an idle tab with nothing in flight stays looking "logged in" long after `exp` has passed. This
// watches the decoded `exp` and forces the logout the moment it lapses, even with no pending request.
export const SessionExpiryWatcher = ({ redirectTo }: { redirectTo?: string }) => {
  const { exp } = useLoggedInUser();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!exp) return;

    const logout = async () => {
      // The cookie is shared by every tab. If another tab signed in as someone else, that session is valid and
      // not ours to end, so the session guard explains instead. (No cookie at all is just this session expiring.)
      if ((await checkSession({ announceSignedOut: false })) === "changed") return;

      // Same person, but a token re-issued elsewhere (another tab) already extended the session.
      const currentExp = getTabUser()?.exp;
      if (currentExp && currentExp * 1000 > Date.now()) {
        queryClient.invalidateQueries({ queryKey: ["session-user"] });
        return;
      }

      toast({ title: "Session expired", description: "Please log in again to continue.", type: "warning" });
      await endTabSession(redirectTo);
    };

    const msUntilExpiry = exp * 1000 - Date.now();
    if (msUntilExpiry <= 0) {
      void logout();
      return;
    }

    const timeoutId = setTimeout(() => void logout(), Math.min(msUntilExpiry, MAX_TIMEOUT_MS));
    return () => clearTimeout(timeoutId);
  }, [exp, redirectTo, queryClient]);

  return null;
};
