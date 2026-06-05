import {
  CampaignEstimateRequest,
  CampaignListParams,
  CampaignPayRequest,
  cancelCampaignSchedule,
  createCampaign,
  CreateCampaignRequest,
  deleteCampaign,
  duplicateCampaign,
  estimateCampaign,
  getCampaignById,
  getCampaignOverview,
  getCampaigns,
  getSmsCount,
  payForCampaign,
  resendCampaign,
  retryCampaign,
  scheduleCampaign,
  ScheduleCampaignRequest,
  SmsCountRequest,
  updateCampaign,
  UpdateCampaignRequest,
} from "@/api/campaign";
import { campaignKeys } from "@/queries/campaign";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/* --------------------------------- Queries -------------------------------- */

export const useGetCampaigns = (params: CampaignListParams = {}) => {
  return useQuery({
    queryKey: campaignKeys.list(params),
    queryFn: () => getCampaigns(params),
    retry: false,
  });
};

export const useGetCampaignOverview = () => {
  return useQuery({
    queryKey: campaignKeys.overview,
    queryFn: getCampaignOverview,
    retry: false,
  });
};

export const useGetCampaign = (id?: number) => {
  return useQuery({
    queryKey: campaignKeys.detail(id ?? 0),
    queryFn: () => getCampaignById(id as number),
    enabled: !!id,
    retry: false,
  });
};

/* -------------------------------- Mutations ------------------------------- */

const useInvalidateCampaigns = () => {
  const queryClient = useQueryClient();
  return (id?: number) => {
    queryClient.invalidateQueries({ queryKey: campaignKeys.all });
    queryClient.invalidateQueries({ queryKey: campaignKeys.overview });
    if (id) queryClient.invalidateQueries({ queryKey: campaignKeys.detail(id) });
  };
};

export const useCreateCampaign = () => {
  const invalidate = useInvalidateCampaigns();
  return useMutation({
    mutationKey: campaignKeys.create,
    mutationFn: (payload: CreateCampaignRequest) => createCampaign(payload),
    onSuccess: () => invalidate(),
  });
};

export const useUpdateCampaign = (id: number) => {
  const invalidate = useInvalidateCampaigns();
  return useMutation({
    mutationKey: campaignKeys.update,
    mutationFn: (payload: UpdateCampaignRequest) => updateCampaign(id, payload),
    onSuccess: () => invalidate(id),
  });
};

export const useDeleteCampaign = () => {
  const invalidate = useInvalidateCampaigns();
  return useMutation({
    mutationKey: campaignKeys.delete,
    mutationFn: (id: number) => deleteCampaign(id),
    onSuccess: () => invalidate(),
  });
};

export const useScheduleCampaign = (id: number) => {
  const invalidate = useInvalidateCampaigns();
  return useMutation({
    mutationKey: campaignKeys.schedule,
    mutationFn: (payload: ScheduleCampaignRequest) => scheduleCampaign(id, payload),
    onSuccess: () => invalidate(id),
  });
};

export const useCancelCampaignSchedule = () => {
  const invalidate = useInvalidateCampaigns();
  return useMutation({
    mutationKey: campaignKeys.cancelSchedule,
    mutationFn: (id: number) => cancelCampaignSchedule(id),
    onSuccess: (_, id) => invalidate(id),
  });
};

export const useRetryCampaign = () => {
  const invalidate = useInvalidateCampaigns();
  return useMutation({
    mutationKey: campaignKeys.retry,
    mutationFn: (id: number) => retryCampaign(id),
    onSuccess: (_, id) => invalidate(id),
  });
};

export const useResendCampaign = () => {
  const invalidate = useInvalidateCampaigns();
  return useMutation({
    mutationKey: campaignKeys.resend,
    mutationFn: ({ id, payload }: { id: number; payload?: CampaignPayRequest }) => resendCampaign(id, payload),
    onSuccess: (_, { id }) => invalidate(id),
  });
};

export const usePayForCampaign = () => {
  return useMutation({
    mutationKey: campaignKeys.pay,
    mutationFn: ({ id, payload }: { id: number; payload?: CampaignPayRequest }) => payForCampaign(id, payload),
    // No onSuccess invalidation — pay redirects to Paystack and campaign status only
    // changes after the webhook fires. Cache is refreshed on return via paymentReference effect.
  });
};

export const useDuplicateCampaign = () => {
  const invalidate = useInvalidateCampaigns();
  return useMutation({
    mutationKey: campaignKeys.duplicate,
    mutationFn: (id: number) => duplicateCampaign(id),
    onSuccess: () => invalidate(),
  });
};

export const useSmsCount = () => {
  return useMutation({
    mutationKey: campaignKeys.smsCount,
    mutationFn: (payload: SmsCountRequest) => getSmsCount(payload),
  });
};

export const useEstimateCampaign = () => {
  return useMutation({
    mutationKey: campaignKeys.estimate,
    mutationFn: (payload: CampaignEstimateRequest) => estimateCampaign(payload),
  });
};
