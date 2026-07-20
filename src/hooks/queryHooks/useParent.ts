import {
  addParent,
  addParentOnParentPortal,
  commitParentsUpload,
  deleteParents,
  editParent,
  exportParents,
  getParent,
  getParents,
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
