"use client";

import { useGetBranchTeachersClassSubjects } from "@/hooks/queryHooks/useSubject";
import { usePathname } from "next/navigation";
import { ClassHeader } from "./ClassHeader";
import { ClassTable } from "./ClassTable";

export default function Class() {
  const pathname = usePathname();
  const armId = pathname.split("/")[5];
  const classId = pathname.split("/")[3];
  const { data, isLoading, isError } = useGetBranchTeachersClassSubjects(Number(armId));
  const classData = data?.data?.data?.subjectReportResponseDtoList ?? [];

  return (
    <div className="flex flex-col gap-4">
      <ClassHeader classData={classData} isLoading={isLoading} armId={armId} classId={classId} />
      <ClassTable classData={classData} isLoading={isLoading} isError={isError} />
    </div>
  );
}
