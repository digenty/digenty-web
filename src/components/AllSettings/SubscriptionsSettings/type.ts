export type SubscriptionView = "dashboard" | "plans" | "upgrade" | "subscribe" | "add-students";

export type BillingCycle = "Termly" | "Yearly";

export type StudentTier = "1-200" | "201-400" | "401+";

export type PlanName = "Standard" | "Advanced";

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

export const PRICE_PER_STUDENT: Record<PlanName, number> = {
  Standard: 1000,
  Advanced: 1350,
};

export const STANDARD_FEATURES = ["Computer-based testing and examination", "School Website", "Students Attendance Management", "16+ modules"];

export const ADVANCED_FEATURES = ["Everything in Standard,", "Live class sessions and online courses", "Transport management", "20+ modules"];

export const billingHistoryData: BillingHistoryRow[] = [
  { period: "Jan 1, 2025 – Jan 31, 2025", plan: "Premium", status: "Paid", amount: 50000 },
  { period: "Jan 1, 2025 – Jan 31, 2025", plan: "Premium", status: "Paid", amount: 50000 },
  { period: "Jan 1, 2025 – Jan 31, 2025", plan: "Premium", status: "Failed", amount: 50000 },
];

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
