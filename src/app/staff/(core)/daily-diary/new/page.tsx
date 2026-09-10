"use client";

import { Suspense } from "react";

import { NewReportPicker } from "@/components/DailyDiary/NewReportPicker";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { ManageAccessGate } from "@/components/ModulePermissionsWrapper/ManageAccessGate";
import { Spinner } from "@/components/ui/spinner";
import { canManageDailyDiary, canViewDailyDiary } from "@/lib/permissions/daily-diary";

export default function NewDailyReportPage() {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewDailyDiary}>
      <ManageAccessGate permissionUtility={canManageDailyDiary} redirectTo="/staff/daily-diary">
        <Suspense
          fallback={
            <div className="flex h-screen items-center justify-center">
              <Spinner className="size-16" />
            </div>
          }
        >
          <NewReportPicker />
        </Suspense>
      </ManageAccessGate>
    </ModulePermissionsWrapper>
  );
}
