import { getDashboardInfo } from "@/api/dashboard";
import { dashboardKey } from "@/queries/dashboard";
import { useQuery } from "@tanstack/react-query";

export const useGetDashboard = () => {
  return useQuery({
    queryKey: dashboardKey.getDashboard,
    queryFn: getDashboardInfo,
  });
};
