import { hasPermission } from ".";

export const canViewStudentParentRecords = (permissions: string[] | undefined) => hasPermission(permissions, "view_student_parent_records");

export const canManageStudentParentRecords = (permissions: string[] | undefined) => hasPermission(permissions, "manage_student_parent_records");

export const canDeleteStudentParentRecords = (permissions: string[] | undefined) => hasPermission(permissions, "delete_student_parent_records");
