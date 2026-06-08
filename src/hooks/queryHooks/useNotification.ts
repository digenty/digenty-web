import {
  getNotifications,
  GetNotificationsParams,
  GetNotificationsResponse,
  markAllNotificationsRead,
  markNotificationRead,
  notifyBranchHead,
  NotificationApiError,
  NotifyBranchHeadPayload,
} from "@/api/notification";
import { notificationKeys } from "@/queries/notification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetNotifications = (params?: GetNotificationsParams) => {
  return useQuery<GetNotificationsResponse, NotificationApiError>({
    queryKey: notificationKeys.list(params),
    queryFn: () => getNotifications(params),
    retry: false,
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation<void, NotificationApiError, number>({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  return useMutation<void, NotificationApiError>({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

export const useNotifyBranchHead = () => {
  return useMutation<unknown, NotificationApiError, NotifyBranchHeadPayload>({
    mutationKey: notificationKeys.notifyBranchHead,
    mutationFn: notifyBranchHead,
  });
};
