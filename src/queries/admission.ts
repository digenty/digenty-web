import { ApplicantsFilters, CycleStatus, PaymentsFilters } from "@/api/admission";

export const admissionKeys = {
  add: ["addAmissionNumber"] as const,
  get: ["getAdmissionDetails"] as const,
  update: ["updateAdmissionDetails"] as const,
  generate: ["generateAdmissionNumber"] as const,
};

export const admissionCycleKeys = {
  all: ["admissionCycles"] as const,
  list: (status?: CycleStatus) => ["admissionCycles", "list", status ?? "all"] as const,
  detail: (cycleId: number) => ["admissionCycles", "detail", cycleId] as const,
  report: (cycleId: number) => ["admissionCycles", "report", cycleId] as const,

  levels: (cycleId: number, branchId?: number) => ["admissionCycles", cycleId, "levels", branchId ?? "all"] as const,
  levelConfig: (cycleId: number, levelId: number, branchId?: number) => ["admissionCycles", cycleId, "levels", levelId, branchId ?? "all"] as const,

  classes: (cycleId: number, levelId: number, branchId?: number) => ["admissionCycles", cycleId, "levels", levelId, "classes", branchId ?? "all"] as const,
  classConfig: (cycleId: number, levelId: number, classId: number, branchId?: number) =>
    ["admissionCycles", cycleId, "levels", levelId, "classes", classId, branchId ?? "all"] as const,

  applicants: (cycleId: number, filters?: ApplicantsFilters) => ["admissionCycles", cycleId, "applicants", filters ?? {}] as const,
  applicantsByClass: (cycleId: number, branchId?: number) => ["admissionCycles", cycleId, "applicants", "by-class", branchId ?? "all"] as const,
  applicantDetail: (cycleId: number, applicantId: number) => ["admissionCycles", cycleId, "applicants", applicantId] as const,
  applicantScores: (cycleId: number, applicantId: number) => ["admissionCycles", cycleId, "applicants", applicantId, "scores"] as const,
  applicantDocument: (cycleId: number, applicantId: number, docId: number) =>
    ["admissionCycles", cycleId, "applicants", applicantId, "documents", docId] as const,

  dashboardOverview: (cycleId: number, branchId?: number) => ["admissionCycles", cycleId, "dashboard", "overview", branchId ?? "all"] as const,
  dashboardByClass: (cycleId: number, branchId?: number) => ["admissionCycles", cycleId, "dashboard", "by-class", branchId ?? "all"] as const,
  dashboardByStatus: (cycleId: number, branchId?: number) => ["admissionCycles", cycleId, "dashboard", "by-status", branchId ?? "all"] as const,

  payments: (cycleId: number, filters?: PaymentsFilters) => ["admissionCycles", cycleId, "payments", filters ?? {}] as const,
  paymentsSummary: (cycleId: number, branchId?: number) => ["admissionCycles", cycleId, "payments", "summary", branchId ?? "all"] as const,
  paymentReceipt: (cycleId: number, paymentId: number) => ["admissionCycles", cycleId, "payments", paymentId, "receipt"] as const,
};
