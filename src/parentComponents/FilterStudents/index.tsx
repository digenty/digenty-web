"use client";

import { Student } from "@/api/types";
import { Avatar } from "@/components/Avatar";
import { ExpandUpDownFill } from "@/components/Icons/ExpandUpDownFill";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetParent } from "@/hooks/queryHooks/useParent";
import { useStudentFilterStore } from "@/store/parent";
import { useEffect, useState } from "react";

interface StudentFilterProps {
  parentId?: number;
  onSelect?: (studentId: number, studentName: string) => void;
}

export const StudentFilter = ({ parentId, onSelect }: StudentFilterProps) => {
  const { setStudent } = useStudentFilterStore();
  const [selectedId, setSelectedId] = useState<string>("");
  const { data: parentData, isPending } = useGetParent(parentId);
  const students = parentData?.linkedStudents ?? [];

  useEffect(() => {
    if (students.length && !selectedId) {
      const first = students[0];
      setSelectedId(String(first.id));

      const name = `${first.firstName} ${first.lastName}`;

      onSelect?.(first.id, name);
      setStudent(first.id, name);
    }
  }, [students]);

  const selected = students.find((s: Student) => String(s.id) === selectedId);

  if (isPending || !students.length) return <Skeleton className="bg-bg-input-soft h-8 w-15 rounded-full md:h-12 md:w-59" />;

  return (
    <div className="">
      <Select
        value={selectedId}
        onValueChange={value => {
          const student = students.find((s: Student) => String(s.id) === value);
          setSelectedId(value);
          const id = Number(value);
          const name = student ? `${student.firstName} ${student.lastName}` : "";
          onSelect?.(id, name);
          setStudent(id, name);
        }}
      >
        <SelectTrigger className="border-border-default bg-bg-subtle h-8 w-15 rounded-full border md:h-12 md:w-59 [&>svg]:hidden">
          {selected ? (
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar />
                <div className="text-left">
                  <p className="text-text-default hidden text-sm leading-5 font-medium md:block">
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
