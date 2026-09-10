"use client";

import { Suspense } from "react";

import { DailyDiary } from "@/components/DailyDiary";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { Spinner } from "@/components/ui/spinner";
import { canViewDailyDiary } from "@/lib/permissions/daily-diary";

export default function DailyDiaryPage() {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewDailyDiary}>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Spinner className="size-16" />
          </div>
        }
      >
        <DailyDiary />
      </Suspense>
    </ModulePermissionsWrapper>
  );
}
