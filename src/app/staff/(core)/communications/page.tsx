"use client";

import { Communications } from "@/components/Communications";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { Spinner } from "@/components/ui/spinner";
import { canViewCommunication } from "@/lib/permissions/communication";
import { Suspense } from "react";

export default function CommunicationsPage() {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewCommunication}>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Spinner className="size-16" />
          </div>
        }
      >
        <Communications />
      </Suspense>
    </ModulePermissionsWrapper>
  );
}
