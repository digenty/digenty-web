"use client";

import { PermissonsSettings } from "@/components/AllSettings/PermissionsSettings";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { canViewSettings } from "@/lib/permissions/settings";
import React from "react";

const PermissionSettingPage = () => {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewSettings}>
      <div>
        <PermissonsSettings />
      </div>
    </ModulePermissionsWrapper>
  );
};

export default PermissionSettingPage;
