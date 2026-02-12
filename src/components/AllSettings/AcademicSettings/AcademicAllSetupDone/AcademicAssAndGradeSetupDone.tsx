"use client";

import React, { useState } from "react";
import Loader2Fill from "@/components/Icons/Loader2Fill";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AddFill } from "@/components/Icons/AddFill";
import { Input } from "@/components/ui/input";
import { DeleteBin2 } from "@/components/Icons/DeleteBin2";
import Edit from "@/components/Icons/Edit";
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

export const AcademicAssAndGradeSetupDone = () => {
  const [activeTab, setActiveTab] = useState<Tab>("Lawanson");
  return (
    <div className="w-full">
      <div className="mb-5 flex w-full items-start justify-between">
        <div className="text-text-default text-xl font-semibold">Assessment & Grading</div>

        <Button className="bg-bg-state-secondary! border-border-darker hover:bg-bg-none! text-text-default flex h-7! items-center justify-center rounded-md border p-2">
          <Edit fill="var(--color-icon-default-muted)" className="bg-bg-" /> Edit
        </Button>
      </div>

      <div className="border-border-default mb-5 flex w-full items-center gap-3">
        <MobileTabSwitch activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      {activeTab === "Lawanson" && (
        <div className="">
          <ClassesTabSetup />
        </div>
      )}
      {activeTab === "Ilasamaja" && (
        <div>
          <ClassesTabSetup />
        </div>
      )}
    </div>
  );
};

export const ClassesTabSetup = () => {
  return (
    <div>
      <div className="w-full">
        <ClassesResponsiveTabs
          items={[
            {
              label: "Nusery",
              content: <ClassAssessmentSetup />,
            },
            {
              label: "Primary",
              content: "hey ila",
            },
            {
              label: "Junior Secondary",
              content: "hey ila",
            },
            {
              label: "Senior Secondary",
              content: <ClassAssessmentSetup />,
            },
          ]}
        />
      </div>
    </div>
  );
};

