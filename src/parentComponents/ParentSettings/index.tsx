"use client";

import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { Lock } from "@/components/Icons/Lock";
import Mail from "@/components/Icons/Mail";
import { Phone } from "@/components/Icons/Phone";
import { ShieldUser } from "@/components/Icons/ShieldUser";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { StudentFilter } from "../FilterStudents";

export const ParentSettings = () => {
  const [editing, setEditing] = useState<string | null>(null);

  return (
    <div className="flex w-full flex-col gap-10 p-4 md:p-8">
      <div className="flex w-full items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <div className="text-text-default text-2xl font-semibold">Settings</div>
          <div className="text-text-muted text-xs">View and update profile information</div>
        </div>
        <StudentFilter />
      </div>

      <div className="border-border-default flex items-center gap-3 rounded-lg border p-5">
        <Avatar className="size-10" />
        <div className="flex flex-col gap-2">
          <div className="text-text-default text-md font-semibold">Mrs. Adaeze Johnson</div>
          <div className="text-text-subtle text-xs">adaeze@gmail.com</div>
        </div>
      </div>

      <div className="border-border-default flex flex-col rounded-xl border">
        <div className="text-text-default flex items-center gap-2 p-4 text-sm font-semibold">
          <ShieldUser fill="var(--color-icon-default-muted)" />
          Account & Security
        </div>
        <div className="border-border-default border-t">
          <div className="flex items-center gap-3 p-5">
            <Avatar />
            <span className="text-text-default border-border-default bg-bg-state-secondary h-7 cursor-pointer rounded-md border p-1 text-sm font-medium">
              Upload
            </span>
            <span className="text-text-muted text-xs">JPG or PNG. 1MB Max.</span>
          </div>
        </div>
        <div className="border-border-default flex items-center justify-between border-t p-5">
          <div className="flex flex-1 items-center gap-3">
            <div className="bg-bg-badge-blue flex h-8 w-8 shrink-0 items-center rounded-md p-2">
              <Mail fill="var(--color-icon-informative)" className="h-7 w-7" />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <p className="text-text-default text-sm font-medium">Email Address</p>

              <span className="text-text-muted text-xs">adaeze.johnson@email.com</span>
            </div>
          </div>
          {editing !== "email" ? (
            <Pencil className="text-icon-default-muted size-4 cursor-pointer" onClick={() => setEditing("email")} />
          ) : (
            <X onClick={() => setEditing(null)} className="text-icon-default-muted size-4 cursor-pointer" />
          )}
        </div>

        {editing === "email" && (
          <div className="border-border-default flex flex-col gap-3 border-t p-5">
            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">
                New Email Address <span className="text-text-destructive">*</span>{" "}
              </Label>
              <Input
                placeholder="Input New Email Address"
                className="bg-bg-input-soft! text-text-default full h-7 rounded-md border-none text-xs"
                autoFocus
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">
                Confirm New Email
                <span className="text-text-destructive">*</span>{" "}
              </Label>
              <Input placeholder="Repeat New Email" className="bg-bg-input-soft! text-text-default full h-7 rounded-md border-none text-xs" />
            </div>

            <div className="flex items-center justify-between gap-3 md:justify-end">
              <Button
                className="bg-bg-state-secondary hover:bg-bg-state-secondary-hover! border-border-darker text-text-default h-7 rounded-md border text-xs"
                onClick={() => setEditing(null)}
              >
                Cancel
              </Button>
              <Button
                className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-7 text-xs"
                onClick={() => setEditing(null)}
              >
                Save Changes
              </Button>
            </div>
          </div>
        )}

        <div className="border-border-default flex items-center justify-between border-t p-5">
          <div className="flex flex-1 items-center gap-3">
            <div className="bg-bg-badge-green flex h-8 w-8 shrink-0 items-center rounded-md p-2">
              <Phone fill="var(--color-bg-basic-emerald-accent)" className="h-7 w-7" />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <p className="text-text-default text-sm font-medium">Phone Number</p>

              <span className="text-text-muted text-xs">+234 803 456 7890</span>
            </div>
          </div>
          {editing !== "phone" ? (
            <Pencil className="text-icon-default-muted size-4 cursor-pointer" onClick={() => setEditing("phone")} />
          ) : (
            <X onClick={() => setEditing(null)} className="text-icon-default-muted size-4 cursor-pointer" />
          )}
        </div>

        {editing === "phone" && (
          <div className="border-border-default flex flex-col gap-3 border-t p-5">
            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">
                New Phonne Number <span className="text-text-destructive">*</span>{" "}
              </Label>
              <Input placeholder="Enter Phone Number" className="bg-bg-input-soft! text-text-default full h-7 rounded-md border-none text-xs" />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">
                Confirm Phone Number
                <span className="text-text-destructive">*</span>{" "}
              </Label>
              <Input placeholder="Repeat Phone Number" className="bg-bg-input-soft! text-text-default full h-7 rounded-md border-none text-xs" />
            </div>

            <div className="flex items-center justify-between gap-3 md:justify-end">
              <Button
                className="bg-bg-state-secondary hover:bg-bg-state-secondary-hover! border-border-darker text-text-default h-7 rounded-md border text-xs"
                onClick={() => setEditing(null)}
              >
                Cancel
              </Button>
              <Button
                className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-7 text-xs"
                onClick={() => setEditing(null)}
              >
                Save Changes
              </Button>
            </div>
          </div>
        )}

        <div className="border-border-default flex items-center justify-between border-t p-5">
          <div className="flex flex-1 items-center gap-3">
            <div className="bg-bg-badge-purple flex h-8 w-8 shrink-0 items-center rounded-md p-2">
              <Lock fill="var(--color-bg-basic-purple-accent)" className="h-7 w-7" />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <p className="text-text-default text-sm font-medium">Password</p>

              <span className="text-text-muted text-xs">••••••••••••</span>
            </div>
          </div>

          {editing !== "password" ? (
            <Pencil className="text-icon-default-muted size-4 cursor-pointer" onClick={() => setEditing("password")} />
          ) : (
            <X onClick={() => setEditing(null)} className="text-icon-default-muted size-4 cursor-pointer" />
          )}
        </div>

        {editing === "password" && (
          <div className="border-border-default flex flex-col gap-3 border-t p-5">
            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">
                Old Password <span className="text-text-destructive">*</span>{" "}
              </Label>
              <Input placeholder="Enter Old Password" className="bg-bg-input-soft! text-text-default full h-7 rounded-md border-none text-xs" />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">
                New Password
                <span className="text-text-destructive">*</span>{" "}
              </Label>
              <Input
                placeholder="Enter New Password"
                className="bg-bg-input-soft! text-text-default full h-7 rounded-md border-none text-xs"
                autoFocus
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">
                Confirm Old Password
                <span className="text-text-destructive">*</span>{" "}
              </Label>
              <Input placeholder="Repeat Password" className="bg-bg-input-soft! text-text-default full h-7 rounded-md border-none text-xs" />
            </div>

            <div className="flex items-center justify-between gap-3 md:justify-end">
              <Button
                className="bg-bg-state-secondary hover:bg-bg-state-secondary-hover! border-border-darker text-text-default h-7 rounded-md border text-xs"
                onClick={() => setEditing(null)}
              >
                Cancel
              </Button>
              <Button
                className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-7 text-xs"
                onClick={() => setEditing(null)}
              >
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
