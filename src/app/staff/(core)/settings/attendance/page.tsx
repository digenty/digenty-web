"use client";

import { AttendanceSettings } from "@/components/AllSettings/AttendanceSettings";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { canViewSettings } from "@/lib/permissions/settings";

export default function Page() {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewSettings}>
      <AttendanceSettings />
    </ModulePermissionsWrapper>
  );
}
