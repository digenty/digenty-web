import CheckboxCircleFill from "@/components/Icons/CheckboxCircleFill";
import { CircleFill } from "@/components/Icons/CircleFill";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import React from "react";

export const SecuritySettings = () => {
  return (
    <div className="mx-auto my-6 flex w-full items-center justify-center md:max-w-151">
      <div className="flex w-full flex-col gap-6">
        <div className="text-text-default text-xl font-semibold">Security</div>
        <div className="border-border-default flex items-center justify-between border-b pb-4">
          <Label className="text-text-default text-sm font-medium">Password</Label>
          <div className="flex items-center gap-1">
            <div className="flex gap-1">
              <CircleFill fill="var(--color-icon-default)" />
              <CircleFill fill="var(--color-icon-default)" />
              <CircleFill fill="var(--color-icon-default)" />
              <CircleFill fill="var(--color-icon-default)" />
              <CircleFill fill="var(--color-icon-default)" />
              <CircleFill fill="var(--color-icon-default)" />
              <CircleFill fill="var(--color-icon-default)" />
              <CircleFill fill="var(--color-icon-default)" />
              <CircleFill fill="var(--color-icon-default)" />
              <CircleFill fill="var(--color-icon-default)" />
            </div>
            <div className="flex items-center gap-1">
              <CheckboxCircleFill fill="var(--color-icon-success)" className="size-3" />
              <div className="text-text-success text-sm font-medium">Very Secure</div>
            </div>
          </div>
          <Button className="border-border-darker text-text-default bg-bg-state-secondary! h-8 rounded-md border"> Change Password</Button>
        </div>
        <div className="text-text-default border-border-default border-b pb-4 text-lg font-semibold">Active Sessions</div>

        <div className="text-text-default border-border-default border-b pb-4">
          <div className="text-text-default text-md font-medium">Mac OS · Safari 101.203.344</div>
          <div className="text-text-muted text-sm font-medium">Current sessions</div>
        </div>

        <div className=" ">
          <div className="text-text-default text-md font-medium">Lenovo · Chrome 101.203.344</div>
          <div className="text-text-muted text-sm font-medium">Last active · 30 mins ago</div>
        </div>

        <Button className="border-border-darker text-text-default bg-bg-state-secondary! mt-5 h-8 w-fit rounded-md border">
          Log out of all sessions
        </Button>
      </div>
    </div>
  );
};
