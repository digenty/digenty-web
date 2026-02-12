"use client";

import { BookFill } from "@/components/Icons/BookFill";
import Edit from "@/components/Icons/Edit";
import { GitMergeFill } from "@/components/Icons/GitMergeFill";
import GraduationCapFill from "@/components/Icons/GraduationCapFill";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Label } from "@/components/ui/label";
import BookOpen from "@/components/Icons/BookOpen";
import School from "@/components/Icons/School";

const tabs = ["Lawanson", "Ilasamaja"] as const;
type Tab = (typeof tabs)[number];

function MobileTabSwitch({ activeTab, setActiveTab }: { activeTab: Tab; setActiveTab: (t: Tab) => void }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="w-full">
        <Select value={activeTab} onValueChange={value => setActiveTab(value as Tab)}>
          <Label className="text-text-default mb-2 text-sm font-medium">
            {" "}
            <School fill="var(--color-icon-default-muted)" /> Select Branch
          </Label>
          <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal">
            <SelectValue>
              <span className="text-text-default text-sm">{activeTab}</span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-bg-default border-border-default">
            {tabs.map(tab => (
              <SelectItem key={tab} value={tab} className="text-text-default text-sm">
                {tab}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="flex w-auto max-w-64 items-center gap-3">
      {tabs.map(tab => {
        const isActive = activeTab === tab;

        return (
          <Button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "hover:bg-bg-none! w-1/2 cursor-pointer rounded-none py-2.5 text-center transition-all duration-150",
              isActive && "border-border-informative border-b-[1.5px]",
            )}
          >
            <span className={cn("text-sm font-medium", isActive ? "text-text-informative" : "text-text-muted")}>{tab}</span>
          </Button>
        );
      })}
    </div>
  );
}

