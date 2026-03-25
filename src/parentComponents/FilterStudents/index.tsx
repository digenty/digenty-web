"use client";

import { Avatar } from "@/components/Avatar";
import { ExpandUpDownFill } from "@/components/Icons/ExpandUpDownFill";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const students = [
  { id: "1", name: "Damilare John", class: "JSS 1 A" },
  { id: "2", name: "Amaka Obi", class: "JSS 2 B" },
  { id: "3", name: "Tunde Bello", class: "SSS 1 C" },
];
export const StudentFilter = () => {
  const [selectedId, setSelectedId] = useState("1");

  const selected = students.find(s => s.id === selectedId);

  return (
    <div className="hidden md:block">
      <Select value={selectedId} onValueChange={setSelectedId}>
        <SelectTrigger className="border-border-default bg-bg-subtle h-12! w-59 rounded-full border [&>svg]:hidden">
          {selected ? (
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar />
                <div className="text-left">
                  <p className="text-text-default text-sm leading-5 font-medium">{selected.name}</p>
                  <p className="text-text-subtle text-xs leading-4">{selected.class}</p>
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
            <SelectItem key={student.id} value={student.id} className="">
              <div className="flex items-center gap-2">
                <Avatar />
                <div>
                  <p className="text-text-default text-sm leading-4 font-medium">{student.name}</p>
                  <p className="text-text-subtle text-xs">{student.class}</p>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
