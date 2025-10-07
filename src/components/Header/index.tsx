"use client";
import Image from "next/image";
import { Breadcrumb } from "./Breadcrumb";
import { Button } from "../ui/button";
import { useSidebarStore } from "@/store";

export const Header = () => {
  const { setIsSidebarOpen } = useSidebarStore();

  return (
    <header className="border-default-transparent/10 flex h-16 w-full items-center border-b px-4 py-4 text-zinc-950 md:px-8">
      <Breadcrumb className="hidden md:block" />

      <div className="flex items-center gap-5 md:hidden">
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => {
            console.log("being clicked");
            setIsSidebarOpen(true);
          }}
        >
          <Image src="/icons/menu-2.svg" width={20} height={20} alt="Menu" />
        </Button>

        <div className="flex items-center gap-2">
          <Image src="/icons/Logomark.svg" width={24} height={24} alt="Digenty logo" />
          <p className="text-sm font-medium text-zinc-950">Digenty</p>
        </div>
      </div>
    </header>
  );
};
