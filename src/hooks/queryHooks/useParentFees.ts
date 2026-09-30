import { getFeeOverview, getInvoice, getParentPaymentHistory, getPayFeesData, PayFeeRequest, recordPayment } from "@/api/parent-fees";
import { parentFeesKeys } from "@/queries/parent-fees";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetFeeOverview = (studentId?: number, termId?: number) => {
  return useQuery({
    queryKey: parentFeesKeys.overview(studentId, termId),
    queryFn: () => getFeeOverview(studentId!, termId),
    enabled: !!studentId,
    retry: false,
  });
};

export const useGetPayFeesData = (studentId?: number, termId?: number) => {
  return useQuery({
    queryKey: parentFeesKeys.pay(studentId, termId),
    queryFn: () => getPayFeesData(studentId!, termId),
    enabled: !!studentId,
    retry: false,
  });
};

export const useGetInvoice = (studentId?: number, termId?: number) => {
  return useQuery({
    queryKey: parentFeesKeys.invoice(studentId, termId),
    queryFn: () => getInvoice(studentId!, termId),
    enabled: !!studentId,
    retry: false,
  });
};

export const useGetParentPaymentHistory = (studentId?: number, termId?: number, page = 0, size = 10) => {
  return useQuery({
    queryKey: parentFeesKeys.paymentHistory(studentId, termId, page, size),
    queryFn: () => getParentPaymentHistory(studentId!, termId, page, size),
    enabled: !!studentId,
    retry: false,
    placeholderData: keepPreviousData,
  });
};

export const useRecordPayment = (studentId?: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PayFeeRequest) => recordPayment(studentId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parentFeeOverview", studentId] });
      queryClient.invalidateQueries({ queryKey: ["parentPayFees", studentId] });
      queryClient.invalidateQueries({ queryKey: ["parentFeeInvoice", studentId] });
      queryClient.invalidateQueries({ queryKey: ["parentPaymentHistory", studentId] });
    },
  });
};
