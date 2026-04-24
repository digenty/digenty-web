import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

export type SubscriptionStatus = "ACTIVE" | "EXPIRED" | "CANCELLED" | "PENDING";
export type PlanType = "YEARLY" | "TERMLY";
export type BillingStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface SubscriptionOverviewDto {
  subscriptionId: number;
  planName: string;
  studentCapacity: number;
  activeStudentCount: number;
  status: SubscriptionStatus;
  endDate: string;
}

export interface PlanResponseDto {
  id: number;
  name: string;
  pricePerStudent: number;
  maxStudentCount: number;
  minStudentCount: number;
  planType: PlanType;
  features: string[];
}

export interface CreateSubscriptionDto {
  planId: number;
  studentCapacity?: number;
}

export interface Subscription {
  id: number;
  uuid: string;
  active: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
  schoolId: number;
  branchId: number;
  planId: number;
  studentCapacity: number;
  activeStudentCount: number;
  totalAmount: number;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
}

export interface BillingHistoryDto {
  periodStart: string;
  periodEnd: string;
  planName: string;
  planType: PlanType;
  status: BillingStatus;
  amount: number;
}

export interface PageBillingHistoryDto {
  totalElements: number;
  totalPages: number;
  size: number;
  content: BillingHistoryDto[];
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export const getCurrentSubscription = async () => {
  try {
    const { data } = await api.get<SubscriptionOverviewDto>("/subscriptions");
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const getActiveSubscription = async () => {
  try {
    const { data } = await api.get<SubscriptionOverviewDto>("/subscriptions/active");
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const getPlans = async () => {
  try {
    const { data } = await api.get("/subscriptions/plans");
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const getBillingHistory = async ({ page, size }: { page: number; size: number }) => {
  try {
    const { data } = await api.get<PageBillingHistoryDto>(`/subscriptions/billing?page=${page}&size=${size}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const createSubscription = async (payload: CreateSubscriptionDto) => {
  try {
    const { data } = await api.post<Subscription>("/subscriptions", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
