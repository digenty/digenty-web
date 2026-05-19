"use client";

import { ArrowDown, ArrowUp } from "@digenty/icons";
import { Avatar } from "@/components/Avatar";

import { Badge } from "@/components/ui/badge";
import { StudentResult } from ".";

export const MobileCard = ({
  student,
  activeStudent,
  assessmentHeader,
  setActiveStudent,
}: {
  student: StudentResult;
  activeStudent?: number;
  assessmentHeader: string[];
  setActiveStudent: React.Dispatch<React.SetStateAction<number | undefined>>;
}) => {
  return (
    <li key={student.studentId} className="border-border-default w-full rounded-sm border">
      <div
        onClick={() => setActiveStudent(prev => (prev === student.studentId ? undefined : student.studentId))}
        aria-expanded={activeStudent === student.studentId}
        className="bg-bg-subtle flex w-full items-center justify-between rounded-sm p-3"
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10" />
          <div className="space-y-1.5 text-left">
            <div className="text-text-default text-sm font-medium">{student.studentName}</div>
            <div className="flex items-center gap-2">
              <div className="text-text-default text-xs font-normal">{student.total}</div>
              <Badge className="text-text-subtle border-border-default bg-bg-badge-default h-4 w-4 rounded-md py-2 text-xs font-medium">
                {student.grade || "-"}
              </Badge>
            </div>
          </div>
        </div>
        <div>
          {activeStudent === student.studentId ? (
            <ArrowUp fill="var(--color-icon-default-muted)" />
          ) : (
            <ArrowDown fill="var(--color-icon-default-muted)" />
          )}
        </div>
      </div>

      <div
        className={`text-sm transition-all duration-200 ${
          activeStudent === student.studentId ? "border-border-default flex max-h-96 flex-col border-t" : "hidden"
        }`}
      >
        {assessmentHeader.map((assessment, idx, arr) => (
          <div key={assessment} className={`flex text-center ${idx < arr.length - 1 ? "border-border-default border-b" : ""}`}>
            <span className="bg-bg-subtle text-text-muted border-border-default flex flex-1 items-center justify-center border-r px-4 py-2">
              {assessment}
            </span>
            <div className="flex h-12 flex-1 items-center justify-center px-2">{student[assessment]}</div>
          </div>
        ))}
      </div>
    </li>
  );
};
