"use client";
import { Avatar } from "@/components/Avatar";
import DeleteBin from "@/components/Icons/DeleteBin";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

export const LinkedStudents = ({
  setOpen,
  selectedStudents,
  setSelectedStudents,
}: {
  setOpen: (open: boolean) => void;
  selectedStudents: { id: number; name: string; avatar: string | null }[];
  setSelectedStudents: Dispatch<SetStateAction<{ id: number; name: string; avatar: string | null }[]>>;
}) => {
  const removeStudent = (id: number) => {
    const students = selectedStudents.filter(student => student.id !== id);
    setSelectedStudents(students);
  };
  return (
    <div className="space-y-6 py-6">
      <h2 className="text-lg font-semibold">
        Linked Students <small className="text-text-destructive text-xs">*</small>
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:gap-5">
        {selectedStudents.map(student => (
          <div
            key={student.id}
            className="bg-bg-card shadow-light border-border-default flex items-center justify-between rounded-xl border py-2 pr-4 pl-2"
          >
            <div className="flex items-center gap-2">
              <Avatar className="size-10" url={student.avatar ?? ""} />
              <p className="text-text-default text-sm font-medium">{student.name}</p>
            </div>

            <Button
              onClick={() => {
                removeStudent(student.id);
              }}
            >
              <DeleteBin fill="var(--color-icon-default-subtle)" className="size-4" />
            </Button>
          </div>
        ))}

        <div
          onClick={evt => {
            evt.stopPropagation();
            setOpen(true);
          }}
          className="text-text-default border-border-darker bg-bg-state-secondary flex h-10 w-full items-center justify-center gap-2 rounded-md border border-dashed! text-sm font-medium"
        >
          <PlusIcon className="text-icon-default-muted size-5" />
          <span>Link Student</span>
        </div>
      </div>
    </div>
  );
};
