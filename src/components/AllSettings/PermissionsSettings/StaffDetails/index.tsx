"use client";

import { Avatar } from "@/components/Avatar";
import BookOpen from "@/components/Icons/BookOpen";
import Building from "@/components/Icons/Building";
import DeleteBin from "@/components/Icons/DeleteBin";
import Edit from "@/components/Icons/Edit";
import GraduationCap from "@/components/Icons/GraduationCap";
import Group from "@/components/Icons/Group";
import Mail from "@/components/Icons/Mail";
import { Phone } from "@/components/Icons/Phone";
import { Shield } from "@/components/Icons/Shield";
import { UserForbid } from "@/components/Icons/UserForbid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { DeleteStaffModal } from "./StaffDetailsModals";

export const StaffDetails = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <DeleteStaffModal open={open} setOpen={setOpen} />
      <div className="mx-auto flex w-full items-center justify-center py-4 md:max-w-250 md:py-6">
        <div className="flex w-full flex-col gap-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="size-14 md:size-26" />

              <div className="flex flex-col gap-1 md:gap-2">
                <div className="flex items-center gap-1">
                  <div className="text-text-default text-lg font-semibold">Damilare John</div>
                  <Badge className="bg-bg-badge-lime border-border-default text-bg-basic-lime-strong rounded-md border text-sm font-medium">
                    Subject Teacher
                  </Badge>
                </div>
                <div className="text-text-subtle text-sm">damilarejohn@gmail.com</div>
                <Badge className="text-bg-basic-green-strong border-border-default bg-bg-badge-green rounded-md border text-sm font-medium">
                  Active
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button className="bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! text-text-default border-border-darker rounded-md border">
                <DeleteBin fill="var(--color-icon-default-muted)" /> Delete
              </Button>
              <Button
                onClick={() => setOpen(true)}
                className="bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! text-text-default border-border-darker rounded-md border"
              >
                <UserForbid fill="var(--color-icon-default-muted)" /> Deactivate
              </Button>
              <Button className="bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! text-text-default border-border-darker rounded-md border">
                <Edit fill="var(--color-icon-default-muted)" /> Edit Staff
              </Button>
            </div>
          </div>
          <div className="bg-bg-muted border-border-default rounded-md border p-2 md:p-6">
            <div className="border-border-default flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-1">
                <Building fill="var(--color-icon-default-muted)" />
                <div className="text-text-muted">Branch</div>
              </div>
              <div className="text-text-default text-sm font-medium">Lawanson, Ilasamaja</div>
            </div>
            {/*  */}
            <div className="border-border-default flex items-center justify-between border-b py-4">
              <div className="flex items-center gap-1">
                <Mail fill="var(--color-icon-default-muted)" />
                <div className="text-text-muted">Email Address</div>
              </div>
              <div className="text-text-informative text-sm font-medium">damilarejohn@gmail.com</div>
            </div>
            {/*  */}
            <div className="border-border-default flex items-center justify-between border-b py-4">
              <div className="flex items-center gap-1">
                <Phone fill="var(--color-icon-default-muted)" />
                <div className="text-text-muted">Primary Phone Number</div>
              </div>
              <div className="text-text-informative text-sm font-medium">0704 000 0000</div>
            </div>
          </div>
          <div className="border-border-default gap-4 rounded-md border p-4">
            <div className="border-border-default flex items-center gap-3 border-b pb-4">
              <div className="bg-bg-badge-gray flex size-8 items-center justify-center rounded-sm p-1">
                <BookOpen fill="var(--color-icon-default-muted)" className="" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-text-default text-md font-medium">Lawanson</div>
                <div className="text-text-muted text-sm">5 classes • 1 class teacher role • 5 Permissions</div>
              </div>
            </div>

            <div className="flex items-center gap-3 py-4">
              <div className="bg-bg-badge-gray flex size-8 items-center justify-center rounded-sm p-1">
                <BookOpen fill="var(--color-bg-basic-sky-accent)" className="" />
              </div>
              <div className="text-text-default text-md font-medium">Subject Teaching</div>
            </div>
            {/*  */}

            <div className="flex flex-col gap-4">
              <div className="bg-bg-muted flex flex-col gap-2 rounded-md px-4 py-2">
                <div className="text-text-default text-sm font-medium">Mathematics</div>
                <div className="flex flex-wrap gap-3">
                  <Badge className="text-text-subtle bg-bg-badge-default rounded-sm">JSS 1</Badge>{" "}
                  <Badge className="text-text-subtle bg-bg-badge-default rounded-sm">JSS 1</Badge>
                </div>
              </div>
              <div className="bg-bg-muted flex flex-col gap-2 rounded-md px-4 py-2">
                <div className="text-text-default text-sm font-medium">Mathematics</div>
                <div className="flex flex-wrap gap-3">
                  <Badge className="text-text-subtle bg-bg-badge-default rounded-sm">JSS 1</Badge>{" "}
                  <Badge className="text-text-subtle bg-bg-badge-default rounded-sm">JSS 1</Badge>
                </div>
              </div>
            </div>
            {/*  */}
            <div className="flex items-center gap-3 py-4">
              <div className="bg-bg-badge-gray flex size-8 items-center justify-center rounded-sm p-1">
                <Group fill="var(--color-bg-basic-violet-accent)" className="" />
              </div>
              <div className="text-text-default text-md font-medium">Class Teacher For</div>
            </div>

            <div className="bg-bg-muted flex items-center justify-between gap-2 rounded-md px-4 py-2">
              <div className="flex flex-col gap-2">
                <div className="text-text-default text-sm font-medium">JSS 1</div>
                <div className="text-text-muted text-xs">32 Students</div>{" "}
              </div>
              <Badge className="text-bg-basic-green-strong bg-bg-badge-green border-border-default rounded-md border text-sm font-medium">
                Active
              </Badge>
            </div>

            {/*  */}
            <div className="flex items-center gap-3 py-4">
              <div className="bg-bg-badge-gray flex size-8 items-center justify-center rounded-sm p-1">
                <Shield fill="var(--color-bg-basic-emerald-accent)" className="" />
              </div>
              <div className="text-text-default text-md font-medium">Permissions</div>
            </div>
            {/*  */}
            <div className="bg-bg-muted flex flex-col gap-2 rounded-md px-4 py-2">
              <div className="itesm-center flex gap-2">
                <div className="bg-bg-badge-gray flex size-5 items-center justify-center rounded-sm p-1">
                  <Group fill="var(--color-icon-default-subtle)" className="" />
                </div>
                <div className="text-text-default text-sm font-medium">Student & Parent Records</div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge className="text-text-subtle bg-bg-badge-default rounded-sm">view</Badge>{" "}
                <Badge className="text-text-subtle bg-bg-badge-default rounded-sm">Manage</Badge>
                <Badge className="text-text-subtle bg-bg-badge-default rounded-sm">Delete</Badge>
              </div>
            </div>
            {/*  */}

            <div className="bg-bg-muted mt-4 flex flex-col gap-2 rounded-md px-4 py-2">
              <div className="itesm-center flex gap-2">
                <div className="bg-bg-badge-gray flex size-5 items-center justify-center rounded-sm p-1">
                  <GraduationCap fill="var(--color-icon-default-subtle)" className="" />
                </div>
                <div className="text-text-default text-sm font-medium">Classes & Subjects</div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge className="text-text-subtle bg-bg-badge-default rounded-sm">view</Badge>{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
