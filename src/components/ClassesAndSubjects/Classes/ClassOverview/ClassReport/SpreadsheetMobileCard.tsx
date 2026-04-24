import { Avatar } from "@/components/Avatar";
import ArrowDown from "@/components/Icons/ArrowDown";
import ArrowUp from "@/components/Icons/ArrowUp";
import React from "react";
import { Button } from "@/components/ui/button";
import ShareBox from "@/components/Icons/ShareBox";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { StudentRow } from "./students";

export const SpreadsheetMobileCard = ({
  student,
  activeStudent,
  setActiveStudent,
  selectedTerm,
}: {
  student: StudentRow;
  activeStudent: number | undefined;
  setActiveStudent: React.Dispatch<React.SetStateAction<number | undefined>>;
  selectedTerm: string;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();

  const studentScore = student.terms.find(term => term.term === selectedTerm);
  const toggleCard = () => {
    setActiveStudent(prev => (prev === student.id ? undefined : student.id));
  };

  const handleViewReport = () => {
    const newParams = new URLSearchParams(params.toString());
    newParams.set("studentId", String(student.id));
    window.open(`${pathname}?${newParams.toString()}`, "_blank", "noopener,noreferrer");
  };

  return (
    <li key={student.id} className="border-border-default w-full rounded-sm border">
      <div
        onClick={toggleCard}
        aria-expanded={activeStudent === student.id}
        className="bg-bg-subtle flex w-full items-center justify-between rounded-sm p-3"
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10" />
          <div className="space-y-1.5 text-left">
            <div className="text-text-default text-sm font-medium">{student.name}</div>
            <div className="flex items-center gap-2">
              <div className="text-text-default text-xs font-normal">{studentScore?.totalPercentage?.toFixed(0)}%</div>
            </div>
          </div>
        </div>
        <div>
          {activeStudent === student.id ? <ArrowUp fill="var(--color-icon-default-muted)" /> : <ArrowDown fill="var(--color-icon-default-muted)" />}
        </div>
      </div>
      <div
        className={`text-sm transition-all duration-200 ${activeStudent === student.id ? "border-border-default flex flex-col border-t" : "hidden"}`}
      >
        {studentScore?.subjects.map(subject => (
          <div key={subject.subjectId} className="border-border-default flex h-12 border-b text-center last:border-b-0">
            <div className="bg-bg-subtle text-text-muted border-border-default flex w-1/2 items-center justify-center border-r px-4 py-2 capitalize">
              {subject.subjectName && subject.subjectName.toLowerCase()}
            </div>
            <div className="text-text-default flex w-1/2 items-center justify-center text-sm">{subject.score}</div>
          </div>
        ))}

        <div className="border-border-default flex h-12 border-b text-center">
          <div className="bg-bg-subtle text-text-muted border-border-default flex w-1/2 items-center justify-center border-r px-4 py-2">Total</div>
          <div className="text-text-default flex w-1/2 items-center justify-center text-sm">{studentScore?.totalScore || 0}</div>
        </div>

        <div className="border-border-default flex h-12 border-b text-center">
          <div className="bg-bg-subtle text-text-muted border-border-default flex w-1/2 items-center justify-center border-r px-4 py-2">
            Percentage
          </div>
          <div className="text-text-default flex w-1/2 items-center justify-center text-sm">{studentScore?.totalPercentage?.toFixed(0) || 0}%</div>
        </div>

        <div className="flex h-12 text-center">
          <div className="bg-bg-subtle text-text-muted border-border-default flex w-1/2 items-center justify-center border-r px-4 py-2">Position</div>
          <div className="text-text-default flex w-1/2 items-center justify-center text-sm">{studentScore?.position || 0}</div>
        </div>

        <div className="flex h-[46px] items-center justify-center px-3 py-1 text-center">
          <Button
            className="border-border-darker bg-bg-state-secondary! text-text-default h-8! w-full justify-between border px-4 font-normal"
            onClick={handleViewReport}
          >
            View Student Report
            <ShareBox fill="var(--color-icon-default-muted)" className="size-3" />
          </Button>
        </div>
      </div>
    </li>
  );
};
