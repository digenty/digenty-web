"use client";

import { EditFeeGroup } from "@/components/Fees/FeesGroup/FeeGroup/EditFeeGroup";
import { ManageAccessGate } from "@/components/ModulePermissionsWrapper/ManageAccessGate";
import { canManageFees } from "@/lib/permissions/fees";

const EditFeeGroupPage = () => {
  return (
    <ManageAccessGate permissionUtility={canManageFees} redirectTo="/staff/fees">
      <div>
        <EditFeeGroup />
      </div>
    </ManageAccessGate>
  );
};

export default EditFeeGroupPage;
