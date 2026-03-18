import { addArm, deleteArmByLevel, getArmsByClass, getArmsByLevel } from "@/api/arm";
import { armKeys } from "@/queries/arm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetArmsByClass = (classId?: number) => {
  return useQuery({
    queryKey: armKeys.armsByClass(classId),
    queryFn: () => getArmsByClass(classId),
    enabled: !!classId,
  });
};

export const useGetArmsByLevel = (levelId?: number, branchId?: number) => {
  return useQuery({
    queryKey: armKeys.armsByLevel(levelId, branchId),
    queryFn: () => getArmsByLevel(levelId, branchId),
    enabled: !!levelId,
    retry: false,
  });
};

export const useDeleteArm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: armKeys.deleteArm,
    mutationFn: ({ armId, levelId }: { armId: number; levelId: number }) => deleteArmByLevel(armId, levelId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: armKeys.armsByLevel(variables.levelId),
      });
    },
  });
};

export const useAddArm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: armKeys.addArm,
    mutationFn: addArm,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: armKeys.armsByLevel(variables.levelId, variables.branchId),
      });
    },
  });
};
