import { addParent, deleteParents, editParent, exportParents, getParent, getParents, uploadParents } from "@/api/parent";
import { parentKeys } from "@/queries/parent";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

export const useAddParent = () => {
  return useMutation({
    mutationKey: parentKeys.addParent,
    mutationFn: addParent,
  });
};

export const useGetParents = ({ limit, branchId, search }: { limit: number; branchId?: number; search?: string }) => {
  return useInfiniteQuery({
    queryKey: [parentKeys.all, branchId, search],
    queryFn: ({ pageParam }) => getParents({ pageParam, limit, branchId, search }),
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      if (lastPage.last) return undefined;
      return lastPage.number + 1; // next page index
    },
  });
};

export const useUploadParents = () => {
  return useMutation({
    mutationKey: parentKeys.parentsUpload,
    mutationFn: uploadParents,
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
  });
};

export const useDeleteParents = (parentIds: number[]) => {
  return useMutation({
    mutationKey: parentKeys.deleteParents,
    mutationFn: () => deleteParents(parentIds),
  });
};

export const useEditParent = () => {
  return useMutation({
    mutationKey: parentKeys.editParent,
    mutationFn: editParent,
  });
};
