import { hasPermission } from ".";

export const canViewInvoices = (permissions: string[] | undefined) => hasPermission(permissions, "view_invoices");

export const canManageInvoices = (permissions: string[] | undefined) => hasPermission(permissions, "manage_invoices");

export const canDeleteInvoices = (permissions: string[] | undefined) => hasPermission(permissions, "delete_invoices");
