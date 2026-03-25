"use client";

import { Avatar } from "@/components/Avatar";
import { ExpandUpDownFill } from "@/components/Icons/ExpandUpDownFill";
import Menu2 from "@/components/Icons/Menu2";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSidebarStore } from "@/store";
import Image from "next/image";
import React, { useState } from "react";

const students = [
  { id: "1", name: "Damilare John", class: "JSS 1 A" },
  { id: "2", name: "Amaka Obi", class: "JSS 2 B" },
  { id: "3", name: "Tunde Bello", class: "SSS 1 C" },
];
export const ParentHeader = () => {
  const [selectedId, setSelectedId] = useState("1");
  const { setIsSidebarOpen } = useSidebarStore();
  const selected = students.find(s => s.id === selectedId);

  return (
    <header className="border-border-default sticky flex h-16 w-full items-center justify-between border-b px-4 py-4 text-zinc-950 md:hidden md:px-8">
      <div className="flex items-center gap-5 md:hidden">
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => {
            setIsSidebarOpen(true);
          }}
        >
          <Menu2 fill="var(--color-icon-default-subtle)" className="size-5" />
        </Button>

        <div className="flex items-center gap-2">
          <Image src="/icons/Logomark.svg" width={24} height={24} alt="Digenty logo" />
          <p className="text-text-default text-sm font-medium">Digenty</p>
        </div>
      </div>

      <div className="">
        <Select value={selectedId} onValueChange={setSelectedId}>
          <SelectTrigger className="border-border-default bg-bg-subtle h-8! w-fit rounded-full border [&>svg]:hidden">
            {selected ? (
              <div className="flex w-full items-center justify-between gap-3">
                <Avatar className="size-6" />

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
    </header>
  );
};
