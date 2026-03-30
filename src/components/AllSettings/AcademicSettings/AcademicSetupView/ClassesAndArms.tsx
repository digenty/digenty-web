"use client";

import { BookFill } from "@/components/Icons/BookFill";
import Edit from "@/components/Icons/Edit";
import { GitMergeFill } from "@/components/Icons/GitMergeFill";
import GraduationCapFill from "@/components/Icons/GraduationCapFill";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Label } from "@/components/ui/label";
import BookOpen from "@/components/Icons/BookOpen";
import School from "@/components/Icons/School";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useGetLevels } from "@/hooks/queryHooks/useLevel";
import { useGetClassesByLevel } from "@/hooks/queryHooks/useClass";
import { cn, extractUniqueLevelsByType } from "@/lib/utils";
import { Branch, BranchWithClassLevels, ClassInLevelDetails, ClassLevel } from "@/api/types";
import { Skeleton } from "@/components/ui/skeleton";
import Loader2Fill from "@/components/Icons/Loader2Fill";
import DeleteBin from "@/components/Icons/DeleteBin";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { ClassesAndArms } from "../AcademicSetup/ClassesAndArms";

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

function ClassesResponsiveTabs({ levels, activeLevel, branchId }: { levels: ClassLevel[]; activeLevel: ClassLevel | null; branchId?: number }) {
  const isMobile = useIsMobile();

  const { data: classesByLevelData, isPending: isLoadingClasses } = useGetClassesByLevel(activeLevel?.id);

  const Content = () => {
    if (!activeLevel) return null;

    if (activeLevel.levelType === "SENIOR_SECONDARY") {
      return <SecondarySetup data={classesByLevelData?.data?.content} isLoading={isLoadingClasses} />;
    }
    return <NurserySetup data={classesByLevelData?.data?.content} isLoading={isLoadingClasses} />;
  };

  if (isMobile) {
    return (
      <div className="w-full">
        <div className="mt-4">
          <Content />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mt-4 w-full">
        <Content />
      </div>
    </div>
  );
}

export const AcademicDoneClassAndArms = () => {
  const [activeBranch, setActiveBranch] = useState<Branch | null>(null);
  const [activeLevel, setActiveLevel] = useState<ClassLevel | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { data: branchesData, isFetching: isLoadingBranches } = useGetBranches();
  const { data: branchLevelsData } = useGetLevels(activeBranch?.id);

  const levels = extractUniqueLevelsByType(branchLevelsData?.data || []);

  useEffect(() => {
    if (branchesData?.data?.length > 0 && !activeBranch) {
      setActiveBranch(branchesData.data[0].branch);
    }
  }, [branchesData]);

  useEffect(() => {
    if (levels.length > 0 && !activeLevel) {
      setActiveLevel(levels[0]);
    }
  }, [levels]);

  const isMobile = useIsMobile();

  return (
    <div>
      {isEditing ? (
        <div className="pb-12">
          <ClassesAndArms isEditing={isEditing} setIsEditing={setIsEditing} />
        </div>
      ) : (
        <div className="mx-auto flex w-full items-center justify-center px-4 pb-12 md:max-w-200">
          <div className="w-full">
            <div className="mb-5 flex w-full items-start justify-between">
              <div className="text-text-default text-xl font-semibold">Classes & Arms</div>

              <Button
                onClick={() => setIsEditing(true)}
                className="bg-bg-state-secondary! border-border-darker hover:bg-bg-none! text-text-default flex h-7! items-center justify-center rounded-md border p-2"
              >
                <Edit fill="var(--color-icon-default-muted)" className="bg-bg-" /> Edit
              </Button>
            </div>

            <div className="mb-5 flex w-auto max-w-64 items-center gap-3">
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
                  </Button>
                );
              })}
            </div>

            <div className="border-border-default mb-5 flex w-full items-center gap-3">
              <LevelTabSwitch levels={levels} activeLevel={activeLevel} setActiveLevel={setActiveLevel} />
            </div>

            <ClassesSetup levels={levels} activeLevel={activeLevel} branchId={activeBranch?.id} />
          </div>
        </div>
      )}
    </div>
  );
};

export const ClassesSetup = ({ levels, activeLevel, branchId }: { levels: ClassLevel[]; activeLevel: ClassLevel | null; branchId?: number }) => {
  return (
    <div>
      <div className="w-full">
        <ClassesResponsiveTabs levels={levels} activeLevel={activeLevel} branchId={branchId} />
      </div>
    </div>
  );
};

