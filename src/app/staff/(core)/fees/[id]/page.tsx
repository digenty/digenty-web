"use client";

import { ClassFeeDetail } from "@/components/Fees/ClassFees/ClassFeeDetail";
import React from "react";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { canViewFees } from "@/lib/permissions/fees";

const ClassfeeDetailPage = () => {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewFees}>
      <div>
        <ClassFeeDetail />
      </div>
    </ModulePermissionsWrapper>
  );
};

export default ClassfeeDetailPage;
