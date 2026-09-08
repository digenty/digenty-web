"use client";

import { NewCampaign } from "@/components/Communications/NewCampaign";
import { ManageAccessGate } from "@/components/ModulePermissionsWrapper/ManageAccessGate";
import { Spinner } from "@/components/ui/spinner";
import { canManageCommunication } from "@/lib/permissions/communication";
import { Suspense } from "react";

export default function NewCampaignPage() {
  return (
    <ManageAccessGate permissionUtility={canManageCommunication} redirectTo="/staff/communications">
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Spinner className="size-16" />
          </div>
        }
      >
        <NewCampaign />
      </Suspense>
    </ManageAccessGate>
  );
}
