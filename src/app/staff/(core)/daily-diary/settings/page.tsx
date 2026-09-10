"use client";

import { Suspense } from "react";

import { DiarySettings } from "@/components/DailyDiary/DiarySettings";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { ManageAccessGate } from "@/components/ModulePermissionsWrapper/ManageAccessGate";
import { Spinner } from "@/components/ui/spinner";
import { canManageDiarySettings, canViewDailyDiary } from "@/lib/permissions/daily-diary";

export default function DiarySettingsPage() {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewDailyDiary}>
      <ManageAccessGate permissionUtility={canManageDiarySettings} redirectTo="/staff/daily-diary">
        <Suspense
          fallback={
            <div className="flex h-screen items-center justify-center">
              <Spinner className="size-16" />
            </div>
          }
        >
          <DiarySettings />
        </Suspense>
      </ManageAccessGate>
    </ModulePermissionsWrapper>
  );
}
