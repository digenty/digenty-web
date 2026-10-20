"use client";

import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { StudentProfile } from "@/components/StudentAndParent/Students/StudentProfile";
import { canViewStudentParentRecords } from "@/lib/permissions/students-and-parents";
import React from "react";

export default function page() {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewStudentParentRecords}>
      <StudentProfile />
    </ModulePermissionsWrapper>
  );
}
