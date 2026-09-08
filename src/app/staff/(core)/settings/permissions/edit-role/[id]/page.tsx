"use client";

import { AddRoleSettings } from "@/components/AllSettings/PermissionsSettings/RoleMutation/AddRole";
import { EditRoleSettings } from "@/components/AllSettings/PermissionsSettings/RoleMutation/EditRole";
import { ManageAccessGate } from "@/components/ModulePermissionsWrapper/ManageAccessGate";
import { canManageSettings } from "@/lib/permissions/settings";
import React from "react";

const EditRolePage = () => {
  return (
    <ManageAccessGate permissionUtility={canManageSettings} redirectTo="/staff/settings/permissions">
      <div>
        <EditRoleSettings />
      </div>
    </ManageAccessGate>
  );
};

export default EditRolePage;
