"use client";

import { Student } from "@/api/types";
import { Avatar } from "@/components/Avatar";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetStudents } from "@/hooks/queryHooks/useStudent";
import useDebounce from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { Recipient } from "./SelectRecipientsModal";

const recipientKey = (r: Recipient) => `${r.type}-${r.id}`;

type Props = {
  selectedKeys: Set<string>;
  onToggle: (r: Recipient, checked: boolean) => void;
  onClearAll: () => void;
};

export function AllStudentsListTab({ selectedKeys, onToggle, onClearAll }: Props) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetStudents({
    limit: 30,
    search: debouncedSearch || undefined,
  });

  const students: Student[] = data?.pages.flatMap(p => p.content) ?? [];

  const handleSelectAll = () => {
    students.forEach(s => {
      const r: Recipient = { type: "student", id: s.id, name: `${s.firstName} ${s.lastName}`, avatar: s.image };
      onToggle(r, true);
    });
  };

  return (
    <div>
      <div className="px-4 py-3">
        <SearchInput
          className="border-border-default bg-bg-input-soft! w-full border-none text-sm"
          placeholder="Search for students..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2 px-4 pb-3">
        <Button className="border-border-darker bg-bg-state-secondary text-text-default h-6 gap-1 rounded-full border px-2.5 text-xs" onClick={handleSelectAll}>
          ✓ Select All
        </Button>
        <Button className="border-border-darker bg-bg-state-secondary text-text-muted h-6 gap-1 rounded-full border px-2.5 text-xs" onClick={onClearAll}>
          ✕ Clear All
        </Button>
      </div>

      <div className="max-h-80 space-y-2 overflow-y-auto px-4 pb-3">
        {isPending ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="bg-bg-input-soft h-14 w-full rounded-lg" />)
        ) : students.length === 0 ? (
          <p className="text-text-muted py-8 text-center text-sm">No students found</p>
        ) : (
          students.map(s => {
            const r: Recipient = { type: "student", id: s.id, name: `${s.firstName} ${s.lastName}`, avatar: s.image };
            const isSelected = selectedKeys.has(recipientKey(r));
            return (
              <div
                key={s.id}
                className={cn(
                  "border-border-default flex cursor-pointer items-center gap-3 rounded-lg border p-3",
                  isSelected ? "bg-bg-state-soft" : "hover:bg-bg-state-ghost-hover",
                )}
                onClick={() => onToggle(r, !isSelected)}
              >
                <Checkbox checked={isSelected} onCheckedChange={c => onToggle(r, !!c)} onClick={e => e.stopPropagation()} className="shrink-0" />
                <Avatar className="size-8" url={s.image ?? undefined} />
                <div>
                  <div className="text-text-default text-sm font-medium">{s.firstName} {s.lastName}</div>
                  <div className="text-text-muted text-xs">
                    {[s.class, s.arm].filter(Boolean).join(" ")}{s.branch ? ` - ${s.branch}` : ""}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {hasNextPage && (
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="bg-bg-state-soft text-text-subtle w-full rounded-md text-sm"
          >
            {isFetchingNextPage ? "Loading..." : "Load more"}
          </Button>
        )}
      </div>
    </div>
  );
}
