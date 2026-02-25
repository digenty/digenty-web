"use client";

import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { RolesAndPermissions } from "./RolesAndPermissions";
import { Staffs } from "./Staffs";

const tabs = ["Staff", "Roles & Permissions"];
export const PermissonsSettings = () => {
  const [activeTab, setActiveTab] = useState("Staff");

  useBreadcrumb([
    { label: "Settings", url: "/settings" },
    { label: "Permissions", url: "/settings/permissions" },
    { label: activeTab, url: "" },
  ]);

  return (
    <div>
      <div className="text-text-default px-4 py-4 text-xl font-semibold md:px-6">Permissions</div>
      <div className="px-4 md:px-6">
        <div className="border-border-default flex w-auto max-w-70 items-center gap-6 border-b">
          {tabs.map(tab => {
            const isActive = activeTab === tab;
            return (
              <div
                role="button"
                onClick={() => {
                  setActiveTab(tab);
                }}
                key={tab}
                className={cn(
                  "w-auto cursor-pointer py-2.5 text-left transition-all duration-150",
                  isActive && "border-border-informative border-b-[1.5px]",
                )}
              >
                <span className={cn("text-sm font-medium", isActive ? "text-text-informative" : "text-text-muted")}>{tab}</span>
              </div>
            );
          })}
        </div>

        {activeTab === "Staff" && <Staffs />}

        {activeTab === "Roles & Permissions" && <RolesAndPermissions />}
      </div>
    </div>
  );
};
