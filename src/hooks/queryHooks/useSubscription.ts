import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelSubscription,
  checkoutSubscription,
  createSubscription,
  getActiveSubscription,
  getBillingHistory,
  getCurrentSubscription,
  getPlans,
  renewSubscription,
  updateSubscription,
  verifySubscription,
} from "@/api/subscription";
import { subscriptionKeys } from "@/queries/subscription";

export const useGetCurrentSubscription = () => {
  return useQuery({
    queryKey: subscriptionKeys.current,
    queryFn: getCurrentSubscription,
    retry: false,
  });
};

export const useGetActiveSubscription = () => {
  return useQuery({
    queryKey: subscriptionKeys.active,
    queryFn: getActiveSubscription,
    retry: false,
  });
};

export const useGetPlans = () => {
  return useQuery({
    queryKey: [subscriptionKeys.plans],
    queryFn: getPlans,
    retry: false,
  });
};

export const useGetBillingHistory = ({ page, size }: { page: number; size: number }) => {
  return useQuery({
    queryKey: subscriptionKeys.billingHistory(page, size),
    queryFn: () => getBillingHistory({ page, size }),
    retry: false,
  });
};

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: subscriptionKeys.create,
    mutationFn: createSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.current });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.active });
      queryClient.invalidateQueries({ queryKey: ["subscriptionBillingHistory"] });
    },
  });
};

export const useCheckoutSubscription = () => {
  return useMutation({
    mutationKey: subscriptionKeys.checkout,
    mutationFn: checkoutSubscription,
  });
};

export const useVerifySubscription = (reference: string) => {
  const queryClient = useQueryClient();
  const result = useQuery({
    queryKey: subscriptionKeys.verify(reference),
    queryFn: () => verifySubscription(reference),
    enabled: !!reference,
    staleTime: Infinity,
    retry: false,
  });

  useEffect(() => {
    if (result.isSuccess) {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.current });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.active });
      queryClient.invalidateQueries({ queryKey: ["subscriptionBillingHistory"] });
    }
  }, [result.isSuccess, queryClient]);

  return result;
};

export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: subscriptionKeys.update,
    mutationFn: ({ id, ...payload }: { id: number; planId?: number; studentCapacity?: number }) => updateSubscription(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.current });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.active });
    },
  });
};

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: subscriptionKeys.cancel,
    mutationFn: (id: number) => cancelSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.current });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.active });
    },
  });
};

export const useRenewSubscription = () => {
  return useMutation({
    mutationKey: subscriptionKeys.renew,
    mutationFn: (id: number) => renewSubscription(id),
  });
};
