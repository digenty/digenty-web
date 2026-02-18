import { hasPermission } from ".";

export const canViewFees = (permissions: string[] | undefined) => hasPermission(permissions, "view_fees");

export const canManageFees = (permissions: string[] | undefined) => hasPermission(permissions, "manage_fees");

export const canDeleteFees = (permissions: string[] | undefined) => hasPermission(permissions, "delete_fees");