export const ClassAssessmentSetup = () => {
  const [addAssessment, setAddAssessment] = useState([{ id: crypto.randomUUID() }]);
  const [gradeSetup, setGradeSetup] = useState([{ id: crypto.randomUUID() }]);

  return (
    <div className="mt-8 flex flex-col gap-6">
      <div className="bg-bg-state-soft rounded-md p-2">
        <div className="text-text-default text-md px-4 py-2 font-semibold">Assessment</div>
        <div className="bg-bg-card border-border-default rounded-md border p-4 md:px-5 md:py-6">
          <div className="flex flex-col gap-4">
            {addAssessment.map(asst => (
              <div key={asst.id} className="mb-2 flex items-center justify-between gap-2">
                <Input className="bg-bg-input-soft! text-text-default h-9! flex-1 border-none" placeholder="Continuous Assessment 1" type="text" />
                <div className="bg-bg-input-soft flex h-9 w-17 items-center gap-1 rounded-md p-1">
                  <Input className="text-text-default h-7! w-full border-none bg-none! p-0" placeholder="20%" type="number" />
                  <span className="text-text-muted">%</span>
                </div>
                <Button
                  onClick={() => setAddAssessment(prev => prev.filter(a => a.id !== asst.id))}
                  className="text-text-subtle bg-bg-state-soft! hover:bg-bg-state-soft-hover! rounde-md w-fit text-sm"
                >
                  <DeleteBin2 fill="var(--color-icon-default-subtle)" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Button
              className="text-text-subtle hover:bg-bg-none! rounde-md w-fit bg-none! text-sm"
              onClick={() => setAddAssessment(prev => [...prev, { id: crypto.randomUUID() }])}
            >
              <AddFill fill="var(--color-icon-default-muted)" /> Add Continuous Assessment
            </Button>

            <div className="flex items-center gap-2">
              <div className="text-text-subtle text-sm">Total Weight</div>
              <div className="text-text-default text-sm font-medium">100%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-bg-state-soft overflow-x-auto rounded-md p-2">
        <div className="text-text-default text-md px-4 py-2 pb-2 font-semibold">Grading </div>
        <div className="bg-bg-card border-border-default hidden w-full rounded-md border px-5 py-6 md:block">
          <table className="border-none">
            <thead>
              <tr className="">
                <th className="text-text-muted px-3 py-2 text-left text-sm font-medium">Grade</th>
                <th className="text-text-muted px-3 py-2 text-left text-sm font-medium">Score</th>
                <th></th>
                <th></th>
                <th className="text-text-muted w-full px-3 py-2 text-left text-sm font-medium">Remark</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>

            <tbody>
              {gradeSetup.map(grd => (
                <tr key={grd.id} className="">
                  <td className="px-3 py-2">
                    <div className="bg-bg-input-soft flex h-9 w-27 items-center gap-1 rounded-md px-2">
                      <Input type="text" placeholder="A" className="text-text-default h-7! w-full border-none bg-transparent p-0" />
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="bg-bg-input-soft flex h-9 w-27 items-center gap-1 rounded-md px-2">
                      <Input type="number" placeholder="70" className="text-text-default h-7! w-full border-none bg-transparent p-0" />
                    </div>
                  </td>
                  <td className="text-text-subtle w-1">-</td>
                  <td className="px-3 py-2">
                    <div className="bg-bg-input-soft flex h-9 w-27 items-center gap-1 rounded-md px-2">
                      <Input type="number" placeholder="100" className="text-text-default h-7! w-full border-none bg-transparent p-0" />
                    </div>
                  </td>
                  <td className="w-full px-3 py-2">
                    <Input className="bg-bg-input-soft! text-text-default h-9! w-full border-none" placeholder="Excellent" />
                  </td>
                  <td className="px-3 py-2">
                    <Button
                      onClick={() => setGradeSetup(prev => prev.filter(a => a.id !== grd.id))}
                      className="bg-bg-state-soft! hover:bg-bg-state-soft-hover! h-8 w-8 p-0"
                    >
                      <DeleteBin2 fill="var(--color-icon-default-subtle)" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-2 md:hidden">
          {gradeSetup.map(grd => (
            <div key={grd.id} className="bg-bg-card border-border-default flex w-full flex-col gap-3 rounded-md border px-5 py-6">
              <div className="flex flex-col">
                <Label className="text-text-default text-sm font-medium">Grade</Label>
                <Input type="text" placeholder="A" className="text-text-default bg-bg-input-soft! h-7! w-full border-none" />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-text-default text-sm font-medium">Score</Label>
                <div className="flex w-full items-center gap-2">
                  <Input type="number" placeholder="70" className="text-text-default bg-bg-input-soft! h-7! w-full border-none" />
                  <span className="text-text-default text-xs">to</span>
                  <Input type="number" placeholder="100" className="text-text-default bg-bg-input-soft! h-7! w-full border-none" />
                </div>
              </div>

              <div className="flex w-full flex-col gap-2">
                <Label className="text-text-default text-sm font-medium">Remark</Label>
                <Input className="bg-bg-input-soft! text-text-default h-7! w-full border-none" placeholder="Excellent" />
              </div>
              <td className="py-2 md:px-3">
                <Button
                  onClick={() => setGradeSetup(prev => prev.filter(a => a.id !== grd.id))}
                  className="bg-bg-state-soft! hover:bg-bg-state-soft-hover! h-8 w-8 p-0"
                >
                  <DeleteBin2 fill="var(--color-icon-default-subtle)" />
                </Button>
              </td>
            </div>
          ))}
        </div>
        {/* <Button
          className="text-text-subtle hover:bg-bg-none! rounde-md mt-2 w-fit bg-none! text-sm"
          onClick={() => setGradeSetup(prev => [...prev, { id: crypto.randomUUID() }])}
        >
          <AddFill fill="var(--color-icon-default-muted)" /> Add Grade Row
        </Button> */}
      </div>
    </div>
  );
};
