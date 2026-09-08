"use client";

import { EditSettingStocks } from "@/components/AllSettings/SettingStock/EditSettingStock";
import { ManageAccessGate } from "@/components/ModulePermissionsWrapper/ManageAccessGate";
import { canManageSettings } from "@/lib/permissions/settings";
import React from "react";

const page = () => {
  return (
    <ManageAccessGate permissionUtility={canManageSettings} redirectTo="/staff/settings/stock">
      <div>
        <EditSettingStocks />
      </div>
    </ManageAccessGate>
  );
};

export default page;
