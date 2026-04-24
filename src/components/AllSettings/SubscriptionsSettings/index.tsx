"use client";

import React, { useState } from "react";
import { SubscriptionDashboard } from "./SubscriptionDashboard";
import { PlansView } from "./PlansView";
import { UpgradeOrSubscribeForm } from "./UpgradeOrSubscribeForm";
import { AddStudentsForm } from "./AddStudentsForm";
import { SubscriptionView } from "./type";
import { ArrowLeftS } from "@/components/Icons/ArrowLeftS";

export const SettingSubscription = () => {
  const [view, setView] = useState<SubscriptionView>("dashboard");

  const handleBack = () => {
    if (view === "plans" || view === "upgrade" || view === "add-students") {
      setView("dashboard");
    } else if (view === "subscribe") {
      setView("plans");
    }
  };

  const renderView = () => {
    switch (view) {
      case "dashboard":
        return <SubscriptionDashboard onViewChange={setView} />;
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
        <button onClick={handleBack} className="text-text-subtle hover:text-text-default mb-2 flex w-fit items-center gap-2 transition-colors">
          <ArrowLeftS fill="var(--color-icon-default-subtle)" className="h-5 w-5" />
          <span className="text-sm font-bold">Back</span>
        </button>
      )}
      {renderView()}
    </div>
  );
};
