"use client";

import { deleteSession } from "@/app/actions/auth";
import { toast } from "@/components/Toast";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { useEffect } from "react";

// setTimeout caps at ~24.8 days (2^31 - 1 ms); session lifetimes here are well under that, but
// clamp defensively so a bad/huge `exp` never overflows into firing immediately.
const MAX_TIMEOUT_MS = 2 ** 31 - 1;

// A 401 (next API call) or middleware (next navigation) only catches an expired token reactively —
// an idle tab with nothing in flight stays looking "logged in" long after `exp` has passed. This
// watches the decoded `exp` and forces the logout the moment it lapses, even with no pending request.
export const SessionExpiryWatcher = ({ redirectTo }: { redirectTo?: string }) => {
  const { exp } = useLoggedInUser();

  useEffect(() => {
    if (!exp) return;

    const logout = () => {
      toast({ title: "Session expired", description: "Please log in again to continue.", type: "warning" });
      deleteSession(redirectTo);
    };

    const msUntilExpiry = exp * 1000 - Date.now();
    if (msUntilExpiry <= 0) {
      logout();
      return;
    }

    const timeoutId = setTimeout(logout, Math.min(msUntilExpiry, MAX_TIMEOUT_MS));
    return () => clearTimeout(timeoutId);
  }, [exp, redirectTo]);

  return null;
};
