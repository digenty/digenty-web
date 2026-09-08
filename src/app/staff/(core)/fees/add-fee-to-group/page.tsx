"use client";

import { AddFeeToGroup } from "@/components/Fees/FeesGroup/AddFeeToGroup/index";
import { ManageAccessGate } from "@/components/ModulePermissionsWrapper/ManageAccessGate";
import { canManageFees } from "@/lib/permissions/fees";

const AddFeeToGroupPage = () => {
  return (
    <ManageAccessGate permissionUtility={canManageFees} redirectTo="/staff/fees">
      <div>
        <AddFeeToGroup />
        {/*add  */}
      </div>
    </ManageAccessGate>
  );
};

export default AddFeeToGroupPage;
