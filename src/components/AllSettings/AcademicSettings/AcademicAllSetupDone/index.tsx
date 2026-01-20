"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { SchoolStructure } from "../SchoolStructure";
import { AcademicDoneClassAndArms } from "./AcademicDoneClassAndArms";
import { AcademicAssAndGradeSetupDone } from "./AcademicAssAndGradeSetupDone";
import { AdmissionNumberSetupDone } from "./AcademicNumberDoneSetup";
import { AddFill } from "@/components/Icons/AddFill";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Calendar from "@/components/Icons/Calendar";
const termsOptions = ["24/25 Session", "24/25 Session", "24/25 Session"];
const tabs = ["School, Session & Term", "Classes & Arms", "Assessment & Grading", "Admission Number"] as const;
type Tab = (typeof tabs)[number];

export const AcademicAllSetupDone = () => {
  const [activeTab, setActiveTab] = useState<Tab>("School, Session & Term");
  const [termSelected, setTermSelected] = useState(termsOptions[0]);
  return (
    <div className="w-full">
      <div className="bg-bg-subtle border-border-darker w-full border-b">
        <div className="flex w-full items-center justify-between gap-2 p-4 md:px-8 md:py-4">
          <Select value={termSelected} onValueChange={setTermSelected}>
            <SelectTrigger className="border-border-darker h-8! w-auto border">
              <SelectValue>
                <div className="flex items-center gap-2">
                  <Calendar fill="var(--color-icon-black-muted )" className="size-4" />
                  <span className="text-text-default text-sm font-semibold">{termSelected}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-border-default">
              {termsOptions.map((term, idx) => (
                <SelectItem key={idx} value={term} className="text-text-default text-sm font-semibold">
                  {term}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default h-8! rounded-md text-sm">
            <AddFill fill="var(--color-icon-white-default)" /> New Session
          </Button>
        </div>
      </div>
      <div className="md:px-8 md:pt-8">
        <div className="border-border-default mb-10 flex flex-row items-center gap-4 overflow-x-auto border-b py-3 md:p-0">
          {tabs.map(tab => {
            const isActive = activeTab === tab;

            return (
              <Button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "hover:bg-bg-none! w-1/2 rounded-none py-2.5 text-center transition-all md:w-1/6",
                  isActive && "md:border-border-informative md:border-b-[1.5px]",
                )}
              >
                <span
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-all",
                    isActive && ["bg-bg-state-soft text-text-default", "md:text-text-informative md:rounded-none md:bg-transparent"],
                    !isActive && "text-text-muted",
                  )}
                >
                  {tab}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
      <div className="mt-5">
        {activeTab === "School, Session & Term" && (
          <div className="">
            <SchoolStructure />
          </div>
        )}
        {activeTab === "Classes & Arms" && (
          <div className="mx-auto flex w-full items-center justify-center md:max-w-200">
            <AcademicDoneClassAndArms />
          </div>
        )}
        {activeTab === "Assessment & Grading" && (
          <div className="mx-auto flex w-full items-center justify-center md:max-w-200">
            <AcademicAssAndGradeSetupDone />
          </div>
        )}
        {activeTab === "Admission Number" && (
          <div className="mx-auto flex w-full items-center justify-center md:max-w-200">
            <AdmissionNumberSetupDone />
          </div>
        )}
      </div>

      <div className="border-border-default mt-5 flex items-center justify-between border-t py-4 md:px-10">
        <Button className="bg-bg-state-soft! text-text-subtle rounded-md">Cancel</Button>
        <Button className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default rounded-md">Save changes</Button>
      </div>
    </div>
  );
};
