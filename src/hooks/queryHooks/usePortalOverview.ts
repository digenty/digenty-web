import { getPortalOverview } from "@/api/portal-overview";
import { portalOverviewKeys } from "@/queries/portal-overview";
import { useQuery } from "@tanstack/react-query";

export const useGetPortalOverview = () => {
  return useQuery({
    queryKey: portalOverviewKeys.overview,
    queryFn: getPortalOverview,
    retry: false,
  });
};
