import { getClassPaymentCompletion, getDashboardAlerts, getDashboardInfo, getDashboardLevels } from "@/api/dashboard";
import { dashboardKey } from "@/queries/dashboard";
import { useQuery } from "@tanstack/react-query";

export const useGetDashboard = (termId: number | null, branchId: number | null) => {
  return useQuery({
    queryKey: [dashboardKey.getDashboard, termId, branchId],
    queryFn: () => getDashboardInfo(termId, branchId),
  });
};

export const useGetDashboardAlerts = (termId: number | null, branchId: number | null) => {
  return useQuery({
    queryKey: dashboardKey.getAlerts(termId, branchId),
    queryFn: () => getDashboardAlerts(termId, branchId),
  });
};

export const useGetDashboardLevels = (branchId: number | null) => {
  return useQuery({
    queryKey: dashboardKey.getLevels(branchId),
    queryFn: () => getDashboardLevels(branchId),
  });
};

export const useGetClassPaymentCompletion = (termId: number | null, branchId: number | null, levelType?: string) => {
  return useQuery({
    queryKey: dashboardKey.getClassPaymentCompletion(termId, branchId, levelType),
    queryFn: () => getClassPaymentCompletion(termId, branchId, levelType),
  });
};
