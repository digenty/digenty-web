import type { PaymentMethod } from "@/api/invoice";
import { Bank, BankCard, Cash, Folder3 } from "@digenty/icons";

export const payMethod: { label: string; value: PaymentMethod; icon: typeof Bank }[] = [
  { label: "Bank Transfer - Terminal", value: "BANK_TRANSFER_TERMINAL", icon: Bank },
  { label: "Cash", value: "CASH", icon: Cash },
  { label: "POS", value: "POS", icon: BankCard },
  { label: "Bank Transfer", value: "BANK_TRANSFER", icon: Folder3 },
  { label: "Cheque", value: "CHEQUE", icon: Folder3 },
];
