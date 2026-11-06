"use client";

import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { canViewDailyDiary } from "@/lib/permissions/daily-diary";

import { InstanceReport } from "./InstanceReport";

export const InstanceReportGate = ({ armId, batchId, reportId }: { armId: string; batchId: string; reportId: string }) => {
  const numericArmId = Number(armId);
  const numericBatchId = Number(batchId);
  const numericReportId = Number(reportId);
  const isValid =
    Number.isFinite(numericArmId) &&
    numericArmId > 0 &&
    Number.isFinite(numericBatchId) &&
    numericBatchId > 0 &&
    Number.isFinite(numericReportId) &&
    numericReportId > 0;

  return (
    <ModulePermissionsWrapper permissionUtility={canViewDailyDiary}>
      {isValid ? (
        <InstanceReport armId={numericArmId} batchId={numericBatchId} reportId={numericReportId} />
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
