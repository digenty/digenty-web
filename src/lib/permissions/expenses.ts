import { hasPermission } from ".";

export const canViewExpenses = (permissions: string[] | undefined) => hasPermission(permissions, "view_expenses");

export const canManageExpenses = (permissions: string[] | undefined) => hasPermission(permissions, "manage_expenses");

export const canDeleteExpenses = (permissions: string[] | undefined) => hasPermission(permissions, "delete_expenses");
