"use client";

import { AcademicSetupView } from "@/components/AllSettings/AcademicSettings/AcademicSetupView";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { canViewSettings } from "@/lib/permissions/settings";

const AcedmicSettingPage = () => {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewSettings}>
      <AcademicSetupView />
    </ModulePermissionsWrapper>
  );
};

export default AcedmicSettingPage;
