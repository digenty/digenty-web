import { Avatar } from "@/components/Avatar";
import ArrowDown from "@/components/Icons/ArrowDown";
import ArrowUp from "@/components/Icons/ArrowUp";
import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PromotionStudent } from "../students";
import { StudentCumulative } from "@/api/types";

const termsOptions = ["FIRST", "SECOND", "THIRD"];
const actions = ["Promote", "Repeat", "Double Promotion"];

export const PromotionMobileCard = ({
  student,
  activeStudent,
  setActiveStudent,
}: {
  student: StudentCumulative;
  activeStudent?: number;
  setActiveStudent: React.Dispatch<React.SetStateAction<number | undefined>>;
}) => {
  const [actionSelected, setActionSelected] = useState(actions[0]);

  const toggleCard = () => {
    setActiveStudent(prev => (prev === student.studentId ? undefined : student.studentId));
  };

  return (
    <li key={student.studentId} className="border-border-default w-full rounded-sm border">
      <div
        onClick={toggleCard}
        aria-expanded={activeStudent === student.studentId}
        className="bg-bg-subtle flex w-full items-center justify-between rounded-sm p-3"
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10" />
          <div className="space-y-1.5 text-left">
            <div className="text-text-default text-sm font-medium">{student.studentName}</div>
          </div>
        </div>
        <div>
          {activeStudent === student.studentId ? <ArrowUp fill="var(--color-icon-default-muted)" /> : <ArrowDown fill="var(--color-icon-default-muted)" />}
        </div>
      </div>

      <div
        className={`text-sm transition-all duration-200 ${activeStudent === student.studentId ? "border-border-default flex flex-col border-t" : "hidden"}`}
      >
        {/* {termsOptions.map(termOption => {
          const studentScore = student.terms.find(term => term.term === termOption);
          if (studentScore?.term) {
            return (
              <div key={`${student.id}-${termOption}`} className="border-border-default flex h-12 border-b text-center last:border-b-0">
                <div className="bg-bg-subtle text-text-muted border-border-default flex flex-1 items-center justify-center border-r px-4 py-2">
                  {studentScore?.term === "FIRST" ? "1st" : studentScore?.term === "SECOND" ? "2nd" : "3rd"} Term %
                </div>
                <div className="text-text-default flex flex-1 items-center justify-center text-sm">{studentScore?.totalPercentage}</div>
              </div>
            );
          }
        })} */}

         <div className="border-border-default flex h-12 border-b text-center last:border-b-0">
                <div className="bg-bg-subtle text-text-muted border-border-default flex flex-1 items-center justify-center border-r px-4 py-2">
                  1st Term %
                </div>
                <div className="text-text-default flex flex-1 items-center justify-center text-sm">{student.firstTermPercentage}</div>
              </div>

               <div className="border-border-default flex h-12 border-b text-center last:border-b-0">
                <div className="bg-bg-subtle text-text-muted border-border-default flex flex-1 items-center justify-center border-r px-4 py-2">
                  2nd Term %
                </div>
                <div className="text-text-default flex flex-1 items-center justify-center text-sm">{student.secondTermPercentage}</div>
              </div>

               <div className="border-border-default flex h-12 border-b text-center last:border-b-0">
                <div className="bg-bg-subtle text-text-muted border-border-default flex flex-1 items-center justify-center border-r px-4 py-2">
                  3rd Term %
                </div>
                <div className="text-text-default flex flex-1 items-center justify-center text-sm">{student.thirdTermPercentage}</div>
              </div>

        <div className="flex h-[46px] justify-center px-3 py-1 text-center">
          <Select value={actionSelected} onValueChange={setActionSelected}>
            <SelectTrigger className="border-border-darker bg-bg-state-secondary! w-full border">
              <SelectValue>
                <div className="flex items-center gap-2">
                  <span className="text-text-default text-sm font-medium">{actionSelected}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-border-default">
              {actions.map(action => (
                <SelectItem key={action} value={action} className="text-text-default text-sm">
                  {action}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </li>
  );
};
