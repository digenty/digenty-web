"use client";

import { StaffDetails } from "@/components/AllSettings/PermissionsSettings/StaffDetails";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { canViewSettings } from "@/lib/permissions/settings";
import React from "react";

const StaffDetailPage = () => {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewSettings}>
      <div>
        <StaffDetails />
      </div>
    </ModulePermissionsWrapper>
  );
};

export default StaffDetailPage;
