"use client";

import { Parent } from "@/api/types";
import { Avatar } from "@/components/Avatar";
import { ExpandUpDownFill } from "@digenty/icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetParent } from "@/hooks/queryHooks/useParent";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { useStudentFilterStore } from "@/store/parent";
import { useEffect, useState } from "react";

type LinkedStudent = Parent["linkedStudents"][number];

interface StudentFilterProps {
  parentId?: number;
  onSelect?: (studentId: number, studentName: string) => void;
}

export const StudentFilter = ({ parentId, onSelect }: StudentFilterProps) => {
  const { setStudent } = useStudentFilterStore();
  const { id: loggedInUserId } = useLoggedInUser();
  const [selectedId, setSelectedId] = useState<string>("");
  // Fall back to the logged-in parent when a valid parentId isn't supplied (NaN from URL parsing is falsy).
  const { data: parentData, isPending } = useGetParent(parentId || loggedInUserId);
  const students: LinkedStudent[] = parentData?.data?.linkedStudents ?? [];

  useEffect(() => {
    if (students.length && !selectedId) {
      const first = students[0];
      setSelectedId(String(first.id));

      onSelect?.(first.id, first.fullName);
      setStudent(first.id, first.fullName);
    }
  }, [students]);

  const selected = students.find(s => String(s.id) === selectedId);

  if (isPending || !students.length) return <Skeleton className="bg-bg-input-soft h-10 w-18 rounded-full md:h-12 md:w-59" />;

  return (
    <div className="">
      <Select
        value={selectedId}
        onValueChange={value => {
          const student = students.find(s => String(s.id) === value);
          setSelectedId(value);
          const id = Number(value);
          const name = student?.fullName ?? "";
          onSelect?.(id, name);
          setStudent(id, name);
        }}
      >
        <SelectTrigger className="border-border-default bg-bg-subtle flex h-10 w-18 items-center justify-between gap-1 rounded-full border px-1.5 py-0 md:h-12 md:w-59 md:gap-2 md:px-2.5 md:py-2 [&>svg]:hidden">
          {selected ? (
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar url={selected.image ?? undefined} />
                <div className="text-left">
                  <p className="text-text-default hidden text-sm leading-5 font-medium md:block">{selected.fullName}</p>
                </div>
              </div>
              <ExpandUpDownFill fill="var(--color-icon-default-muted)" />
            </div>
          ) : (
            <SelectValue placeholder="Select student" />
          )}
        </SelectTrigger>
        <SelectContent className="bg-bg-card border-border-default">
          {students.map(student => (
            <SelectItem key={student.id} value={String(student.id)}>
              <div className="flex items-center gap-2">
                <Avatar url={student.image ?? undefined} />
                <p className="text-text-default text-sm leading-4 font-medium">{student.fullName}</p>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
