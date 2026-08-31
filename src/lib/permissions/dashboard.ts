import { hasPermission } from ".";

export const canViewDashboard = (permissions: string[] | undefined) => hasPermission(permissions, "view_dashboard");
