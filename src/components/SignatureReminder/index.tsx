"use client";

import { useGetUserProfile } from "@/hooks/queryHooks/useProfile";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import Link from "next/link";

// Staff-only nudge above a report card: shown to people who sign reports (principal/admin or class teacher) until they add a signature.
export const SignatureReminder = () => {
  const { isMain, isAdmin, armIds, isUserLoading } = useLoggedInUser();
  const { data, isLoading } = useGetUserProfile();

  const canSign = !!isMain || !!isAdmin || (armIds?.length ?? 0) > 0;
  if (isUserLoading || isLoading || !canSign || data?.data?.signature) return null;

  return (
    <div className="border-border-default bg-bg-subtle text-text-subtle mb-3 flex flex-wrap items-center gap-1 rounded-md border px-3 py-2 text-xs">
      <span>Your signature isn&apos;t on this report card yet.</span>
      <Link href="/staff/profile" className="text-text-default font-medium underline">
        Add your signature
      </Link>
    </div>
  );
};
