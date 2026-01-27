import { addParent, getParents, uploadParents } from "@/api/parent";
import { parentKeys } from "@/queries/parent";
import { Pagination } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAddParent = () => {
  return useMutation({
    mutationKey: parentKeys.addParent,
    mutationFn: addParent,
  });
};

export const useGetParents = (pagination: Pagination) => {
  return useQuery({
    queryKey: parentKeys.all,
    queryFn: () => getParents({ pagination }),
    retry: false,
  });
};

export const useUploadParents = () => {
  return useMutation({
    mutationKey: parentKeys.parentsUpload,
    mutationFn: uploadParents,
  });
};
