"use client";

import { General } from "@/components/AllSettings/GeneralSettings";
import { Spinner } from "@/components/ui/spinner";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { canViewSettings } from "@/lib/permissions/settings";
import React, { Suspense } from "react";

export default function SettingsPage() {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewSettings}>
      <div className="">
        <Suspense
          fallback={
            <div className="flex h-[60vh] items-center justify-center">
              <Spinner className="size-16" />
            </div>
          }
        >
          <General />
        </Suspense>
      </div>
    </ModulePermissionsWrapper>
  );
}
