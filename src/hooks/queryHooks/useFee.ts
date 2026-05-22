import {
  createFeeItem,
  createFeeRoute,
  deleteFee,
  deleteFeeGroup,
  deleteFeeItem,
  deleteFeeRoute,
  getFeeById,
  getFeeGroupById,
  getFeeGroups,
  getFeeItems,
  getFeeRoutes,
  getFeeRoutesByBranch,
  getFees,
  updateFeeGroup,
  updateFeeRoute,
  FeeGroupDto,
  FeeItemDto,
  FeeRouteRequestDto,
  FeeRouteResponseDto,
} from "@/api/fee";
import { feeKeys } from "@/queries/fee";
import { feeCollectionKeys } from "@/queries/fee-collection";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetFees = (termId?: number) => {
  return useQuery({
    queryKey: feeKeys.fees,
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

export const useGetFeeItems = (branchId?: number, termId?: number) => {
  return useQuery({
    queryKey: feeKeys.feeItems(branchId, termId),
    queryFn: () => getFeeItems(branchId, termId),
    retry: false,
  });
};

export const useGetFeeItemById = (id: number) => {
  return useQuery({
    queryKey: feeKeys.feeItemById(id),
    queryFn: () => getFeeById(id),
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
      queryClient.invalidateQueries({ queryKey: feeKeys.feeItems() });
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

export const useDeleteFeeItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteFeeItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feeKeys.feeItems() });
    },
  });
};

export const useGetFeeGroups = (branchId?: number) => {
  return useQuery({
    queryKey: feeKeys.feeGroups(branchId),
    queryFn: () => getFeeGroups(branchId),
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

export const useUpdateFeeGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: FeeGroupDto }) => updateFeeGroup(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feeKeys.feeGroups() });
    },
  });
};

export const useDeleteFeeGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteFeeGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feeKeys.feeGroups() });
    },
  });
};

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
