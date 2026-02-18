import { hasPermission } from ".";

export const canView = (permissions: string[] | undefined) => hasPermission(permissions, "view_student_parent_records");

export const canManage = (permissions: string[] | undefined) => !hasPermission(permissions, "manage_student_parent_records");

export const canDelete = (permissions: string[] | undefined) => hasPermission(permissions, "delete_student_parent_records");
