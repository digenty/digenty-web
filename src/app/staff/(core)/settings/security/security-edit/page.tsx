"use client";

import { EditSetting } from "@/components/AllSettings/SecuritySettings/EditSetting";
import { ManageAccessGate } from "@/components/ModulePermissionsWrapper/ManageAccessGate";
import { canManageSettings } from "@/lib/permissions/settings";
import React from "react";

const EditSettingPage = () => {
  return (
    <ManageAccessGate permissionUtility={canManageSettings} redirectTo="/staff/settings/security">
      <div>
        <EditSetting />
      </div>
    </ManageAccessGate>
  );
};

export default EditSettingPage;
