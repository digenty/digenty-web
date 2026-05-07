import {
  createFeeGroup,
  createFeeItem,
  deleteFee,
  deleteFeeGroup,
  deleteFeeItem,
  FeeGroupDto,
  FeeItemDto,
  FeeTermType,
  getFeeClassOverview,
  getFeeGroupById,
  getFeeGroups,
  getFeeGroupsForPicker,
  getFeeItemById,
  getFeeItems,
  getFees,
  getFeesForPicker,
  getFeeById,
  getFeeRoutes,
  publishFee,
  updateFeeGroup,
} from "@/api/fee";
import { feeKeys } from "@/queries/fee";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ── Class Fee Overview ──────────────────────────────────────────────────────

export const useGetFeeClassOverview = (sessionId?: number, term?: FeeTermType, branchId?: number) => {
  return useQuery({
    queryKey: feeKeys.feeClassOverview(sessionId, term, branchId),
    queryFn: () => getFeeClassOverview(sessionId!, term!, branchId),
    enabled: !!sessionId && !!term,
  });
};

// ── Class Fees ──────────────────────────────────────────────────────────────

export const useGetFees = (termId?: number) => {
  return useQuery({
    queryKey: feeKeys.fees(termId),
    queryFn: () => getFees(termId),
  });
};

export const useGetFeeById = (id?: number) => {
  return useQuery({
    queryKey: feeKeys.feeById(id),
    queryFn: () => getFeeById(id!),
    enabled: !!id,
  });
};

export const useDeleteFee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: feeKeys.deleteFee,
    mutationFn: (id: number) => deleteFee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fees"] });
      queryClient.invalidateQueries({ queryKey: ["feeClassOverview"] });
    },
  });
};

export const usePublishFee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => publishFee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fees"] });
    },
  });
};

// ── Fee Items ───────────────────────────────────────────────────────────────

export const useGetFeeItems = (branchId?: number, termId?: number) => {
  return useQuery({
    queryKey: feeKeys.feeItems(branchId, termId),
    queryFn: () => getFeeItems(branchId, termId),
  });
};

export const useGetFeeItemById = (id?: number) => {
  return useQuery({
    queryKey: feeKeys.feeItemById(id),
    queryFn: () => getFeeItemById(id!),
    enabled: !!id,
  });
};

export const useCreateFeeItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: feeKeys.createFeeItem,
    mutationFn: (payload: FeeItemDto) => createFeeItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeItems"] });
      queryClient.invalidateQueries({ queryKey: ["feeClassOverview"] });
    },
  });
};

export const useDeleteFeeItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: feeKeys.deleteFeeItem,
    mutationFn: (id: number) => deleteFeeItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeItems"] });
    },
  });
};

// ── Fee Groups ──────────────────────────────────────────────────────────────

export const useGetFeeGroups = (branchId?: number) => {
  return useQuery({
    queryKey: feeKeys.feeGroups(branchId),
    queryFn: () => getFeeGroups(branchId),
  });
};

export const useGetFeeGroupById = (id?: number) => {
  return useQuery({
    queryKey: feeKeys.feeGroupById(id),
    queryFn: () => getFeeGroupById(id!),
    enabled: !!id,
  });
};

export const useCreateFeeGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: feeKeys.createFeeGroup,
    mutationFn: (payload: FeeGroupDto) => createFeeGroup(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeGroups"] });
    },
  });
};

export const useUpdateFeeGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: feeKeys.updateFeeGroup,
    mutationFn: ({ id, payload }: { id: number; payload: FeeGroupDto }) => updateFeeGroup(id, payload),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: feeKeys.feeGroupById(id) });
      queryClient.invalidateQueries({ queryKey: ["feeGroups"] });
    },
  });
};

export const useDeleteFeeGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: feeKeys.deleteFeeGroup,
    mutationFn: (id: number) => deleteFeeGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeGroups"] });
    },
  });
};

// ── Pickers ─────────────────────────────────────────────────────────────────

export const useGetFeesForPicker = (branchId?: number, classId?: number, termId?: number) => {
  return useQuery({
    queryKey: feeKeys.feesForPicker(branchId, classId, termId),
    queryFn: () => getFeesForPicker(branchId!, classId, termId),
    enabled: !!branchId,
  });
};

export const useGetFeeGroupsForPicker = (branchId?: number, search?: string) => {
  return useQuery({
    queryKey: feeKeys.feeGroupsForPicker(branchId, search),
    queryFn: () => getFeeGroupsForPicker(branchId!, search),
    enabled: !!branchId,
  });
};

// ── Fee Routes ──────────────────────────────────────────────────────────────

export const useGetFeeRoutes = () => {
  return useQuery({
    queryKey: feeKeys.feeRoutes,
    queryFn: getFeeRoutes,
  });
};
