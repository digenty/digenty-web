import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

export type NotifyBranchHeadPayload = {
  receiverId: number;
  message: string;
};

export type NotificationApiError = {
  message: string;
};

export type NotificationType = "APPROVAL" | "EDIT_REQUEST" | "RESULT_APPROVED" | "RESULT_RETURNED" | "REMINDER" | "SYSTEM" | "DIRECT_MESSAGE";

export type Notification = {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  metadata?: {
    armId?: number;
    classId?: number;
    classArmReportId?: number;
    subjectId?: number;
    senderId?: number;
    senderName?: string;
  } | null;
};

export type GetNotificationsParams = {
  page?: number;
  pageSize?: number;
  read?: boolean;
};

export type GetNotificationsResponse = {
  data: {
    notifications: Notification[];
    unreadCount: number;
    total: number;
    page: number;
    pageSize: number;
  };
};

export const getNotifications = async (params?: GetNotificationsParams): Promise<GetNotificationsResponse> => {
  try {
    const { data } = await api.get("/notifications", { params });
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data as NotificationApiError;
    throw error;
  }
};

export const markNotificationRead = async (id: number): Promise<void> => {
  try {
    await api.patch(`/notifications/${id}/read`);
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data as NotificationApiError;
    throw error;
  }
};

export const markAllNotificationsRead = async (): Promise<void> => {
  try {
    await api.patch("/notifications/read-all");
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data as NotificationApiError;
    throw error;
  }
};

export const notifyBranchHead = async (payload: NotifyBranchHeadPayload) => {
  try {
    const { data } = await api.post("/notifications", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data as NotificationApiError;
    }
    throw error;
  }
};
