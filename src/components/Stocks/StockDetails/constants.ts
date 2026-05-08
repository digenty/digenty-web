import { StockAdjustReason } from "@/api/stock";

export const ADJUST_REASON_LABELS: Record<StockAdjustReason, string> = {
  RESTOCK: "Restock",
  DONATION: "Donation",
  RETURNED: "Returned",
  CORRECTION_OF_PREVIOUS_ERROR: "Correction of Previous Error",
  TRANSFER_FROM_ANOTHER_BRANCH: "Transfer From Another Branch",
  RECOVERED_ITEMS: "Recovered Items",
};

export const INCREASE_REASONS: { value: StockAdjustReason; label: string }[] = [
  { value: "RESTOCK", label: "Restock" },
  { value: "DONATION", label: "Donation" },
  { value: "RETURNED", label: "Returned" },
  { value: "CORRECTION_OF_PREVIOUS_ERROR", label: "Correction of Previous Error" },
  { value: "TRANSFER_FROM_ANOTHER_BRANCH", label: "Transfer From Another Branch" },
  { value: "RECOVERED_ITEMS", label: "Recovered Items" },
];

export const DECREASE_REASONS: { value: string; label: string }[] = [
  { value: "SOLD", label: "Sold" },
  { value: "DAMAGED", label: "Damaged" },
  { value: "ISSUED_TO_TEACHER", label: "Issued to Teacher" },
  { value: "EXPIRED", label: "Expired" },
  { value: "LOST", label: "Lost" },
  { value: "TRANSFER_FROM_ANOTHER_BRANCH", label: "Transferred to Another Branch" },
  { value: "CORRECTION_OF_PREVIOUS_ERROR", label: "Correction of Previous Error" },
  { value: "DISPOSED", label: "Disposed (Old or Obsolete)" },
];
