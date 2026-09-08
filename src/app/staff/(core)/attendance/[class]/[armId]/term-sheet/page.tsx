"use client";

import { TermSheet } from "@/components/AttendanceManagement/ClassAttendance/TermSheet";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { Spinner } from "@/components/ui/spinner";
import { canViewAttendance } from "@/lib/permissions/attendance";
import { Suspense } from "react";

export default function ClassTermSheetPage() {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewAttendance}>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Spinner className="size-16" />
          </div>
        }
      >
        <TermSheet />
      </Suspense>
    </ModulePermissionsWrapper>
  );
}
