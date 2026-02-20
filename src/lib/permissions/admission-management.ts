import { hasPermission } from ".";

export const canViewAdmissionManagement = (permissions: string[] | undefined) => hasPermission(permissions, "view_admission_management");

export const canManageAdmissionManagement = (permissions: string[] | undefined) => hasPermission(permissions, "manage_admission_management");
