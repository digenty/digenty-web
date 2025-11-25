import AlertFill from "@/components/Icons/AlertFill";
import GraduationCapFill from "@/components/Icons/GraduationCapFill";
import { OverviewCard } from "@/components/OverviewCard";
import React from "react";
import { AllClassesHeader } from "./AllClassesHeader";
import { AllClassesMainTable } from "./AllClassesMainTable";

export const AllClassesMain = () => {
  return (
    <div className="flex flex-col">
      <AllClassesHeader />
      <div className="grid w-full grid-cols-2 gap-3 px-4 py-3 lg:grid-cols-3">
        <OverviewCard
          title="Total Classes"
          Icon={() => (
            <div className="bg-bg-basic-teal-subtle border-bg-basic-teal-accent flex w-6 items-center justify-center rounded-xs border p-1">
              <GraduationCapFill fill="var(--color-icon-default)" className="" />
            </div>
          )}
          value="67"
        />
        <OverviewCard
          title="Pending Submission"
          Icon={() => (
            <div className="bg-bg-basic-yellow-subtle border-bg-basic-yellow-accent flex w-6 items-center justify-center rounded-xs border p-1">
              <AlertFill fill="var(--color-icon-default)" className="" />
            </div>
          )}
          value="78"
        />
        <OverviewCard
          className="col-span-2 lg:col-auto"
          title="Completed Submission"
          Icon={() => (
            <div className="bg-bg-basic-teal-subtle border-bg-basic-teal-accent flex w-6 items-center justify-center rounded-xs border p-1">
              <GraduationCapFill fill="var(--color-icon-default)" className="" />
            </div>
          )}
          value="45"
        />
      </div>

      <AllClassesMainTable />
    </div>
  );
};
