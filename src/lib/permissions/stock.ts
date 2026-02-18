import { hasPermission } from ".";

export const canViewStock = (permissions: string[] | undefined) => hasPermission(permissions, "view_stock");

export const canManageStock = (permissions: string[] | undefined) => hasPermission(permissions, "manage_stock");

export const canDeleteStock = (permissions: string[] | undefined) => hasPermission(permissions, "delete_stock");
