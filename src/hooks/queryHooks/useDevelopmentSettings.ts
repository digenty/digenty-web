import {
  AddDevelopmentCategoryPayload,
  addDevelopmentCategory,
  deleteDevelopmentCategory,
  getDevelopmentCategories,
  getDevelopmentSettings,
  getDevelopmentSettingsByLevel,
  updateDevelopmentCategory,
  updateLevelSkills,
  UpdateLevelSkillsPayload,
} from "@/api/development-settings";
import { developmentSettingsKeys } from "@/queries/development-settings";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetDevelopmentCategories = () => {
  return useQuery({
    queryKey: developmentSettingsKeys.categories,
    queryFn: getDevelopmentCategories,
  });
};

export const useAddDevelopmentCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: developmentSettingsKeys.addCategory,
    mutationFn: (payload: AddDevelopmentCategoryPayload) => addDevelopmentCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: developmentSettingsKeys.categories });
    },
  });
};

export const useUpdateDevelopmentCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: developmentSettingsKeys.updateCategory,
    mutationFn: ({ categoryId, payload }: { categoryId: number; payload: AddDevelopmentCategoryPayload }) =>
      updateDevelopmentCategory(categoryId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: developmentSettingsKeys.categories });
    },
  });
};

export const useDeleteDevelopmentCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: developmentSettingsKeys.deleteCategory,
    mutationFn: (categoryId: number) => deleteDevelopmentCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: developmentSettingsKeys.categories });
    },
  });
};

export const useGetDevelopmentSettings = (branchId?: number) => {
  return useQuery({
    queryKey: [developmentSettingsKeys.settings, branchId],
    queryFn: () => getDevelopmentSettings(branchId),
  });
};

export const useGetDevelopmentSettingsByLevel = (levelId?: number) => {
  return useQuery({
    queryKey: [developmentSettingsKeys.settingsByLevel, levelId],
    queryFn: () => getDevelopmentSettingsByLevel(levelId!),
    enabled: !!levelId,
  });
};

export const useUpdateLevelSkills = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: developmentSettingsKeys.updateLevelSkills,
    mutationFn: (payload: UpdateLevelSkillsPayload) => updateLevelSkills(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [developmentSettingsKeys.settings] });
      queryClient.invalidateQueries({ queryKey: [developmentSettingsKeys.settingsByLevel] });
    },
  });
};
