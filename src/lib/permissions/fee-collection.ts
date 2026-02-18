import { hasPermission } from ".";

export const canViewFeeCollection = (permissions: string[] | undefined) => hasPermission(permissions, "view_fee_collection");

export const canManageFeeCollection = (permissions: string[] | undefined) => hasPermission(permissions, "manage_fee_collection");

export const canDeleteFeeCollection = (permissions: string[] | undefined) => hasPermission(permissions, "delete_fee_collection");
