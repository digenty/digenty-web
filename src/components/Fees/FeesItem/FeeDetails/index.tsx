import DeleteBin from "@/components/Icons/DeleteBin";
import Edit from "@/components/Icons/Edit";
import { FileCopy } from "@/components/Icons/FileCopy";
import GraduationCap from "@/components/Icons/GraduationCap";
import School from "@/components/Icons/School";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React from "react";
const classesApply = [
  {
    title: "Lawanson",
    classes: [
      { className: "SS1", type: "Class", amount: 15000 },
      { className: "SS2", type: "Department", amount: 15000 },
      { className: "SS3", type: "Class", amount: 15000 },
    ],
  },
  {
    title: "Ilesa",
    classes: [
      { className: "JS1", type: "Class", amount: 15000 },
      { className: "JS2", type: "Class", amount: 15000 },
      { className: "JS3", type: "Class", amount: 15000 },
    ],
  },
];

export const FeeItemDetail = () => {
  return (
    <div className="flex items-center justify-center px-4 py-3 pb-8 md:px-8">
      <div className="mx-auto flex w-full max-w-225 flex-col gap-6 md:gap-9">
        {/* The header */}
        <div className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-text-default text-xl font-semibold">Tuition Fee</div>

            <div className="flex items-center gap-1">
              <Button className="bg-bg-state-destructive! hover:bg-bg-state-destructive-hover! text-text-white-default h-8! w-auto rounded-md">
                {" "}
                <DeleteBin fill="var(--color-icon-white-default)" /> Delete
              </Button>
              <Button className="border-border-default text-text-default h-8! border">
                <FileCopy fill="var(--color-icon-default-muted)" /> Duplicate
              </Button>
              <Button className="border-border-default text-text-default h-8! border">
                {" "}
                <Edit fill="var(--color-icon-default-muted)" /> Edit Fee
              </Button>
            </div>
          </div>

          {/* tje box */}
          <div className="border-border-default grid grid-cols-2 rounded-sm border md:grid-cols-4">
            <div className="border-border-default flex flex-col gap-4 border-r border-b p-3 py-4 md:border-b-0 md:p-6">
              <div className="text-text-muted text-xs font-medium">Status</div>
              <Badge className="bg-bg-badge-green text-bg-basic-green-strong border-border-default h-5 rounded-md text-xs font-medium">Active</Badge>
            </div>
            <div className="border-border-default flex flex-col gap-4 border-r border-b p-3 py-4 md:border-b-0 md:p-6">
              <div className="text-text-muted text-xs font-medium">Term & Session</div>
              <div className="text-text-default text-md font-medium">24/25 Third Term</div>
            </div>
            <div className="border-border-default flex flex-col gap-4 border-r p-3 py-4 md:p-6">
              <div className="text-text-muted text-xs font-medium">Amount</div>
              <div className="text-text-default text-md font-medium">₦75,000 - ₦95,000</div>
            </div>
            <div className="flex flex-col gap-4 p-3 py-4 md:p-6">
              <div className="text-text-muted text-xs font-medium">Quantity</div>
              <div className="text-text-default text-md font-medium">1</div>
            </div>
          </div>
        </div>

        {/*  */}
        <div className="border-border-default flex w-full flex-col gap-6 rounded-sm border p-4 md:p-6">
          <div className="flex items-center gap-2">
            <School fill="var(--color-icon-default)" className="size-4" />
            <h2 className="text-text-default text-sm font-medium">Applied Branches (2)</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-bg-muted flex items-center gap-2 rounded-sm px-3 py-2">
              <School fill="var(--color-icon-default)" className="size-4" />
              <h2 className="text-text-default text-sm font-medium">Lawanson</h2>
            </div>
            <div className="bg-bg-muted flex items-center gap-2 rounded-sm px-3 py-2">
              <School fill="var(--color-icon-default)" className="size-4" />
              <h2 className="text-text-default text-sm font-medium">Lawanson</h2>
            </div>
          </div>
        </div>
        {/* Apply */}
        <div className="border-border-default rounded-sm border p-4 md:p-6">
          <div className="mb-6 flex items-center gap-2">
            <GraduationCap fill="var(--color-icon-default)" className="size-4" />
            <h2 className="text-text-default text-sm font-medium">Applied Classes (2)</h2>
          </div>
          {classesApply.map(branch => (
            <div key={branch.title} className="mb-6">
              <div className="mb-4 flex items-center gap-2">
                <School fill="var(--color-icon-default)" />
                <h2 className="text-text-default text-sm font-medium">{branch.title}</h2>
              </div>
              <div className="flex flex-col gap-3">
                {branch.classes.map(cls => (
                  <div key={cls.className} className="bg-bg-subtle flex w-full items-center justify-between rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap fill="var(--color-bg-basic-purple-strong)" className="size-4" />
                      <div className="text-text-default text-sm font-semibold">{cls.className}</div>
                      <Badge className="bg-bg-badge-default border-border-default text-text-subtle h-5! rounded-md border text-xs font-medium">
                        {cls.type}
                      </Badge>
                    </div>
                    <div className="text-text-default text-sm font-semibold">₦{cls.amount.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
