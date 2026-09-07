"use client";

import { SkillRating } from "@/api/types";
import { ArrowDown, ArrowUp } from "@digenty/icons";
import { Avatar } from "@/components/Avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { skillColumnId } from "./Columns";

export const DevelopmentMobileCard = ({
  studentId,
  studentName,
  skills,
  ratings,
  activeStudent,
  setActiveStudent,
  onRate,
  editable,
}: {
  studentId: number;
  studentName: string;
  skills: SkillRating[];
  ratings: Record<string, string>;
  activeStudent?: number;
  setActiveStudent: React.Dispatch<React.SetStateAction<number | undefined>>;
  onRate: (columnId: string, value: string) => void;
  editable: boolean;
}) => {
  const isOpen = activeStudent === studentId;

  return (
    <li className="border-border-default w-full rounded-sm border">
      <div
        onClick={() => setActiveStudent(prev => (prev === studentId ? undefined : studentId))}
        aria-expanded={isOpen}
        className="bg-bg-subtle flex w-full items-center justify-between rounded-sm p-3"
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10" />
          <div className="text-text-default text-sm font-medium">{studentName}</div>
        </div>
        <div>{isOpen ? <ArrowUp fill="var(--color-icon-default-muted)" /> : <ArrowDown fill="var(--color-icon-default-muted)" />}</div>
      </div>

      <div className={`text-sm transition-all duration-200 ${isOpen ? "border-border-default flex max-h-96 flex-col border-t" : "hidden"}`}>
        {skills.map((skill, index) => {
          const columnId = skillColumnId(skill, index);
          return (
            <div key={columnId} className="border-border-default flex items-center justify-between border-b px-4 py-2 last:border-b-0">
              <span className="text-text-muted text-sm">{skill.skillName ?? "Skill"}</span>
              {editable ? (
                <Select value={ratings[columnId] ?? ""} onValueChange={value => onRate(columnId, value)}>
                  <SelectTrigger className="bg-bg-input-soft! text-text-default h-8 w-16 rounded-md border-none px-2 py-1 text-center text-sm font-normal">
                    <SelectValue placeholder="-" />
                  </SelectTrigger>
                  <SelectContent className="bg-bg-default border-border-default">
                    {[5, 4, 3, 2, 1].map(rating => (
                      <SelectItem key={rating} value={String(rating)} className="text-text-default text-sm">
                        {rating}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <span className="text-text-default text-sm">{ratings[columnId] || "-"}</span>
              )}
            </div>
          );
        })}
      </div>
    </li>
  );
};
