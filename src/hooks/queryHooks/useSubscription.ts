import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSubscription, getActiveSubscription, getBillingHistory, getCurrentSubscription, getPlans } from "@/api/subscription";
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
