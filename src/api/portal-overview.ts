import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

// GET /portal/overview — key metrics for a school's public website portal
export interface RecentActivityDto {
  type: string;
  description: string;
  occurredAt: string;
}

export interface PortalOverviewDto {
  live: boolean;
  websiteVisitsThisTerm: number;
  activeParents30Days: number;
  topAction: number;
  recentActivities: RecentActivityDto[];
}

export const getPortalOverview = async (): Promise<PortalOverviewDto> => {
  try {
    const { data } = await api.get(`/portal/overview`);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};
