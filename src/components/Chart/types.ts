import { SchoolOption } from "../../types";

export interface ChartData {
  name: string; // e.g., 'Pr 1', 'JSS 1', 'SS 3'
  paid: number; // The absolute NGN value for 'Paid'
  paid_abs: number; // The % value for 'Paid'
  unpaid: number; // The absolute NGN value for 'Unpaid'
  unpaid_abs: number; // The % value for 'Unpaid'
  total: number; // The sum of Paid and Unpaid (used for proportional scaling)
  group: SchoolOption;
}
