import { Avatar } from "@/components/Avatar";
import ArrowDown from "@/components/Icons/ArrowDown";
import ArrowUp from "@/components/Icons/ArrowUp";
import { Badge } from "@/components/ui/badge";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { ScoreType } from "./types";

const RenderCell = ({ initialValue, isEditable }: { initialValue: string | number | undefined; isEditable: boolean }) => {
  const [value, setValue] = useState<string | number | undefined>(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const save = (evt: React.TouchEvent<HTMLInputElement>) => {
    console.log("being called");
    setIsEditing(false);
    setValue((evt.target as HTMLInputElement).value);
    // Save updated data here
  };

  const cancel = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setValue(evt.target.value);
    setIsEditing(false);
  };

  if (isEditing && isEditable) {
    return (
      // TODO: Restrict the input type to the type of data displayed in teh cell
      <Input
        ref={inputRef}
        value={value ?? ""}
        onChange={e => setValue(e.target.value)}
        className="text-text-muted bg-bg-input-soft! h-7! w-16 rounded-md border-none px-2 py-1 text-sm outline-none"
        onTouchEnd={evt => save(evt)}
        onBlur={cancel}
      />
    );
  }

  return (
    <div
      onTouchStart={() => setIsEditing(true)}
      className="text-text-default flex h-full w-20 flex-1 items-center justify-center overflow-y-auto px-4 text-wrap"
    >
      {value ?? 0}
    </div>
  );
};

export const MobileCard = ({
  student,
  activeStudent,
  setActiveStudent,
  isEditable = false,
}: {
  student: ScoreType;
  activeStudent?: number;
  setActiveStudent: React.Dispatch<React.SetStateAction<number | undefined>>;
  isEditable?: boolean;
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
          <Avatar username={student.studentName} className="h-10 w-10" />
          <div className="space-y-1.5 text-left">
            <div className="text-text-default text-sm font-medium">{student.studentName}</div>
            <div className="flex items-center gap-2">
              <div className="text-text-default text-xs font-normal">{student.totalScore}</div>
              <Badge className="text-text-subtle border-border-default bg-bg-badge-default h-4 w-4 rounded-md py-2 text-xs font-medium">
                {student.grade}
              </Badge>
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
          <div className="bg-bg-subtle text-text-muted border-border-default flex flex-1 items-center justify-center border-r px-4 py-2">CA 1</div>
          <div className="flex h-12 flex-1 items-center justify-center px-2">
            <RenderCell initialValue={student.ca1Score} isEditable={isEditable} />
          </div>
        </div>

        <div className="border-border-default flex border-b text-center">
          <span className="bg-bg-subtle text-text-muted border-border-default flex flex-1 items-center justify-center border-r px-4 py-2">CA 2</span>
          <div className="flex h-12 flex-1 items-center justify-center px-2">
            <RenderCell initialValue={student.ca2Score} isEditable={isEditable} />
          </div>
        </div>

        <div className="border-border-default flex border-b text-center">
          <span className="bg-bg-subtle text-text-muted border-border-default flex flex-1 items-center justify-center border-r px-4 py-2">
            Exam Score
          </span>
          <div className="flex h-12 flex-1 items-center justify-center px-2">
            <RenderCell initialValue={student.examScore} isEditable={isEditable} />
          </div>
        </div>

        <div className="border-border-default flex border-b text-center">
          <span className="bg-bg-subtle text-text-muted border-border-default flex flex-1 items-center justify-center border-r px-4 py-2">Total</span>
          <div className="flex h-12 flex-1 items-center justify-center px-2">
            <RenderCell initialValue={student.totalScore} isEditable={isEditable} />
          </div>
        </div>

        <div className="border-border-default flex border-b text-center">
          <span className="bg-bg-subtle text-text-muted border-border-default flex flex-1 items-center justify-center border-r px-4 py-2">Grade</span>
          <div className="flex h-12 flex-1 items-center justify-center px-2">
            <RenderCell initialValue={student.grade} isEditable={isEditable} />
          </div>
        </div>

        <div className="flex h-12 text-center">
          <span className="bg-bg-subtle text-text-muted border-border-default flex flex-1 items-center justify-center border-r px-4 py-2">
            Remark
          </span>
          <div className="flex flex-1 items-center justify-center px-2">
            <RenderCell initialValue={student.remark} isEditable={isEditable} />
          </div>
        </div>
      </div>
    </li>
  );
};
