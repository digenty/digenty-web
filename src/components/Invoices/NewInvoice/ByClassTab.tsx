"use client";

import { BranchWithClassLevels, BranchClassLevel, ClassInLevelDetails, Student } from "@/api/types";
import { Avatar } from "@/components/Avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useGetClassesByLevel } from "@/hooks/queryHooks/useClass";
import { useGetStudents } from "@/hooks/queryHooks/useStudent";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { Recipient } from "./SelectRecipientsModal";

const recipientKey = (r: Recipient) => `${r.type}-${r.id}`;

function ColHeader({ title }: { title: string }) {
  return (
    <div className="border-border-default bg-bg-card-subtle border-b px-4 py-2.5">
      <span className="text-text-muted text-xs font-medium">{title}</span>
    </div>
  );
}

function StudentsColumn({
  armId,
  selectedKeys,
  onToggle,
}: {
  armId: number;
  selectedKeys: Set<string>;
  onToggle: (r: Recipient, checked: boolean) => void;
}) {
  const { data, isPending } = useGetStudents({ limit: 50, armId });
  const students: Student[] = data?.pages[0]?.content ?? [];

  if (isPending) return <Skeleton className="bg-bg-input-soft h-40 w-full" />;

  return (
    <>
      {students.map(s => {
        const r: Recipient = { type: "student", id: s.id, name: `${s.firstName} ${s.lastName}`, avatar: s.image };
        return (
          <div
            key={s.id}
            className="hover:bg-bg-state-ghost-hover flex cursor-pointer items-center gap-2 px-3 py-2"
            onClick={() => onToggle(r, !selectedKeys.has(recipientKey(r)))}
          >
            <Checkbox checked={selectedKeys.has(recipientKey(r))} onCheckedChange={c => onToggle(r, !!c)} onClick={e => e.stopPropagation()} className="shrink-0" />
            <Avatar className="size-5" url={s.image ?? undefined} />
            <span className="text-text-default text-sm">{r.name}</span>
          </div>
        );
      })}
    </>
  );
}

