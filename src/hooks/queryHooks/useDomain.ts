import { useRef } from "react";
import { DomainPurchaseStatus, checkDomainAvailability, getDomainPurchase, getDomainPurchases, purchaseAndConnectDomain } from "@/api/domain";
import { domainKeys, isDomainPurchaseInFlight } from "@/queries/domain";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Matches the backend's polling sweep — polling faster just burns requests without learning
// anything sooner. If the status hasn't moved in this long, stop polling and let the UI fall
// back to "we'll email you" — provisioning can run past two hours, so an indefinite spinner reads
// as broken long before then.
const POLL_INTERVAL_MS = 2 * 60 * 1000;
const STALL_THRESHOLD_MS = 10 * 60 * 1000;

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
// Also stops (but doesn't error) if the status hasn't moved in STALL_THRESHOLD_MS, since a
// two-hour operation has long stretches where there's nothing new to learn from polling.
export const useDomainPurchase = (purchaseId?: string) => {
  const lastChange = useRef<{ status: DomainPurchaseStatus | null; at: number }>({ status: null, at: Date.now() });

  const query = useQuery({
    queryKey: domainKeys.purchase(purchaseId ?? ""),
    queryFn: () => getDomainPurchase(purchaseId as string),
    enabled: !!purchaseId,
    retry: false,
    refetchInterval: query => {
      const status = query.state.data?.status;
      if (!status || !isDomainPurchaseInFlight(status)) return false;
      if (lastChange.current.status !== status) lastChange.current = { status, at: Date.now() };
      return Date.now() - lastChange.current.at > STALL_THRESHOLD_MS ? false : POLL_INTERVAL_MS;
    },
  });

  const status = query.data?.status;
  if (status && lastChange.current.status !== status) lastChange.current = { status, at: Date.now() };
  const isStalled = !!status && isDomainPurchaseInFlight(status) && Date.now() - lastChange.current.at > STALL_THRESHOLD_MS;

  return { ...query, isStalled };
};

export const useDomainPurchases = () => {
  return useQuery({
    queryKey: domainKeys.purchases,
    queryFn: getDomainPurchases,
    retry: false,
  });
};
