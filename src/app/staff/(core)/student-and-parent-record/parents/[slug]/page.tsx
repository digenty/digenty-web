"use client";

import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { ParentProfile } from "@/components/StudentAndParent/Parent/ParentProfile";
import { canViewStudentParentRecords } from "@/lib/permissions/students-and-parents";

export default function page() {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewStudentParentRecords}>
      <ParentProfile />
    </ModulePermissionsWrapper>
  );
}
