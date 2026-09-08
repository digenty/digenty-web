"use client";

import { AdmissionManagement } from "@/components/AdmissionManagement";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { Spinner } from "@/components/ui/spinner";
import { canViewAdmissionManagement } from "@/lib/permissions/admission-management";
import { Suspense } from "react";

export default function page() {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewAdmissionManagement}>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Spinner className="size-16" />
          </div>
        }
      >
        <AdmissionManagement />
      </Suspense>
    </ModulePermissionsWrapper>
  );
}
