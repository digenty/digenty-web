"use client";

import { AddStaff } from "@/components/AllSettings/PermissionsSettings/StaffMutation/AddStaff";
import { ManageAccessGate } from "@/components/ModulePermissionsWrapper/ManageAccessGate";
import { canManageSettings } from "@/lib/permissions/settings";
import React from "react";

const AddStaffPage = () => {
  return (
    <ManageAccessGate permissionUtility={canManageSettings} redirectTo="/staff/settings/permissions">
      <div>
        <AddStaff />
      </div>
    </ManageAccessGate>
  );
};

export default AddStaffPage;
