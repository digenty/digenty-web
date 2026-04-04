import { getLevelResultSettings, getLevels, updateLevel, getAssessmentsByLevel, getGradingsByLevel } from "@/api/level";
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
