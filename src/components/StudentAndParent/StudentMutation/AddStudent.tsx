"use client";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Avatar } from "../../Avatar";
import DeleteBin from "../../Icons/DeleteBin";
import { Button } from "../../ui/button";
import { AcademicInformation } from "./AcademicInformation";
import { ContactInformation } from "./ContactInformation";
import { PersonalInformation } from "./PersonalInformation";
import { ProfilePicture } from "./ProfilePicture";
import { Tags } from "./Tags";

export const AddStudent = () => {
  const [date, setDate] = useState<Date>(new Date());

  const [tags, setTags] = useState<string[]>([]);

  return (
    <div className="pb-12.5">
      <div className="border-border-default bg-bg-card-subtle flex justify-between border-b px-4 py-3 md:px-30 xl:px-70">
        <h1 className="text-text-default text-base font-semibold">
          Add <span className="hidden md:inline">New</span> Student
        </h1>
        <div className="bg-bg-badge-default text-text-subtle border-border-default flex h-6 w-8.5 items-center justify-center rounded-md border p-1 text-sm md:hidden">
          1/3
        </div>
      </div>

      <div className="text-text-default p-4 md:px-30 md:py-8 xl:px-70">
        <ProfilePicture />

        <PersonalInformation date={date} setDate={setDate} />

        <ContactInformation />

        <AcademicInformation />

        {/* Tags */}
        <Tags tags={tags} setTags={setTags} />

        {/* Linked Parents */}
        <div className="space-y-6 py-6">
          <h2 className="text-lg font-semibold">Linked Parents</h2>

          <div className="grid grid-cols-1 gap-6 sm:gap-5">
            <div className="bg-bg-card shadow-light border-border-default flex items-center justify-between rounded-xl border py-2 pr-4 pl-2">
              <div className="flex items-center gap-2">
                <Avatar username="Damilare John" className="size-10" url="" />
                <p className="text-text-default text-sm font-medium">Damilare John</p>
              </div>

              <Button>
                <DeleteBin fill="var(--color-icon-default-subtle)" className="size-4" />
              </Button>
            </div>

            <Button
              onClick={() => {}}
              className="text-text-default border-border-darker bg-bg-state-secondary h-10 w-full border border-dashed! text-sm font-medium"
            >
              <PlusIcon className="text-icon-default-muted" />
              <span>Link Parent</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
