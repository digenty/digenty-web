"use client";

import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { MidtermReportScreen } from "@/components/MidtermReport";
import { canViewClassesAndSubjects } from "@/lib/permissions/classes-and-subjects";

export default function MidtermReportPage() {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewClassesAndSubjects}>
      <MidtermReportScreen />
    </ModulePermissionsWrapper>
  );
}
