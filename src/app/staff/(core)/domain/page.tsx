"use client";

import { DomainMain } from "@/components/Domain";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { Spinner } from "@/components/ui/spinner";
import { canViewDomain } from "@/lib/permissions/domain";
import { Suspense } from "react";

const DomainPage = () => {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewDomain}>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Spinner className="size-16" />
          </div>
        }
      >
        <DomainMain />
      </Suspense>
    </ModulePermissionsWrapper>
  );
};

export default DomainPage;
