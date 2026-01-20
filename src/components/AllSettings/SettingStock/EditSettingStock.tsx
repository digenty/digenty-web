import { Toggle } from "@/components/Toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

export const EditSettingStocks = () => {
  return (
    <div className="mx-auto flex w-full items-center justify-center p-4 md:max-w-151">
      <div className="flex w-full flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="text-text-default text-xl font-semibold">Stock Settings</div>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-text-default text-sm font-medium"></Label>
          <Input type="number" className="text-text-default bg-bg-input-soft! w-full border-none" placeholder="3" />
          <div className="text-text-muted text-xs">Set the number of items that will trigger a low stock alert</div>
        </div>
        <div className="border-border-default w-full border-b"></div>

        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <div className="text-text-default text-sm font-medium">Low Stock Alert </div>
            <div className="text-text-subtle text-sm">Enable notifications when an item&apos;s quantity falls below the set threshold.</div>
          </div>
          <Toggle />
        </div>

        <div className="fixed bottom-0 md:w-151">
          <div className="border-border-default flex items-center justify-between border-t py-4">
            <Button className="bg-bg-state-soft hover:bg-bg-state-soft-hover! text-text-subtle">Cancel</Button>
            <Button className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary-hover!">Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
