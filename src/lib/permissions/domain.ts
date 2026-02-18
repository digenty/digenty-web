import { hasPermission } from ".";

export const canViewDomain = (permissions: string[] | undefined) => hasPermission(permissions, "view_domain");

export const canManageDomain = (permissions: string[] | undefined) => hasPermission(permissions, "manage_domain");

export const canDeleteDomain = (permissions: string[] | undefined) => hasPermission(permissions, "delete_domain");
