"use client";

import { Arm, BranchWithClassLevels, ClassInLevelDetails, ClassLevel, Level, Parent, Student } from "@/api/types";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useGetArmsByClass } from "@/hooks/queryHooks/useArm";
import { useGetClassesByLevel } from "@/hooks/queryHooks/useClass";
import { useGetLevels } from "@/hooks/queryHooks/useLevel";
import { useGetParents } from "@/hooks/queryHooks/useParent";
import { useGetStudents } from "@/hooks/queryHooks/useStudent";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import { ChevronRight, Search, User, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { SelectedRecipient } from "../types";

type Tab = "by-class" | "student-tags" | "parent-tags";
type MobileDrillStep = "branch" | "level" | "class" | "arm" | "student";

export type SelectRecipientsModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  selected: SelectedRecipient[];
  onConfirm: (recipients: SelectedRecipient[]) => void;
};

const TAB_DESCRIPTIONS: Record<Tab, string> = {
  "by-class": "Messages will be delivered to the parent/guardian linked to each selected student.",
  "student-tags": "Messages will be delivered to parents/guardians of all students in the selected tag group.",
  "parent-tags": "Messages will be delivered to each parent in the selected parent tag group.",
};

const TABS: { key: Tab; label: string }[] = [
  { key: "by-class", label: "By Class" },
  { key: "student-tags", label: "Student Tags" },
  { key: "parent-tags", label: "Parent Tags" },
];

const MOBILE_COLUMN_TITLES: Record<MobileDrillStep, string> = {
  branch: "Select Branch",
  level: "Select Level",
  class: "Select Class",
  arm: "Select Arm",
  student: "Select Students",
};

// ─── Sub-components ────────────────────────────────────────────────────────────

const ClassColumnHeader = ({ title }: { title: string }) => (
  <div className="text-text-muted border-border-default border-b px-3 py-2 text-xs font-medium">{title}</div>
);

const ColumnSpinner = () => (
  <div className="flex items-center justify-center py-6">
    <Spinner className="size-5" />
  </div>
);

const ClassRow = ({
  label,
  count,
  active,
  hasChevron = false,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  hasChevron?: boolean;
  onClick: () => void;
}) => (
  <div
    className={cn(
      "hover:bg-bg-state-ghost-hover flex cursor-pointer items-center justify-between gap-2 px-3 py-2.5",
      active && "bg-bg-state-active-soft",
    )}
    onClick={onClick}
  >
    <span className={cn("text-text-default text-sm", active && "font-medium")}>{label}</span>
    <div className="flex items-center gap-1">
      {count !== undefined && <span className="text-text-muted text-xs">{count}</span>}
      {hasChevron && <ChevronRight className="text-icon-default-muted size-3.5 shrink-0" />}
    </div>
  </div>
);

const StudentRow = ({ label, checked, onCheck }: { label: string; checked: boolean; onCheck: () => void }) => (
  <div className="hover:bg-bg-state-ghost-hover flex cursor-pointer items-center gap-2 px-3 py-2.5" onClick={onCheck}>
    <Checkbox checked={checked} onCheckedChange={onCheck} onClick={e => e.stopPropagation()} />
    <div className="bg-bg-state-soft flex size-6 shrink-0 items-center justify-center rounded-full">
      <User className="text-icon-default-muted size-3.5" />
    </div>
    <span className="text-text-default truncate text-sm">{label}</span>
  </div>
);

const TagRow = ({ tag, count, checked, onCheck }: { tag: string; count: number; checked: boolean; onCheck: () => void }) => (
  <div className="hover:bg-bg-state-ghost-hover flex cursor-pointer items-center gap-2 px-3 py-2.5" onClick={onCheck}>
    <Checkbox checked={checked} onCheckedChange={onCheck} onClick={e => e.stopPropagation()} />
    <span className="text-text-default flex-1 truncate text-sm">{tag}</span>
    <span className="text-text-muted text-xs">{count}</span>
  </div>
);


