"use client";

import { AddFill } from "@/components/Icons/AddFill";
import { QuickReferenceAll } from "@/components/Icons/QuickReferenceAll";
import { Staffs } from "./Staffs";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { RolesAndPermissions } from "./RolesAndPermissions";
import { PlusIcon } from "lucide-react";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

export const StaffList = [
  {
    id: 1,
    staffName: "Adebayo Johnson",
    role: "Principal",
    email: "damilarejohn@gmail.com",
    status: "Active",
    branch: "Lawanson",
    lastLogin: "2026-01-10 09:42 AM",
  },
  {
    id: 2,
    staffName: "Fatima Bello",
    role: "Subject Teacher",
    email: "fdamilarejohn@gmail.com",
    status: "Active",
    branch: "Lawanson",
    lastLogin: "2026-01-11 02:18 PM",
  },
  {
    id: 3,
    staffName: "Chinedu Okafor",
    role: "Principal",
    email: "damilarejohn@gmail.com",
    status: "Inactive",
    branch: "Lawanson",
    lastLogin: "2025-12-28 04:56 PM",
  },
  {
    id: 4,
    staffName: "Zainab Musa",
    role: "Subject Teacher",
    email: "zdamilarejohn@gmail.com",
    status: "Active",
    branch: "Lawanson",
    lastLogin: "2026-01-12 08:05 AM",
  },
  {
    id: 5,
    staffName: "Samuel Adeyemi",
    role: "Subject Teacher",
    email: "damilarejohn@gmail.com",
    status: "Pending",
    branch: "Lawanson",
    lastLogin: "2026-01-11 06:31 PM",
  },
  {
    id: 6,
    staffName: "Blessing Udo",
    role: "Class Teacher",
    email: "damilarejohn@gmail.com",
    status: "Suspended",
    branch: "Lawanson",
    lastLogin: "2025-12-15 11:20 AM",
  },
  {
    id: 7,
    staffName: "Ibrahim Sadiq",
    role: "Principal",
    email: "damilarejohn@gmail.com",
    status: "Active",
    branch: "Lawanson",
    lastLogin: "2026-01-12 10:47 AM",
  },
  {
    id: 8,
    staffName: "Ngozi Eze",
    role: "Principal",
    email: "damilarejohn@gmail.com",
    status: "Active",
    branch: "Lawanson",
    lastLogin: "2026-01-09 03:14 PM",
  },
  {
    id: 9,
    staffName: "Daniel Peters",
    role: "Principal",
    email: "damilarejohn@gmail.com",
    status: "Active",
    branch: "Lawanson",
    lastLogin: "2026-01-12 12:01 PM",
  },
  {
    id: 10,
    staffName: "Maryam Abdullahi",
    role: "Principal",
    email: "damilarejohn@gmail.com",
    status: "Inactive",
    branch: "Lawanson",
    lastLogin: "2025-12-30 09:08 AM",
  },
  {
    id: 11,
    staffName: "Victor Olatunji",
    role: "Principal",
    email: "damilarejohn@gmail.com",
    status: "Active",
    branch: "Lawanson",
    lastLogin: "2026-01-11 01:55 PM",
  },
  {
    id: 12,
    staffName: "Hadiza Lawal",
    role: "Secretary",
    email: "damilarejohn@gmail.com",
    status: "Active",
    branch: "Lawanson",
    lastLogin: "2026-01-12 07:32 AM",
  },
];

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
      <div className="md:px-6">
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

        {activeTab === "Staff" && (
          <>
            {StaffList.length > 0 ? (
              <Staffs />
            ) : (
              <div className="mx-auto flex h-screen items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <QuickReferenceAll />
                  <div className="text-text-subtle text-sm font-medium">No staff added yet</div>
                  <div className="text-text-muted text-xs">Invite staff members to assign roles and start managing your school.</div>
                  <Button className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-7!">
                    {" "}
                    <PlusIcon className="text-icon-white-default size-4" /> Add Staff
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "Roles & Permissions" && <RolesAndPermissions />}
      </div>
    </div>
  );
};
