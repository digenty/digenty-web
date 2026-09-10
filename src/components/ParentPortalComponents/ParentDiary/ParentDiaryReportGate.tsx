"use client";

import { useEffect, useMemo } from "react";

import { Parent } from "@/api/types";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { Spinner } from "@/components/ui/spinner";
import { useGetMyParentProfile } from "@/hooks/queryHooks/useParent";
import { useStudentFilterStore } from "@/store/parent";

import { ParentDailyReport } from "./ParentDailyReport";
import { ParentWeeklyReport } from "./ParentWeeklyReport";

type Props = {
  reportId: string;
  kind: "daily" | "weekly";
};

/**
 * A report link can be opened cold (from a push notification or a bookmark) with no child
 * chosen yet, so resolve the parent's first linked child before rendering the report.
 */
export const ParentDiaryReportGate = ({ reportId, kind }: Props) => {
  const numericId = Number(reportId);
  const { selectedStudentId, setStudent } = useStudentFilterStore();
  const { data: parentData, isPending } = useGetMyParentProfile();

  const students: Parent["linkedStudents"] = useMemo(() => parentData?.data?.linkedStudents ?? [], [parentData]);

  useEffect(() => {
    if (selectedStudentId || students.length === 0) return;
    setStudent(students[0].id, students[0].fullName);
  }, [selectedStudentId, students, setStudent]);

  if (!Number.isFinite(numericId) || numericId <= 0) {
    return (
      <div className="p-4 md:p-8">
        <ErrorComponent
          title="We could not find that report"
          description="The link may be out of date. Go back to the diary and open the report again."
          buttonText="Back to diary"
          url="/parents/daily-diary"
        />
      </div>
    );
  }

  if (isPending || (!selectedStudentId && students.length > 0)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="size-16" />
      </div>
    );
  }

  if (!selectedStudentId) {
    return (
      <div className="p-4 md:p-8">
        <ErrorComponent
          title="No child linked to your account"
          description="Contact your school so they can link your child to your parent account."
          buttonText="Back to diary"
          url="/parents/daily-diary"
        />
      </div>
    );
  }

  return kind === "daily" ? <ParentDailyReport reportId={numericId} /> : <ParentWeeklyReport weeklyReportId={numericId} />;
};
