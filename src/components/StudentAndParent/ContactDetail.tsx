"use client";

import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { canManageStudentParentRecords } from "@/lib/permissions/students-and-parents";

// View-only staff can browse student/parent records but shouldn't see contact details.
export const ContactDetail = ({ value }: { value?: string | null }) => {
  const { permissions } = useLoggedInUser();

  if (!canManageStudentParentRecords(permissions)) {
    return <span className="text-text-muted">Hidden</span>;
  }

  return <>{value || "--"}</>;
};
