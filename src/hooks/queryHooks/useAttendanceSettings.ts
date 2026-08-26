import {
  getAttendanceSettings,
  getAttendanceSettingsByLevel,
  updateAttendanceSettings,
  UpdateAttendanceSettingsPayload,
} from "@/api/attendance-settings";
import { attendanceSettingsKeys } from "@/queries/attendance-settings";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAttendanceSettings = (branchId?: number) => {
  return useQuery({
    queryKey: [attendanceSettingsKeys.attendanceSettings, branchId],
    queryFn: () => getAttendanceSettings(branchId),
  });
};

export const useGetAttendanceSettingsByLevel = (levelId?: number) => {
  return useQuery({
    queryKey: [attendanceSettingsKeys.attendanceSettingsByLevel, levelId],
    queryFn: () => getAttendanceSettingsByLevel(levelId!),
    enabled: !!levelId,
  });
};

export const useUpdateAttendanceSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: attendanceSettingsKeys.updateAttendanceSettings,
    mutationFn: ({ levelId, payload }: { levelId: number; payload: UpdateAttendanceSettingsPayload }) => updateAttendanceSettings(levelId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [attendanceSettingsKeys.attendanceSettings] });
      queryClient.invalidateQueries({ queryKey: [attendanceSettingsKeys.attendanceSettingsByLevel] });
    },
  });
};
