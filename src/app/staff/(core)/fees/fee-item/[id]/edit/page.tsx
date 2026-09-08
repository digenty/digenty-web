"use client";

import { EditFeeItem } from "@/components/Fees/FeesItem/EditFeeItem";
import { ManageAccessGate } from "@/components/ModulePermissionsWrapper/ManageAccessGate";
import { canManageFees } from "@/lib/permissions/fees";

const EditFeeItemPage = () => {
  return (
    <ManageAccessGate permissionUtility={canManageFees} redirectTo="/staff/fees">
      <div>
        <EditFeeItem />
      </div>
    </ManageAccessGate>
  );
};

export default EditFeeItemPage;
