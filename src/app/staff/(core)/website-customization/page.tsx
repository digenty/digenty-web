import { WebsiteCustomization } from "@/components/WebsiteCustomization";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { canViewPortalCustomization } from "@/lib/permissions/website-customization";

export default function WebsiteCustomizationPage() {
  return (
    <>
      <WebsiteCustomization />
    </>
  );
}
