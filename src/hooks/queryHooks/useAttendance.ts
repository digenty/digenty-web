import { createAttendanceSheet, getAllAttendance, getArmAttendance, getTermSheet, markAllAttendance, markAttendance } from "@/api/attendance";
import { attendanceKeys } from "@/queries/attendance";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetAllAttendance = (branchId?: number, termId?: number) => {
  return useQuery({
    queryKey: [attendanceKeys.attendance, branchId, termId],
    queryFn: () => getAllAttendance(branchId, termId),
    enabled: !!termId
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
    queryKey: [attendanceKeys.getArmAttendance, date],
    queryFn: () => getArmAttendance({ armId, date, limit, page }),
  });
};

export const useGetTermSheet = (armId: number) => {
  return useQuery({
    queryKey: attendanceKeys.getTermSheet,
    queryFn: () => getTermSheet(armId),
  });
};

export const useMarkAttendance = () => {
  return useMutation({
    mutationKey: attendanceKeys.markAttendance,
    mutationFn: markAttendance,
  });
};

export const useMarkAllAttendance = () => {
  return useMutation({
    mutationKey: attendanceKeys.markAllAttendance,
    mutationFn: markAllAttendance,
  });
};
