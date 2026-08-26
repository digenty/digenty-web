import { checkDomainAvailability, getDomainPurchase, getDomainPurchases, purchaseAndConnectDomain } from "@/api/domain";
import { domainKeys, isDomainPurchaseInFlight } from "@/queries/domain";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCheckDomainAvailability = () => {
  return useMutation({
    mutationKey: domainKeys.check,
    mutationFn: checkDomainAvailability,
  });
};

export const usePurchaseAndConnectDomain = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: domainKeys.purchaseAndConnect,
    mutationFn: purchaseAndConnectDomain,
    onSuccess: data => {
      // Seed the individual-purchase cache so the progress card can render immediately
      // from the 202 response instead of waiting on a refetch.
      queryClient.setQueryData(domainKeys.purchase(data.purchaseId), data);
      queryClient.invalidateQueries({ queryKey: domainKeys.purchases });
    },
  });
};

// Polls while the purchase is in-flight and stops automatically once it hits a terminal
// status (LIVE or any failure) — provisioning is genuinely slow, so this drives a progress UI.
export const useDomainPurchase = (purchaseId?: string) => {
  return useQuery({
    queryKey: domainKeys.purchase(purchaseId ?? ""),
    queryFn: () => getDomainPurchase(purchaseId as string),
    enabled: !!purchaseId,
    retry: false,
    refetchInterval: query => (query.state.data && isDomainPurchaseInFlight(query.state.data.status) ? 5000 : false),
  });
};

export const useDomainPurchases = () => {
  return useQuery({
    queryKey: domainKeys.purchases,
    queryFn: getDomainPurchases,
    retry: false,
  });
};
