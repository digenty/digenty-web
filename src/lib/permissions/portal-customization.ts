import { hasPermission } from ".";

export const canViewPortalCustomization = (permissions: string[] | undefined) => hasPermission(permissions, "view_portal_customization");

export const canManagePortalCustomization = (permissions: string[] | undefined) => hasPermission(permissions, "manage_portal_customization");

export const canDeletePortalCustomization = (permissions: string[] | undefined) => hasPermission(permissions, "delete_portal_customization");
