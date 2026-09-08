"use client";

import { ManageAccessGate } from "@/components/ModulePermissionsWrapper/ManageAccessGate";
import { StudentsUpload } from "@/components/StudentAndParent/Students/StudentsUpload";
import { canManageStudentParentRecords } from "@/lib/permissions/students-and-parents";

export default function page() {
  return (
    <ManageAccessGate permissionUtility={canManageStudentParentRecords} redirectTo="/staff/student-and-parent-record">
      <StudentsUpload />
    </ManageAccessGate>
  );
}
