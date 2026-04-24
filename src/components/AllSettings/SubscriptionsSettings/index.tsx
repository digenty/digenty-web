"use client";

<<<<<<< HEAD
import { SubscriptionDashboard } from "./SubscriptionDashboard";
import { PlansView } from "./PlansView";
import { useGetCurrentSubscription } from "@/hooks/queryHooks/useSubscription";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

const BASE_CRUMBS = [
  { label: "Settings", url: "/staff/settings" },
  { label: "Subscriptions", url: "/staff/settings/subscription" },
];
=======
import React, { useState } from "react";
import { ArrowLeftS } from "@/components/Icons/ArrowLeftS";
import { SubscriptionDashboard } from "./SubscriptionDashboard";
import { PlansView } from "./PlansView";
import { UpgradeOrSubscribeForm } from "./UpgradeOrSubscribeForm";
import { AddStudentsForm } from "./AddStudentsForm";
import { SubscriptionView } from "./type";
>>>>>>> 7678c9e (feat: implement designs for subscriptions)

export const SettingSubscription = () => {
  useBreadcrumb(BASE_CRUMBS);
  const { data: subscription, isFetching } = useGetCurrentSubscription();

<<<<<<< HEAD
  // if (isFetching) {
  //   return (
  //     <div className="flex flex-col gap-6">
  //       <div className="bg-bg-state-soft h-6 w-40 animate-pulse rounded" />
  //       <div className="bg-bg-state-soft h-40 w-full max-w-81 animate-pulse rounded-lg" />
  //     </div>
  //   );
  // }

  if (!subscription || subscription.data?.status === "CANCELLED") {
    return <PlansView showNoSubscriptionBanner />;
  }

  return <SubscriptionDashboard />;
};
=======
  const handleBack = () => {
    if (view === "subscribe") {
      setView("plans");
    } else {
      setView("dashboard");
    }
  };

  const renderView = () => {
    switch (view) {
      case "plans":
        return <PlansView onViewChange={setView} />;
      case "upgrade":
        return <UpgradeOrSubscribeForm isUpgrade onViewChange={setView} />;
      case "subscribe":
        return <UpgradeOrSubscribeForm onViewChange={setView} />;
      case "add-students":
        return <AddStudentsForm onViewChange={setView} />;
      default:
        return <SubscriptionDashboard onViewChange={setView} />;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {view !== "dashboard" && (
        <button
          onClick={handleBack}
          className="text-text-subtle hover:text-text-default flex w-fit cursor-pointer items-center gap-2 transition-colors"
        >
          <ArrowLeftS fill="var(--color-icon-default-subtle)" className="h-5 w-5" />
          <span className="text-sm font-medium">Back</span>
        </button>
      )}
      {renderView()}
    </div>
  );
};
>>>>>>> 7678c9e (feat: implement designs for subscriptions)
