"use client";

import { AddAdmin } from "@/components/AllSettings/PermissionsSettings/AddAdmin";
import { ManageAccessGate } from "@/components/ModulePermissionsWrapper/ManageAccessGate";
import { canManageSettings } from "@/lib/permissions/settings";

const AddAdminPage = () => {
  return (
    <ManageAccessGate permissionUtility={canManageSettings} redirectTo="/staff/settings/permissions">
      <div>
        <AddAdmin />
      </div>
    </ManageAccessGate>
  );
};

export default AddAdminPage;
