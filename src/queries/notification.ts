export const notificationKeys = {
  all: ["notifications"] as const,
  list: (params?: { page?: number; pageSize?: number; read?: boolean }) =>
    [...notificationKeys.all, "list", params ?? {}] as const,
  notifyBranchHead: ["notifyBranchHead"] as const,
};
