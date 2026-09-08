"use client";

import { SettingsResult } from "@/components/AllSettings/ResultSettings";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { canViewSettings } from "@/lib/permissions/settings";
import React from "react";

function SettingsResultPage() {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewSettings}>
      <div>
        <SettingsResult />
      </div>
    </ModulePermissionsWrapper>
  );
}

export default SettingsResultPage;
