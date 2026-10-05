export const parentNotificationKeys = {
  all: ["parentNotifications"] as const,
  list: (params?: { page?: number; pageSize?: number; read?: boolean }) => [...parentNotificationKeys.all, "list", params ?? {}] as const,
};
