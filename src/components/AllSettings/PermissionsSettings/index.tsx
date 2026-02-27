"use client";

import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { RolesAndPermissions } from "./RolesAndPermissions";
import { Staffs } from "./Staffs";
import { useRouter, useSearchParams } from "next/navigation";

const tabs = [
  { label: "Staff", value: "staff" },
  { label: "Roles & Permissions", value: "roles-and-permissions" },
];
export const PermissonsSettings = () => {
  const router = useRouter();
  const params = useSearchParams();
  const activeTab = params.get("tab") ?? "staff";

  useEffect(() => {
    if (!activeTab) {
      router.push(`/settings/permissions?tab=staff`);
    }
  }, [activeTab, router]);

  useBreadcrumb([
    { label: "Settings", url: "/settings" },
    { label: "Permissions", url: "/settings/permissions" },
    { label: tabs.find(tab => tab.value === activeTab)?.label || "Staff", url: "" },
  ]);

  return (
    <div>
      <div className="text-text-default px-4 py-4 text-xl font-semibold md:px-8">Permissions</div>
      <div className="px-4 md:px-8">
        <div className="border-border-default flex w-full items-center justify-evenly gap-6 border-b md:max-w-80 md:flex-none md:justify-normal">
          {tabs.map(tab => {
            const isActive = activeTab === tab.value;
            return (
              <div
                role="button"
                onClick={() => {
                  router.push(`/settings/permissions?tab=${tab.value}`);
                }}
                key={tab.value}
                className={cn(
                  "w-full cursor-pointer py-2.5 text-center transition-all duration-150",
                  isActive && "border-border-informative border-b-[1.5px]",
                )}
              >
                <span className={cn("text-sm font-medium", isActive ? "text-text-informative" : "text-text-muted")}>{tab.label}</span>
              </div>
            );
          })}
        </div>

        {activeTab === "staff" && <Staffs />}

        {activeTab === "roles-and-permissions" && <RolesAndPermissions />}
      </div>
    </div>
  );
};
