import { createAttendanceSheet, getAllAttendance, getArmAttendance, getTermSheet, markAllAttendance, markAttendance } from "@/api/attendance";
import { attendanceKeys } from "@/queries/attendance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllAttendance = (branchId?: number, termId?: number, searchQuery?: string) => {
  return useQuery({
    queryKey: [attendanceKeys.attendance, branchId, termId, searchQuery],
    queryFn: () => getAllAttendance(branchId, termId, searchQuery),
    enabled: !!termId,
  });
};

export const useCreateAttendanceSheet = () => {
  return useMutation({
    mutationKey: attendanceKeys.createAttendanceSheet,
    mutationFn: createAttendanceSheet,
  });
};

export const useGetArmAttendance = ({ armId, date, limit, page }: { armId: number; date?: string; limit?: number; page?: number }) => {
  return useQuery({
    queryKey: [attendanceKeys.getArmAttendance, armId, date],
    queryFn: () => getArmAttendance({ armId, date, limit, page }),
  });
};

export const useGetTermSheet = (armId?: number, termId?: number) => {
  return useQuery({
    queryKey: [attendanceKeys.getTermSheet, armId, termId],
    queryFn: () => getTermSheet(armId, termId),
    enabled: !!armId,
  });
};

export const useMarkAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: attendanceKeys.markAttendance,
    mutationFn: markAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [attendanceKeys.getArmAttendance] });
      queryClient.invalidateQueries({ queryKey: [attendanceKeys.getTermSheet] });
    },
  });
};

export const useMarkAllAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: attendanceKeys.markAllAttendance,
    mutationFn: markAllAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [attendanceKeys.getArmAttendance] });
      queryClient.invalidateQueries({ queryKey: [attendanceKeys.getTermSheet] });
    },
  });
};
