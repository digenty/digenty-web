import { getFeeOverview, getInvoice, getParentPaymentHistory, getPayFeesData, PayFeeRequest, recordPayment } from "@/api/parent-fees";
import { parentFeesKeys } from "@/queries/parent-fees";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isNotFoundError } from "@/lib/academicStructureCache";
import { parentKeys } from "@/queries/parent";
import { parentStudentsKeys } from "@/queries/parent-students";

// "Student not found" means the school deleted this child: refresh the parent's children so the child drops out of the
// picker (StudentFilter then moves to the next child), then let the screen show the error as usual.
const useDropDeletedChild = () => {
  const queryClient = useQueryClient();
  return <T>(fetch: () => Promise<T>) =>
    async () => {
      try {
        return await fetch();
      } catch (error) {
        if (isNotFoundError(error)) {
          queryClient.invalidateQueries({ queryKey: parentKeys.getMyProfile });
          queryClient.invalidateQueries({ queryKey: parentStudentsKeys.all });
        }
        throw error;
      }
    };
};

export const useGetFeeOverview = (studentId?: number, termId?: number) => {
  const dropDeletedChild = useDropDeletedChild();
  return useQuery({
    queryKey: parentFeesKeys.overview(studentId, termId),
    queryFn: dropDeletedChild(() => getFeeOverview(studentId!, termId)),
    enabled: !!studentId,
    retry: false,
  });
};

export const useGetPayFeesData = (studentId?: number, termId?: number) => {
  const dropDeletedChild = useDropDeletedChild();
  return useQuery({
    queryKey: parentFeesKeys.pay(studentId, termId),
    queryFn: dropDeletedChild(() => getPayFeesData(studentId!, termId)),
    enabled: !!studentId,
    retry: false,
  });
};

export const useGetInvoice = (studentId?: number, termId?: number) => {
  const dropDeletedChild = useDropDeletedChild();
  return useQuery({
    queryKey: parentFeesKeys.invoice(studentId, termId),
    queryFn: dropDeletedChild(() => getInvoice(studentId!, termId)),
    enabled: !!studentId,
    retry: false,
  });
};

export const useGetParentPaymentHistory = (studentId?: number, termId?: number, page = 0, size = 10) => {
  const dropDeletedChild = useDropDeletedChild();
  return useQuery({
    queryKey: parentFeesKeys.paymentHistory(studentId, termId, page, size),
    queryFn: dropDeletedChild(() => getParentPaymentHistory(studentId!, termId, page, size)),
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
