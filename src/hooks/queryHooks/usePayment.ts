import { getStudentInvoice, initiatePayment, PaymentRequestDto, StudentInvoiceDto } from "@/api/payment";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useInitiatePayment = () => {
  return useMutation({
    mutationFn: (payload: PaymentRequestDto) => initiatePayment(payload),
  });
};

const isSettledStatus = (status?: StudentInvoiceDto["status"]) => status === "PAID" || status === "FULLY_PAID";

// Polls the invoice snapshot while the Paystack webhook reconciles the payment.
// Stops once the invoice is fully settled. `maxAttempts` bounds how long we wait.
export const useVerifyPaymentInvoice = (invoiceId?: number, maxAttempts = 12) => {
  return useQuery({
    queryKey: ["paymentInvoice", invoiceId],
    queryFn: () => getStudentInvoice(invoiceId!),
    enabled: !!invoiceId,
    retry: false,
    refetchInterval: query => {
      const data = query.state.data as StudentInvoiceDto | undefined;
      if (isSettledStatus(data?.status)) return false;
      if (query.state.dataUpdateCount >= maxAttempts) return false;
      return 2500;
    },
  });
};
