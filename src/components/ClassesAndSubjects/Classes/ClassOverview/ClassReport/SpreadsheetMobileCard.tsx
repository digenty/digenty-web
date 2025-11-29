import { Avatar } from "@/components/Avatar";
import ArrowDown from "@/components/Icons/ArrowDown";
import ArrowUp from "@/components/Icons/ArrowUp";
import React from "react";
import { StudentRow } from "./students";

export const SpreadsheetMobileCard = ({
  student,
  activeStudent,
  setActiveStudent,
  termSelected,
}: {
  student: StudentRow;
  activeStudent?: string;
  setActiveStudent: React.Dispatch<React.SetStateAction<string | undefined>>;
  termSelected: string;
}) => {
  const studentScore = student.terms.find(term => term.term === termSelected);
  const toggleCard = () => {
    setActiveStudent(prev => (prev === student.id ? undefined : student.id));
  };

  return (
    <li key={student.id} className="border-border-default w-full rounded-sm border">
      <div
        onClick={toggleCard}
        aria-expanded={activeStudent === student.id}
        className="bg-bg-subtle flex w-full items-center justify-between rounded-sm p-3"
      >
        <div className="flex items-center gap-3">
          <Avatar username={student.name} className="h-10 w-10" />
          <div className="space-y-1.5 text-left">
            <div className="text-text-default text-sm font-medium">{student.name}</div>
            <div className="flex items-center gap-2">
              <div className="text-text-default text-xs font-normal">{studentScore?.totalPercentage}%</div>
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
            <div className="bg-bg-subtle text-text-muted border-border-default flex flex-1 items-center justify-center border-r px-4 py-2">
              {subject.subjectName}
            </div>
            <div className="text-text-default flex flex-1 items-center justify-center text-sm">{subject.score}</div>
          </div>
        ))}

        <div className="border-border-default flex h-12 border-b text-center">
          <div className="bg-bg-subtle text-text-muted border-border-default flex flex-1 items-center justify-center border-r px-4 py-2">Total</div>
          <div className="text-text-default flex flex-1 items-center justify-center text-sm">{490}</div>
        </div>

        <div className="border-border-default flex h-12 border-b text-center">
          <div className="bg-bg-subtle text-text-muted border-border-default flex flex-1 items-center justify-center border-r px-4 py-2">
            Percentage
          </div>
          <div className="text-text-default flex flex-1 items-center justify-center text-sm">{40}%</div>
        </div>

        <div className="flex h-12 text-center">
          <div className="bg-bg-subtle text-text-muted border-border-default flex flex-1 items-center justify-center border-r px-4 py-2">
            Position
          </div>
          <div className="text-text-default flex flex-1 items-center justify-center text-sm">3rd</div>
        </div>
      </div>
    </li>
  );
};
