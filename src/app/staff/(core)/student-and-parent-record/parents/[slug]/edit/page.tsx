"use client";

import { ManageAccessGate } from "@/components/ModulePermissionsWrapper/ManageAccessGate";
import { EditParent } from "@/components/StudentAndParent/Parent/EditParent/EditParent";
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
        <EditParent />
      </Suspense>
    </ManageAccessGate>
  );
}
