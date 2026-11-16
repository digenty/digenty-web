"use client";

import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { MidtermCommentsScreen } from "@/components/MidtermReport/MidtermCommentsScreen";
import { canViewClassesAndSubjects } from "@/lib/permissions/classes-and-subjects";

export default function MidtermCommentsPage() {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewClassesAndSubjects}>
      <MidtermCommentsScreen />
    </ModulePermissionsWrapper>
  );
}
