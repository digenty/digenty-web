import { getAllAttendance } from "@/api/attendance";
import { attendanceKeys } from "@/queries/attendance";
import { useQuery } from "@tanstack/react-query";

export const useGetAllAttendance = (branchId?: number) => {
  return useQuery({
    queryKey: attendanceKeys.attendance,
    queryFn: () => getAllAttendance(branchId),
    enabled: !!branchId,
  });
};
