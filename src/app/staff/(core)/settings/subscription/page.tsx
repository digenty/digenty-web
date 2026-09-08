"use client";

import { SettingSubscription } from "@/components/AllSettings/SubscriptionsSettings";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { canViewSettings } from "@/lib/permissions/settings";
import React from "react";

const SettingSubscriptionPage = () => {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewSettings}>
      <div className="p-4 md:p-8">
        <SettingSubscription />
      </div>
    </ModulePermissionsWrapper>
  );
};

export default SettingSubscriptionPage;
