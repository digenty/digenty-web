"use client";

import AddFeeToClass from "@/components/Fees/ClassFees/AddFeeToClass";
import React from "react";
import { ManageAccessGate } from "@/components/ModulePermissionsWrapper/ManageAccessGate";
import { canManageFees } from "@/lib/permissions/fees";

const AddFeeToClassPage = () => {
  return (
    <ManageAccessGate permissionUtility={canManageFees} redirectTo="/staff/fees">
      <div>
        <AddFeeToClass />
      </div>
    </ManageAccessGate>
  );
};

export default AddFeeToClassPage;
