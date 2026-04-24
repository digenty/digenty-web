import { BillingStatus, PlanType, SubscriptionStatus } from "@/api/subscription";

export type SubscriptionView = "dashboard" | "plans" | "upgrade" | "subscribe" | "add-students";

export type BillingCycle = "Termly" | "Yearly";

export type StudentTier = "1-200" | "201-400" | "401+";

export interface PlanFeatureRow {
  feature: string;
  standard: boolean;
  advanced: boolean;
}

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

export const planFeaturesData: PlanFeatureRow[] = [
  { feature: "Administrator Tools", standard: true, advanced: true },
  { feature: "User Information Systems", standard: true, advanced: true },
  { feature: "Students Attendance Management", standard: true, advanced: true },
  { feature: "Result Processing, Publishing & Remote Access", standard: true, advanced: true },
  { feature: "Students Class Promotion / Transfer Management", standard: true, advanced: true },
  { feature: "Communications (Bulk SMS)", standard: true, advanced: true },
  { feature: "Online Assignments / Home Works & Lesson/Lecture Notes", standard: true, advanced: true },
  { feature: "Online Admission Management", standard: true, advanced: true },
  { feature: "Fees & Bursary Management", standard: true, advanced: true },
  { feature: "Financial summary and Analytics", standard: true, advanced: true },
  { feature: "Online Fees Payment", standard: true, advanced: true },
  { feature: "Stock keeping and Management (School uniform, textbooks, notebooks etc.)", standard: true, advanced: true },
  { feature: "Expense Management", standard: true, advanced: true },
  { feature: "School Website", standard: true, advanced: true },
  { feature: "Computer-based Testing / Examination (CBT/CBE)", standard: true, advanced: true },
  { feature: "HR / Payroll Management", standard: true, advanced: true },
  { feature: "Hostel Management", standard: false, advanced: true },
  { feature: "Transport Management", standard: false, advanced: true },
  { feature: "LMS (Live class sessions online,online courses etc.)", standard: false, advanced: true },
  { feature: "Students E-Portal", standard: false, advanced: true },
  { feature: "Library Management", standard: false, advanced: true },
  { feature: "Students Graduation, Transcripts & Alumni", standard: false, advanced: true },
];
