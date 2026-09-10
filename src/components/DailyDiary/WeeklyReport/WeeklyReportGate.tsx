"use client";

import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { canViewDailyDiary } from "@/lib/permissions/daily-diary";

import { WeeklyReport } from ".";

export const WeeklyReportGate = ({ armId, weekStart }: { armId: string; weekStart?: string }) => {
  const numericArmId = Number(armId);

  return (
    <ModulePermissionsWrapper permissionUtility={canViewDailyDiary}>
      {Number.isFinite(numericArmId) && numericArmId > 0 ? (
        <WeeklyReport armId={numericArmId} weekStart={weekStart} />
      ) : (
        <ErrorComponent
          title="We could not find that class"
          description="The link may be out of date. Go back to the diary and pick the class again."
          buttonText="Back to Daily Diary"
          url="/staff/daily-diary"
        />
      )}
    </ModulePermissionsWrapper>
  );
};
