import { addArm, deleteArmByLevel, getArmsByClass, getArmsByLevel } from "@/api/arm";
import { LevelType } from "@/api/types";
import { armKeys } from "@/queries/arm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetArmsByClass = (classId?: number) => {
  return useQuery({
    queryKey: armKeys.armsByClass(classId),
    queryFn: () => getArmsByClass(classId),
    enabled: !!classId,
  });
};

export const useGetArmsByLevel = (levelType?: LevelType, branchId?: number) => {
  return useQuery({
    queryKey: armKeys.armsByLevel(levelType, branchId),
    queryFn: () => getArmsByLevel(levelType, branchId),
    enabled: !!levelType,
    retry: false,
  });
};

export const useDeleteArm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: armKeys.deleteArm,
    mutationFn: ({ armId, levelId }: { armId: number; levelId: number }) => deleteArmByLevel(armId, levelId),
    // onSuccess: (_data, variables) => {
    //   queryClient.invalidateQueries({
    //     queryKey: armKeys.armsByLevel(variables.levelId),
    //   });
    // },
  });
};

export const useAddArm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: armKeys.addArm,
    mutationFn: addArm,
    // onSuccess: (_data, variables) => {
    //   queryClient.invalidateQueries({
    //     queryKey: armKeys.armsByLevel(variables.levelId, variables.branchId),
    //   });
    // },
  });
};
