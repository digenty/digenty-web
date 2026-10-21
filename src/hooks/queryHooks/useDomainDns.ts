import { addSpfInclude, createDnsRecord, deleteDnsRecord, getDnsRecords, getEmailSetup, postEmailSetup } from "@/api/domainDns";
import { domainKeys } from "@/queries/domain";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// The status endpoint makes live DNS lookups, so never poll faster than this.
const EMAIL_STATUS_POLL_MS = 45 * 1000;

export const useEmailSetupStatus = (purchaseId: string) => {
  return useQuery({
    queryKey: domainKeys.emailSetup(purchaseId),
    queryFn: () => getEmailSetup(purchaseId),
    retry: false,
    staleTime: 0,
    refetchInterval: query => (query.state.data?.components.some(c => c.state === "PROPAGATING") ? EMAIL_STATUS_POLL_MS : false),
  });
};

export const useEmailSetup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: domainKeys.emailSetupSubmit,
    mutationFn: postEmailSetup,
    onSuccess: (_data, { purchaseId }) => {
      queryClient.invalidateQueries({ queryKey: domainKeys.emailSetup(purchaseId) });
      queryClient.invalidateQueries({ queryKey: domainKeys.dnsRecords(purchaseId) });
    },
  });
};

export const useDnsRecords = (purchaseId: string, enabled = true) => {
  return useQuery({
    queryKey: domainKeys.dnsRecords(purchaseId),
    queryFn: () => getDnsRecords(purchaseId),
    retry: false,
    enabled,
  });
};

export const useCreateDnsRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: domainKeys.createDnsRecord,
    mutationFn: createDnsRecord,
    onSuccess: (_data, { purchaseId }) => {
      queryClient.invalidateQueries({ queryKey: domainKeys.dnsRecords(purchaseId) });
      queryClient.invalidateQueries({ queryKey: domainKeys.emailSetup(purchaseId) });
    },
  });
};

export const useDeleteDnsRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: domainKeys.deleteDnsRecord,
    mutationFn: deleteDnsRecord,
    onSuccess: (_data, { purchaseId }) => {
      queryClient.invalidateQueries({ queryKey: domainKeys.dnsRecords(purchaseId) });
      queryClient.invalidateQueries({ queryKey: domainKeys.emailSetup(purchaseId) });
    },
  });
};

export const useAddSpfInclude = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: domainKeys.addSpfInclude,
    mutationFn: addSpfInclude,
    onSuccess: (_data, { purchaseId }) => {
      queryClient.invalidateQueries({ queryKey: domainKeys.dnsRecords(purchaseId) });
      queryClient.invalidateQueries({ queryKey: domainKeys.emailSetup(purchaseId) });
    },
  });
};
