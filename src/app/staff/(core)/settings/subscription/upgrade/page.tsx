"use client";

import { UpgradeOrSubscribeForm } from "@/components/AllSettings/SubscriptionsSettings/UpgradeOrSubscribeForm";
import { SubscriptionBackLink } from "@/components/AllSettings/SubscriptionsSettings/SubscriptionBackLink";
import { ManageAccessGate } from "@/components/ModulePermissionsWrapper/ManageAccessGate";
import { canManageSettings } from "@/lib/permissions/settings";

const UpgradePage = () => {
  return (
    <ManageAccessGate permissionUtility={canManageSettings} redirectTo="/staff/settings/subscription">
      <div className="flex flex-col gap-6 p-4 md:p-8">
        <SubscriptionBackLink href="/staff/settings/subscription" />
        <UpgradeOrSubscribeForm isUpgrade />
      </div>
    </ManageAccessGate>
  );
};

export default UpgradePage;
