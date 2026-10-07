import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

export type ParentNotificationType = "FEE_INVOICE" | "PAYMENT_RECEIVED" | "PAYMENT_REMINDER" | "DIARY_REPORT" | "RESULT_PUBLISHED" | "SYSTEM";

export type ParentNotification = {
  id: number;
  type: ParentNotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  studentId?: number | null;
};

export type GetParentNotificationsParams = {
  page?: number;
  pageSize?: number;
  read?: boolean;
};

export type ParentNotificationsResponse = {
  notifications: ParentNotification[];
  unreadCount: number;
  total: number;
  page: number;
  pageSize: number;
};

export type ParentNotificationApiError = {
  message: string;
};

export const getParentNotifications = async (params?: GetParentNotificationsParams): Promise<ParentNotificationsResponse> => {
  try {
    const { data } = await api.get("/parent/portal/notifications", { params });
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data as ParentNotificationApiError;
    throw error;
  }
};

export const markParentNotificationRead = async (id: number): Promise<void> => {
  try {
    await api.patch(`/parent/portal/notifications/${id}/read`);
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data as ParentNotificationApiError;
    throw error;
  }
};

export const markAllParentNotificationsRead = async (): Promise<void> => {
  try {
    await api.patch("/parent/portal/notifications/read-all");
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data as ParentNotificationApiError;
    throw error;
  }
};
