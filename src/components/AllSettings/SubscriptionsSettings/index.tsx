"use client";

import { SubscriptionDashboard } from "./SubscriptionDashboard";
import { PlansView } from "./PlansView";
import { useGetCurrentSubscription } from "@/hooks/queryHooks/useSubscription";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

const BASE_CRUMBS = [
  { label: "Settings", url: "/staff/settings" },
  { label: "Subscriptions", url: "/staff/settings/subscription" },
];

export const SettingSubscription = () => {
  useBreadcrumb(BASE_CRUMBS);
  const { data: subscription, isFetching } = useGetCurrentSubscription();

  // if (isFetching) {
  //   return (
  //     <div className="flex flex-col gap-6">
  //       <div className="bg-bg-state-soft h-6 w-40 animate-pulse rounded" />
  //       <div className="bg-bg-state-soft h-40 w-full max-w-81 animate-pulse rounded-lg" />
  //     </div>
  //   );
  // }

  if (!subscription) {
    return <PlansView showNoSubscriptionBanner />;
  }

  return <SubscriptionDashboard />;
};
