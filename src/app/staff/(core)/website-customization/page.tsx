"use client";

import { WebsiteCustomization } from "@/components/WebsiteCustomization";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { canViewWebsiteCustomization } from "@/lib/permissions/website-customization";

export default function WebsiteCustomizationPage() {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewWebsiteCustomization}>
      <WebsiteCustomization />
    </ModulePermissionsWrapper>
  );
}
