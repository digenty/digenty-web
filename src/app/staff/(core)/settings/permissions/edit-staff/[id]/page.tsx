"use client";

import { EditStaff } from "@/components/AllSettings/PermissionsSettings/StaffMutation/EditStaff";
import { ManageAccessGate } from "@/components/ModulePermissionsWrapper/ManageAccessGate";
import { canManageSettings } from "@/lib/permissions/settings";
import React from "react";

const EditStaffPage = () => {
  return (
    <ManageAccessGate permissionUtility={canManageSettings} redirectTo="/staff/settings/permissions">
      <div>
        <EditStaff />
      </div>
    </ManageAccessGate>
  );
};

export default EditStaffPage;
