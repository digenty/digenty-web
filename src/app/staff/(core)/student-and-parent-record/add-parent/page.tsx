"use client";

import { ManageAccessGate } from "@/components/ModulePermissionsWrapper/ManageAccessGate";
import { AddParent } from "@/components/StudentAndParent/Parent/AddParent/AddParent";
import { canManageStudentParentRecords } from "@/lib/permissions/students-and-parents";

export default function page() {
  return (
    <ManageAccessGate permissionUtility={canManageStudentParentRecords} redirectTo="/staff/student-and-parent-record">
      <AddParent />
    </ManageAccessGate>
  );
}
