"use client";

import { FeesIndex } from "@/components/Fees";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { canViewFees } from "@/lib/permissions/fees";

export default function feesPage() {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewFees}>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Spinner className="size-16" />
          </div>
        }
      >
        <FeesIndex />
      </Suspense>
    </ModulePermissionsWrapper>
  );
}
