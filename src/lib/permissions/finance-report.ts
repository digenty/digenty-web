import { hasPermission } from ".";

export const canViewFinanceReport = (permissions: string[] | undefined) => hasPermission(permissions, "view_finance_report");

export const canManageFinanceReport = (permissions: string[] | undefined) => hasPermission(permissions, "manage_finance_report");

export const canDeleteFinanceReport = (permissions: string[] | undefined) => hasPermission(permissions, "delete_finance_report");
