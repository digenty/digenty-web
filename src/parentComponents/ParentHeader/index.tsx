"use client";

import Menu2 from "@/components/Icons/Menu2";
import { Button } from "@/components/ui/button";
import { useSidebarStore } from "@/store";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { StudentFilter } from "../FilterStudents";

export const ParentHeader = () => {
  const pathname = usePathname();
  const parentId = Number(pathname.split("/")[3]);

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
          <Image src="/icons/Logomark.svg" width={24} height={24} alt="Digenty logo" />
          <p className="text-text-default text-sm font-medium">Digenty</p>
        </div>
      </div>

      <div className="">
        <StudentFilter parentId={parentId} />
      </div>
    </header>
  );
};
