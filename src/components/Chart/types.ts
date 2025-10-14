export interface ChartData {
  name: string; // e.g., 'Pr 1', 'JSS 1', 'SS 3'
  Paid: number; // The absolute NGN value for 'Paid'
  Unpaid: number; // The absolute NGN value for 'Unpaid'
  Total: number; // The sum of Paid and Unpaid (used for proportional scaling)
}
