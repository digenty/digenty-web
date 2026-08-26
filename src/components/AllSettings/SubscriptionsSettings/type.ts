import { BillingStatus, PlanType, SubscriptionStatus } from "@/api/subscription";

export type BillingCycle = "Termly" | "Yearly";

export type StudentTier = "1-200" | "201-400" | "401+";

export type FeatureAvailability = boolean | string;

export interface PlanFeatureRow {
  feature: string;
  starter: FeatureAvailability;
  standard: FeatureAvailability;
  advanced: FeatureAvailability;
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

export const PLAN_PRICES: Record<StudentTier, Record<BillingCycle, { starter: number; standard: number; advanced: number }>> = {
  "1-200": {
    Yearly: { starter: 2500, standard: 3500, advanced: 4500 },
    Termly: { starter: 900, standard: 1200, advanced: 1500 },
  },
  "201-400": {
    Yearly: { starter: 2250, standard: 3250, advanced: 4250 },
    Termly: { starter: 800, standard: 1100, advanced: 1425 },
  },
  "401+": {
    Yearly: { starter: 2000, standard: 3000, advanced: 4000 },
    Termly: { starter: 700, standard: 1000, advanced: 1350 },
  },
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
  { feature: "Dashboard", starter: true, standard: true, advanced: true },
  { feature: "Student & Parent Records", starter: true, standard: true, advanced: true },
  { feature: "Classes & Subjects", starter: true, standard: true, advanced: true },
  { feature: "Attendance", starter: true, standard: true, advanced: true },
  { feature: "Communication", starter: true, standard: true, advanced: true },
  { feature: "Settings", starter: true, standard: true, advanced: true },
  { feature: "Referrals", starter: true, standard: true, advanced: true },
  { feature: "Admission Management", starter: true, standard: true, advanced: true },
  { feature: "Invoices", starter: true, standard: true, advanced: true },
  { feature: "Fees", starter: true, standard: true, advanced: true },
  { feature: "Fee Collection", starter: true, standard: true, advanced: true },
  { feature: "Expenses", starter: true, standard: true, advanced: true },
  { feature: "Stock", starter: true, standard: true, advanced: true },
  { feature: "Finance Report", starter: true, standard: true, advanced: true },
  { feature: "Portal Overview", starter: true, standard: true, advanced: true },
  { feature: "Portal Customization", starter: true, standard: true, advanced: true },
  { feature: "Domain", starter: true, standard: true, advanced: true },
  { feature: "CBT", starter: false, standard: "100 AI imports / school / term", advanced: "150 AI imports / school / term" },
  // Roadmap features — not sold as modules until built, so not offered on Starter/Standard yet;
  // Advanced (coming soon) is slated to ship with all of them.
  { feature: "Online Assignments / Lesson Notes", starter: false, standard: false, advanced: true },
  { feature: "HR / Payroll Management", starter: false, standard: false, advanced: true },
  { feature: "Hostel Management", starter: false, standard: false, advanced: true },
  { feature: "Transport Management", starter: false, standard: false, advanced: true },
  { feature: "LMS (live classes, online courses)", starter: false, standard: false, advanced: true },
  { feature: "Students E-Portal", starter: false, standard: false, advanced: true },
  { feature: "Library Management", starter: false, standard: false, advanced: true },
  { feature: "Graduation, Transcripts & Alumni", starter: false, standard: false, advanced: true },
];
