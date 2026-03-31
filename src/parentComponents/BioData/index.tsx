"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { StudentFilter } from "../FilterStudents";
import { Avatar } from "@/components/Avatar";
import { ParentBioData } from "./ParentBioData";
import { StudentBioData } from "./StudentBioData";

export const BioDatas = () => {
  const path = usePathname();
  const parentId = Number(path.split("/")[3]);

  const [activeTab, setActiveTab] = useState<"parent" | "student">("parent");
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [selectedStudentName, setSelectedStudentName] = useState<string>("");

  const tabs = [
    { key: "parent", label: "My Biodata" },
    { key: "student", label: selectedStudentName ? `${selectedStudentName}'s Biodata` : "Student Biodata" },
  ] as const;

  return (
    <div className="flex w-full flex-col gap-10 p-4 md:p-8">
      <div className="flex w-full items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <div className="text-text-default text-2xl font-semibold">Biodata</div>
          <div className="text-text-muted text-xs">Manage and view your child&apos;s school fees, payment history, and invoices.</div>
        </div>
        <StudentFilter
          parentId={parentId}
          onSelect={(studentId, studentName) => {
            setSelectedStudentId(studentId);
            setSelectedStudentName(studentName);
          }}
        />
      </div>

      <div className="bg-bg-state-soft flex h-9 w-full rounded-md p-1">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex w-full items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key ? "text-text-default bg-bg-state-secondary! rounded-md" : "text-text-muted hover:text-text-default"
            }`}
          >
            <Avatar className="size-4" /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "parent" && <ParentBioData parentId={parentId} />}
      {activeTab === "student" && <StudentBioData parentId={parentId} selectedStudentId={selectedStudentId} />}
    </div>
  );
};
