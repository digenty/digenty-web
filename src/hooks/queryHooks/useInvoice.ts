import { addPayment, AddPaymentPayload, createInvoice, createInvoiceDraft, CreateInvoicePayload, createInvoiceSettings, CreateInvoiceSettingsPayload, deleteInvoice, getInvoiceDetail, getInvoicesByBranch, getInvoiceSettings, getNextInvoiceNumber, getPaymentHistory, sendInvoiceReminder, updateInvoice, UpdateInvoicePayload, updateInvoiceSettings, UpdateInvoiceSettingsPayload, updatePayment } from "@/api/invoice";
import { invoiceKeys } from "@/queries/invoice";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetInvoices = ({
  branchId,
  page,
  size,
  classId,
  termId,
  search,
}: {
  branchId?: number;
  page: number;
  size: number;
  classId?: number;
  termId?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: invoiceKeys.byBranch(branchId, page, size, classId, termId, search),
    queryFn: () => getInvoicesByBranch({ branchId: branchId as number, page, size, classId, termId, search }),
    enabled: !!branchId,
    placeholderData: keepPreviousData,
  });
};

export const useGetInvoiceDetail = (invoiceId?: string) => {
  return useQuery({
    queryKey: invoiceKeys.detail(invoiceId),
    queryFn: () => getInvoiceDetail(invoiceId as string),
    enabled: !!invoiceId,
  });
};

export const useAddPayment = (invoiceId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: invoiceKeys.addPayment(invoiceId),
    mutationFn: (payload: AddPaymentPayload) => addPayment(invoiceId as string, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.detail(invoiceId) });
    },
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: invoiceKeys.create,
    mutationFn: (payload: CreateInvoicePayload) => createInvoice(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.all });
    },
  });
};

export const useCreateInvoiceDraft = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: invoiceKeys.draft,
    mutationFn: (payload: CreateInvoicePayload) => createInvoiceDraft(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.all });
    },
  });
};

export const useUpdateInvoice = (invoiceId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: invoiceKeys.update(invoiceId),
    mutationFn: (payload: UpdateInvoicePayload) => updateInvoice(invoiceId as string, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.all });
      queryClient.invalidateQueries({ queryKey: invoiceKeys.detail(invoiceId) });
    },
  });
};

export const useGetNextInvoiceNumber = (branchId?: number) =>
  useQuery({
    queryKey: invoiceKeys.nextNumber(branchId),
    queryFn: () => getNextInvoiceNumber(branchId!),
    enabled: !!branchId,
  });

export const useGetInvoiceSettings = (branchId?: number) =>
  useQuery({
    queryKey: invoiceKeys.settings(branchId),
    queryFn: () => getInvoiceSettings(branchId!),
    enabled: !!branchId,
  });

export const useCreateInvoiceSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateInvoiceSettingsPayload) => createInvoiceSettings(payload),
    onSuccess: (_, v) => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.settings(v.branchId) });
    },
  });
};

export const useUpdateInvoiceSettings = (branchId?: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateInvoiceSettingsPayload) => updateInvoiceSettings(branchId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.settings(branchId) });
    },
  });
};

export const useGetPaymentHistory = (invoiceId?: string, page = 0, size = 10) =>
  useQuery({
    queryKey: [...invoiceKeys.paymentHistory(invoiceId), page, size],
    queryFn: () => getPaymentHistory(invoiceId!, page, size),
    enabled: !!invoiceId,
    placeholderData: keepPreviousData,
  });

export const useSendInvoiceReminder = () => {
  return useMutation({
    mutationFn: (invoiceId: string) => sendInvoiceReminder(invoiceId),
  });
};

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (invoiceId: string) => deleteInvoice(invoiceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.all });
    },
  });
};

export const useUpdatePayment = (invoiceId?: string, paymentId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: invoiceKeys.updatePayment(invoiceId, paymentId),
    mutationFn: (payload: AddPaymentPayload) => updatePayment(invoiceId as string, paymentId as string, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.detail(invoiceId) });
    },
  });
};
