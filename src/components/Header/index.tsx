"use client";
import { Menu2, Notification2, QuestionFill } from "@digenty/icons";
import { useSidebarStore } from "@/store";
import Image from "next/image";
import { Avatar } from "../Avatar";

import { Button } from "../ui/button";
import { Breadcrumb } from "./Breadcrumb";
import { useRouter } from "next/navigation";
import { useGetUserProfile } from "@/hooks/queryHooks/useProfile";

export const Header = () => {
  const { setIsSidebarOpen } = useSidebarStore();
  const router = useRouter();
  const { data } = useGetUserProfile();

  return (
    <header className="border-border-default sticky flex h-16 w-full items-center justify-between border-b px-4 py-4 text-zinc-950 md:px-8">
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
          <Image src="/icons/Logomark.svg" width={55} height={23} alt="Axis logo" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* <Button variant="ghost" className="border-border-darker hidden h-7 rounded-full border border-dashed px-2! py-0.5! md:flex">
          <QuestionFill fill="var(--color-icon-default-subtle)" />
          <p className="text-text-default text-sm font-medium">Help</p>
        </Button>

        <Button variant="ghost" className="p-0!">
          <Notification2 fill="var(--color-icon-default-subtle)" />
        </Button> */}

        <div onClick={() => router.push("/staff/profile")} className="border-border-darker cursor-pointer rounded-full">
          <Avatar className="size-8" url={data?.data?.image || undefined} />
        </div>
      </div>
    </header>
  );
};
