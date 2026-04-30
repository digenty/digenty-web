"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Eye from "@/components/Icons/Eye";
import School from "@/components/Icons/School";

const BRANCHES = ["Lawanson", "Ilasamaja"];

const mockClasses = [
  { id: "1", name: "JSS 1", branch: "Lawanson", admitted: 4, pending: 4, rejected: 4, enrolled: 1247, capacity: 2000 },
  { id: "2", name: "JSS 2", branch: "Lawanson", admitted: 4, pending: 4, rejected: 4, enrolled: 1247, capacity: 2000 },
  { id: "3", name: "JSS 3", branch: "Lawanson", admitted: 4, pending: 4, rejected: 4, enrolled: 1247, capacity: 2000 },
  { id: "4", name: "SS 1 Art", branch: "Lawanson", admitted: 4, pending: 4, rejected: 4, enrolled: 1247, capacity: 2000 },
  { id: "5", name: "SS 1 Commercial", branch: "Lawanson", admitted: 4, pending: 4, rejected: 4, enrolled: 1247, capacity: 2000 },
  { id: "6", name: "SS 1 Science", branch: "Lawanson", admitted: 4, pending: 4, rejected: 4, enrolled: 1247, capacity: 2000 },
  { id: "7", name: "SS 2 Art", branch: "Lawanson", admitted: 4, pending: 4, rejected: 4, enrolled: 1247, capacity: 2000 },
  { id: "8", name: "SS 2 Commercial", branch: "Lawanson", admitted: 4, pending: 4, rejected: 4, enrolled: 1247, capacity: 2000 },
  { id: "9", name: "SS 2 Science", branch: "Lawanson", admitted: 4, pending: 4, rejected: 4, enrolled: 1247, capacity: 2000 },
  { id: "10", name: "JSS 1", branch: "Ilasamaja", admitted: 6, pending: 2, rejected: 1, enrolled: 980, capacity: 1500 },
  { id: "11", name: "JSS 2", branch: "Ilasamaja", admitted: 3, pending: 5, rejected: 2, enrolled: 750, capacity: 1500 },
  { id: "12", name: "Primary 1", branch: "Ilasamaja", admitted: 8, pending: 1, rejected: 0, enrolled: 400, capacity: 800 },
];

interface ClassCardProps {
  name: string;
  branch: string;
  admitted: number;
  pending: number;
  rejected: number;
  enrolled: number;
  capacity: number;
}

const ClassCard = ({ id, name, branch, admitted, pending, rejected, enrolled, capacity }: ClassCardProps & { id: string }) => {
  const router = useRouter();
  const pct = Math.min(Math.round((enrolled / capacity) * 100), 100);

  return (
    <div className="border-border-default flex flex-col gap-4 rounded-xl border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <p className="text-text-default text-base leading-tight font-semibold">{name}</p>
          <p className="text-text-muted text-xs">{branch}</p>
        </div>
        <Button
          onClick={() => router.push(`/staff/admission-management/${id}`)}
          className="text-text-subtle bg-bg-state-soft flex h-6 shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium"
        >
          <Eye fill="var(--color-icon-default-subtle)" className="size-3.5 shrink-0" />
          View Class
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-bg-badge-sky flex flex-col items-center gap-1 rounded-lg py-3">
          <span className="text-text-default text-xl leading-none font-semibold">{admitted}</span>
          <span className="text-text-muted text-xs">Admitted</span>
        </div>

        <div className="bg-bg-badge-yellow flex flex-col items-center gap-1 rounded-lg py-3">
          <span className="text-text-default text-xl leading-none font-semibold">{pending}</span>
          <span className="text-text-muted text-xs">Pending</span>
        </div>

        <div className="bg-bg-badge-gray flex flex-col items-center gap-1 rounded-lg py-3">
          <span className="text-text-default text-xl leading-none font-semibold">{rejected}</span>
          <span className="text-text-muted text-xs">Rejected</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-text-default text-xs font-semibold">Student Capacity</span>
          <span className="text-text-muted text-xs">
            {enrolled.toLocaleString()} / {capacity.toLocaleString()}
          </span>
        </div>
        <div className="bg-bg-state-soft h-1.5 w-full overflow-hidden rounded-full">
          <div className="h-full rounded-full bg-green-500 transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
};

export const ProcessApplicants = () => {
  const [branch, setBranch] = useState(BRANCHES[0]);

  const filtered = mockClasses.filter(c => c.branch === branch);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-text-default text-xl font-semibold">Process Applicants by Class</h2>

        <Select value={branch} onValueChange={setBranch}>
          <SelectTrigger className="border-border-darker bg-bg-state-secondary! h-8 w-auto gap-1.5 border text-sm font-medium focus-visible:ring-0">
            <School fill="var(--color-icon-default-subtle)" className="size-3.5 shrink-0" />
            <span className="text-text-default">{branch}</span>
          </SelectTrigger>
          <SelectContent className="bg-bg-card border-border-default">
            {BRANCHES.map(b => (
              <SelectItem key={b} value={b} className="text-text-default text-sm font-medium">
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(cls => (
          <ClassCard key={cls.id} {...cls} />
        ))}
      </div>
    </div>
  );
};
