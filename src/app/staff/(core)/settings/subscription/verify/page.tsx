"use client";

import { Suspense } from "react";
import { SubscriptionVerify } from "@/components/AllSettings/SubscriptionsSettings/SubscriptionVerify";
import { ManageAccessGate } from "@/components/ModulePermissionsWrapper/ManageAccessGate";
import { canManageSettings } from "@/lib/permissions/settings";

const VerifyPage = () => {
  return (
    <ManageAccessGate permissionUtility={canManageSettings} redirectTo="/staff/settings/subscription">
      <div className="p-4 md:p-8">
        <Suspense fallback={null}>
          <SubscriptionVerify />
        </Suspense>
      </div>
    </ManageAccessGate>
  );
};

export default VerifyPage;
