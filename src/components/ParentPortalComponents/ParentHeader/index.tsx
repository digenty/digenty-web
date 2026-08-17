"use client";

import { Button } from "@/components/ui/button";
import { useSidebarStore } from "@/store";
import Image from "next/image";
import { StudentFilter } from "../FilterStudents";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { Menu2 } from "@digenty/icons";

export const ParentHeader = () => {
  const { id: parentId } = useLoggedInUser();

  const { setIsSidebarOpen } = useSidebarStore();

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
          <Image src="/icons/Logomark.svg" width={44} height={44} alt="Digenty logo" />
          {/* <p className="text-text-default text-sm font-medium">Digenty</p> */}
        </div>
      </div>

      <div className="">
        <StudentFilter parentId={parentId} />
      </div>
    </header>
  );
};
