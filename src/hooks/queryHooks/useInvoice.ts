import {
  createInvoiceSettings,
  CreateInvoiceSettingsPayload,
  getInvoiceSettings,
  updateInvoiceSettings,
  UpdateInvoiceSettingsPayload,
} from "@/api/invoice";
import { invoiceKeys } from "@/queries/invoice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetInvoiceSettings = () =>
  useQuery({
    queryKey: invoiceKeys.settings(),
    queryFn: () => getInvoiceSettings(),
    retry: false,
  });

export const useCreateInvoiceSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateInvoiceSettingsPayload) => createInvoiceSettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.settings() });
    },
  });
};

export const useUpdateInvoiceSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ invoiceId, payload }: { invoiceId: number; payload: UpdateInvoiceSettingsPayload }) =>
      updateInvoiceSettings(invoiceId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.settings() });
    },
  });
};
