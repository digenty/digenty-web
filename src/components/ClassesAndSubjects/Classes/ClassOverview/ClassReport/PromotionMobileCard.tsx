import { Avatar } from "@/components/Avatar";
import ArrowDown from "@/components/Icons/ArrowDown";
import ArrowUp from "@/components/Icons/ArrowUp";
import React, { useState } from "react";
import { StudentRow } from "./students";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const termsOptions = ["First Term", "Second Term", "Third Term"];
const actions = ["Promote", "Repeat", "Double Promotion"];

export const PromotionMobileCard = ({
  student,
  activeStudent,
  setActiveStudent,
}: {
  student: StudentRow;
  activeStudent?: string;
  setActiveStudent: React.Dispatch<React.SetStateAction<string | undefined>>;
}) => {
  const [actionSelected, setActionSelected] = useState(actions[0]);

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
          <Avatar className="h-10 w-10" />
          <div className="space-y-1.5 text-left">
            <div className="text-text-default text-sm font-medium">{student.name}</div>
          </div>
        </div>
        <div>
          {activeStudent === student.id ? <ArrowUp fill="var(--color-icon-default-muted)" /> : <ArrowDown fill="var(--color-icon-default-muted)" />}
        </div>
      </div>

      <div
        className={`text-sm transition-all duration-200 ${activeStudent === student.id ? "border-border-default flex flex-col border-t" : "hidden"}`}
      >
        {termsOptions.map(termOption => {
          const studentScore = student.terms.find(term => term.term === termOption);
          return (
            <div key={studentScore?.term} className="border-border-default flex h-12 border-b text-center last:border-b-0">
              <div className="bg-bg-subtle text-text-muted border-border-default flex flex-1 items-center justify-center border-r px-4 py-2">
                {studentScore?.term} %
              </div>
              <div className="text-text-default flex flex-1 items-center justify-center text-sm">{studentScore?.totalPercentage}</div>
            </div>
          );
        })}

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
