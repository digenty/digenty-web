import { BillingStatus, PlanType, SubscriptionStatus } from "@/api/subscription";

export type BillingCycle = "Termly" | "Yearly";

export type StudentTier = "1-200" | "201-400" | "401+";

export interface BillingHistoryRow {
  period: string;
  plan: string;
  status: string;
  amount: number;
}

export const BILLING_CYCLE_TO_PLAN_TYPE: Record<BillingCycle, PlanType> = {
  Termly: "TERMLY",
  Yearly: "YEARLY",
};

export const STUDENT_TIER_RANGES: Record<StudentTier, { min: number; max: number }> = {
  "1-200": { min: 1, max: 200 },
  "201-400": { min: 201, max: 400 },
  "401+": { min: 401, max: Number.MAX_SAFE_INTEGER },
};

export const subscriptionStatusLabel: Record<SubscriptionStatus, string> = {
  ACTIVE: "Active",
  EXPIRED: "Expired",
  CANCELLED: "Cancelled",
  PENDING: "Pending",
};

export const billingStatusLabel: Record<BillingStatus, "Paid" | "Failed" | "Pending"> = {
  SUCCESS: "Paid",
  FAILED: "Failed",
  PENDING: "Pending",
};
