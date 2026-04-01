import { getDashboardInfo } from "@/api/dashboard";
import { dashboardKey } from "@/queries/dashboard";
import { useQuery } from "@tanstack/react-query";

export const useGetDashboard = (termId: number | null, branchId: number | null) => {
  return useQuery({
    queryKey: [dashboardKey.getDashboard, termId, branchId],
    queryFn: () => getDashboardInfo(termId, branchId),
  });
};
