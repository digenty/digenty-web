"use client";
import { useSidebarStore } from "@/store";
import Image from "next/image";
import { Avatar } from "../Avatar";
import Menu2 from "../Icons/Menu2";
import Notification2 from "../Icons/Notification2";
import QuestionFill from "../Icons/QuestionFill";
import { Button } from "../ui/button";
import { Breadcrumb } from "./Breadcrumb";

export const Header = () => {
  const { setIsSidebarOpen } = useSidebarStore();

  return (
    <header className="border-border-default flex h-16 w-full items-center justify-between border-b px-4 py-4 text-zinc-950 md:px-8">
      <Breadcrumb className="hidden md:block" />

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

      <div className="flex items-center gap-4">
        <Button variant="ghost" className="border-border-darker hidden h-7 rounded-full border border-dashed px-2! py-0.5! md:flex">
          <QuestionFill fill="var(--color-icon-default-subtle)" />
          <p className="text-text-default text-sm font-medium">Help</p>
        </Button>

        <Button variant="ghost" className="p-0!">
          <Notification2 fill="var(--color-icon-default-subtle)" />
        </Button>

        <div className="border-border-darker rounded-full">
          <Avatar username="John Doe" className="size-8" />
        </div>
      </div>
    </header>
  );
};
