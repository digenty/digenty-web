import { SchoolOption } from "../../types";

export interface ChartData {
  name: string; // e.g., 'Pr 1', 'JSS 1', 'SS 3'
  paid: number; // The % value for 'Paid'
  paid_abs: number; // The absolute NGN value for 'Paid'
  unpaid: number; // The % value for 'Unpaid'
  unpaid_abs: number; // The absolute NGN value for 'Unpaid'
  total: number; // The billed amount (used for proportional scaling)
  level: string;
}
