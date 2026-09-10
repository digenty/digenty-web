"use client";

import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { ManageAccessGate } from "@/components/ModulePermissionsWrapper/ManageAccessGate";
import { canManageDailyDiary, canViewDailyDiary } from "@/lib/permissions/daily-diary";

import { ComposeDailyReport } from ".";

/** Validates the route param before the composer tries to open a report for it. */
export const ComposeReportGate = ({ armId, date }: { armId: string; date?: string }) => {
  const numericArmId = Number(armId);

  return (
    <ModulePermissionsWrapper permissionUtility={canViewDailyDiary}>
      <ManageAccessGate permissionUtility={canManageDailyDiary} redirectTo="/staff/daily-diary">
        {Number.isFinite(numericArmId) && numericArmId > 0 ? (
          <ComposeDailyReport armId={numericArmId} date={date} />
        ) : (
          <ErrorComponent
            title="We could not find that class"
            description="The link may be out of date. Go back to the diary and pick the class again."
            buttonText="Back to Daily Diary"
            url="/staff/daily-diary"
          />
        )}
      </ManageAccessGate>
    </ModulePermissionsWrapper>
  );
};
