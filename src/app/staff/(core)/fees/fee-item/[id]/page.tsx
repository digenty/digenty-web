"use client";

import { FeeItemDetail } from "@/components/Fees/FeesItem/FeeDetails";
import React from "react";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { canViewFees } from "@/lib/permissions/fees";

const FeeItemDetailPage = () => {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewFees}>
      <div>
        <FeeItemDetail />
      </div>
    </ModulePermissionsWrapper>
  );
};

export default FeeItemDetailPage;
