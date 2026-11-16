"use client";

import { MidtermFormat } from "@/api/types";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { toast } from "@/components/Toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import {
  useGetMidtermSettings,
  useResetClassMidtermFormat,
  useSetClassMidtermFormat,
  useSetLevelMidtermFormat,
} from "@/hooks/queryHooks/useMidtermSettings";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { getApiErrorMessage, getApiErrorReason } from "@/lib/apiError";
import { canManageSettings } from "@/lib/permissions/settings";
import { cn, toTitleCase } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";

const OPTIONS: { value: MidtermFormat; title: string; hint: string }[] = [
  { value: "SCORE", title: "Scores", hint: "Marks, percentages and grades" },
  { value: "COMMENT", title: "Written comments", hint: "A short note on each subject and quality" },
];

const formatName = (format: MidtermFormat) => (format === "COMMENT" ? "written comments" : "scores");

const OptionPicker = ({
  value,
  onChange,
  disabled,
  compact,
}: {
  value: MidtermFormat;
  onChange: (format: MidtermFormat) => void;
  disabled?: boolean;
  compact?: boolean;
}) => (
  <div role="radiogroup" className={cn("grid gap-2", compact ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2")}>
    {OPTIONS.map(option => {
      const selected = value === option.value;
      return (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={selected}
          disabled={disabled}
          onClick={() => !selected && onChange(option.value)}
          className={cn(
            "flex items-start gap-3 rounded-md border text-left transition-all disabled:cursor-not-allowed",
            compact ? "px-3 py-2" : "p-3",
            selected ? "border-border-informative bg-bg-state-soft" : "border-border-default bg-bg-card hover:bg-bg-state-soft",
            disabled && !selected && "opacity-60",
          )}
        >
          <span
            className={cn(
              "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border",
              selected ? "border-border-informative" : "border-border-darker",
            )}
          >
            {selected && <span className="bg-bg-state-primary size-2 rounded-full" />}
          </span>
          <span className="min-w-0">
            <span className="text-text-default block text-sm font-medium">{option.title}</span>
            {!compact && <span className="text-text-muted block text-xs">{option.hint}</span>}
          </span>
        </button>
      );
    })}
  </div>
);

const TabRow = ({
  label,
  tabs,
  active,
  onSelect,
}: {
  label: string;
  tabs: { key: string; label: string }[];
  active: string;
  onSelect: (key: string) => void;
}) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-text-muted text-xs font-medium">{label}</span>
    <div role="tablist" aria-label={label} className="border-border-default flex gap-4 overflow-x-auto border-b" style={{ scrollbarWidth: "none" }}>
      {tabs.map(tab => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(tab.key)}
            className={cn(
              "shrink-0 border-b-[1.5px] px-1 pb-2 text-sm font-medium whitespace-nowrap transition-all",
              isActive ? "border-border-informative text-text-informative" : "text-text-muted border-transparent",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  </div>
);

export const MidtermFormatSettings = () => {
  const { permissions } = useLoggedInUser();
  const canEdit = canManageSettings(permissions ?? []);

  const { data: levels, isPending, isError, error, refetch } = useGetMidtermSettings();
  const { data: branchesData } = useGetBranches();
  const { mutate: setLevelFormat, isPending: isSettingLevel } = useSetLevelMidtermFormat();
  const { mutate: setClassFormat, isPending: isSettingClass } = useSetClassMidtermFormat();
  const { mutate: resetClass, isPending: isResetting } = useResetClassMidtermFormat();

  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const busy = isSettingLevel || isSettingClass || isResetting;

  const branches: { branch?: { id: number; name: string | null } }[] = branchesData?.data ?? [];
  const branchName = (branchId: number) => branches.find(b => b.branch?.id === branchId)?.branch?.name ?? null;

  // Branch tabs first, then that branch's level tabs. Falls back to the first one until the user picks.
  const [branchId, setBranchId] = useState<number | null>(null);
  const [levelId, setLevelId] = useState<number | null>(null);
  const allLevels = levels ?? [];
  const branchIds = [...new Set(allLevels.map(l => l.branchId))];
  const activeBranchId = branchId !== null && branchIds.includes(branchId) ? branchId : branchIds[0];
  const branchLevels = allLevels.filter(l => l.branchId === activeBranchId);
  const activeLevel = branchLevels.find(l => l.levelId === levelId) ?? branchLevels[0];

  const toggle = (key: string) =>
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const onFailure = (title: string) => (err: Error) => toast({ title, description: getApiErrorReason(err), type: "error" });

  if (isPending) return <Skeleton className="h-60 w-full" />;

  if (isError) {
    return (
      <div className="flex h-80 items-center justify-center">
        <ErrorComponent
          title="Could not load mid-term report settings"
          description={getApiErrorMessage(error, "Please try again")}
          buttonText="Try again"
          onClick={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="flex max-w-3xl flex-col gap-5">
      <div className="flex flex-col gap-1">
        <div className="text-text-default text-md font-semibold">Mid-term report</div>
        <div className="text-text-muted text-sm">
          Choose what parents see on the mid-term report. Teachers enter scores the same way either way. Written comments are usually best for Creche
          and Nursery.
        </div>
        {!canEdit && <div className="text-text-muted text-sm">You can view these settings but not change them.</div>}
      </div>

      {(levels ?? []).length === 0 && (
        <div className="bg-bg-card border-border-default text-text-muted rounded-md border p-6 text-center text-sm">No levels set up yet.</div>
      )}

      {branchIds.length > 1 && (
        <TabRow
          label="Branch"
          tabs={branchIds.map(id => ({ key: String(id), label: branchName(id) ?? `Branch ${id}` }))}
          active={String(activeBranchId)}
          onSelect={key => setBranchId(Number(key))}
        />
      )}

      {branchLevels.length > 0 && (
        <TabRow
          label="Level"
          tabs={branchLevels.map(l => ({ key: String(l.levelId), label: toTitleCase(l.levelName) }))}
          active={String(activeLevel?.levelId)}
          onSelect={key => setLevelId(Number(key))}
        />
      )}

      {(activeLevel ? [activeLevel] : []).map(level => {
        const key = `${level.branchId}-${level.levelId}`;
        const isOpen = expanded.has(key);
        const customCount = level.classes.filter(c => c.overridden).length;
        const levelTitle = toTitleCase(level.levelName);

        return (
          <section key={key} className="bg-bg-card border-border-default flex flex-col gap-4 rounded-md border p-4 md:p-5">
            <div>
              <h3 className="text-text-default text-sm font-semibold">{levelTitle}</h3>
              <p className="text-text-muted text-xs">Parents of {levelTitle} classes see:</p>
            </div>

            <OptionPicker
              value={level.format}
              disabled={!canEdit || busy}
              onChange={format =>
                setLevelFormat(
                  { levelId: level.levelId, format },
                  {
                    onSuccess: () => toast({ title: `${levelTitle} will now show ${formatName(format)}`, type: "success" }),
                    onError: onFailure("Could not save your choice"),
                  },
                )
              }
            />

            {level.classes.length > 0 && (
              <div className="flex flex-col gap-3">
                <button type="button" onClick={() => toggle(key)} className="text-text-informative flex w-fit items-center gap-1 text-xs font-medium">
                  {isOpen ? <ChevronUpIcon className="size-3.5" /> : <ChevronDownIcon className="size-3.5" />}
                  {isOpen ? "Hide classes" : "Need a different choice for one class?"}
                  {!isOpen && customCount > 0 && <span className="text-text-muted font-normal">({customCount} customised)</span>}
                </button>

                {isOpen && (
                  <div className="flex flex-col gap-2">
                    {level.classes.map(cls => (
                      <div key={cls.classId} className="border-border-default flex flex-col gap-2 rounded-md border p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-text-default text-sm font-medium">{cls.className}</span>
                          {cls.overridden ? (
                            <span className="flex items-center gap-2 text-xs">
                              <span className="text-text-muted">Different from {levelTitle}</span>
                              {canEdit && (
                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={() =>
                                    resetClass(cls.classId, {
                                      onSuccess: () => toast({ title: `${cls.className} now follows ${levelTitle}`, type: "success" }),
                                      onError: onFailure("Could not reset the class"),
                                    })
                                  }
                                  className="text-text-informative font-medium disabled:opacity-60"
                                >
                                  Use the {levelTitle} choice
                                </button>
                              )}
                            </span>
                          ) : (
                            <span className="text-text-muted text-xs">Same as {levelTitle}</span>
                          )}
                        </div>
                        <OptionPicker
                          compact
                          value={cls.format}
                          disabled={!canEdit || busy}
                          onChange={format =>
                            setClassFormat(
                              { classId: cls.classId, format },
                              {
                                onSuccess: () => toast({ title: `${cls.className} will now show ${formatName(format)}`, type: "success" }),
                                onError: onFailure("Could not save your choice"),
                              },
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};
