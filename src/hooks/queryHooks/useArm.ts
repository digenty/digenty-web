import { addArm, addArmToClass, deleteArmByLevel, deleteArmFromClass, getArmsByClass, getArmsByLevel } from "@/api/arm";
import { LevelType } from "@/api/types";
import { armKeys } from "@/queries/arm";
import { classKeys } from "@/queries/class";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetArmsByClass = (classId: number | null) => {
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [classKeys.classesByLevel],
      });
    },
  });
};

export const useAddArm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: armKeys.addArm,
    mutationFn: addArm,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [classKeys.classesByLevel],
      });
    },
  });
};

export const useAddArmToClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: armKeys.addArm,
    mutationFn: addArmToClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["arms"] });
      queryClient.invalidateQueries({ queryKey: ["armsByLevel"] });
    },
  });
};
export const useDeleteArmFromClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: armKeys.deleteArm,
    mutationFn: ({ armId, classId }: { armId: number; classId: number }) => deleteArmFromClass(armId, classId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["arms"] });
      // queryClient.invalidateQueries({ queryKey: [classKeys.classesByLevel] });
    },
  });
};
