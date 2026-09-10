import {
  addParent,
  addParentOnParentPortal,
  commitParentsUpload,
  deleteParents,
  editParent,
  exportParents,
  getMyParentProfile,
  getParent,
  getParentInviteStatus,
  getParents,
  sendParentInvites,
  uploadParents,
  validateParentsUpload,
} from "@/api/parent";
import { parentKeys } from "@/queries/parent";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAddParent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: parentKeys.addParent,
    mutationFn: addParent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [parentKeys.all] });
    },
  });
};

export const useAddParentOnParentPortal = () => {
  // const queryClient = useQueryClient();
  return useMutation({
    mutationKey: parentKeys.addParentOnParentPortal,
    mutationFn: addParentOnParentPortal,
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: [parentKeys.all] });
    // },
  });
};

export const useGetParents = ({ limit, branchId, search, enabled }: { limit: number; branchId?: number; search?: string; enabled?: boolean }) => {
  return useInfiniteQuery({
    queryKey: [parentKeys.all, branchId, search],
    queryFn: ({ pageParam }) => getParents({ pageParam, limit, branchId, search }),
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      if (lastPage.last) return undefined;
      return lastPage.number + 1;
    },
    enabled: enabled !== false,
  });
};

export const useUploadParents = ({ branchId }: { branchId?: number }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: parentKeys.parentsUpload,
    mutationFn: ({ file }: { file: File | null }) => uploadParents({ file, branchId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [parentKeys.all] });
    },
  });
};

export const useValidateParentsUpload = ({ branchId }: { branchId?: number }) => {
  return useMutation({
    mutationKey: parentKeys.parentsValidateUpload,
    mutationFn: ({ file }: { file: File }) => validateParentsUpload({ file, branchId: branchId! }),
  });
};

export const useCommitParentsUpload = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: parentKeys.parentsCommitUpload,
    mutationFn: ({ batchId }: { batchId: string }) => commitParentsUpload({ batchId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [parentKeys.all] });
    },
  });
};

export const useSendParentInvites = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: parentKeys.sendParentInvites,
    mutationFn: sendParentInvites,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: parentKeys.parentInviteStatus(variables.branchId) });
    },
  });
};

// Branch totals for the invites screen: how many parents already have their login
// details and how many the next send would target.
export const useParentInviteStatus = ({ branchId, enabled, refetchInterval }: { branchId?: number; enabled?: boolean; refetchInterval?: number }) => {
  return useQuery({
    queryKey: parentKeys.parentInviteStatus(branchId),
    queryFn: () => getParentInviteStatus(branchId!),
    enabled: !!branchId && enabled !== false,
    retry: false,
    staleTime: 0,
    ...(refetchInterval ? { refetchInterval } : {}),
  });
};

export const useExportParents = ({ branchId }: { branchId?: number }) => {
  return useMutation({
    mutationKey: parentKeys.exportParents,
    mutationFn: () => exportParents({ branchId }),
  });
};

export const useGetParent = (parentId?: number) => {
  return useQuery({
    queryKey: [parentKeys.getParent, parentId],
    queryFn: () => getParent(parentId),
    enabled: !!parentId,
    retry: false,
  });
};

export const useGetMyParentProfile = () => {
  return useQuery({
    queryKey: parentKeys.getMyProfile,
    queryFn: getMyParentProfile,
    retry: false,
  });
};

export const useDeleteParents = (parentIds: number[]) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: parentKeys.deleteParents,
    mutationFn: () => deleteParents(parentIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [parentKeys.all] });
    },
  });
};

export const useEditParent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: parentKeys.editParent,
    mutationFn: editParent,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [parentKeys.all] });
      queryClient.invalidateQueries({ queryKey: [parentKeys.getParent, variables.id] });
    },
  });
};
