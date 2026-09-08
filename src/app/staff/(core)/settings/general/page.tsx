"use client";

import { General } from "@/components/AllSettings/GeneralSettings";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { canViewSettings } from "@/lib/permissions/settings";
import React from "react";

const GeneralSettingPage = () => {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewSettings}>
      <div>
        <General />
      </div>
    </ModulePermissionsWrapper>
  );
};

export default GeneralSettingPage;
