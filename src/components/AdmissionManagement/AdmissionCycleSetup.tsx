"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Bill from "../Icons/Bill";
import CheckboxCircleFill from "../Icons/CheckboxCircleFill";
import Edit from "../Icons/Edit";
import Eye from "../Icons/Eye";
import Loader2Fill from "../Icons/Loader2Fill";
import Settings4 from "../Icons/Settings4";

const mockCycle = {
  name: "2026-2027 Admissions",
  differsByBranch: false,
  branches: [
    { id: "1", name: "Lawanson", status: "active" as const },
    { id: "2", name: "Ilasamaja", status: "loading" as const },
  ],
  levels: [
    { id: "1", name: "Nursery/KG", classCount: 4, configured: false },
    { id: "2", name: "Primary", classCount: 6, configured: true },
    { id: "3", name: "Junior Secondary", classCount: 3, configured: true },
    { id: "4", name: "Senior Secondary Art", classCount: 3, configured: true },
    { id: "5", name: "Senior Secondary Commercial", classCount: 3, configured: true },
    { id: "6", name: "Senior Secondary Science", classCount: 3, configured: false },
  ],
};

export const AdmissionCycleSetup = () => {
  const [differsByBranch, setDiffersByBranch] = useState(mockCycle.differsByBranch);
  const [activeBranchId, setActiveBranchId] = useState(mockCycle.branches[0].id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-text-default text-xl font-semibold">{mockCycle.name}</h2>
        <div className="flex items-center gap-2">
          <Button className="border-border-darker text-text-default hover:bg-bg-state-secondary-hover! bg-bg-state-secondary! flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium">
            <Bill fill="var(--color-icon-default-subtle)" className="size-4 shrink-0" />
            Set Global Fees
          </Button>
          <Button className="border-border-darker text-text-default hover:bg-bg-state-secondary-hover! bg-bg-state-secondary! flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium">
            <Edit fill="var(--color-icon-default-subtle)" className="size-4 shrink-0" />
            Edit Cycle Details
          </Button>
        </div>
      </div>

      <div className="border-border-default flex items-center justify-between gap-4 rounded-xl border p-4">
        <div className="flex flex-col gap-0.5">
          <p className="text-text-default text-sm font-semibold">Do admission requirements differ by school branch?</p>
          <p className="text-text-muted text-xs font-normal">
            Turn ON if admission requirements vary across branches. Keep OFF to apply the same requirements to all branches.
          </p>
        </div>
        <Switch checked={differsByBranch} onCheckedChange={setDiffersByBranch} className="shrink-0" />
      </div>

      <div className="bg-bg-state-soft flex w-fit flex-wrap items-center gap-2.5 rounded-full p-1">
        {mockCycle.branches.map(branch => (
          <button
            key={branch.id}
            onClick={() => setActiveBranchId(branch.id)}
            className={cn(
              "flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              activeBranchId === branch.id
                ? "border-border-darker bg-bg-state-secondary text-text-default border"
                : "text-text-muted hover:text-text-subtle",
            )}
          >
            {branch.status === "active" ? (
              <CheckboxCircleFill fill="#22c55e" className="size-4 shrink-0" />
            ) : (
              <Loader2Fill fill="var(--color-icon-default-subtle)" className="size-4 shrink-0" />
            )}
            {branch.name}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-text-default text-sm font-semibold">Configure Requirements by Level</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {mockCycle.levels.map(level => (
            <div key={level.id} className="border-border-default bg-bg-subtle flex flex-col gap-4 rounded-xl border p-4">
              <div className="flex flex-col gap-1.5">
                <p className="text-text-default text-sm font-semibold">{level.name}</p>
                <p className="text-text-muted text-xs">{level.classCount} Classes</p>
                <Badge
                  className={cn(
                    "border-border-default w-fit rounded-md border px-2 py-0.5 text-xs font-medium",
                    level.configured ? "bg-bg-badge-green text-bg-basic-green-strong" : "bg-bg-badge-orange text-bg-basic-orange-strong",
                  )}
                >
                  {level.configured ? "Configured" : "Not Configured"}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Button className="border-border-darker bg-bg-state-secondary! text-text-default hover:bg-bg-state-secondary-hover! flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium">
                  <Eye fill="var(--color-icon-default-subtle)" className="size-3.5 shrink-0" />
                  View Classes
                </Button>
                <Button className="border-border-darker bg-bg-state-secondary! text-text-default hover:bg-bg-state-secondary-hover! flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium">
                  <Settings4 fill="var(--color-icon-default-subtle)" className="size-3.5 shrink-0" />
                  Configure Level
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
