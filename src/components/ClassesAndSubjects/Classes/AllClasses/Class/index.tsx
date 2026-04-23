"use client";

import { useGetBranchTeachersClassSubjects } from "@/hooks/queryHooks/useSubject";
import { usePathname } from "next/navigation";
import { ClassHeader } from "./ClassHeader";
import { ClassTable } from "./ClassTable";
import { Skeleton } from "@/components/ui/skeleton";

export default function Class() {
  const pathname = usePathname();
  const armId = pathname.split("/")[6];
  const classId = pathname.split("/")[4];

  const { data, isLoading, isError } = useGetBranchTeachersClassSubjects(Number(armId));

  const classData = data?.data?.data?.subjectReportResponseDtoList ?? [];
  const classTeacherName = data?.data?.data?.classTeacherName || "--";

  return (
    <div className="flex flex-col gap-4">
      <ClassHeader classData={classData} isLoading={isLoading} armId={armId} classId={classId} classTeacherName={classTeacherName} />

      {isLoading && !data && (
        <div className="px-4 py-4 md:px-8">
          <Skeleton className="bg-bg-state-soft h-200 w-full rounded-md" />
        </div>
      )}
      <ClassTable
        classData={classData}
        isLoading={isLoading}
        isError={isError}
        armId={Number(armId)}
        classId={Number(classId)}
        classArmName={data?.data?.data?.classArmName || ""}
      />
    </div>
  );
}
