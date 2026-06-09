"use client";

import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { Recipient } from "./SelectRecipientsModal";

const recipientKey = (r: Recipient) => `${r.type}-${r.id}`;

type StudentTag = {
  id: number;
  name: string;
  studentCount: number;
  branchName: string;
};

// Replace with real API call when GET /student-tags is available
const MOCK_TAGS: StudentTag[] = [
  { id: 1, name: "Troublesome", studentCount: 10, branchName: "Lawanson" },
  { id: 2, name: "Outstanding Students", studentCount: 24, branchName: "Lawanson" },
  { id: 3, name: "Scholarship", studentCount: 8, branchName: "Ilasamaja" },
  { id: 4, name: "At Risk", studentCount: 15, branchName: "Lawanson" },
  { id: 5, name: "Fee Defaulters", studentCount: 12, branchName: "Ilasamaja" },
];

type Props = {
  selectedKeys: Set<string>;
  onToggle: (r: Recipient, checked: boolean) => void;
  onClearAll: () => void;
  filterBranchId?: number;
};

export function StudentTagsTab({ selectedKeys, onToggle, onClearAll, filterBranchId }: Props) {
  const [search, setSearch] = useState("");

  const filtered = MOCK_TAGS.filter(t => {
    const matchesSearch = !search || t.name.toLowerCase().includes(search.toLowerCase());
    const matchesBranch = !filterBranchId;
    return matchesSearch && matchesBranch;
  });

  const handleSelectAll = () => {
    filtered.forEach(t => {
      const r: Recipient = { type: "tag", id: t.id, name: t.name, count: t.studentCount };
      onToggle(r, true);
    });
  };

  return (
    <div>
      <div className="px-4 py-3">
        <SearchInput
          className="border-border-default bg-bg-input-soft! w-full border-none text-sm"
          placeholder="Search for student tags..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2 px-4 pb-3">
        <Button
          className="border-border-darker bg-bg-state-secondary text-text-default h-6 gap-1 rounded-full border px-2.5 text-xs"
          onClick={handleSelectAll}
        >
          ✓ Select All
        </Button>
        <Button
          className="border-border-darker bg-bg-state-secondary text-text-muted h-6 gap-1 rounded-full border px-2.5 text-xs"
          onClick={onClearAll}
        >
          ✕ Clear All
        </Button>
      </div>

      <div className="max-h-80 space-y-2 overflow-y-auto px-4 pb-3">
        {filtered.length === 0 ? (
          <p className="text-text-muted py-8 text-center text-sm">No tags found</p>
        ) : (
          filtered.map(t => {
            const r: Recipient = { type: "tag", id: t.id, name: t.name, count: t.studentCount };
            const isSelected = selectedKeys.has(recipientKey(r));
            return (
              <div
                key={t.id}
                className={cn(
                  "border-border-default flex cursor-pointer items-center gap-3 rounded-lg border p-3",
                  isSelected ? "bg-bg-state-soft" : "hover:bg-bg-state-ghost-hover",
                )}
                onClick={() => onToggle(r, !isSelected)}
              >
                <Checkbox checked={isSelected} onCheckedChange={c => onToggle(r, !!c)} onClick={e => e.stopPropagation()} className="shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-text-default text-sm font-medium">{t.name}</span>
                    <span className="text-text-muted text-xs">{t.studentCount} Students</span>
                  </div>
                  <div className="text-text-muted text-xs">{t.branchName}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
