import { addInvoiceSetting } from "@/api/invoice";
import { invoiceKey } from "@/queries/invoice";
import { useMutation } from "@tanstack/react-query";

export const useAddInvoiceSetting = () => {
  return useMutation({
    mutationKey: invoiceKey.addInvoiceSetting,
    mutationFn: addInvoiceSetting,
  });
};
