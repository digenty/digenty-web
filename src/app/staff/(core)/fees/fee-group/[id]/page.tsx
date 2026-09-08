"use client";

import { FeeGroup } from "@/components/Fees/FeesGroup/FeeGroup";
import React from "react";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { canViewFees } from "@/lib/permissions/fees";

const AddNewStudentFeePage = () => {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewFees}>
      <div>
        <FeeGroup />
      </div>
    </ModulePermissionsWrapper>
  );
};

export default AddNewStudentFeePage;
