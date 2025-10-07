"use client";
import Image from "next/image";
import { Breadcrumb } from "./Breadcrumb";
import { Button } from "../ui/button";
import { useSidebarStore } from "@/store";
import { Avatar } from "../Avatar";

export const Header = () => {
  const { setIsSidebarOpen } = useSidebarStore();

  return (
    <header className="border-default-transparent/10 flex h-16 w-full items-center justify-between border-b px-4 py-4 text-zinc-950 md:px-8">
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

      <div className="flex items-center gap-4">
        <Button variant="ghost" className="border-default-transparent/15 hidden h-7 rounded-full border border-dashed px-2! py-0.5! md:flex">
          <Image src="/icons/question-fill.svg" width={16} height={16} alt="Close button" />
          <p className="text-sm font-medium">Help</p>
        </Button>

        <Button variant="ghost" className="p-0!">
          <Image src="/icons/notification-2.svg" width={16} height={16} alt="Close button" />
        </Button>

        <Avatar username="John Doe" className="size-8" />
      </div>
    </header>
  );
};