export function ByClassDesktop({ selectedKeys, onToggle }: { selectedKeys: Set<string>; onToggle: (r: Recipient, checked: boolean) => void }) {
  const { data: branchesData, isPending: loadingBranches } = useGetBranches();
  const branches: BranchWithClassLevels[] = branchesData?.data ?? [];

  const [activeBranch, setActiveBranch] = useState<BranchWithClassLevels | null>(null);
  const [activeLevelId, setActiveLevelId] = useState<number | null>(null);
  const [activeClass, setActiveClass] = useState<ClassInLevelDetails | null>(null);
  const [activeArmId, setActiveArmId] = useState<number | null>(null);

  const levels: BranchClassLevel[] = activeBranch?.classLevels ?? [];
  const { data: classesData, isPending: loadingClasses } = useGetClassesByLevel(activeLevelId ?? undefined);
  const classes: ClassInLevelDetails[] = classesData?.data ?? [];
  const arms = activeClass?.arms ?? [];

  const colClass = "border-border-default flex flex-1 flex-col overflow-hidden border-r last:border-r-0";
  const rowClass = (active: boolean) =>
    cn("hover:bg-bg-state-ghost-hover flex cursor-pointer items-center justify-between px-3 py-2", active && "bg-bg-state-ghost-hover");

  return (
    <div className="flex min-h-80 overflow-hidden">
     
      <div className={colClass}>
        <ColHeader title="Branches" />
        <div className="overflow-y-auto">
          {loadingBranches ? (
            <Skeleton className="bg-bg-input-soft m-2 h-32" />
          ) : (
            branches.map(b => {
              const r: Recipient = { type: "branch", id: b.branch.id, name: b.branch.name ?? "" };
              return (
                <div key={b.branch.id} className={rowClass(activeBranch?.branch.id === b.branch.id)} onClick={() => { setActiveBranch(b); setActiveLevelId(null); setActiveClass(null); setActiveArmId(null); }}>
                  <div className="flex items-center gap-2">
                    <Checkbox checked={selectedKeys.has(recipientKey(r))} onCheckedChange={c => onToggle(r, !!c)} onClick={e => e.stopPropagation()} className="shrink-0" />
                    <span className="text-text-default text-sm">{b.branch.name}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Levels */}
      <div className={colClass}>
        <ColHeader title="Levels" />
        <div className="overflow-y-auto">
          {levels.length === 0 ? (
            <p className="text-text-muted px-3 py-4 text-xs">Select a branch</p>
          ) : (
            levels.map(l => (
              <div key={l.id} className={rowClass(activeLevelId === l.id)} onClick={() => { setActiveLevelId(l.id); setActiveClass(null); setActiveArmId(null); }}>
                <span className="text-text-default text-sm">{l.levelName}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Classes */}
      <div className={colClass}>
        <ColHeader title="Classes" />
        <div className="overflow-y-auto">
          {!activeLevelId ? (
            <p className="text-text-muted px-3 py-4 text-xs">Select a level</p>
          ) : loadingClasses ? (
            <Skeleton className="bg-bg-input-soft m-2 h-32" />
          ) : (
            classes.map(c => {
              const r: Recipient = { type: "class", id: c.classId, name: c.className };
              return (
                <div key={c.classId} className={rowClass(activeClass?.classId === c.classId)} onClick={() => { setActiveClass(c); setActiveArmId(null); }}>
                  <div className="flex items-center gap-2">
                    <Checkbox checked={selectedKeys.has(recipientKey(r))} onCheckedChange={checked => onToggle(r, !!checked)} onClick={e => e.stopPropagation()} className="shrink-0" />
                    <span className="text-text-default text-sm">{c.className}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Arms */}
      <div className={colClass}>
        <ColHeader title="Arms" />
        <div className="overflow-y-auto">
          {arms.length === 0 ? (
            <p className="text-text-muted px-3 py-4 text-xs">Select a class</p>
          ) : (
            arms.map(a => {
              const r: Recipient = { type: "arm", id: a.id, name: `${activeClass?.className ?? ""} ${a.name}` };
              return (
                <div key={a.id} className={rowClass(activeArmId === a.id)} onClick={() => setActiveArmId(a.id)}>
                  <div className="flex items-center gap-2">
                    <Checkbox checked={selectedKeys.has(recipientKey(r))} onCheckedChange={checked => onToggle(r, !!checked)} onClick={e => e.stopPropagation()} className="shrink-0" />
                    <span className="text-text-default text-sm">{a.name}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Students */}
      <div className={colClass}>
        <ColHeader title="Students" />
        <div className="overflow-y-auto">
          {!activeArmId ? (
            <p className="text-text-muted px-3 py-4 text-xs">Select an arm</p>
          ) : (
            <StudentsColumn armId={activeArmId} selectedKeys={selectedKeys} onToggle={onToggle} />
          )}
        </div>
      </div>
    </div>
  );
}

export function ByClassMobile({ selectedKeys, onToggle }: { selectedKeys: Set<string>; onToggle: (r: Recipient, checked: boolean) => void }) {
  const { data: branchesData, isPending: loadingBranches } = useGetBranches();
  const branches: BranchWithClassLevels[] = branchesData?.data ?? [];

  const [depth, setDepth] = useState(0);
  const [activeBranch, setActiveBranch] = useState<BranchWithClassLevels | null>(null);
  const [activeLevelId, setActiveLevelId] = useState<number | null>(null);
  const [activeClass, setActiveClass] = useState<ClassInLevelDetails | null>(null);
  const [activeArmId, setActiveArmId] = useState<number | null>(null);

  const levels: BranchClassLevel[] = activeBranch?.classLevels ?? [];
  const { data: classesData, isPending: loadingClasses } = useGetClassesByLevel(activeLevelId ?? undefined);
  const classes: ClassInLevelDetails[] = classesData?.data ?? [];
  const arms = activeClass?.arms ?? [];

  const depthTitles = ["Select Branch", "Select Level", "Select Class", "Select Arm", "Select Students"];
  const rowClass = "hover:bg-bg-state-ghost-hover flex cursor-pointer items-center justify-between px-4 py-3";

  const goBack = () => {
    if (depth === 1) setActiveBranch(null);
    if (depth === 2) setActiveLevelId(null);
    if (depth === 3) setActiveClass(null);
    if (depth === 4) setActiveArmId(null);
    setDepth(d => d - 1);
  };

  return (
    <div className="min-h-64">
      {depth > 0 && (
        <button onClick={goBack} className="text-text-informative flex items-center gap-1 px-4 py-2 text-sm font-medium">
          <ChevronLeft className="size-4" /> Back
        </button>
      )}
      <p className="text-text-muted px-4 pb-2 text-xs font-medium">{depthTitles[depth]}</p>

      <div className="max-h-96 overflow-y-auto">
        {depth === 0 && (loadingBranches ? (
          <Skeleton className="bg-bg-input-soft mx-4 h-32" />
        ) : branches.map(b => {
          const r: Recipient = { type: "branch", id: b.branch.id, name: b.branch.name ?? "" };
          return (
            <div key={b.branch.id} className={rowClass}>
              <div className="flex items-center gap-2" onClick={() => { setActiveBranch(b); setDepth(1); }}>
                <Checkbox checked={selectedKeys.has(recipientKey(r))} onCheckedChange={c => onToggle(r, !!c)} onClick={e => e.stopPropagation()} className="shrink-0" />
                <span className="text-text-default text-sm">{b.branch.name}</span>
              </div>
              <ChevronRight className="text-text-muted size-4 shrink-0" onClick={() => { setActiveBranch(b); setDepth(1); }} />
            </div>
          );
        }))}

        {depth === 1 && levels.map(l => (
          <div key={l.id} className={rowClass} onClick={() => { setActiveLevelId(l.id); setDepth(2); }}>
            <span className="text-text-default text-sm">{l.levelName}</span>
            <ChevronRight className="text-text-muted size-4 shrink-0" />
          </div>
        ))}

        {depth === 2 && (loadingClasses ? (
          <Skeleton className="bg-bg-input-soft mx-4 h-32" />
        ) : classes.map(c => {
          const r: Recipient = { type: "class", id: c.classId, name: c.className };
          return (
            <div key={c.classId} className={rowClass}>
              <div className="flex items-center gap-2" onClick={() => { setActiveClass(c); setDepth(3); }}>
                <Checkbox checked={selectedKeys.has(recipientKey(r))} onCheckedChange={checked => onToggle(r, !!checked)} onClick={e => e.stopPropagation()} className="shrink-0" />
                <span className="text-text-default text-sm">{c.className}</span>
              </div>
              <ChevronRight className="text-text-muted size-4 shrink-0" onClick={() => { setActiveClass(c); setDepth(3); }} />
            </div>
          );
        }))}

        {depth === 3 && arms.map(a => {
          const r: Recipient = { type: "arm", id: a.id, name: `${activeClass?.className ?? ""} ${a.name}` };
          return (
            <div key={a.id} className={rowClass}>
              <div className="flex items-center gap-2" onClick={() => { setActiveArmId(a.id); setDepth(4); }}>
                <Checkbox checked={selectedKeys.has(recipientKey(r))} onCheckedChange={checked => onToggle(r, !!checked)} onClick={e => e.stopPropagation()} className="shrink-0" />
                <span className="text-text-default text-sm">{a.name}</span>
              </div>
              <ChevronRight className="text-text-muted size-4 shrink-0" onClick={() => { setActiveArmId(a.id); setDepth(4); }} />
            </div>
          );
        })}

        {depth === 4 && activeArmId && <StudentsColumn armId={activeArmId} selectedKeys={selectedKeys} onToggle={onToggle} />}
      </div>
    </div>
  );
}
