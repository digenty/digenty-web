import { getLevels, updateLevel } from "@/api/level";
import { classKeys } from "@/queries/class";
import { levelKeys } from "@/queries/level";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetLevels = (branchId?: number) => {
  return useQuery({
    queryKey: [levelKeys.levels, branchId],
    queryFn: () => getLevels(branchId),
  });
};

export const useUpdateLevel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: levelKeys.updateLevel,
    mutationFn: updateLevel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [levelKeys.levels] });
      queryClient.invalidateQueries({ queryKey: [classKeys.classesByLevel] });
    },
  });
};
