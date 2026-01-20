"use client";

import { Tabs } from "@/components/Tab";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { ModulePermission } from "./ModulePermission";
import { TeacherAssignments } from "./TeacherAssignments";

export const EditRoleSettings = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-bg-card-subtle border-border-default border-b p-3">
        <div className="justify-left mx-auto flex w-full items-center md:max-w-225">
          <div className="text-text-default text-md text-left font-semibold">Edit Role</div>
        </div>
      </div>
      <div className="mx-auto flex w-full items-center justify-center md:max-w-225">
        <div className="flex w-full flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">Role Name</Label>
            <Input className="bg-bg-input-soft! w-full border-none" placeholder="Input Role Name" />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">Role Description</Label>
            <Input className="bg-bg-input-soft! w-full border-none" placeholder="Input Role Description" />
          </div>

          <div className="border-border-default border-b"></div>

          <Tabs
            className="w-full"
            items={[
              {
                label: "Module Permission",
                content: <ModulePermission />,
              },
              {
                label: "Teacher Assignments",
                content: <TeacherAssignments />,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};
