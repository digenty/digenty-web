export type AlertSeverity = "SUCCESS" | "WARNING" | "INFO";

export type DashboardAlertType = "PAYMENT_COMPLETED" | "PAYMENT_OUTSTANDING";

export type DashboardAlert = {
  type: DashboardAlertType;
  severity: AlertSeverity;
  classId: number;
  className: string;
  title: string;
  message: string;
  outstandingAmount: number;
  studentsBilled: number;
  studentsOwing: number;
};
