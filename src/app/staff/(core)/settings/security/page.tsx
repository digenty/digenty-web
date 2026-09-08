"use client";

import { SecuritySettings } from "@/components/AllSettings/SecuritySettings";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { canViewSettings } from "@/lib/permissions/settings";
import React from "react";

const SettingSecurityPage = () => {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewSettings}>
      <div>
        <SecuritySettings />
      </div>
    </ModulePermissionsWrapper>
  );
};

export default SettingSecurityPage;
