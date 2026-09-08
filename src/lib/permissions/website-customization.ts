import { hasPermission } from ".";

export const canViewWebsiteCustomization = (permissions: string[] | undefined) => hasPermission(permissions, "view_website_customization");

export const canManageWebsiteCustomization = (permissions: string[] | undefined) => hasPermission(permissions, "manage_website_customization");

export const canDeleteWebsiteCustomization = (permissions: string[] | undefined) => hasPermission(permissions, "delete_website_customization");
