"use client";

import { ManageAccessGate } from "@/components/ModulePermissionsWrapper/ManageAccessGate";
import { ParentsUpload } from "@/components/StudentAndParent/Parent/ParentsUpload";
import { canManageStudentParentRecords } from "@/lib/permissions/students-and-parents";

export default function page() {
  return (
    <ManageAccessGate permissionUtility={canManageStudentParentRecords} redirectTo="/staff/student-and-parent-record">
      <ParentsUpload />
    </ManageAccessGate>
  );
}
