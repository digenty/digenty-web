"use client";

import { ManageAccessGate } from "@/components/ModulePermissionsWrapper/ManageAccessGate";
import { Spinner } from "@/components/ui/spinner";
import { canManageCommunication } from "@/lib/permissions/communication";
import { Suspense } from "react";

import { EditCampaign } from ".";

export const EditCampaignGate = ({ id }: { id: string }) => (
  <ManageAccessGate permissionUtility={canManageCommunication} redirectTo="/staff/communications">
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Spinner className="size-16" />
        </div>
      }
    >
      <EditCampaign id={id} />
    </Suspense>
  </ManageAccessGate>
);
