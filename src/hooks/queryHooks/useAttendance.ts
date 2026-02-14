import { getAllAttendance } from "@/api/attendance";
import { attendanceKeys } from "@/queries/attendance";
import { useQuery } from "@tanstack/react-query";

export const useGetAllAttendance = (branchId?: number, termId?: number) => {
  return useQuery({
    queryKey: [attendanceKeys.attendance, branchId, termId],
    queryFn: () => getAllAttendance(branchId, termId),
  });
};
