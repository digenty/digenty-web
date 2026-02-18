import { hasPermission } from ".";

export const canViewSettings = (permissions: string[] | undefined) => hasPermission(permissions, "view_settings");

export const canManageSettings = (permissions: string[] | undefined) => hasPermission(permissions, "manage_settings");
