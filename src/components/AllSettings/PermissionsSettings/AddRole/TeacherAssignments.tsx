import BookOpen from "@/components/Icons/BookOpen";
import Group from "@/components/Icons/Group";
import { Toggle } from "@/components/Toggle";
import React from "react";

export const TeacherAssignments = () => {
  return (
    <div className="flex flex-col gap-6 pb-6">
      <div className="border-border-default my-6 flex w-full flex-col gap-4 rounded-md border p-4 md:p-6">
        <div className="flex flex-col gap-1">
          <div className="text-text-default text-lg font-semibold">Teacher Assignments</div>
          <div className="text-text-subtle text-sm">
            Set up class and subject teacher assignments. Academic permissions are automatically granted based on these assignments.
          </div>
        </div>

        <div className="border-border-default flex items-center justify-between gap-4 rounded-md border p-2 md:p-4">
          <div className="flex items-center gap-4">
            <div className="bg-bg-state-soft-hover rounded-sm p-1">
              <Group fill="var(--color-icon-default-subtle)" className="size-6" />
            </div>
            <div className="flex flex-col">
              <div className="text-text-default text-sm font-medium">Class Teacher</div>
              <div className="text-text-muted text-xs">Assign specific classes this teacher will manage</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Toggle />
          </div>
        </div>
        <div className="border-border-default w-full border-b"></div>

        <div className="border-border-default flex items-center justify-between gap-4 rounded-md border p-2 md:p-4">
          <div className="flex items-center gap-4">
            <div className="bg-bg-state-soft-hover rounded-sm p-1">
              <BookOpen fill="var(--color-icon-default-subtle)" className="size-6" />
            </div>
            <div className="flex flex-col">
              <div className="text-text-default text-sm font-medium">Subject Teacher</div>
              <div className="text-text-muted text-xs">Assign subjects and select which classes they apply to</div>
            </div>
          </div>
          <div className="flex items-center">
            <Toggle />
          </div>
        </div>
        {/*  */}
      </div>

      <div className="border-border-default bg-bg-basic-blue-subtle flex flex-col gap-2 rounded-md border px-5 py-3">
        <div className="text-text-subtle text-sm font-semibold">Automatic Academic Permissions</div>
        <div className="text-text-subtle text-xs">Once assignments are made, the following permissions are automatically granted:</div>
        <ul className="flex list-disc flex-col gap-2 pl-4">
          <li className="text-text-subtle">
            <div className="font-medium"> Class Teachers:</div> View results, input scores, and comment on results for assigned classes
          </li>

          <li className="text-text-subtle">
            <div className="font-medium"> Subject Teachers:</div> View results, input scores, and comment on results for assigned subjects and classes
          </li>

          <li className="text-text-subtle">
            <div className="font-medium">  Principals/Admins:</div> All academic permissions including approval rights
          </li>
        </ul>
      </div>
    </div>
  );
};
