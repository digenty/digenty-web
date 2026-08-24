import { ClassPaymentCompletionResponse } from "@/api/dashboard";
import { ChartData } from "./types";

export const mapToChartData = (response?: ClassPaymentCompletionResponse): ChartData[] => {
  if (!response) return [];

  return response.classes.map(cls => ({
    name: cls.className,
    paid: cls.paidPercentage,
    paid_abs: cls.paidAmount,
    unpaid: cls.unpaidPercentage,
    unpaid_abs: cls.outstandingAmount,
    total: cls.billedAmount,
    level: cls.levelType,
  }));
};
