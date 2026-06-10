import {
  addFeeGroupItem,
  createFeeGroup,
  createFeeItem,
  createFeeRoute,
  createMultiBranchFeeItem,
  createSingleArmFeeItem,
  deleteFee,
  deleteFeeGroup,
  deleteFeeItem,
  deleteFeeRoute,
  duplicateFeeItem,
  getFeeArms,
  getFeeById,
  getFeeClassOverview,
  getFeeGroupById,
  getFeeGroupOverview,
  getFeeGroups,
  getFeeItemById,
  getFeeItems,
  getFeeItemsByFee,
  getFeeRoutes,
  getFeeRoutesByBranch,
  getFees,
  publishFee,
  renameFeeClass,
  updateFeeGroup,
  updateFeeItem,
  updateFeeRoute,
  FeeGroupDto,
  FeeGroupItemDto,
  FeeItemDto,
  FeeItemsFilter,
  FeeRouteRequestDto,
  FeeRouteResponseDto,
  FeeTermType,
  MultiBranchFeeItemDto,
  SingleArmFeeItemDto,
  UpdateFeeItemDto,
} from "@/api/fee";
import { feeKeys } from "@/queries/fee";
import { feeCollectionKeys } from "@/queries/fee-collection";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ---- Fee class ----
export const useGetFeeClassOverview = (sessionId: number, term: FeeTermType, branchId?: number) => {
  return useQuery({
    queryKey: feeKeys.feeClassOverview(sessionId, term, branchId),
    queryFn: () => getFeeClassOverview(sessionId, term, branchId),
    enabled: !!sessionId && !!term,
    retry: false,
  });
};

export const useRenameFeeClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) => renameFeeClass(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeClassOverview"] });
      queryClient.invalidateQueries({ queryKey: feeKeys.fees });
    },
  });
};

// ---- Fees ----
export const useGetFees = (termId?: number) => {
  return useQuery({
    queryKey: feeKeys.feesByTerm(termId),
    queryFn: () => getFees(termId),
    retry: false,
  });
};

export const useGetFeeById = (id: number) => {
  return useQuery({
    queryKey: feeKeys.feeById(id),
    queryFn: () => getFeeById(id),
    enabled: !!id,
    retry: false,
  });
};

export const useGetFeeArms = (id: number) => {
  return useQuery({
    queryKey: feeKeys.feeArms(id),
    queryFn: () => getFeeArms(id),
    enabled: !!id,
    retry: false,
  });
};

export const useGetFeeItemsByFee = (id: number) => {
  return useQuery({
    queryKey: feeKeys.feeItemsByFee(id),
    queryFn: () => getFeeItemsByFee(id),
    enabled: !!id,
    retry: false,
  });
};

export const usePublishFee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => publishFee(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: feeKeys.fees });
      queryClient.invalidateQueries({ queryKey: feeKeys.feeById(id) });
    },
  });
};

export const useDeleteFee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteFee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feeKeys.fees });
    },
  });
};

// ---- Fee items ----
export const useGetFeeItems = (filter: FeeItemsFilter = {}) => {
  return useQuery({
    queryKey: feeKeys.feeItems(filter),
    queryFn: () => getFeeItems(filter),
    retry: false,
  });
};

export const useGetFeeItemById = (id: number) => {
  return useQuery({
    queryKey: feeKeys.feeItemById(id),
    queryFn: () => getFeeItemById(id),
    enabled: !!id,
    retry: false,
  });
};

export const useCreateFeeItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: FeeItemDto) => createFeeItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feeKeys.fees });
      queryClient.invalidateQueries({ queryKey: ["feeItems"] });
      queryClient.invalidateQueries({ queryKey: ["feeClassOverview"] });
    },
  });
};

export const useCreateSingleArmFeeItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ armId, payload }: { armId: number; payload: SingleArmFeeItemDto }) => createSingleArmFeeItem(armId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feeKeys.fees });
      queryClient.invalidateQueries({ queryKey: ["feeItems"] });
      queryClient.invalidateQueries({ queryKey: ["feeClassOverview"] });
    },
  });
};

export const useCreateMultiBranchFeeItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: MultiBranchFeeItemDto) => createMultiBranchFeeItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feeKeys.fees });
      queryClient.invalidateQueries({ queryKey: ["feeItems"] });
      queryClient.invalidateQueries({ queryKey: ["feeClassOverview"] });
    },
  });
};

export const useDeleteFeeItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteFeeItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeItems"] });
      queryClient.invalidateQueries({ queryKey: ["feeClassOverview"] });
    },
  });
};

export const useUpdateFeeItem = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateFeeItemDto) => updateFeeItem(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feeKeys.feeItemById(id) });
      queryClient.invalidateQueries({ queryKey: ["feeItems"] });
      queryClient.invalidateQueries({ queryKey: ["feeClassOverview"] });
    },
  });
};

export const useDuplicateFeeItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => duplicateFeeItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeItems"] });
      queryClient.invalidateQueries({ queryKey: ["feeClassOverview"] });
    },
  });
};

// ---- Fee groups ----
export const useGetFeeGroups = (branchId?: number, termId?: number) => {
  return useQuery({
    queryKey: feeKeys.feeGroups(branchId, termId),
    queryFn: () => getFeeGroups(branchId, termId),
    retry: false,
  });
};

export const useGetFeeGroupOverview = (sessionId: number, term: FeeTermType, branchId?: number) => {
  return useQuery({
    queryKey: feeKeys.feeGroupOverview(sessionId, term, branchId),
    queryFn: () => getFeeGroupOverview(sessionId, term, branchId),
    enabled: !!sessionId && !!term,
    retry: false,
  });
};

export const useGetFeeGroupById = (id: number) => {
  return useQuery({
    queryKey: feeKeys.feeGroupById(id),
    queryFn: () => getFeeGroupById(id),
    enabled: !!id,
    retry: false,
  });
};

export const useCreateFeeGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: FeeGroupDto) => createFeeGroup(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeGroups"] });
      queryClient.invalidateQueries({ queryKey: ["feeGroupOverview"] });
    },
  });
};

export const useAddFeeGroupItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: FeeGroupItemDto) => addFeeGroupItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeGroups"] });
      queryClient.invalidateQueries({ queryKey: ["feeGroup"] });
      queryClient.invalidateQueries({ queryKey: ["feeGroupOverview"] });
    },
  });
};

export const useUpdateFeeGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: FeeGroupDto }) => updateFeeGroup(id, payload),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["feeGroups"] });
      queryClient.invalidateQueries({ queryKey: feeKeys.feeGroupById(id) });
      queryClient.invalidateQueries({ queryKey: ["feeGroupOverview"] });
    },
  });
};

export const useDeleteFeeGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteFeeGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeGroups"] });
      queryClient.invalidateQueries({ queryKey: ["feeGroupOverview"] });
    },
  });
};

// ---- Fee routing ----
// GET /fee/route — all fee routes for the school
export const useGetFeeRoutes = () => {
  return useQuery<FeeRouteResponseDto[]>({
    queryKey: feeKeys.feeRoutes,
    queryFn: getFeeRoutes,
    retry: false,
  });
};

// GET /fee/route/branch/{branchId}
export const useGetFeeRoutesByBranch = (branchId: number) => {
  return useQuery<FeeRouteResponseDto[]>({
    queryKey: feeKeys.feeRoutesByBranch(branchId),
    queryFn: () => getFeeRoutesByBranch(branchId),
    enabled: !!branchId,
    retry: false,
  });
};

export const useCreateFeeRoute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: FeeRouteRequestDto) => createFeeRoute(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feeKeys.feeRoutes });
      queryClient.invalidateQueries({ queryKey: feeCollectionKeys.setupStatus });
    },
  });
};

export const useUpdateFeeRoute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: FeeRouteRequestDto }) => updateFeeRoute(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feeKeys.feeRoutes });
      queryClient.invalidateQueries({ queryKey: feeCollectionKeys.setupStatus });
    },
  });
};

export const useDeleteFeeRoute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteFeeRoute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feeKeys.feeRoutes });
      queryClient.invalidateQueries({ queryKey: feeCollectionKeys.setupStatus });
    },
  });
};
