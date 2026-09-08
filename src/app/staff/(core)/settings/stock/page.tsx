"use client";

import { SettingsStocks } from "@/components/AllSettings/SettingStock";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { canViewSettings } from "@/lib/permissions/settings";
import React from "react";

const SettingStockPage = () => {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewSettings}>
      <div>
        <SettingsStocks />
      </div>
    </ModulePermissionsWrapper>
  );
};

export default SettingStockPage;
