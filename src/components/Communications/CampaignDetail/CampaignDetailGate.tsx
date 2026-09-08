"use client";

import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { Spinner } from "@/components/ui/spinner";
import { canViewCommunication } from "@/lib/permissions/communication";
import { Suspense } from "react";

import { CampaignDetail } from ".";

// The parent page.tsx is an async Server Component (it awaits params/searchParams), so the
// permission predicate can't be passed to it directly — functions aren't serializable across
// the server/client boundary. This client component takes only serializable props instead.
export const CampaignDetailGate = ({ id, paymentReference }: { id: string; paymentReference: string | null }) => (
  <ModulePermissionsWrapper permissionUtility={canViewCommunication}>
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Spinner className="size-16" />
        </div>
      }
    >
      <CampaignDetail id={id} paymentReference={paymentReference} />
    </Suspense>
  </ModulePermissionsWrapper>
);
