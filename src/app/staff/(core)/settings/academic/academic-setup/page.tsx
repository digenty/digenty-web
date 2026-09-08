"use client";

import { AcademicSetup } from "@/components/AllSettings/AcademicSettings/AcademicSetup";
import { ManageAccessGate } from "@/components/ModulePermissionsWrapper/ManageAccessGate";
import { canManageSettings } from "@/lib/permissions/settings";

const AcademicSetupPage = () => {
  return (
    <ManageAccessGate permissionUtility={canManageSettings} redirectTo="/staff/settings/academic">
      <div className="flex min-h-screen flex-col">
        <AcademicSetup />
      </div>
    </ManageAccessGate>
  );
};

export default AcademicSetupPage;
