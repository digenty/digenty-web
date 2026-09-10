"use client";

import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { canViewDailyDiary } from "@/lib/permissions/daily-diary";

import { PublishedReport } from ".";

export const PublishedReportGate = ({ armId, reportId }: { armId: string; reportId: string }) => {
  const numericArmId = Number(armId);
  const numericReportId = Number(reportId);
  const isValid = Number.isFinite(numericArmId) && numericArmId > 0 && Number.isFinite(numericReportId) && numericReportId > 0;

  return (
    <ModulePermissionsWrapper permissionUtility={canViewDailyDiary}>
      {isValid ? (
        <PublishedReport armId={numericArmId} reportId={numericReportId} />
      ) : (
        <ErrorComponent
          title="We could not find that report"
          description="The link may be out of date. Go back to the diary and open the class again."
          buttonText="Back to Daily Diary"
          url="/staff/daily-diary"
        />
      )}
    </ModulePermissionsWrapper>
  );
};