export const NurserySetup = ({ data, isLoading }: { data?: ClassInLevelDetails[]; isLoading: boolean }) => {
  if (isLoading) return <Skeleton className="bg-bg-state-soft h-80 w-full" />;
  if (!data || data.length === 0)
    return (
      <div className="flex items-center justify-center pt-15">
        <ErrorComponent title="No classes found for this level" description="Use the Quick Setup to add classes" />
      </div>
    );

  return (
    <div className="mt-8 flex w-full flex-col gap-6">
      {data.map(clss => (
        <div key={clss.classId} className="bg-bg-state-soft rounded-md p-1">
          <div className="flex items-center justify-between px-5 py-2">
            <div className="text-text-default text-sm font-medium capitalize">{clss.className} </div>
          </div>
          <div className="bg-bg-card border-border-darker flex flex-col gap-4 rounded-md border p-2 md:px-5 md:py-6">
            <div className="p-3">
              <div className="text-text-default mb-3 flex items-center gap-2 text-sm font-medium">
                <BookFill fill="var(--color-bg-basic-blue-accent)" /> Subjects
              </div>
              <div className="border-border-default flex flex-wrap gap-3 border-b pb-4">
                {clss.subjects.length > 0 ? (
                  clss.subjects.map(sub => (
                    <Badge
                      key={sub.id}
                      className="bg-bg-badge-gray! text-text-default flex h-6! items-center gap-3 rounded-md p-1 text-xs capitalize"
                    >
                      {sub.name.toLowerCase()}
                    </Badge>
                  ))
                ) : (
                  <span className="text-text-muted text-xs">No subjects added</span>
                )}
              </div>
              <div className="text-text-default my-2 flex items-center gap-2 text-sm font-medium">
                <GitMergeFill fill="var(--color-bg-basic-blue-accent)" /> Arm
              </div>

              <div className="flex flex-wrap gap-1">
                {clss.arms.length > 0 ? (
                  clss.arms.map(arm => (
                    <div key={arm.id} className="">
                      <div className="text-text-subtle bg-bg-badge-gray flex h-6! w-6! items-center justify-center rounded-md text-sm font-medium">
                        {arm.name}
                      </div>
                    </div>
                  ))
                ) : (
                  <span className="text-text-muted text-xs">No arms added</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const SecondarySetup = ({ data, isLoading }: { data?: ClassInLevelDetails[]; isLoading: boolean }) => {
  if (isLoading) return <Skeleton className="bg-bg-state-soft h-80 w-full" />;
  if (!data || data.length === 0)
    return (
      <div className="flex items-center justify-center pt-15">
        <ErrorComponent title="No classes found for this level" description="Use the Quick Setup to add classes" />
      </div>
    );

  return (
    <div className="mt-8 flex w-full flex-col gap-6">
      {data.map(clss => (
        <div key={clss.classId} className="bg-bg-state-soft rounded-md p-1">
          <div className="flex items-center justify-between px-5 py-2">
            <div className="text-text-default text-sm font-medium">{clss.className} </div>
            <div className="flex items-center gap-2"></div>
          </div>
          <div className="bg-bg-card border-border-darker flex flex-col gap-4 rounded-md border p-2 md:px-5 md:py-2">
            <div className="p-3">
              <div className="text-text-default mb-3 flex items-center gap-2 text-sm font-medium">
                <GraduationCapFill fill="var(--color-bg-basic-blue-accent) " className="size-4" /> Departments
              </div>
              <div className="border-border-default flex flex-wrap gap-3 border-b pb-4">
                {/* Departments are currently not explicitly in ClassInLevelDetails, but we can list arms/subjects if relevant */}
                <span className="text-text-muted text-xs">No department paths configured</span>
              </div>

              <div className="text-text-default my-3 flex items-center gap-2 text-sm font-medium">
                <BookFill fill="var(--color-bg-basic-blue-accent)" />
                Subjects
              </div>
              <div className="border-border-default flex flex-wrap gap-3 border-b pb-4">
                {clss.subjects.length > 0 ? (
                  clss.subjects.map(sub => (
                    <Badge
                      key={sub.id}
                      className="bg-bg-badge-gray! text-text-default flex h-6! items-center gap-3 rounded-md p-1 text-xs capitalize"
                    >
                      {sub.name.toLowerCase()}
                    </Badge>
                  ))
                ) : (
                  <span className="text-text-muted text-xs">No subjects added</span>
                )}
              </div>

              <div className="text-text-default my-2 flex items-center gap-2 text-sm font-medium">
                <GitMergeFill fill="var(--color-bg-basic-blue-accent)" /> Arm
              </div>

              <div className="flex flex-wrap gap-1">
                {clss.arms.length > 0 ? (
                  clss.arms.map(arm => (
                    <div key={arm.id} className="">
                      <div className="text-text-subtle bg-bg-badge-gray flex h-6! w-6! items-center justify-center rounded-md text-sm font-medium">
                        {arm.name}
                      </div>
                    </div>
                  ))
                ) : (
                  <span className="text-text-muted text-xs">No arms added</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
