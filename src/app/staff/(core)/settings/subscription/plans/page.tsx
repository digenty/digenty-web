"use client";

import { PlansView } from "@/components/AllSettings/SubscriptionsSettings/PlansView";
import { SubscriptionBackLink } from "@/components/AllSettings/SubscriptionsSettings/SubscriptionBackLink";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { canViewSettings } from "@/lib/permissions/settings";

const PlansPage = () => {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewSettings}>
      <div className="flex flex-col gap-6 p-4 md:p-8">
        <SubscriptionBackLink href="/staff/settings/subscription" />
        <PlansView />
      </div>
    </ModulePermissionsWrapper>
  );
};

export default PlansPage;
