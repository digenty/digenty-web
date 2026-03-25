"use client";

import { useState } from "react";
import { StudentFilter } from "../FilterStudents";
import { Avatar } from "@/components/Avatar";
import { ParentBioData } from "./ParentBioData";
import { StudentBioData } from "./StudentBioData";

const tabs = ["My Biodata", "Damilare’s Biodata"];
export const BioDatas = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  return (
    <div className="flex w-full flex-col gap-10 p-4 md:p-8">
      <div className="flex w-full items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <div className="text-text-default text-2xl font-semibold">Fees</div>
          <div className="text-text-muted text-xs">Manage and view your child&apos;s school fees, payment history, and invoices.</div>
        </div>
        <StudentFilter />
      </div>

      <div className="bg-bg-state-soft flex h-9 w-full rounded-md p-1">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex w-full items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab ? "text-text-default bg-bg-state-secondary! rounded-md" : "text-text-muted hover:text-text-default"
            }`}
          >
            <Avatar className="size-4" /> {tab}
          </button>
        ))}
      </div>

      {activeTab === "My Biodata" && <ParentBioData />}
      {activeTab === "Damilare’s Biodata" && <StudentBioData />}
    </div>
  );
};
