import { hasPermission } from ".";

export const canViewReferrals = (permissions: string[] | undefined) => hasPermission(permissions, "view_referrals");
