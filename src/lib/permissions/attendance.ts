import { hasPermission } from ".";

export const canViewAttendance = (permissions: string[] | undefined) => hasPermission(permissions, "view_attendance");

export const canManageAttendance = (permissions: string[] | undefined) => hasPermission(permissions, "manage_attendance");