const SelectedChip = ({ recipient, onRemove }: { recipient: SelectedRecipient; onRemove: (id: string) => void }) => {
  const isIndividual = recipient.type === "student" || recipient.type === "parent";
  return (
    <div className="bg-bg-badge-default border-border-default text-text-default flex items-center gap-1 rounded-md border px-2 py-1 text-xs">
      {isIndividual && <User className="text-icon-default-muted size-3 shrink-0" />}
      <span className="max-w-[110px] truncate">
        {recipient.label}
        {recipient.count ? ` (${recipient.count})` : ""}
      </span>
      <button type="button" onClick={() => onRemove(recipient.id)} className="hover:text-text-destructive ml-0.5 shrink-0">
        <X className="size-3" />
      </button>
    </div>
  );
};

// ─── Shared modal body ─────────────────────────────────────────────────────────

const ModalBody = ({
  localSelected,
  setLocalSelected,
}: {
  localSelected: SelectedRecipient[];
  setLocalSelected: (r: SelectedRecipient[]) => void;
}) => {
  const isMobile = useIsMobile();

  const [activeTab, setActiveTab] = useState<Tab>("by-class");
  const [search, setSearch] = useState("");
  const [filterBranchId, setFilterBranchId] = useState<string>("all");

  // Shared active IDs used by both desktop and mobile API hooks
  const [activeBranchId, setActiveBranchId] = useState<number | null>(null);
  const [activeLevelId, setActiveLevelId] = useState<number | null>(null);
  const [activeClassId, setActiveClassId] = useState<number | null>(null);
  const [activeArmId, setActiveArmId] = useState<number | null>(null);

  // Mobile drill-down navigation state (by-class)
  const [mobileDrillStep, setMobileDrillStep] = useState<MobileDrillStep>("branch");
  const [mobileNavBranch, setMobileNavBranch] = useState<BranchWithClassLevels | null>(null);
  const [mobileNavLevel, setMobileNavLevel] = useState<ClassLevel | null>(null);
  const [mobileNavClass, setMobileNavClass] = useState<ClassInLevelDetails | null>(null);
  const [mobileNavArm, setMobileNavArm] = useState<Arm | null>(null);

  const searchRef = useRef<HTMLInputElement>(null);

  // ─── API hooks ────────────────────────────────────────────────────────────────
  const { data: branchesData, isLoading: loadingBranches } = useGetBranches();
  const branches: BranchWithClassLevels[] = branchesData?.data ?? [];

  const { data: levelsData, isLoading: loadingLevels } = useGetLevels(activeBranchId ?? undefined);
  const levels: ClassLevel[] = (levelsData?.data ?? []).flatMap((l: Level) => l.classLevels ?? []);

  const { data: classesData, isLoading: loadingClasses } = useGetClassesByLevel(activeLevelId ?? undefined);
  const classes: ClassInLevelDetails[] = classesData?.data?.content ?? [];

  const { data: armsData, isLoading: loadingArms } = useGetArmsByClass(activeClassId);
  const arms: Arm[] = armsData?.data ?? [];

  const { data: studentsData, isLoading: loadingStudents } = useGetStudents({
    limit: 100,
    armId: activeArmId ?? undefined,
    enabled: !!activeArmId,
  });
  const students: Student[] = (studentsData?.pages.flatMap(p => p.content) ?? []).filter((s): s is Student => s != null);

  // School-wide students for deriving tags (optionally filtered by branch)
  const { data: tagStudentsData, isLoading: loadingTagStudents } = useGetStudents({
    limit: 300,
    branchId: filterBranchId !== "all" ? Number(filterBranchId) : undefined,
    enabled: activeTab === "student-tags",
  });
  const allTagStudents: Student[] = (tagStudentsData?.pages.flatMap(p => p.content) ?? []).filter((s): s is Student => s != null);

  const studentsByTag = useMemo(() => {
    const map = new Map<string, Student[]>();
    allTagStudents.forEach(s => {
      (s.tags ?? []).forEach(tag => {
        if (!map.has(tag)) map.set(tag, []);
        map.get(tag)!.push(s);
      });
    });
    return map;
  }, [allTagStudents]);

  const uniqueTags = useMemo(() => Array.from(studentsByTag.keys()).sort(), [studentsByTag]);

  // School-wide parents for deriving parent tags (optionally filtered by branch)
  const { data: tagParentsData, isLoading: loadingParentTags } = useGetParents({
    limit: 300,
    branchId: filterBranchId !== "all" ? Number(filterBranchId) : undefined,
    enabled: activeTab === "parent-tags",
  });
  const allTagParents: Parent[] = (tagParentsData?.pages.flatMap(p => p.content) ?? []).filter((p): p is Parent => p != null);

  const parentsByTag = useMemo(() => {
    const map = new Map<string, Parent[]>();
    allTagParents.forEach(p => {
      (p.tags ?? []).forEach(tag => {
        if (!map.has(tag)) map.set(tag, []);
        map.get(tag)!.push(p);
      });
    });
    return map;
  }, [allTagParents]);

  const uniqueParentTags = useMemo(() => Array.from(parentsByTag.keys()).sort(), [parentsByTag]);

  // ─── Navigation helpers ───────────────────────────────────────────────────────
  const resetDrill = () => {
    setActiveBranchId(null);
    setActiveLevelId(null);
    setActiveClassId(null);
    setActiveArmId(null);
    setMobileDrillStep("branch");
    setMobileNavBranch(null);
    setMobileNavLevel(null);
    setMobileNavClass(null);
    setMobileNavArm(null);
  };

  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
    setSearch("");
    resetDrill();
  };

  const handleMobileBack = () => {
    if (mobileDrillStep === "level") {
      setMobileDrillStep("branch");
      setMobileNavBranch(null);
      setActiveBranchId(null);
      setActiveLevelId(null);
    } else if (mobileDrillStep === "class") {
      setMobileDrillStep("level");
      setMobileNavLevel(null);
      setActiveLevelId(null);
      setActiveClassId(null);
    } else if (mobileDrillStep === "arm") {
      setMobileDrillStep("class");
      setMobileNavClass(null);
      setActiveClassId(null);
      setActiveArmId(null);
    } else if (mobileDrillStep === "student") {
      setMobileDrillStep("arm");
      setMobileNavArm(null);
      setActiveArmId(null);
    }
  };

  const mobileBreadcrumbParts = [mobileNavBranch?.branch.name, mobileNavLevel?.levelName, mobileNavClass?.className, mobileNavArm?.name].filter(
    Boolean,
  );

  // ─── Selection helpers ────────────────────────────────────────────────────────
  const isSelected = (id: string) => localSelected.some(r => r.id === id);
  const toggle = (recipient: SelectedRecipient) =>
    setLocalSelected(isSelected(recipient.id) ? localSelected.filter(r => r.id !== recipient.id) : [...localSelected, recipient]);
  const removeSelected = (id: string) => setLocalSelected(localSelected.filter(r => r.id !== id));

  // Tag-level toggle: checking a tag adds/removes all its students as individual `student` recipients
  const isTagChecked = (tag: string) => {
    const studs = studentsByTag.get(tag) ?? [];
    return studs.length > 0 && studs.every(s => isSelected(`student:${s.id}`));
  };

  const toggleTag = (tag: string) => {
    const studs = studentsByTag.get(tag) ?? [];
    if (isTagChecked(tag)) {
      const ids = new Set(studs.map(s => `student:${s.id}`));
      setLocalSelected(localSelected.filter(r => !ids.has(r.id)));
    } else {
      const ids = new Set(studs.map(s => `student:${s.id}`));
      const existing = localSelected.filter(r => !ids.has(r.id));
      const items: SelectedRecipient[] = studs.map(s => ({
        id: `student:${s.id}`,
        label: `${s.firstName} ${s.lastName}`.trim(),
        type: "student" as const,
        parentIds: s.linkedParents.map(p => p.id),
        count: s.linkedParents.length || 1,
      }));
      setLocalSelected([...existing, ...items]);
    }
  };

  const handleSelectAll = () => {
    if (activeTab === "by-class") {
      if (!activeArmId || filteredStudents.length === 0) return;
      const newIds = new Set(filteredStudents.map(s => `student:${s.id}`));
      const existing = localSelected.filter(r => !newIds.has(r.id));
      const items: SelectedRecipient[] = filteredStudents.map(s => {
        const name = `${s.firstName} ${s.lastName}`.trim();
        return {
          id: `student:${s.id}`,
          label: name,
          type: "student" as const,
          parentIds: s.linkedParents.map(p => p.id),
          count: s.linkedParents.length || 1,
        };
      });
      setLocalSelected([...existing, ...items]);
    } else if (activeTab === "student-tags") {
      // Select all students from all currently visible tags
      const allStudents = filteredUniqueTags.flatMap(tag => studentsByTag.get(tag) ?? []);
      const unique = [...new Map(allStudents.map(s => [s.id, s])).values()];
      const ids = new Set(unique.map(s => `student:${s.id}`));
      const existing = localSelected.filter(r => !ids.has(r.id));
      const items: SelectedRecipient[] = unique.map(s => ({
        id: `student:${s.id}`,
        label: `${s.firstName} ${s.lastName}`.trim(),
        type: "student" as const,
        parentIds: s.linkedParents.map(p => p.id),
        count: s.linkedParents.length || 1,
      }));
      setLocalSelected([...existing, ...items]);
    } else {
      // Select all parents from all currently visible parent tags
      const allParents = filteredUniqueParentTags.flatMap(tag => parentsByTag.get(tag) ?? []);
      const unique = [...new Map(allParents.map(p => [p.id, p])).values()];
      const ids = new Set(unique.map(p => `parent:${p.id}`));
      const existing = localSelected.filter(r => !ids.has(r.id));
      const items: SelectedRecipient[] = unique.map(p => ({
        id: `parent:${p.id}`,
        label: `${p.firstName} ${p.lastName}`.trim(),
        type: "parent" as const,
        parentIds: [p.id],
        studentIds: p.linkedStudents.map(s => s.id),
        count: p.linkedStudents.length || 1,
      }));
      setLocalSelected([...existing, ...items]);
    }
  };

  const handleClearAll = () => {
    if (activeTab === "by-class") {
      if (!activeArmId) return;
      const armStudentIds = new Set(filteredStudents.map(s => `student:${s.id}`));
      setLocalSelected(localSelected.filter(r => !armStudentIds.has(r.id)));
    } else if (activeTab === "student-tags") {
      const ids = new Set(filteredUniqueTags.flatMap(tag => (studentsByTag.get(tag) ?? []).map(s => `student:${s.id}`)));
      setLocalSelected(localSelected.filter(r => !ids.has(r.id)));
    } else {
      const ids = new Set(filteredUniqueParentTags.flatMap(tag => (parentsByTag.get(tag) ?? []).map(p => `parent:${p.id}`)));
      setLocalSelected(localSelected.filter(r => !ids.has(r.id)));
    }
  };

  // Tag-level toggle: checking a parent tag adds/removes all its parents as individual `parent` recipients
  const isParentTagChecked = (tag: string) => {
    const parents = parentsByTag.get(tag) ?? [];
    return parents.length > 0 && parents.every(p => isSelected(`parent:${p.id}`));
  };

  const toggleParentTag = (tag: string) => {
    const parents = parentsByTag.get(tag) ?? [];
    if (isParentTagChecked(tag)) {
      const ids = new Set(parents.map(p => `parent:${p.id}`));
      setLocalSelected(localSelected.filter(r => !ids.has(r.id)));
    } else {
      const ids = new Set(parents.map(p => `parent:${p.id}`));
      const existing = localSelected.filter(r => !ids.has(r.id));
      const items: SelectedRecipient[] = parents.map(p => ({
        id: `parent:${p.id}`,
        label: `${p.firstName} ${p.lastName}`.trim(),
        type: "parent" as const,
        parentIds: [p.id],
        studentIds: p.linkedStudents.map(s => s.id),
        count: p.linkedStudents.length || 1,
      }));
      setLocalSelected([...existing, ...items]);
    }
  };

  const q = search.toLowerCase();
  // Search only applies to students/tags; navigation columns are unfiltered
  const filteredBranches = branches;
  const filteredLevels = levels;
  const filteredClasses = classes;
  const filteredArms = arms;
  const filteredStudents = students.filter(s => !q || `${s.firstName} ${s.lastName}`.toLowerCase().includes(q));
  const filteredUniqueTags = uniqueTags.filter(tag => !q || tag.toLowerCase().includes(q));
  const filteredUniqueParentTags = uniqueParentTags.filter(tag => !q || tag.toLowerCase().includes(q));

  const STUDENT_PAGE_SIZE = 5;
  const [visibleStudentCount, setVisibleStudentCount] = useState(STUDENT_PAGE_SIZE);
  useEffect(() => {
    setVisibleStudentCount(STUDENT_PAGE_SIZE);
  }, [activeArmId, search]);

  const recipientChips = localSelected.filter(r => ["student", "parent", "student-tag", "parent-tag"].includes(r.type));
  const MAX_CHIPS = 4;
  const visibleChips = recipientChips.slice(0, MAX_CHIPS);
  const hiddenCount = recipientChips.length - MAX_CHIPS;

  return (
    <>
      <div className="border-border-default flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2">
        <div className="bg-bg-input-soft flex gap-1 rounded-full p-0.5">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => switchTab(tab.key)}
              className={cn(
                "cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                activeTab === tab.key
                  ? "bg-bg-state-ghost-hover text-text-default"
                  : "text-text-muted hover:bg-bg-state-ghost-hover hover:text-text-default",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Branch filter — filters student-tags by branch */}
        <Select value={filterBranchId} onValueChange={setFilterBranchId}>
          <SelectTrigger className="border-border-default bg-bg-card text-text-muted h-auto w-auto gap-1.5 rounded-md border px-2.5 py-1 text-xs shadow-none">
            <SelectValue placeholder="All Branches" />
          </SelectTrigger>
          <SelectContent className="bg-bg-card text-text-default border-border-default w-auto min-w-0 rounded-md border p-1 text-sm">
            <SelectItem value="all">All Branches</SelectItem>
            {branches.map(bwl => (
              <SelectItem key={bwl.branch.id} value={String(bwl.branch.id)}>
                {bwl.branch.name ?? "Branch"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Description */}
      <p className="text-text-muted px-4 py-2 text-xs">{TAB_DESCRIPTIONS[activeTab]}</p>

      {/* Search + controls */}
      <div className="flex flex-col gap-2 px-4 pb-2">
        <div className="border-border-default bg-bg-input-soft relative flex items-center rounded-md border">
          <Search className="text-icon-default-muted absolute left-3 size-4 shrink-0" />
          <input
            ref={searchRef}
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={
              activeTab === "by-class" ? "Search for students..." : activeTab === "student-tags" ? "Search for tags..." : "Search for parent tags..."
            }
            className="text-text-default w-full bg-transparent py-2 pr-8 pl-9 text-sm outline-none"
          />
          {search ? (
            <button type="button" onClick={() => setSearch("")} className="absolute right-3">
              <X className="text-icon-default-muted size-4" />
            </button>
          ) : (
            <kbd className="text-text-muted border-border-default absolute right-3 rounded border px-1 text-xs">/</kbd>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button onClick={handleSelectAll} className="text-text-default flex cursor-pointer items-center gap-1.5 text-xs font-medium">
            <span className="bg-bg-state-active-soft flex size-4 items-center justify-center rounded-sm">
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            Select All
          </button>
          <button onClick={handleClearAll} className="text-text-muted flex cursor-pointer items-center gap-1.5 text-xs">
            <X className="size-3.5" />
            Clear All
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-2">
        {/* ── By Class (desktop) ── */}
        {activeTab === "by-class" && !isMobile && (
          <div className="border-border-default overflow-x-auto rounded-lg border">
            <div className="flex min-w-[580px]">
              {/* Branches */}
              <div className="border-border-default min-w-[130px] border-r">
                <ClassColumnHeader title="Branches" />
                {loadingBranches ? (
                  <ColumnSpinner />
                ) : filteredBranches.length === 0 ? (
                  <p className="text-text-muted px-3 py-3 text-xs">No branches</p>
                ) : (
                  filteredBranches.map(bwl => (
                    <ClassRow
                      key={bwl.branch.id}
                      label={bwl.branch.name ?? "Branch"}
                      active={activeBranchId === bwl.branch.id}
                      onClick={() => {
                        setActiveBranchId(bwl.branch.id);
                        setActiveLevelId(null);
                        setActiveClassId(null);
                        setActiveArmId(null);
                      }}
                    />
                  ))
                )}
              </div>

              {/* Levels */}
              <div className="border-border-default min-w-[110px] border-r">
                <ClassColumnHeader title="Levels" />
                {!activeBranchId ? (
                  <p className="text-text-muted px-3 py-3 text-xs">Select a branch</p>
                ) : loadingLevels ? (
                  <ColumnSpinner />
                ) : filteredLevels.length === 0 ? (
                  <p className="text-text-muted px-3 py-3 text-xs">No levels</p>
                ) : (
                  filteredLevels.map(l => (
                    <ClassRow
                      key={l.id}
                      label={l.levelName}
                      active={activeLevelId === l.id}
                      onClick={() => {
                        setActiveLevelId(l.id);
                        setActiveClassId(null);
                        setActiveArmId(null);
                      }}
                    />
                  ))
                )}
              </div>

              {/* Classes */}
              <div className="border-border-default min-w-[120px] border-r">
                <ClassColumnHeader title="Classes" />
                {loadingClasses ? (
                  <ColumnSpinner />
                ) : !activeLevelId ? (
                  <p className="text-text-muted px-3 py-3 text-xs">Select a level</p>
                ) : filteredClasses.length === 0 ? (
                  <p className="text-text-muted px-3 py-3 text-xs">No classes</p>
                ) : (
                  filteredClasses.map(c => (
                    <ClassRow
                      key={c.classId}
                      label={c.className}
                      active={activeClassId === c.classId}
                      onClick={() => {
                        setActiveClassId(c.classId);
                        setActiveArmId(null);
                      }}
                    />
                  ))
                )}
              </div>

              {/* Arms */}
              <div className="border-border-default min-w-[100px] border-r">
                <ClassColumnHeader title="Arms" />
                {loadingArms ? (
                  <ColumnSpinner />
                ) : !activeClassId ? (
                  <p className="text-text-muted px-3 py-3 text-xs">Select a class</p>
                ) : filteredArms.length === 0 ? (
                  <p className="text-text-muted px-3 py-3 text-xs">No arms</p>
                ) : (
                  filteredArms.map(a => <ClassRow key={a.id} label={a.name} active={activeArmId === a.id} onClick={() => setActiveArmId(a.id)} />)
                )}
              </div>

              {/* Students */}
              <div className="min-w-[160px] flex-1">
                <ClassColumnHeader title="Students" />
                {loadingStudents ? (
                  <ColumnSpinner />
                ) : !activeArmId ? (
                  <p className="text-text-muted px-3 py-3 text-xs">Select an arm</p>
                ) : filteredStudents.length === 0 ? (
                  <p className="text-text-muted px-3 py-3 text-xs">No students</p>
                ) : (
                  <>
                    {filteredStudents.slice(0, visibleStudentCount).map(s => {
                      const name = `${s.firstName} ${s.lastName}`.trim();
                      return (
                        <StudentRow
                          key={s.id}
                          label={name}
                          checked={isSelected(`student:${s.id}`)}
                          onCheck={() =>
                            toggle({
                              id: `student:${s.id}`,
                              label: name,
                              type: "student",
                              parentIds: s.linkedParents.map(p => p.id),
                              count: s.linkedParents.length || 1,
                            })
                          }
                        />
                      );
                    })}
                    {visibleStudentCount < filteredStudents.length && (
                      <Button
                        onClick={() => setVisibleStudentCount(c => c + STUDENT_PAGE_SIZE)}
                        className="hover:bg-bg-state-ghost-hover! text-text-default w-full px-3 py-2 text-center text-xs font-medium"
                      >
                        View more ({filteredStudents.length - visibleStudentCount} more)
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "by-class" && isMobile && (
          <div className="border-border-default overflow-hidden rounded-lg border">
            {mobileDrillStep !== "branch" && (
              <div className="border-border-default flex items-center justify-between gap-2 border-b px-3 py-2">
                <span className="text-text-muted truncate text-xs">{mobileBreadcrumbParts.join(" > ")}</span>
                <button type="button" onClick={handleMobileBack} className="text-text-default shrink-0 text-xs font-medium">
                  Back
                </button>
              </div>
            )}

            <ClassColumnHeader title={MOBILE_COLUMN_TITLES[mobileDrillStep]} />

            {/* Branch step */}
            {mobileDrillStep === "branch" &&
              (loadingBranches ? (
                <ColumnSpinner />
              ) : (
                filteredBranches.map(bwl => (
                  <ClassRow
                    key={bwl.branch.id}
                    label={bwl.branch.name ?? "Branch"}
                    active={false}
                    hasChevron
                    onClick={() => {
                      setMobileNavBranch(bwl);
                      setActiveBranchId(bwl.branch.id);
                      setMobileDrillStep("level");
                    }}
                  />
                ))
              ))}

            {/* Level step */}
            {mobileDrillStep === "level" &&
              (loadingLevels ? (
                <ColumnSpinner />
              ) : filteredLevels.length === 0 ? (
                <p className="text-text-muted px-3 py-4 text-xs">No levels found</p>
              ) : (
                filteredLevels.map(l => (
                  <ClassRow
                    key={l.id}
                    label={l.levelName}
                    active={false}
                    hasChevron
                    onClick={() => {
                      setMobileNavLevel(l);
                      setActiveLevelId(l.id);
                      setMobileDrillStep("class");
                    }}
                  />
                ))
              ))}

            {/* Class step */}
            {mobileDrillStep === "class" &&
              (loadingClasses ? (
                <ColumnSpinner />
              ) : filteredClasses.length === 0 ? (
                <p className="text-text-muted px-3 py-4 text-xs">No classes found</p>
              ) : (
                filteredClasses.map(c => (
                  <ClassRow
                    key={c.classId}
                    label={c.className}
                    active={false}
                    hasChevron
                    onClick={() => {
                      setMobileNavClass(c);
                      setActiveClassId(c.classId);
                      setMobileDrillStep("arm");
                    }}
                  />
                ))
              ))}

            {/* Arm step */}
            {mobileDrillStep === "arm" &&
              (loadingArms ? (
                <ColumnSpinner />
              ) : filteredArms.length === 0 ? (
                <p className="text-text-muted px-3 py-4 text-xs">No arms found</p>
              ) : (
                filteredArms.map(a => (
                  <ClassRow
                    key={a.id}
                    label={a.name}
                    active={false}
                    hasChevron
                    onClick={() => {
                      setMobileNavArm(a);
                      setActiveArmId(a.id);
                      setMobileDrillStep("student");
                    }}
                  />
                ))
              ))}

            {/* Student step */}
            {mobileDrillStep === "student" &&
              (loadingStudents ? (
                <ColumnSpinner />
              ) : filteredStudents.length === 0 ? (
                <p className="text-text-muted px-3 py-4 text-xs">No students found</p>
              ) : (
                <>
                  {filteredStudents.slice(0, visibleStudentCount).map(s => {
                    const name = `${s.firstName} ${s.lastName}`.trim();
                    return (
                      <StudentRow
                        key={s.id}
                        label={name}
                        checked={isSelected(`student:${s.id}`)}
                        onCheck={() =>
                          toggle({
                            id: `student:${s.id}`,
                            label: name,
                            type: "student",
                            parentIds: s.linkedParents.map(p => p.id),
                            count: s.linkedParents.length || 1,
                          })
                        }
                      />
                    );
                  })}
                  {visibleStudentCount < filteredStudents.length && (
                    <button
                      type="button"
                      onClick={() => setVisibleStudentCount(c => c + STUDENT_PAGE_SIZE)}
                      className="hover:bg-bg-state-ghost-hover text-text-default w-full px-3 py-2 text-center text-xs font-medium"
                    >
                      View more ({filteredStudents.length - visibleStudentCount} more)
                    </button>
                  )}
                </>
              ))}
          </div>
        )}

        {/* ── Student Tags ── */}
        {activeTab === "student-tags" && (
          <div className="border-border-default rounded-lg border">
            <ClassColumnHeader title="Student Tags" />
            {loadingTagStudents ? (
              <ColumnSpinner />
            ) : filteredUniqueTags.length === 0 ? (
              <p className="text-text-muted px-3 py-8 text-center text-sm">No tags found</p>
            ) : (
              filteredUniqueTags.map(tag => (
                <TagRow key={tag} tag={tag} count={studentsByTag.get(tag)?.length ?? 0} checked={isTagChecked(tag)} onCheck={() => toggleTag(tag)} />
              ))
            )}
          </div>
        )}

        {/* ── Parent Tags ── */}
        {activeTab === "parent-tags" && (
          <div className="border-border-default rounded-lg border">
            <ClassColumnHeader title="Parent Tags" />
            {loadingParentTags ? (
              <ColumnSpinner />
            ) : filteredUniqueParentTags.length === 0 ? (
              <p className="text-text-muted px-3 py-8 text-center text-sm">No tags found</p>
            ) : (
              filteredUniqueParentTags.map(tag => (
                <TagRow
                  key={tag}
                  tag={tag}
                  count={parentsByTag.get(tag)?.length ?? 0}
                  checked={isParentTagChecked(tag)}
                  onCheck={() => toggleParentTag(tag)}
                />
              ))
            )}
          </div>
        )}
      </div>

      {recipientChips.length > 0 && (
        <div className="border-border-default border-t px-4 py-2.5">
          <p className="text-text-default mb-1.5 text-xs font-medium">Selected</p>
          <div className="flex flex-wrap items-center gap-1.5">
            {visibleChips.map(r => (
              <SelectedChip key={r.id} recipient={r} onRemove={removeSelected} />
            ))}
            {hiddenCount > 0 && <span className="text-text-muted text-xs">+{hiddenCount}</span>}
          </div>
        </div>
      )}
    </>
  );
};

export const SelectRecipientsModal = ({ open, setOpen, selected, onConfirm }: SelectRecipientsModalProps) => {
  const isMobile = useIsMobile();
  const [localSelected, setLocalSelected] = useState<SelectedRecipient[]>(selected);

  useEffect(() => {
    if (open) setLocalSelected(selected);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalCount = localSelected.reduce((sum, r) => sum + (r.count ?? 1), 0);

  const handleConfirm = () => {
    onConfirm(localSelected);
    setOpen(false);
  };

  const handleCancel = () => {
    setLocalSelected(selected);
    setOpen(false);
  };

  const doneLabel = `Done${totalCount > 0 ? ` ${totalCount}` : ""}`;

  const body = (
    <div className="flex max-h-[70svh] flex-col overflow-hidden md:max-h-[600px]">
      <ModalBody localSelected={localSelected} setLocalSelected={setLocalSelected} />
    </div>
  );

  if (isMobile) {
    return (
      <MobileDrawer open={open} setIsOpen={setOpen} title="Select Campaign Recipients">
        {body}
        <DrawerFooter className="border-border-default border-t">
          <div className="flex items-center justify-between">
            <DrawerClose asChild>
              <Button
                type="button"
                className="bg-bg-state-soft! hover:bg-bg-state-soft! text-text-subtle h-7 border-none text-sm font-medium"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </DrawerClose>
            <Button
              type="button"
              onClick={handleConfirm}
              className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-8 rounded-md px-4 text-sm font-medium"
            >
              {doneLabel}
            </Button>
          </div>
        </DrawerFooter>
      </MobileDrawer>
    );
  }

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Select Campaign Recipients"
      className="sm:max-w-[900px]"
      cancelButton={
        <Button
          type="button"
          className="bg-bg-state-soft! hover:bg-bg-state-soft! text-text-subtle h-7 border-none text-sm font-medium"
          onClick={handleCancel}
        >
          Cancel
        </Button>
      }
      ActionButton={
        <Button
          type="button"
          onClick={handleConfirm}
          className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-8 rounded-md px-4 text-sm font-medium"
        >
          {doneLabel}
        </Button>
      }
    >
      {body}
    </Modal>
  );
};
