"use client";

import { ManageAccessGate } from "@/components/ModulePermissionsWrapper/ManageAccessGate";
import { AddStudent } from "@/components/StudentAndParent/StudentMutation/AddStudent";
import { canManageStudentParentRecords } from "@/lib/permissions/students-and-parents";

export default function page() {
  return (
    <ManageAccessGate permissionUtility={canManageStudentParentRecords} redirectTo="/staff/student-and-parent-record">
      <AddStudent />
    </ManageAccessGate>
  );
}
