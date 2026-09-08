"use client";

import { AddRoleSettings } from "@/components/AllSettings/PermissionsSettings/RoleMutation/AddRole";
import { ManageAccessGate } from "@/components/ModulePermissionsWrapper/ManageAccessGate";
import { canManageSettings } from "@/lib/permissions/settings";
import React from "react";

const AddRolePage = () => {
  return (
    <ManageAccessGate permissionUtility={canManageSettings} redirectTo="/staff/settings/permissions">
      <div>
        <AddRoleSettings />
      </div>
    </ManageAccessGate>
  );
};

export default AddRolePage;
