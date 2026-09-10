"use client";

import { ManageAccessGate } from "@/components/ModulePermissionsWrapper/ManageAccessGate";
import { StaffsUpload } from "@/components/AllSettings/PermissionsSettings/StaffMutation/StaffsUpload";
import { canManageSettings } from "@/lib/permissions/settings";

export default function Page() {
  return (
    <ManageAccessGate permissionUtility={canManageSettings} redirectTo="/staff/settings/permissions">
      <StaffsUpload />
    </ManageAccessGate>
  );
}
