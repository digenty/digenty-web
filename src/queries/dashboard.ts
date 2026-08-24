export const dashboardKey = {
  getDashboard: ["getDashboard"] as const,
  getAlerts: (termId: number | null, branchId: number | null) => ["dashboardAlerts", termId, branchId] as const,
  getLevels: (branchId: number | null) => ["dashboardLevels", branchId] as const,
  getClassPaymentCompletion: (termId: number | null, branchId: number | null, levelType?: string) =>
    ["classPaymentCompletion", termId, branchId, levelType ?? "all"] as const,
};
