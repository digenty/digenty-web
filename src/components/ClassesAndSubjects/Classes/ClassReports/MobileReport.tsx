import { Avatar } from "@/components/Avatar";
import ArrowDown from "@/components/Icons/ArrowDown";
import ArrowUp from "@/components/Icons/ArrowUp";

import { ClassReportProps } from "../types";

export const MobileReport = ({
  student,
  activeStudent,
  setActiveStudent,
}: {
  student: ClassReportProps;
  activeStudent?: number;
  setActiveStudent: React.Dispatch<React.SetStateAction<number | undefined>>;
}) => {
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
          <div className="text-left">
            <div className="text-text-default text-sm font-medium">{student.subject}</div>
            <div className="">
              <div className="text-text-default text-xs font-normal">{student.subject}</div>
            </div>
          </div>
        </div>
        <div>
          {activeStudent === student.id ? <ArrowUp fill="var(--color-icon-default-muted)" /> : <ArrowDown fill="var(--color-icon-default-muted)" />}
        </div>
      </div>
      <div
        className={`text-sm transition-all duration-200 ${activeStudent === student.id ? "border-border-default flex max-h-96 flex-col border-t" : "hidden"}`}
      >
        <div className="border-border-default flex border-b text-center">
          <div className="bg-bg-subtle text-text-muted border-border-default flex flex-1 items-center justify-center border-r px-4 py-2">Subject</div>
          <div className="text-text-default flex h-12 flex-1 items-center justify-center px-2">
            <span>{student.subject}</span>
          </div>
        </div>

        <div className="border-border-default flex border-b text-center">
          <span className="bg-bg-subtle text-text-muted border-border-default flex flex-1 items-center justify-center border-r px-4 py-2">
            Subject
          </span>
          <div className="text-text-default flex h-12 flex-1 items-center justify-center px-2">
            <span>{student.subject}</span>
          </div>
        </div>

        <div className="border-border-default flex border-b text-center">
          <span className="bg-bg-subtle text-text-muted border-border-default flex flex-1 items-center justify-center border-r px-4 py-2">
            Subject
          </span>
          <div className="text-text-default flex h-12 flex-1 items-center justify-center px-2">
            <span>{student.subject}</span>
          </div>
        </div>

        <div className="border-border-default flex border-b text-center">
          <span className="bg-bg-subtle text-text-muted border-border-default flex flex-1 items-center justify-center border-r px-4 py-2">
            Subject
          </span>
          <div className="text-text-default flex h-12 flex-1 items-center justify-center px-2">
            <span>{student.subject}</span>
          </div>
        </div>

        <div className="border-border-default flex border-b text-center">
          <span className="bg-bg-subtle text-text-muted border-border-default flex flex-1 items-center justify-center border-r px-4 py-2">
            Subject
          </span>
          <div className="text-text-default flex h-12 flex-1 items-center justify-center px-2">
            <span>{student.subject}</span>
          </div>
        </div>

        <div className="flex h-12 text-center">
          <span className="bg-bg-subtle text-text-muted border-border-default flex flex-1 items-center justify-center border-r px-4 py-2">
            Subject
          </span>
          <div className="text-text-default flex flex-1 items-center justify-center px-2">
            <span>{student.subject}</span>
          </div>
        </div>
      </div>
    </li>
  );
};
