import { getLevelResultSettings, getLevels, updateLevel, getAssessmentsByLevel, getGradingsByLevel, addLevel, deleteLevel } from "@/api/level";
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
export const useGetLevelResultSettings = (levelId: number, filter: string) => {
  return useQuery({
    queryKey: levelKeys.resultSettings(levelId, filter),
    queryFn: () => getLevelResultSettings(levelId, filter),
    enabled: !!levelId && filter === "promotion",
  });
};
export const useGetAssessmentsByLevel = (levelId?: number) => {
  return useQuery({
    queryKey: [levelKeys.levelAssessments, levelId],
    queryFn: () => getAssessmentsByLevel(levelId!),
    enabled: !!levelId,
  });
};
export const useGetGradingsByLevel = (levelId?: number) => {
  return useQuery({
    queryKey: [levelKeys.levelGradings, levelId],
    queryFn: () => getGradingsByLevel(levelId!),
    enabled: !!levelId,
  });
};

export const useAddLevel = () => {
  return useMutation({
    mutationKey: levelKeys.addLevel,
    mutationFn: addLevel,
  });
};

export const useDeleteLevel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: levelKeys.deleteLevel,
    mutationFn: (levelId: number) => deleteLevel(levelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [levelKeys.levels] });
    },
  });
};
