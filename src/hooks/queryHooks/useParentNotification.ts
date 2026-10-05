import {
  getParentNotifications,
  GetParentNotificationsParams,
  markAllParentNotificationsRead,
  markParentNotificationRead,
  ParentNotificationApiError,
  ParentNotificationsResponse,
} from "@/api/parent-notification";
import { parentNotificationKeys } from "@/queries/parent-notification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetParentNotifications = (params?: GetParentNotificationsParams) => {
  return useQuery<ParentNotificationsResponse, ParentNotificationApiError>({
    queryKey: parentNotificationKeys.list(params),
    queryFn: () => getParentNotifications(params),
    retry: false,
  });
};

export const useMarkParentNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation<void, ParentNotificationApiError, number>({
    mutationFn: markParentNotificationRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: parentNotificationKeys.all }),
  });
};

export const useMarkAllParentNotificationsRead = () => {
  const queryClient = useQueryClient();
  return useMutation<void, ParentNotificationApiError>({
    mutationFn: markAllParentNotificationsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: parentNotificationKeys.all }),
  });
};
