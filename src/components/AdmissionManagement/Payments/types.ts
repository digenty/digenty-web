export type PaymentStatus = "Paid" | "Pending" | "Overdue";

export type FeeType = "Examination Fee" | "Entrance Fee" | "Application Fee";

export interface PaymentRecord {
  id: string;
  studentName: string;
  image?: string;
  applicantId: string;
  className: string;
  fee: FeeType;
  amount: number;
  status: PaymentStatus;
  date: string;
}
