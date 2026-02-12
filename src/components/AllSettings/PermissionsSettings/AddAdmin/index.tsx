import Mail from "@/components/Icons/Mail";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

export const AddAdmin = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-bg-card-subtle border-border-default border-b p-3">
        <div className="justify-left mx-auto flex w-full items-center md:max-w-225">
          <div className="text-text-default text-md text-left font-semibold">Add Admin</div>
        </div>
      </div>

      <div className="mx-auto flex w-full items-center justify-center md:max-w-225">
        <div className="flex w-full flex-col gap-6">
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">First Name</Label>
              <Input className="bg-bg-input-soft! w-full border-none" placeholder="Input First Name" />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">Last Name</Label>
              <Input className="bg-bg-input-soft! w-full border-none" placeholder="Input Last Name" />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">Email Address</Label>
              <Input className="bg-bg-input-soft! w-full border-none" placeholder="Input Email Address" />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">Phone Number</Label>
              <Input className="bg-bg-input-soft! w-full border-none" type="number" placeholder="Input Phone Number" />
            </div>
          </div>
          <div className="border-border-default border-b"></div>
          <div className="text-text-default text-lg font-semibold">Select Branches To Manage</div>
          <div className="flex flex-col gap-3">
            <div className="bg-bg-card border-border-darker flex w-45 items-center gap-2 rounded-md border px-3 py-2">
              <Checkbox /> <div className="text-text-default text-xs font-medium">Lawanson</div>
            </div>
            <div className="bg-bg-card border-border-darker flex w-45 items-center gap-2 rounded-md border px-3 py-2">
              <Checkbox /> <div className="text-text-default text-xs font-medium">Lawanson</div>
            </div>
          </div>

          <div className="border-border-default border-t p-3">
            <div className="mx-auto flex h-15! w-full items-center justify-center md:max-w-225">
              <div className="flex w-full items-center justify-between">
                <Button className="bg-bg-state-soft text-text-subtle">Cancel</Button>
                <Button className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default">
                  {" "}
                  <Mail fill="var(--color-icon-white-default)" /> Send Invite
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
