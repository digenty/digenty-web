import BankCard from "@/components/Icons/BankCard";
import CalendarCheck from "@/components/Icons/CalendarCheck";
import ColorFilter from "@/components/Icons/ColorFilter";
import DeleteBin from "@/components/Icons/DeleteBin";
import { DoorOpen } from "@/components/Icons/DoorOpen";
import Edit from "@/components/Icons/Edit";
import Eye from "@/components/Icons/Eye";
import FileList2 from "@/components/Icons/FileList2";
import FileList3 from "@/components/Icons/FileList3";
import { Gift2 } from "@/components/Icons/Gift2";
import Global from "@/components/Icons/Global";
import GraduationCap from "@/components/Icons/GraduationCap";
import Group from "@/components/Icons/Group";
import LineChart from "@/components/Icons/LineChart";
import Macbook from "@/components/Icons/Macbook";
import Megaphone from "@/components/Icons/Megaphone";
import { SendPlane } from "@/components/Icons/SendPlane";
import Store3 from "@/components/Icons/Store3";
import Wallet from "@/components/Icons/Wallet";
import { Toggle } from "@/components/Toggle";
import React from "react";

export const ModulePermission = () => {
  return (
    <div className="border-border-default my-6 flex w-full flex-col gap-4 rounded-md border p-4 md:p-6">
      <div className="flex flex-col gap-1">
        <div className="text-text-default text-lg font-semibold">Module Permissions</div>
        <div className="text-text-subtle text-sm">Configure access to standard system modules</div>
      </div>

      {/* First div */}
      <div className="border-border-default flex flex-col gap-4 rounded-md border p-2 md:flex-row md:items-center md:justify-between md:gap-2 md:p-4">
        <div className="flex items-center gap-4">
          <div className="bg-bg-state-soft-hover rounded-sm p-1">
            <Group fill="var(--color-icon-default-subtle)" className="size-6" />
          </div>
          <div className="flex flex-col">
            <div className="text-text-default text-sm font-medium">Student & Parent Records</div>
            <div className="text-text-muted text-xs">Access to student and parent information</div>
          </div>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <Toggle />
            <Eye fill="var(--color-icon-default-muted)" />
            <div className="text-text-muted text-sm">View</div>
          </div>
          <div className="flex items-center gap-2">
            <Toggle />
            <Edit fill="var(--color-icon-default-muted)" />
            <div className="text-text-muted text-sm">Manage</div>
          </div>

          <div className="flex items-center gap-2">
            <Toggle />
            <DeleteBin fill="var(--color-icon-default-muted)" className="size-4" />
            <div className="text-text-muted text-sm">View</div>
          </div>
        </div>
      </div>
      {/*  */}
      <div className="border-border-default flex flex-col gap-4 rounded-md border p-2 md:flex-row md:items-center md:justify-between md:gap-2 md:p-4">
        <div className="flex items-center gap-4">
          <div className="bg-bg-state-soft-hover rounded-sm p-1">
            <GraduationCap fill="var(--color-icon-default-subtle)" className="size-6" />
          </div>
          <div className="flex flex-col">
            <div className="text-text-default text-sm font-medium">Classes & Subjects (Admin)</div>
            <div className="text-text-muted text-xs">Control who can view and manage classes and subjects.</div>
          </div>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <Toggle />
            <Eye fill="var(--color-icon-default-muted)" />
            <div className="text-text-muted text-sm">View</div>
          </div>
          <div className="flex items-center gap-2">
            <Toggle />
            <Edit fill="var(--color-icon-default-muted)" />
            <div className="text-text-muted text-sm">Manage</div>
          </div>
        </div>
      </div>
      {/*  */}
      <div className="border-border-default flex flex-col gap-4 rounded-md border p-2 md:flex-row md:items-center md:justify-between md:gap-2 md:p-4">
        <div className="flex items-center gap-4">
          <div className="bg-bg-state-soft-hover rounded-sm p-1">
            <CalendarCheck fill="var(--color-icon-default-subtle)" className="size-6" />
          </div>
          <div className="flex flex-col">
            <div className="text-text-default text-sm font-medium">Attendance (Admin)</div>
            <div className="text-text-muted text-xs">View student attendance records.</div>
          </div>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <Toggle />
            <Eye fill="var(--color-icon-default-muted)" />
            <div className="text-text-muted text-sm">View</div>
          </div>
          <div className="flex items-center gap-2">
            <Toggle />
            <Edit fill="var(--color-icon-default-muted)" />
            <div className="text-text-muted text-sm">Manage</div>
          </div>
        </div>
      </div>
      {/*  */}
      <div className="border-border-default flex flex-col gap-4 rounded-md border p-2 md:flex-row md:items-center md:justify-between md:gap-2 md:p-4">
        <div className="flex items-center gap-4">
          <div className="bg-bg-state-soft-hover rounded-sm p-1">
            <DoorOpen fill="var(--color-icon-default-subtle)" className="size-6" />
          </div>
          <div className="flex flex-col">
            <div className="text-text-default text-sm font-medium">Admission Management</div>
            <div className="text-text-muted text-xs">Manage student applications and admission workflows.</div>
          </div>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <Toggle />
            <Eye fill="var(--color-icon-default-muted)" />
            <div className="text-text-muted text-sm">View</div>
          </div>
          <div className="flex items-center gap-2">
            <Toggle />
            <Edit fill="var(--color-icon-default-muted)" />
            <div className="text-text-muted text-sm">Manage</div>
          </div>
        </div>
      </div>
      {/*  */}
      <div className="border-border-default flex flex-col gap-4 rounded-md border p-2 md:flex-row md:items-center md:justify-between md:gap-2 md:p-4">
        <div className="flex items-center gap-4">
          <div className="bg-bg-state-soft-hover rounded-sm p-1">
            <FileList3 fill="var(--color-icon-default-subtle)" className="size-6" />
          </div>
          <div className="flex flex-col">
            <div className="text-text-default text-sm font-medium">Invoices</div>
            <div className="text-text-muted text-xs">Create and manage student invoices</div>
          </div>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <Toggle />
            <Eye fill="var(--color-icon-default-muted)" />
            <div className="text-text-muted text-sm">View</div>
          </div>
          <div className="flex items-center gap-2">
            <Toggle />
            <Edit fill="var(--color-icon-default-muted)" />
            <div className="text-text-muted text-sm">Manage</div>
          </div>

          <div className="flex items-center gap-2">
            <Toggle />
            <DeleteBin fill="var(--color-icon-default-muted)" className="size-4" />
            <div className="text-text-muted text-sm">View</div>
          </div>
        </div>
      </div>
      {/*  */}
      <div className="border-border-default flex flex-col gap-4 rounded-md border p-2 md:flex-row md:items-center md:justify-between md:gap-2 md:p-4">
        <div className="flex items-center gap-4">
          <div className="bg-bg-state-soft-hover rounded-sm p-1">
            <FileList2 fill="var(--color-icon-default-subtle)" className="size-6" />
          </div>
          <div className="flex flex-col">
            <div className="text-text-default text-sm font-medium">Fees</div>
            <div className="text-text-muted text-xs">Configure school fees and payment structures</div>
          </div>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <Toggle />
            <Eye fill="var(--color-icon-default-muted)" />
            <div className="text-text-muted text-sm">View</div>
          </div>
          <div className="flex items-center gap-2">
            <Toggle />
            <Edit fill="var(--color-icon-default-muted)" />
            <div className="text-text-muted text-sm">Manage</div>
          </div>

          <div className="flex items-center gap-2">
            <Toggle />
            <DeleteBin fill="var(--color-icon-default-muted)" className="size-4" />
            <div className="text-text-muted text-sm">View</div>
          </div>
        </div>
      </div>
      {/*  */}
      <div className="border-border-default flex flex-col gap-4 rounded-md border p-2 md:flex-row md:items-center md:justify-between md:gap-2 md:p-4">
        <div className="flex items-center gap-4">
          <div className="bg-bg-state-soft-hover rounded-sm p-1">
            <BankCard fill="var(--color-icon-default-subtle)" className="size-6" />
          </div>
          <div className="flex flex-col">
            <div className="text-text-default text-sm font-medium">Expenses</div>
            <div className="text-text-muted text-xs">Track and manage school expenses</div>
          </div>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <Toggle />
            <Eye fill="var(--color-icon-default-muted)" />
            <div className="text-text-muted text-sm">View</div>
          </div>
          <div className="flex items-center gap-2">
            <Toggle />
            <Edit fill="var(--color-icon-default-muted)" />
            <div className="text-text-muted text-sm">Manage</div>
          </div>

          <div className="flex items-center gap-2">
            <Toggle />
            <DeleteBin fill="var(--color-icon-default-muted)" className="size-4" />
            <div className="text-text-muted text-sm">View</div>
          </div>
        </div>
      </div>
      {/*  */}
      <div className="border-border-default flex flex-col gap-4 rounded-md border p-2 md:flex-row md:items-center md:justify-between md:gap-2 md:p-4">
        <div className="flex items-center gap-4">
          <div className="bg-bg-state-soft-hover rounded-sm p-1">
            <Store3 fill="var(--color-icon-default-subtle)" className="size-6" />
          </div>
          <div className="flex flex-col">
            <div className="text-text-default text-sm font-medium">Stock</div>
            <div className="text-text-muted text-xs">Manage school inventory and supplies</div>
          </div>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <Toggle />
            <Eye fill="var(--color-icon-default-muted)" />
            <div className="text-text-muted text-sm">View</div>
          </div>
          <div className="flex items-center gap-2">
            <Toggle />
            <Edit fill="var(--color-icon-default-muted)" />
            <div className="text-text-muted text-sm">Manage</div>
          </div>

          <div className="flex items-center gap-2">
            <Toggle />
            <DeleteBin fill="var(--color-icon-default-muted)" className="size-4" />
            <div className="text-text-muted text-sm">View</div>
          </div>
        </div>
      </div>
      {/*  */}
      <div className="border-border-default flex flex-col gap-4 rounded-md border p-2 md:flex-row md:items-center md:justify-between md:gap-2 md:p-4">
        <div className="flex items-center gap-4">
          <div className="bg-bg-state-soft-hover rounded-sm p-1">
            <Wallet fill="var(--color-icon-default-subtle)" className="size-6" />
          </div>
          <div className="flex flex-col">
            <div className="text-text-default text-sm font-medium">Fee Collection</div>
            <div className="text-text-muted text-xs">Set up your school&apos;s payment gateway for online fee payments.</div>
          </div>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <Toggle />
            <Eye fill="var(--color-icon-default-muted)" />
            <div className="text-text-muted text-sm">View</div>
          </div>
          <div className="flex items-center gap-2">
            <Toggle />
            <Edit fill="var(--color-icon-default-muted)" />
            <div className="text-text-muted text-sm">Manage</div>
          </div>

          <div className="flex items-center gap-2">
            <Toggle />
            <DeleteBin fill="var(--color-icon-default-muted)" className="size-4" />
            <div className="text-text-muted text-sm">View</div>
          </div>
        </div>
      </div>
      {/*  */}
      <div className="border-border-default flex flex-col gap-4 rounded-md border p-2 md:flex-row md:items-center md:justify-between md:gap-2 md:p-4">
        <div className="flex items-center gap-4">
          <div className="bg-bg-state-soft-hover rounded-sm p-1">
            <LineChart fill="var(--color-icon-default-subtle)" className="size-6" />
          </div>
          <div className="flex flex-col">
            <div className="text-text-default text-sm font-medium">Finance Report</div>
            <div className="text-text-muted text-xs">Access financial analytics and reports</div>
          </div>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <Toggle />
            <Eye fill="var(--color-icon-default-muted)" />
            <div className="text-text-muted text-sm">View</div>
          </div>
          <div className="flex items-center gap-2">
            <Toggle />
            <Edit fill="var(--color-icon-default-muted)" />
            <div className="text-text-muted text-sm">Manage</div>
          </div>

          <div className="flex items-center gap-2">
            <Toggle />
            <DeleteBin fill="var(--color-icon-default-muted)" className="size-4" />
            <div className="text-text-muted text-sm">View</div>
          </div>
        </div>
      </div>
      {/*  */}
      <div className="border-border-default flex flex-col gap-4 rounded-md border p-2 md:flex-row md:items-center md:justify-between md:gap-2 md:p-4">
        <div className="flex items-center gap-4">
          <div className="bg-bg-state-soft-hover rounded-sm p-1">
            <Megaphone fill="var(--color-icon-default-subtle)" className="size-6" />
          </div>
          <div className="flex flex-col">
            <div className="text-text-default text-sm font-medium">Communication</div>
            <div className="text-text-muted text-xs">Send school communications and campaigns</div>
          </div>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <Toggle />
            <Eye fill="var(--color-icon-default-muted)" />
            <div className="text-text-muted text-sm">View</div>
          </div>
          <div className="flex items-center gap-2">
            <Toggle />
            <Edit fill="var(--color-icon-default-muted)" />
            <div className="text-text-muted text-sm">Manage</div>
          </div>

          <div className="flex items-center gap-2">
            <Toggle />
            <DeleteBin fill="var(--color-icon-default-muted)" className="size-4" />
            <div className="text-text-muted text-sm">View</div>
          </div>
          <div className="flex items-center gap-2">
            <Toggle />
            <SendPlane fill="var(--color-icon-default-muted)" className="size-4" />
            <div className="text-text-muted text-sm">Send</div>
          </div>
        </div>
      </div>
      {/*  */}
      <div className="border-border-default flex flex-col gap-4 rounded-md border p-2 md:flex-row md:items-center md:justify-between md:gap-2 md:p-4">
        <div className="flex items-center gap-4">
          <div className="bg-bg-state-soft-hover rounded-sm p-1">
            <Macbook fill="var(--color-icon-default-subtle)" className="size-6" />
          </div>
          <div className="flex flex-col">
            <div className="text-text-default text-sm font-medium">Portal Overview</div>
            <div className="text-text-muted text-xs">View key metrics across your school portal.</div>
          </div>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <Toggle />
            <Eye fill="var(--color-icon-default-muted)" />
            <div className="text-text-muted text-sm">View</div>
          </div>
          <div className="flex items-center gap-2">
            <Toggle />
            <Edit fill="var(--color-icon-default-muted)" />
            <div className="text-text-muted text-sm">Manage</div>
          </div>
        </div>
      </div>
      {/*  */}
      <div className="border-border-default flex flex-col gap-4 rounded-md border p-2 md:flex-row md:items-center md:justify-between md:gap-2 md:p-4">
        <div className="flex items-center gap-4">
          <div className="bg-bg-state-soft-hover rounded-sm p-1">
            <ColorFilter fill="var(--color-icon-default-subtle)" className="size-6" />
          </div>
          <div className="flex flex-col">
            <div className="text-text-default text-sm font-medium">Portal Customization</div>
            <div className="text-text-muted text-xs">Customize school portal appearance</div>
          </div>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <Toggle />
            <Eye fill="var(--color-icon-default-muted)" />
            <div className="text-text-muted text-sm">View</div>
          </div>
          <div className="flex items-center gap-2">
            <Toggle />
            <Edit fill="var(--color-icon-default-muted)" />
            <div className="text-text-muted text-sm">Manage</div>
          </div>
        </div>
      </div>
      {/*  */}
      <div className="border-border-default flex flex-col gap-4 rounded-md border p-2 md:flex-row md:items-center md:justify-between md:gap-2 md:p-4">
        <div className="flex items-center gap-4">
          <div className="bg-bg-state-soft-hover rounded-sm p-1">
            <Global fill="var(--color-icon-default-subtle)" className="size-6" />
          </div>
          <div className="flex flex-col">
            <div className="text-text-default text-sm font-medium">Domain</div>
            <div className="text-text-muted text-xs">Set up and manage your school&apos;s custom domain.</div>
          </div>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <Toggle />
            <Eye fill="var(--color-icon-default-muted)" />
            <div className="text-text-muted text-sm">View</div>
          </div>
          <div className="flex items-center gap-2">
            <Toggle />
            <Edit fill="var(--color-icon-default-muted)" />
            <div className="text-text-muted text-sm">Manage</div>
          </div>

          <div className="flex items-center gap-2">
            <Toggle />
            <DeleteBin fill="var(--color-icon-default-muted)" className="size-4" />
            <div className="text-text-muted text-sm">View</div>
          </div>
        </div>
      </div>
      {/*  */}
      <div className="border-border-default flex flex-col gap-4 rounded-md border p-2 md:flex-row md:items-center md:justify-between md:gap-2 md:p-4">
        <div className="flex items-center gap-4">
          <div className="bg-bg-state-soft-hover rounded-sm p-1">
            <Global fill="var(--color-icon-default-subtle)" className="size-6" />
          </div>
          <div className="flex flex-col">
            <div className="text-text-default text-sm font-medium">Settings</div>
            <div className="text-text-muted text-xs">View and manage the school settings.</div>
          </div>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <Toggle />
            <Eye fill="var(--color-icon-default-muted)" />
            <div className="text-text-muted text-sm">View</div>
          </div>
          <div className="flex items-center gap-2">
            <Toggle />
            <Edit fill="var(--color-icon-default-muted)" />
            <div className="text-text-muted text-sm">Manage</div>
          </div>
        </div>
      </div>
      {/*  */}

      <div className="border-border-default flex flex-col gap-4 rounded-md border p-2 md:flex-row md:items-center md:justify-between md:gap-2 md:p-4">
        <div className="flex items-center gap-4">
          <div className="bg-bg-state-soft-hover rounded-sm p-1">
            <Gift2 fill="var(--color-icon-default-subtle)" className="size-6" />
          </div>
          <div className="flex flex-col">
            <div className="text-text-default text-sm font-medium">Referrals</div>
            <div className="text-text-muted text-xs">View referral program statistics</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Toggle />
            <Eye fill="var(--color-icon-default-muted)" />
            <div className="text-text-muted text-sm">View</div>
          </div>
        </div>
      </div>
    </div>
  );
};
