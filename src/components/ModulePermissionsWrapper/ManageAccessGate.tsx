"use client";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "../ui/skeleton";

// Redirects to `redirectTo` when the staff only has view access — blocks direct-URL
// access to add/edit/upload routes, not just the buttons that link to them.
export const ManageAccessGate = ({
  permissionUtility,
  redirectTo,
  children,
}: {
  permissionUtility: (permissions: string[] | undefined) => boolean;
  redirectTo: string;
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const { permissions, isUserLoading } = useLoggedInUser();
  const canManage = permissionUtility(permissions);

  useEffect(() => {
    if (!isUserLoading && permissions && !canManage) {
      router.replace(redirectTo);
    }
  }, [isUserLoading, permissions, canManage, router, redirectTo]);

  if (isUserLoading || !permissions) {
    return (
      <div className="flex items-center justify-center p-4 md:px-8 md:py-4">
        <Skeleton className="bg-bg-input-soft h-screen w-full" />
      </div>
    );
  }

  if (!canManage) return null;

  return <>{children}</>;
};
