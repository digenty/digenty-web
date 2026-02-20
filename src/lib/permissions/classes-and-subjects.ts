import { hasPermission } from ".";

export const canViewClassesAndSubjects = (permissions: string[] | undefined) => hasPermission(permissions, "view_classes_subjects");

export const canManageClassesAndSubjects = (permissions: string[] | undefined) => hasPermission(permissions, "manage_classes_subjects");
