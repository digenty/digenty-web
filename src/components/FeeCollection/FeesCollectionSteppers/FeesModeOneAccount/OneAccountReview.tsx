import Edit from "@/components/Icons/Edit";
import { Gtbank } from "@/components/Icons/Gtbank";
import Information from "@/components/Icons/Information";
import { Button } from "@/components/ui/button";
import React from "react";

export const OneAccountReview = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="border-border-darker flex flex-col gap-4 rounded-md border p-3">
        <div className="bg-bg-muted border-border-darker flex flex-col gap-3 rounded-md border p-4 md:flex-row md:justify-between">
          <div className="flex flex-col gap-2">
            <div className="text-text-default text-md font-semibold">Branch collection</div>
            <div className="text-text-muted text-sm font-normal">Single account for all branches</div>
          </div>
          <Button className="border-border-darker bg-bg-state-secondary! text-text-default flex h-8! w-fit items-center gap-4 rounded-md border text-sm font-medium">
            <Edit fill="var(--color-icon-default-muted)" /> Change Mode
          </Button>
        </div>
        <div className="border-border-darker flex justify-between gap-3 rounded-md border p-4">
          <div className="flex flex-col gap-1">
            <div className="text-text-default text-sm font-medium">All branches use</div>
            <div className="flex gap-1">
              <Gtbank />
              <div className="text-text-muted text-xs font-medium">23234343334 • Damilare John</div>
            </div>
          </div>
          <Button className="hover:bg-bg-none! bg-none">
            <Edit fill="var(--color-icon-default-muted)" />
          </Button>
        </div>
      </div>
      <div className="border-border-darker flex flex-col gap-4 rounded-md border p-3">
        <div className="bg-bg-muted border-border-darker flex justify-between gap-3 rounded-t-md border p-4">
          <div className="flex flex-col gap-2">
            <div className="text-text-default text-md font-semibold">Fee Routing</div>
            <div className="text-text-muted text-sm font-normal">Custom collection accounts for specific fees</div>
          </div>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:justify-between">
          <div className="border-border-darker flex w-full flex-col gap-3 rounded-sm border p-3">
            <div className="text-text-default text-2xl font-medium">2</div>
            <div className="text-text-muted text-xs font-medium">Custom routes</div>
          </div>
          <div className="border-border-darker flex w-full flex-col gap-3 rounded-sm border p-3">
            <div className="text-text-default text-2xl font-medium">4</div>
            <div className="text-text-muted text-xs font-medium">Custom routes</div>
          </div>
          <div className="border-border-darker flex w-full flex-col gap-3 rounded-sm border p-3">
            <div className="text-text-default text-2xl font-medium">6</div>
            <div className="text-text-muted text-xs font-medium">Custom routes</div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="border-border-darker flex justify-between gap-3 rounded-md border p-4">
            <div className="flex flex-col gap-1">
              <div className="text-text-default text-sm font-medium">All branches use</div>
              <div className="flex gap-1">
                <Gtbank />
                <div className="text-text-muted text-xs font-medium">23234343334 • Damilare John</div>
              </div>
            </div>
            <Button className="hover:bg-bg-none! bg-none">
              <Edit fill="var(--color-icon-default-muted)" />
            </Button>
          </div>
          <div className="border-border-darker flex justify-between gap-3 rounded-md border p-4">
            <div className="flex flex-col gap-1">
              <div className="text-text-default text-sm font-medium">All branches use</div>
              <div className="flex gap-1">
                <Gtbank />
                <div className="text-text-muted text-xs font-medium">23234343334 • Damilare John</div>
              </div>
            </div>
            <Button className="hover:bg-bg-none! bg-none">
              <Edit fill="var(--color-icon-default-muted)" />
            </Button>
          </div>
        </div>
      </div>
      <div className="bg-bg-basic-gray-subtle flex h-10 w-full items-center gap-2 rounded-md p-3 md:w-89">
        <Information fill="var(--color-icon-default)" />
        <div className="text-text-subtle text-xs">All other fees use the default account</div>
      </div>
    </div>
  );
};
