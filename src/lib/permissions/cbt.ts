import { hasPermission } from ".";

export const canViewCBT = (permissions: string[] | undefined) => hasPermission(permissions, "view_classes_subjects");

export const canManageCBT = (permissions: string[] | undefined) => hasPermission(permissions, "manage_classes_subjects");
