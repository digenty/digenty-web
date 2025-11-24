import { Avatar } from "@/components/Avatar";
import ArrowDown from "@/components/Icons/ArrowDown";
import ArrowUp from "@/components/Icons/ArrowUp";
import { Badge } from "@/components/ui/badge";
import { ScoreType } from "./types";

export const MobileCard = ({
  student,
  activeStudent,
  setActiveStudent,
}: {
  student: ScoreType;
  activeStudent?: number;
  setActiveStudent: React.Dispatch<React.SetStateAction<number | undefined>>;
}) => {
  return (
    <li key={student.id} className="border-border-default w-full rounded-md border">
      <button
        type="button"
        onClick={() => setActiveStudent(student.id)}
        aria-expanded={activeStudent === student.id}
        className="bg-bg-basic-gray-subtle flex w-full items-center justify-between p-3"
      >
        <div className="flex items-center gap-3">
          <Avatar username={student.studentName} className="h-10 w-10" />
          <div className="text-left">
            <div className="text-text-default text-sm font-medium">{student.studentName}</div>
            <div className="flex items-center gap-2">
              <div className="text-text-default text-sm font-normal">{student.totalScore}</div>
              <Badge className="text-text-subtle border-border-default bg-bg-badge-default h-4 w-4 rounded-md py-2 text-sm font-medium">
                {student.grade}
              </Badge>
            </div>
          </div>
        </div>
        <div>
          {activeStudent === student.id ? <ArrowUp fill="var(--color-icon-default-muted)" /> : <ArrowDown fill="var(--color-icon-default-muted)" />}
        </div>
      </button>
      <div
        className={`transition-all duration-200 ${activeStudent === student.id ? "border-border-default flex max-h-96 flex-col border opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="border-border-default grid grid-cols-2 items-center border-b">
          <span className="bg-bg-basic-gray-subtle text-text-muted border-border-default flex items-center justify-center border-r p-4">CA 1</span>
          <span className="text-text-default flex items-center justify-center p-4">{student.ca1Score}</span>
        </div>
        <div className="border-border-default grid grid-cols-2 items-center border-b">
          <span className="bg-bg-basic-gray-subtle text-text-muted border-border-default flex items-center justify-center border-r p-4">CA 2</span>
          <span className="text-text-default flex items-center justify-center p-4">{student.ca2Score}</span>
        </div>
        <div className="border-border-default grid grid-cols-2 items-center border-b">
          <span className="bg-bg-basic-gray-subtle text-text-muted border-border-default flex items-center justify-center border-r p-4">
            Exam Score
          </span>
          <span className="text-text-default flex items-center justify-center p-4">{student.examScore}</span>
        </div>
        <div className="border-border-default grid grid-cols-2 items-center border-b">
          <span className="bg-bg-basic-gray-subtle text-text-muted border-border-default flex items-center justify-center border-r p-4">Total</span>
          <span className="text-text-default flex items-center justify-center p-4">{student.totalScore}</span>
        </div>
        <div className="border-border-default grid grid-cols-2 items-center border-b">
          <span className="bg-bg-basic-gray-subtle text-text-muted border-border-default flex items-center justify-center border-r p-4">Grade</span>
          <span className="text-text-default flex items-center justify-center p-4">{student.grade}</span>
        </div>
        <div className="border-border-default grid grid-cols-2 items-center border-b">
          <span className="bg-bg-basic-gray-subtle text-text-muted border-border-default flex items-center justify-center border-r p-4">Remark</span>
          <span className="text-text-default flex items-center justify-center p-4">{student.remark}</span>
        </div>
      </div>
    </li>
  );
};
