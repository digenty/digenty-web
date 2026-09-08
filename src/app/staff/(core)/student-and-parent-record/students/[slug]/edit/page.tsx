"use client";

import { ManageAccessGate } from "@/components/ModulePermissionsWrapper/ManageAccessGate";
import { EditStudent } from "@/components/StudentAndParent/StudentMutation/EditStudent";
import { Spinner } from "@/components/ui/spinner";
import { canManageStudentParentRecords } from "@/lib/permissions/students-and-parents";
import { Suspense } from "react";

export default function Page() {
  return (
    <ManageAccessGate permissionUtility={canManageStudentParentRecords} redirectTo="/staff/student-and-parent-record">
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Spinner className="size-16" />
          </div>
        }
      >
        <EditStudent />
      </Suspense>
    </ManageAccessGate>
  );
}
