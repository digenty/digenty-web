import {
  getArmMidtermComments,
  getMidtermSettingForLevel,
  getMidtermSettings,
  resetClassMidtermFormat,
  saveArmMidtermComments,
  saveStudentMidtermComments,
  setClassMidtermFormat,
  setLevelMidtermFormat,
} from "@/api/midterm-settings";
import { midtermKeys } from "@/queries/midterm";
import { midtermSettingsKeys } from "@/queries/midterm-settings";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetMidtermSettings = (branchId?: number) => {
  return useQuery({
    queryKey: midtermSettingsKeys.list(branchId),
    queryFn: () => getMidtermSettings(branchId),
    retry: false,
  });
};

export const useGetMidtermSettingForLevel = (levelId?: number) => {
  return useQuery({
    queryKey: midtermSettingsKeys.level(levelId),
    queryFn: () => getMidtermSettingForLevel(levelId!),
    enabled: !!levelId,
    retry: false,
  });
};

// A format switch changes what the report and comment endpoints return (400 vs data), so both the settings
// caches and every midterm report cache are dropped.
const useInvalidateAfterFormatChange = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: midtermSettingsKeys.all });
    queryClient.invalidateQueries({ queryKey: midtermKeys.all });
  };
};

export const useSetLevelMidtermFormat = () => {
  const invalidate = useInvalidateAfterFormatChange();
  return useMutation({ mutationKey: midtermSettingsKeys.setLevelFormat, mutationFn: setLevelMidtermFormat, onSuccess: invalidate });
};

export const useSetClassMidtermFormat = () => {
  const invalidate = useInvalidateAfterFormatChange();
  return useMutation({ mutationKey: midtermSettingsKeys.setClassFormat, mutationFn: setClassMidtermFormat, onSuccess: invalidate });
};

export const useResetClassMidtermFormat = () => {
  const invalidate = useInvalidateAfterFormatChange();
  return useMutation({ mutationKey: midtermSettingsKeys.resetClassFormat, mutationFn: resetClassMidtermFormat, onSuccess: invalidate });
};

export const useGetArmMidtermComments = ({ armId, termId, enabled = true }: { armId?: number; termId?: number; enabled?: boolean }) => {
  return useQuery({
    queryKey: midtermSettingsKeys.comments(armId, termId),
    queryFn: () => getArmMidtermComments({ armId: armId!, termId }),
    enabled: enabled && !!armId,
    retry: false,
  });
};

export const useSaveArmMidtermComments = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: midtermSettingsKeys.saveComments,
    mutationFn: saveArmMidtermComments,
    onSuccess: (_data, { armId }) => {
      queryClient.invalidateQueries({ queryKey: ["midterm", "comments", armId] });
      queryClient.invalidateQueries({ queryKey: ["midterm", "arm", armId] });
      queryClient.invalidateQueries({ queryKey: ["midterm", "student"] });
    },
  });
};

export const useSaveStudentMidtermComments = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: midtermSettingsKeys.saveComments,
    mutationFn: saveStudentMidtermComments,
    onSuccess: (_data, { armId }) => {
      queryClient.invalidateQueries({ queryKey: ["midterm", "comments", armId] });
      queryClient.invalidateQueries({ queryKey: ["midterm", "arm", armId] });
      queryClient.invalidateQueries({ queryKey: ["midterm", "student"] });
    },
  });
};
