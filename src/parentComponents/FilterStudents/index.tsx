"use client";

import { Student } from "@/api/types";
import { Avatar } from "@/components/Avatar";
import { ExpandUpDownFill } from "@/components/Icons/ExpandUpDownFill";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetParent } from "@/hooks/queryHooks/useParent";
import { useEffect, useState } from "react";

interface StudentFilterProps {
  parentId?: number;
  onSelect: (studentId: number, studentName: string) => void;
}

export const StudentFilter = ({ parentId, onSelect }: StudentFilterProps) => {
  const [selectedId, setSelectedId] = useState<string>("");
  const { data: parentData, isPending } = useGetParent(parentId);
  const students = parentData?.linkedStudents ?? [];

  useEffect(() => {
    if (students.length && !selectedId) {
      setSelectedId(String(students[0].id));
      onSelect(students[0].id, `${students[0].firstName} ${students[0].lastName}`);
    }
  }, [students]);

  const selected = students.find((s: Student) => String(s.id) === selectedId);

  if (isPending || !students.length) return <Skeleton className="bg-bg-input-soft h-12 w-59 rounded-full" />;

  return (
    <div className="hidden md:block">
      <Select
        value={selectedId}
        onValueChange={value => {
          const student = students.find((s: Student) => String(s.id) === value);
          setSelectedId(value);
          onSelect(Number(value), student ? `${student.firstName} ${student.lastName}` : "");
        }}
      >
        <SelectTrigger className="border-border-default bg-bg-subtle h-12! w-59 rounded-full border [&>svg]:hidden">
          {selected ? (
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar />
                <div className="text-left">
                  <p className="text-text-default text-sm leading-5 font-medium">
                    {" "}
                    {selected.firstName} {selected.lastName}
                  </p>
                </div>
              </div>
              <ExpandUpDownFill fill="var(--color-icon-default-muted)" />
            </div>
          ) : (
            <SelectValue placeholder="Select student" />
          )}
        </SelectTrigger>
        <SelectContent className="bg-bg-card border-border-default">
          {students.map((student: Student) => (
            <SelectItem key={student.id} value={String(student.id)}>
              <div className="flex items-center gap-2">
                {/* <Avatar url={student.image} /> */}
                <Avatar />
                <p className="text-text-default text-sm leading-4 font-medium">
                  {student.firstName} {student.lastName}
                </p>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
