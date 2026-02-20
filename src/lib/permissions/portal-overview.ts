import { hasPermission } from ".";

export const canViewPortalOverview = (permissions: string[] | undefined) => hasPermission(permissions, "view_portal_overview");

export const canManagePortalOverview = (permissions: string[] | undefined) => hasPermission(permissions, "manage_portal_overview");
