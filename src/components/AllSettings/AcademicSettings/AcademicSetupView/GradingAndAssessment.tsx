"use client";

import React, { useEffect, useState } from "react";
import Loader2Fill from "@/components/Icons/Loader2Fill";
import { Button } from "@/components/ui/button";
import { cn, extractUniqueLevelsByType } from "@/lib/utils";
import { AddFill } from "@/components/Icons/AddFill";
import { Input } from "@/components/ui/input";
import { DeleteBin2 } from "@/components/Icons/DeleteBin2";
import Edit from "@/components/Icons/Edit";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Label } from "@/components/ui/label";
import BookOpen from "@/components/Icons/BookOpen";
import School from "@/components/Icons/School";
import { AssessmentType, Branch, BranchWithClassLevels, ClassLevel, SchoolGrading } from "@/api/types";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useGetLevels, useGetAssessmentsByLevel, useGetGradingsByLevel } from "@/hooks/queryHooks/useLevel";
import { Skeleton } from "@/components/ui/skeleton";
import { GradingAndAssessment } from "../AcademicSetup/GradingAndAssessment";

function LevelTabSwitch({
  levels,
  activeLevel,
  setActiveLevel,
}: {
  levels: ClassLevel[];
  activeLevel: ClassLevel | null;
  setActiveLevel: (l: ClassLevel) => void;
}) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="w-full">
        <Select
          value={activeLevel?.levelName || ""}
          onValueChange={value => {
            const level = levels.find(l => l.levelName === value);
            if (level) setActiveLevel(level);
          }}
        >
          <Label className="text-text-default mb-2 text-sm font-medium">
            {" "}
            <BookOpen fill="var(--color-icon-default-muted)" /> Select Level
          </Label>
          <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal">
            <SelectValue>
              <span className="text-text-default text-sm capitalize">{activeLevel?.levelName?.replaceAll("_", " ").toLowerCase()}</span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-bg-default border-border-default">
            {levels.map(level => (
              <SelectItem key={level.levelName} value={level.levelName} className="text-text-default text-sm capitalize">
                {level.levelName.replaceAll("_", " ").toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="h-9 w-auto overflow-hidden">
      <div
        className="bg-bg-state-soft hide-scrollbar flex max-w-full items-center gap-2.5 overflow-x-auto rounded-full p-0.5"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {levels.map(level => {
          const isActive = activeLevel?.levelName === level.levelName;

          return (
            <button
              key={level.levelName}
              type="button"
              onClick={() => setActiveLevel(level)}
              className={cn(
                "transit flex shrink-0 justify-center px-4 py-2 text-sm font-medium whitespace-nowrap capitalize",
                isActive
                  ? "bg-bg-state-secondary border-border-darker text-text-default flex h-8 items-center justify-center gap-1 rounded-full border shadow-sm"
                  : "text-text-muted flex h-8 items-center gap-1",
              )}
            >
              <span>{level.levelName.replaceAll("_", " ").toLowerCase()}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BranchTabSwitch({ activeBranch, setActiveBranch }: { activeBranch: Branch | null; setActiveBranch: (t: Branch | null) => void }) {
  const { data: branchesData, isFetching: isLoadingBranches } = useGetBranches();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (branchesData?.data?.length > 0 && !activeBranch) {
      setActiveBranch(branchesData.data[0].branch);
    }
  }, [branchesData]);

  if (isMobile) {
    return (
      <div className="w-full">
        <Select
          value={activeBranch?.name || ""}
          onValueChange={value => {
            const branch = branchesData?.data?.find((b: BranchWithClassLevels) => b.branch.name === value);
            if (branch) setActiveBranch(branch.branch);
          }}
        >
          <Label className="text-text-default mb-2 text-sm font-medium">
            {" "}
            <School fill="var(--color-icon-default-muted)" /> Select Branch
          </Label>
          <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal">
            <SelectValue>
              <span className="text-text-default text-sm">{activeBranch?.name}</span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-bg-default border-border-default">
            {branchesData?.data?.map((branchItem: BranchWithClassLevels) => (
              <SelectItem key={branchItem.branch.id} value={branchItem.branch.name || ""} className="text-text-default text-sm">
                {branchItem.branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="flex w-auto max-w-64 items-center gap-3">
      {isLoadingBranches && <Skeleton className="h-9 w-full" />}
      {branchesData?.data?.map((branchItem: BranchWithClassLevels) => {
        const branch = branchItem.branch;
        const isActive = activeBranch?.id === branch.id;

        return (
          <Button
            key={branch.id}
            type="button"
            onClick={() => setActiveBranch(branch)}
            className={cn(
              "hover:bg-bg-none! w-1/2 cursor-pointer rounded-none py-2.5 text-center transition-all duration-150",
              isActive && "border-border-informative border-b-[1.5px]",
            )}
          >
            <span className={cn("text-sm font-medium", isActive ? "text-text-informative" : "text-text-muted")}>{branch.name}</span>
            {isActive ? <Loader2Fill fill="var(--color-icon-informative)" /> : <Loader2Fill fill="var(--color-icon-default-muted)" />}
          </Button>
        );
      })}
    </div>
  );
}

function ClassesResponsiveTabs({ levels, activeLevel }: { levels: ClassLevel[]; activeLevel: ClassLevel | null }) {
  const isMobile = useIsMobile();

  if (!activeLevel) return null;

  return (
    <div className="w-full">
      <div className="mt-4 w-full">
        <ClassAssessmentSetup levelId={activeLevel.id} />
      </div>
    </div>
  );
}

export const AcademicAssAndGradeSetupDone = () => {
  const [activeBranch, setActiveBranch] = useState<Branch | null>(null);
  const [activeLevel, setActiveLevel] = useState<ClassLevel | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { data: branchLevelsData } = useGetLevels(activeBranch?.id);
  const levels = extractUniqueLevelsByType(branchLevelsData?.data || []);

  useEffect(() => {
    if (levels.length > 0 && !activeLevel) {
      setActiveLevel(levels[0]);
    }
  }, [levels]);

  return (
    <div>
      {isEditing ? (
        <div className="pb-20">
          {" "}
          <GradingAndAssessment isEditing={isEditing} setIsEditing={setIsEditing} />{" "}
        </div>
      ) : (
        <div className="mx-auto flex w-full items-center justify-center px-4 pb-12 md:max-w-200">
          <div className="w-full">
            <div className="mb-5 flex w-full items-start justify-between">
              <div className="text-text-default text-xl font-semibold">Assessment & Grading</div>

              <Button
                onClick={() => setIsEditing(true)}
                className="bg-bg-state-secondary! border-border-darker hover:bg-bg-none! text-text-default flex h-7! items-center justify-center rounded-md border p-2"
              >
                <Edit fill="var(--color-icon-default-muted)" className="bg-bg-" /> Edit
              </Button>
            </div>

            <div className="border-border-default mb-5 flex w-full items-center gap-3">
              <BranchTabSwitch activeBranch={activeBranch} setActiveBranch={setActiveBranch} />
            </div>

            <div className="border-border-default mb-5 flex w-full items-center gap-3">
              <LevelTabSwitch levels={levels} activeLevel={activeLevel} setActiveLevel={setActiveLevel} />
            </div>

            <ClassesTabSetup levels={levels} activeLevel={activeLevel} />
          </div>
        </div>
      )}
    </div>
  );
};

export const ClassesTabSetup = ({ levels, activeLevel }: { levels: ClassLevel[]; activeLevel: ClassLevel | null }) => {
  return (
    <div>
      <div className="w-full">
        <ClassesResponsiveTabs levels={levels} activeLevel={activeLevel} />
      </div>
    </div>
  );
};

export const ClassAssessmentSetup = ({ levelId }: { levelId?: number }) => {
  const { data: assessmentsData, isPending: isLoadingAssessments } = useGetAssessmentsByLevel(levelId);
  const { data: gradingsData, isPending: isLoadingGradings } = useGetGradingsByLevel(levelId);

  const assessments = assessmentsData?.data || [];
  const gradings = gradingsData?.data || [];
  const totalWeight = assessments.reduce((acc: number, curr: AssessmentType) => acc + (curr.weight || 0), 0);

  if (isLoadingAssessments || isLoadingGradings) return <Skeleton className="bg-bg-state-soft h-100 w-full" />;

  return (
    <div className="mt-8 flex flex-col gap-6">
      <div className="bg-bg-state-soft rounded-md p-2">
        <div className="text-text-default text-md px-4 py-2 font-semibold">Assessment</div>
        <div className="bg-bg-card border-border-default space-y-2 rounded-md border p-4 md:px-5 md:py-6">
          <div className="flex flex-col gap-2">
            {assessments.length > 0 ? (
              assessments.map((asst: AssessmentType) => (
                <div key={asst.id} className="mb-2 flex items-center justify-between gap-2">
                  <Input className="bg-bg-input-soft! text-text-default h-9! flex-1 border-none" value={asst.name} readOnly type="text" />
                  <div className="bg-bg-input-soft flex h-9 w-17 items-center gap-1 rounded-md p-1">
                    <Input className="text-text-default h-7! w-full border-none bg-none! p-0" value={asst.weight} readOnly type="number" />
                    <span className="text-text-muted">%</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-text-muted py-4 text-center text-sm">No assessments configured for this level.</div>
            )}
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
            <div className="flex items-center gap-2 justify-self-end">
              <div className="text-text-subtle text-sm">Total Weight</div>
              <div className="text-text-default text-sm font-medium">{totalWeight}%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-bg-state-soft overflow-x-auto rounded-md p-2">
        <div className="text-text-default text-md px-4 py-2 pb-2 font-semibold">Grading </div>
        <div className="bg-bg-card border-border-default hidden w-full rounded-md border px-5 py-6 md:block">
          <table className="w-full border-none">
            {gradings.length > 0 && (
              <thead>
                <tr className="">
                  <th className="text-text-muted px-3 py-2 text-left text-sm font-medium">Grade</th>
                  <th className="text-text-muted px-3 py-2 text-left text-sm font-medium">Score</th>
                  <th></th>
                  <th></th>
                  <th className="text-text-muted w-full px-3 py-2 text-left text-sm font-medium">Remark</th>
                </tr>
              </thead>
            )}

            <tbody>
              {gradings.length > 0 ? (
                gradings.map((grd: SchoolGrading) => (
                  <tr key={grd.id} className="">
                    <td className="px-3 py-2">
                      <div className="bg-bg-input-soft flex h-9 w-27 items-center gap-1 rounded-md px-2">
                        <Input readOnly value={grd.grade} className="text-text-default h-7! w-full border-none bg-transparent p-0" />
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="bg-bg-input-soft flex h-9 w-27 items-center gap-1 rounded-md px-2">
                        <Input readOnly value={grd.lowerLimit} className="text-text-default h-7! w-full border-none bg-transparent p-0" />
                      </div>
                    </td>
                    <td className="text-text-subtle w-1">-</td>
                    <td className="px-3 py-2">
                      <div className="bg-bg-input-soft flex h-9 w-27 items-center gap-1 rounded-md px-2">
                        <Input readOnly value={grd.upperLimit} className="text-text-default h-7! w-full border-none bg-transparent p-0" />
                      </div>
                    </td>
                    <td className="w-full px-3 py-2">
                      <Input readOnly className="bg-bg-input-soft! text-text-default h-9! w-full border-none" value={grd.remark} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-text-muted py-4 text-center text-sm">
                    No gradings configured for this level.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-2 md:hidden">
          {gradings.length > 0 ? (
            gradings.map((grd: SchoolGrading) => (
              <div key={grd.id} className="bg-bg-card border-border-default flex w-full flex-col gap-3 rounded-md border px-5 py-6">
                <div className="flex flex-col">
                  <Label className="text-text-default text-sm font-medium">Grade</Label>
                  <Input readOnly value={grd.grade} className="text-text-default bg-bg-input-soft! h-7! w-full border-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-text-default text-sm font-medium">Score</Label>
                  <div className="flex w-full items-center gap-2">
                    <Input readOnly value={grd.lowerLimit} className="text-text-default bg-bg-input-soft! h-7! w-full border-none" />
                    <span className="text-text-default text-xs">to</span>
                    <Input readOnly value={grd.upperLimit} className="text-text-default bg-bg-input-soft! h-7! w-full border-none" />
                  </div>
                </div>

                <div className="flex w-full flex-col gap-2">
                  <Label className="text-text-default text-sm font-medium">Remark</Label>
                  <Input readOnly className="bg-bg-input-soft! text-text-default h-7! w-full border-none" value={grd.remark} />
                </div>
              </div>
            ))
          ) : (
            <div className="text-text-muted py-4 text-center text-sm">No gradings configured for this level.</div>
          )}
        </div>
      </div>
    </div>
  );
};
