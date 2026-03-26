"use client";

import React from "react";
import { ClassHeader } from "./ClassHeader";
import { ClassTable } from "./ClassTable";
import { useGetBranchTeachersClassSubjects } from "@/hooks/queryHooks/useSubject";

export default function Class() {
  const armId = 7;
  const { data, isLoading, isError } = useGetBranchTeachersClassSubjects(armId);
  const classData = data?.data.content ?? [];
  return (
    <div className="flex flex-col gap-4">
      <ClassHeader classData={classData} isLoading={isLoading} />
      <ClassTable classData={classData} isLoading={isLoading} isError={isError} />
    </div>
  );
}
