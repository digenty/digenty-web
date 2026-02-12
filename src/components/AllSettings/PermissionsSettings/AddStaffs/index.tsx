"use client";

import Accordion from "@/components/Accordion";
import { AddFill } from "@/components/Icons/AddFill";
import DeleteBin from "@/components/Icons/DeleteBin";
import Mail from "@/components/Icons/Mail";
import School from "@/components/Icons/School";
import { SchoolFill } from "@/components/Icons/SchoolFill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const branches = ["All Branches", "Lawanson", "Ilasamaja"];
const roles = ["Admin", "Teacher"];

export const AddStaff = () => {
  const [branchSelected, setBranchSelected] = useState(branches[0]);
  const [roleAssignments, setRoleAssignments] = useState<string[]>([roles[0]]);
  const addRole = () => {
    setRoleAssignments(prev => [...prev, roles[0]]);
  };

  const removeRole = (index: number) => {
    setRoleAssignments(prev => prev.filter((_, i) => i !== index));
  };

  const updateRole = (index: number, value: string) => {
    setRoleAssignments(prev => prev.map((r, i) => (i === index ? value : r)));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-bg-card-subtle border-border-default border-b p-3">
        <div className="justify-left mx-auto flex w-full items-center md:max-w-225">
          <div className="text-text-default text-md text-left font-semibold">Add Role</div>
        </div>
      </div>

      <div className="mx-auto flex w-full items-center justify-center md:max-w-225">
        <div className="flex w-full flex-col gap-6">
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">First Name</Label>
              <Input className="bg-bg-input-soft! w-full border-none" placeholder="Input First Name" />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">Last Name</Label>
              <Input className="bg-bg-input-soft! w-full border-none" placeholder="Input Last Name" />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">Email Address</Label>
              <Input className="bg-bg-input-soft! w-full border-none" placeholder="Input Email Address" />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">Phone Number</Label>
              <Input className="bg-bg-input-soft! w-full border-none" type="number" placeholder="Input Phone Number" />
            </div>
          </div>
          <div className="border-border-default border-b"></div>

          <Accordion
            defaultOpen={true}
            title={
              <div className="flex items-center gap-2">
                <SchoolFill fill="var(--color-icon-default-muted)" /> Branch Assignment 1
              </div>
            }
          >
            <div className="flex flex-col gap-6 py-4">
              <div className="text-text-default text-lg font-semibold">Role Assignment</div>
              <div>
                <Select value={branchSelected} onValueChange={setBranchSelected}>
                  <Label className="text-text-default mb-2 text-sm font-medium">Branch</Label>
                  <SelectTrigger className="bg-bg-input-soft! text-text-default h-8 w-full border-none text-sm">
                    <SelectValue>{branchSelected}</SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-bg-card border-border-default">
                    {branches.map(branch => (
                      <SelectItem key={branch} value={branch} className="text-text-default text-sm font-semibold">
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {roleAssignments.map((roleValue, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <Select value={roleValue} onValueChange={value => updateRole(index, value)}>
                    <div className="flex items-center justify-between">
                      <Label className="text-text-default text-sm font-medium">Select Role</Label>{" "}
                      {roleAssignments.length > 1 && (
                        <Button className="hover:bg-bg-none! bg-none!" onClick={() => removeRole(index)}>
                          <DeleteBin fill="var(--color-icon-default-muted)" />
                        </Button>
                      )}
                    </div>
                    <SelectTrigger className="bg-bg-input-soft! text-text-default h-8 w-full border-none text-sm">
                      <SelectValue>{roleValue}</SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-bg-card border-border-default">
                      {roles.map(role => (
                        <SelectItem key={role} value={role} className="text-text-default text-sm font-semibold">
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}

              <Button
                className="text-text-subtle bg-bg-state-soft! hover:bg-bg-state-soft-hover! mt-2 flex w-fit items-center justify-start gap-2 rounded font-medium"
                onClick={addRole}
              >
                <AddFill fill="var(--color-icon-default-muted)" /> Add Role
              </Button>
            </div>
          </Accordion>

          <div className="border-border-darker bg-bg-state-secondary flex items-center justify-center rounded-md border border-dashed p-6">
            <div className="flex flex-col items-center gap-2">
              <div className="text-text-default flex items-center gap-1 text-xs">
                <School fill="var(--color-icon-default-muted)" /> Add another branch assignment
              </div>
              <Button className="bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! text-text-default flex w-fit items-center justify-center text-xs font-medium shadow">
                <AddFill fill="var(--color-icon-default-muted)" /> Add Branch
              </Button>
            </div>
          </div>

          <div className="border-border-default border-t p-3">
            <div className="mx-auto flex h-15! w-full items-center justify-center md:max-w-225">
              <div className="flex w-full items-center justify-between">
                <Button className="bg-bg-state-soft text-text-subtle">Cancel</Button>
                <Button className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default">
                  {" "}
                  <Mail fill="var(--color-icon-white-default)" /> Send Invite
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