function ClassesResponsiveTabs({ items }: { items: { label: string; content: React.ReactNode }[] }) {
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = React.useState(0);

  if (isMobile) {
    return (
      <div className="w-full">
        <Label className="text-text-default mb-2 text-sm font-medium">
          {" "}
          <BookOpen fill="var(--color-icon-default-muted)" /> Select Class
        </Label>
        <Select value={String(activeIndex)} onValueChange={value => setActiveIndex(Number(value))}>
          <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal">
            <SelectValue>
              <span className="text-text-default text-sm">{items[activeIndex].label}</span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-bg-default border-border-default">
            {items.map((it, idx) => (
              <SelectItem key={it.label} value={String(idx)} className="text-text-default text-sm">
                {it.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="mt-4">{items[activeIndex].content}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="h-9 w-full md:w-fit">
        <div className="bg-bg-state-soft flex w-full items-center justify-between gap-2.5 rounded-full p-0.5">
          {items.map((item, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "transit flex justify-center px-4 py-2 text-sm font-medium",
                  isActive
                    ? "bg-bg-state-secondary border-border-darker text-text-default flex h-8 items-center justify-center gap-1 rounded-full border shadow-sm"
                    : "text-text-muted flex h-8 items-center gap-1",
                )}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 w-full">
        <div className="flex w-full">
          <div className="flex-1">{items[activeIndex].content}</div>
        </div>
      </div>
    </div>
  );
}

export const AcademicDoneClassAndArms = () => {
  const [activeTab, setActiveTab] = useState<Tab>("Lawanson");
  return (
    <div className="mx-auto flex w-full items-center justify-center">
      <div className="w-full">
        <div className="mb-5 flex w-full items-start justify-between">
          <div className="text-text-default text-xl font-semibold">Classes & Arms</div>

          <Button className="bg-bg-state-secondary! border-border-darker hover:bg-bg-none! text-text-default flex h-7! items-center justify-center rounded-md border p-2">
            <Edit fill="var(--color-icon-default-muted)" className="bg-bg-" /> Edit
          </Button>
        </div>
        <div className="border-border-default mb-5 flex w-full items-center gap-3">
          <MobileTabSwitch activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {activeTab === "Lawanson" && <ClassesSetup />}
        {activeTab === "Ilasamaja" && <ClassesSetup />}
      </div>
    </div>
  );
};

export const ClassesSetup = () => {
  return (
    <div>
      <div className="w-full">
        <ClassesResponsiveTabs
          items={[
            {
              label: "Nusery",
              content: <NurserySetup />,
            },
            {
              label: "Primary",
              content: <NurserySetup />,
            },
            {
              label: "Junior Secondary",
              content: <NurserySetup />,
            },
            {
              label: "Senior Secondary",
              content: <SecondarySetup />,
            },
          ]}
        />
      </div>
    </div>
  );
};

export const NurserySetup = () => {
  const nurseryClasses = [{ id: "n1" }, { id: "n2" }];
  return (
    <div className="mt-8 flex w-full flex-col gap-6">
      {nurseryClasses.map(nc => (
        <div key={nc.id} className="bg-bg-state-soft rounded-md p-1">
          <div className="flex items-center justify-between px-5 py-2">
            <div className="text-text-default text-sm font-medium">Nusery </div>
          </div>
          <div className="bg-bg-card border-border-darker flex flex-col gap-4 rounded-md border p-2 md:px-5 md:py-6">
            <div className="p-3">
              <div className="text-text-default mb-3 flex items-center gap-2 text-sm font-medium">
                {" "}
                <BookFill fill="var(--color-bg-basic-blue-accent)" /> Subjects
              </div>
              <div className="border-border-default flex flex-wrap gap-3 border-b pb-4">
                {["English Language", "English Language", "English Language", "English Language"].map(sub => (
                  <Badge key={sub} className="bg-bg-badge-gray! text-text-default flex h-6! items-center gap-3 rounded-md p-1 text-xs">
                    {sub}
                  </Badge>
                ))}
              </div>
              <div className="text-text-default my-2 flex items-center gap-2 text-sm font-medium">
                {" "}
                <GitMergeFill fill="var(--color-bg-basic-blue-accent)" /> Arm
              </div>

              <div className="flex flex-wrap gap-1">
                {["A", "B", "C"].map(arm => (
                  <div key={arm} className="">
                    <div className="text-text-subtle bg-bg-badge-gray flex h-6! w-6! items-center justify-center rounded-md text-sm font-medium">
                      {arm}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const SecondarySetup = () => {
  const secondaryClasses = [
    { id: "ss1", name: "SS 1", hasDelete: true },
    { id: "ss2", name: "SS 1", hasDelete: true },
  ];
  return (
    <div className="mt-8 flex w-full flex-col gap-6">
      {secondaryClasses.map(sc => (
        <div key={sc.id} className="bg-bg-state-soft rounded-md p-1">
          <div className="flex items-center justify-between px-5 py-2">
            <div className="text-text-default text-sm font-medium">{sc.name} </div>
            <div className="flex items-center gap-2"></div>
          </div>
          <div className="bg-bg-card border-border-darker flex flex-col gap-4 rounded-md border p-2 md:px-5 md:py-2">
            <div className="p-3">
              <div className="text-text-default mb-3 flex items-center gap-2 text-sm font-medium">
                {" "}
                <GraduationCapFill fill="var(--color-bg-basic-blue-accent) " className="size-4" /> Departments
              </div>
              <div className="border-border-default flex flex-wrap gap-3 border-b pb-4">
                {["English Language", "English Language", "English Language", "English Language"].map(sub => (
                  <Badge key={sub} className="bg-bg-badge-gray! text-text-default flex h-6! items-center gap-3 rounded-md p-1 text-xs">
                    {sub}
                  </Badge>
                ))}
              </div>

              <div className="text-text-default my-3 flex items-center gap-2 text-sm font-medium">
                {" "}
                <BookFill fill="var(--color-bg-basic-blue-accent)" />
                Art Subjects
              </div>
              <div className="border-border-default flex flex-wrap gap-3 border-b pb-4">
                {["English Language", "English Language", "English Language", "English Language"].map(sub => (
                  <Badge key={sub} className="bg-bg-badge-gray! text-text-default flex h-6! items-center gap-3 rounded-md p-1 text-xs">
                    {sub}
                  </Badge>
                ))}
              </div>

              <div className="text-text-default my-3 flex items-center gap-2 text-sm font-medium">
                {" "}
                <BookFill fill="var(--color-bg-basic-blue-accent)" />
                Commercial Subjects
              </div>
              <div className="border-border-default flex flex-wrap gap-3 border-b pb-4">
                {["English Language", "English Language", "English Language", "English Language"].map(sub => (
                  <Badge key={sub} className="bg-bg-badge-gray! text-text-default flex h-6! items-center gap-3 rounded-md p-1 text-xs">
                    {sub}
                  </Badge>
                ))}
              </div>

              <div className="text-text-default my-3 flex items-center gap-2 text-sm font-medium">
                {" "}
                <BookFill fill="var(--color-bg-basic-blue-accent)" />
                Science Subjects
              </div>
              <div className="border-border-default flex flex-wrap gap-3 border-b pb-4">
                {["English Language", "English Language", "English Language", "English Language"].map(sub => (
                  <Badge key={sub} className="bg-bg-badge-gray! text-text-default flex h-6! items-center gap-3 rounded-md p-1 text-xs">
                    {sub}
                  </Badge>
                ))}
              </div>

              <div className="text-text-default my-2 flex items-center gap-2 text-sm font-medium">
                <GitMergeFill fill="var(--color-bg-basic-blue-accent)" /> Arm
              </div>

              <div className="flex flex-wrap gap-1">
                {["A", "B", "C"].map(arm => (
                  <div key={arm} className="">
                    <div className="text-text-subtle bg-bg-badge-gray flex h-6! w-6! items-center justify-center rounded-md text-sm font-medium">
                      {arm}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
