"use client";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { canManageStudentParentRecords } from "@/lib/permissions/students-and-parents";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "../ui/skeleton";

// Redirects to the Student & Parent Record list when the staff only has view
// access — blocks direct-URL access to add/edit/upload routes, not just the
// buttons that link to them.
export const ManageAccessGate = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { permissions, isUserLoading } = useLoggedInUser();
  const canManage = canManageStudentParentRecords(permissions);

  useEffect(() => {
    if (!isUserLoading && permissions && !canManage) {
      router.replace("/staff/student-and-parent-record");
    }
  }, [isUserLoading, permissions, canManage, router]);

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
