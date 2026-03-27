"use client";

import { Branch, BranchWithClassLevels, ClassInLevel, ClassInLevelDetails, ClassLevel } from "@/api/types";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { BookFill } from "@/components/Icons/BookFill";
import BookOpen from "@/components/Icons/BookOpen";
import DeleteBin from "@/components/Icons/DeleteBin";
import Edit from "@/components/Icons/Edit";
import { GitMergeFill } from "@/components/Icons/GitMergeFill";
import GraduationCapFill from "@/components/Icons/GraduationCapFill";
import Loader2Fill from "@/components/Icons/Loader2Fill";
import School from "@/components/Icons/School";
import Settings4 from "@/components/Icons/Settings4";
import { Toggle } from "@/components/Toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useGetClassesByLevel } from "@/hooks/queryHooks/useClass";
import { useGetLevels } from "@/hooks/queryHooks/useLevel";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn, extractUniqueLevelsByType } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ClassEditSheet } from "./ClassEditSheet";
import { ClassQuickSetupSheet } from "./ClassQuickSetupSheet";
import { DeleteClass } from "./ClassesAndArmsModals";

function BranchTabs({ activeBranch, setActiveBranch }: { activeBranch: Branch | null; setActiveBranch: (t: Branch | null) => void }) {
  const { data: branchesData, isFetching: isLoadingBranches, refetch: refetchBranches, isError } = useGetBranches();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (branchesData?.data?.length > 0) {
      setActiveBranch(branchesData?.data[0].branch);
    }
  }, [branchesData]);

  if (isMobile) {
    return (
      <div className="w-full">
        {isLoadingBranches || !branchesData ? (
          <Skeleton />
        ) : (
          <Select
            value={activeBranch?.name || ""}
            onValueChange={value => {
              const branch = branchesData?.data?.find((branch: BranchWithClassLevels) => branch?.branch?.name === value);
              setActiveBranch(branch?.branch || null);
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
              {branchesData?.data?.map((branch: BranchWithClassLevels) => (
                <SelectItem key={branch.branch.name} value={branch.branch.name || ""} className="text-text-default text-sm">
                  {branch.branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    );
  }

  return (
    <div className="flex w-auto max-w-64 items-center gap-3">
      {isLoadingBranches && <Skeleton className="h-9 w-1/2" />}
      {branchesData?.data?.map((branch: BranchWithClassLevels) => {
        const isActive = activeBranch?.name === branch.branch.name;

        return (
          <Button
            key={branch.branch.name}
            type="button"
            onClick={() => setActiveBranch(branch?.branch)}
            className={cn(
              "hover:bg-bg-none! w-1/2 cursor-pointer rounded-none py-2.5 text-center transition-all duration-150",
              isActive && "border-border-informative border-b-[1.5px]",
            )}
          >
            <span className={cn("text-sm font-medium", isActive ? "text-text-informative" : "text-text-muted")}>{branch.branch.name}</span>
            {isActive ? <Loader2Fill fill="var(--color-icon-informative)" /> : <Loader2Fill fill="var(--color-icon-default-muted)" />}
          </Button>
        );
      })}
    </div>
  );
}

function ClassesResponsiveTabs({
  levels,
  activeLevel,
  setActiveLevel,
  branchId,
  branchSpecific,
}: {
  levels: ClassLevel[];
  activeLevel: ClassLevel | null;
  setActiveLevel: (level: ClassLevel) => void;
  branchId?: number;
  branchSpecific: boolean;
}) {
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [classId, setClassId] = React.useState<number | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const { data: classesByLevelData, isPending } = useGetClassesByLevel(activeLevel?.id);

  const Classes = () => {
    return (
      <>
        {openDelete && <DeleteClass setOpenDeleteModal={setOpenDelete} open={openDelete} classId={classId} />}
        {sheetOpen && <ClassEditSheet sheetOpen={sheetOpen} setSheetOpen={setSheetOpen} level={activeLevel} branchId={branchId} classId={classId} />}

        {isPending && !classesByLevelData && <Skeleton className="bg-bg-state-soft h-80 w-full" />}
        {!isPending && classesByLevelData && classesByLevelData?.data?.length === 0 && (
          <div className="flex w-full items-center justify-center">
            <ErrorComponent title="No Classes added yet" description="Use the Quick Setup to add classes" />
          </div>
        )}
        {!isPending && classesByLevelData && activeLevel?.levelType !== "SENIOR_SECONDARY" && (
          <div className="mt-8 flex w-full flex-col gap-6">
            {classesByLevelData?.data?.content?.map((clss: ClassInLevelDetails) => (
              <div key={clss.classId} className="bg-bg-state-soft rounded-md p-1">
                <div className="flex items-center justify-between px-5 py-2">
                  <div className="text-text-default text-sm font-medium capitalize">{clss.className} </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => {
                        setOpenDelete(true);
                        setClassId(clss.classId);
                      }}
                      className="bg-bg-state-secondary! hover:bg-bg-none! flex h-7! w-7! items-center justify-center rounded-md p-2"
                    >
                      <DeleteBin fill="var(--color-icon-destructive)" className="bg-bg-" />
                    </Button>
                    <Button
                      onClick={() => {
                        setSheetOpen(true);
                        setClassId(clss.classId);
                      }}
                      className="bg-bg-state-secondary! hover:bg-bg-none! text-text-default flex h-7! items-center justify-center rounded-md p-2"
                    >
                      <Edit fill="var(--color-icon-default-muted)" className="bg-bg-" /> Edit
                    </Button>
                  </div>
                </div>
                <div className="bg-bg-card border-border-darker flex flex-col gap-4 rounded-md border p-2 md:px-5 md:py-6">
                  <div className="">
                    <div className="text-text-default mb-3 flex items-center gap-2 text-sm font-medium">
                      {" "}
                      <BookFill fill="var(--color-bg-basic-blue-accent)" /> Subjects
                    </div>
                    <div className="border-border-default flex flex-wrap gap-3 border-b pb-4">
                      {clss.subjects.length === 0 && <p className="text-text-subtle text-sm">No subjects added yet</p>}
                      {clss.subjects.map(subject => (
                        <Badge
                          key={subject.id}
                          className="bg-bg-badge-gray! text-text-default flex h-6! items-center gap-3 rounded-md p-1 text-xs capitalize"
                        >
                          {subject.name.toLowerCase()}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-text-default my-2 flex items-center gap-2 text-sm font-medium">
                      {" "}
                      <GitMergeFill fill="var(--color-bg-basic-blue-accent)" /> Arm
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {clss.arms.length === 0 && <p className="text-text-subtle text-sm">No arms added yet</p>}
                      {clss.arms.map(arm => (
                        <div key={arm.id} className="">
                          <div className="text-text-subtle bg-bg-badge-gray flex h-6! w-6! items-center justify-center rounded-md text-sm font-medium">
                            {arm.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isPending && classesByLevelData && activeLevel?.levelType === "SENIOR_SECONDARY" && (
          <div className="mt-8 flex flex-col gap-6">
            {classesByLevelData?.data?.map((clss: ClassInLevel) => (
              <div key={clss.id} className="bg-bg-state-soft rounded-md p-1">
                <div className="flex items-center justify-between px-5 py-2">
                  <div className="text-text-default text-sm font-medium">{clss.name} </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => {
                        setClassId(clss.id);
                        setOpenDelete(true);
                      }}
                      className="bg-bg-state-secondary! hover:bg-bg-none! flex h-7! w-7! items-center justify-center rounded-md p-2"
                    >
                      <DeleteBin fill="var(--color-icon-destructive)" className="bg-bg-" />
                    </Button>
                    <Button className="bg-bg-state-secondary! hover:bg-bg-none! text-text-default flex h-7! items-center justify-center rounded-md p-2">
                      <Edit fill="var(--color-icon-default-muted)" className="bg-bg-" /> Edit
                    </Button>
                  </div>
                </div>
                <div className="bg-bg-card border-border-darker flex flex-col gap-4 rounded-md border p-2 md:px-5 md:py-2">
                  <div className="p-3">
                    <div className="text-text-default mb-3 flex items-center gap-2 text-sm font-medium">
                      {" "}
                      <GraduationCapFill fill="var(--color-bg-basic-blue-accent) " className="size-4" /> Departments
                    </div>
                    <div className="border-border-default flex flex-wrap gap-3 border-b pb-4">
                      {["English Language"].map(sub => (
                        <Badge key={sub} className="bg-bg-badge-gray! text-text-default flex h-6! items-center gap-3 rounded-md p-1 text-xs">
                          {sub}
                        </Badge>
                      ))}
                    </div>

                    <div className="text-text-default my-3 flex items-center gap-2 text-sm font-medium">
                      {" "}
                      <BookFill fill="var(--color-bg-basic-blue-accent)" />
                      Art Subjects
                    </div>
                    <div className="border-border-default flex flex-wrap gap-3 border-b pb-4">
                      {["English Language"].map(sub => (
                        <Badge key={sub} className="bg-bg-badge-gray! text-text-default flex h-6! items-center gap-3 rounded-md p-1 text-xs">
                          {sub}
                        </Badge>
                      ))}
                    </div>

                    <div className="text-text-default my-3 flex items-center gap-2 text-sm font-medium">
                      {" "}
                      <BookFill fill="var(--color-bg-basic-blue-accent)" />
                      Commercial Subjects
                    </div>
                    <div className="border-border-default flex flex-wrap gap-3 border-b pb-4">
                      {["English Language"].map(sub => (
                        <Badge key={sub} className="bg-bg-badge-gray! text-text-default flex h-6! items-center gap-3 rounded-md p-1 text-xs">
                          {sub}
                        </Badge>
                      ))}
                    </div>

                    <div className="text-text-default my-3 flex items-center gap-2 text-sm font-medium">
                      {" "}
                      <BookFill fill="var(--color-bg-basic-blue-accent)" />
                      Science Subjects
                    </div>
                    <div className="border-border-default flex flex-wrap gap-3 border-b pb-4">
                      {["English Language"].map(sub => (
                        <Badge key={sub} className="bg-bg-badge-gray! text-text-default flex h-6! items-center gap-3 rounded-md p-1 text-xs">
                          {sub}
                        </Badge>
                      ))}
                    </div>

                    <div className="text-text-default my-2 flex items-center gap-2 text-sm font-medium">
                      <GitMergeFill fill="var(--color-bg-basic-blue-accent)" /> Arm
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {["A", "B", "C"].map(arm => (
                        <div key={arm} className="">
                          <div className="text-text-subtle bg-bg-badge-gray flex h-6! w-6! items-center justify-center rounded-md text-sm font-medium">
                            {arm}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    );
  };

  if (isMobile) {
    return (
      <div className="w-full">
        <Label className="text-text-default mb-2 text-sm font-medium">
          <BookOpen fill="var(--color-icon-default-muted)" /> Select Level
        </Label>
        <Select
          value={String(activeIndex)}
          onValueChange={value => {
            setActiveIndex(Number(value));
            setActiveLevel(levels[Number(value)]);
          }}
        >
          <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal">
            <SelectValue>
              {/* <span className="text-text-default text-sm capitalize">{levels[activeIndex].levelName.replaceAll("_", " ").toLowerCase()}</span> */}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-bg-default border-border-default">
            {levels.map((level, idx) => (
              <SelectItem key={level.levelName} value={String(idx)} className="text-text-default text-sm capitalize">
                {level.levelName.replaceAll("_", " ").toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="mt-4">{<Classes />}</div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="h-9 w-full">
        <div
          className="bg-bg-state-soft hide-scrollbar flex max-w-150 items-center gap-2.5 overflow-x-auto rounded-full p-0.5 lg:max-w-160 xl:max-w-216"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {levels.map(level => {
            const isActive = level.levelName === activeLevel?.levelName;

            return (
              <button
                key={level.levelName}
                onClick={() => setActiveLevel(level)}
                className={cn(
                  "transit flex shrink-0 justify-center px-4 py-2 text-sm font-medium whitespace-nowrap capitalize",
                  isActive
                    ? "bg-bg-state-secondary border-border-darker text-text-default flex h-8 items-center justify-center gap-1 rounded-full border shadow-sm"
                    : "text-text-muted flex h-8 items-center gap-1",
                )}
              >
                <span>{level.levelName.replaceAll("_", " ").toLowerCase()}</span>
                {isActive ? (
                  <Loader2Fill fill="var(--color-icon-informative)" className="size-4" />
                ) : (
                  <Loader2Fill fill="var(--color-icon-default-muted)" className="size-4" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 w-full">{<Classes />}</div>
    </div>
  );
}

export const ClassesAndArms = ({ setCompletedSteps, completedSteps }: { setCompletedSteps: (step: string[]) => void; completedSteps: string[] }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeBranch, setActiveBranch] = useState<Branch | null>(null);
  const [branchSpecific, setBranchSpecific] = useState(false);
  const [activeLevel, setActiveLevel] = useState<ClassLevel | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const { data: branchLevels } = useGetLevels(activeBranch?.id);
  const levels = extractUniqueLevelsByType(branchLevels?.data || []);

  useEffect(() => {
    if (!activeLevel) {
      setActiveLevel(levels[0]);
    }
  }, [levels]);

  return (
    <section className="">
      <div className="mx-auto flex w-full flex-1 flex-col gap-4 px-4 lg:px-36">
        <div className="bg-bg-subtle border-border-default mb-5 flex w-full items-start justify-between rounded-md border p-4">
          <div className="">
            <div className="text-text-default text-md font-semibold">Do academic structures differ by school branch?</div>
            <div className="text-text-subtle text-sm font-normal">Turn ON for branch-specific structures. Keep OFF to share one setup.</div>
          </div>
          <Toggle
            withBorder={false}
            checked={branchSpecific}
            onChange={evt => {
              setBranchSpecific(!branchSpecific);
              if (!evt.target.checked) setActiveBranch(null);
            }}
          />
        </div>
        {branchSpecific && (
          <div className="border-border-default mb-5 flex w-full items-center gap-3 px-4">
            <BranchTabs activeBranch={activeBranch} setActiveBranch={setActiveBranch} />
          </div>
        )}

        <div className="flex w-full flex-col-reverse gap-4 md:flex-row md:items-start md:justify-between">
          <div className="w-full min-w-0 flex-1">
            <ClassesSetup
              levels={levels}
              activeLevel={activeLevel}
              setActiveLevel={setActiveLevel}
              branchId={activeBranch?.id}
              branchSpecific={branchSpecific}
            />
          </div>
          <div className="shrink-0">
            {activeLevel && (
              <>
                {sheetOpen && (
                  <ClassQuickSetupSheet
                    level={activeLevel}
                    branchSpecific={branchSpecific}
                    setActiveLevel={setActiveLevel}
                    branchId={activeBranch?.id}
                    sheetOpen={sheetOpen}
                    setSheetOpen={setSheetOpen}
                  />
                )}
                <Button
                  onClick={() => {
                    // setDepartmentsEnabled(false);
                    setSheetOpen(true);
                  }}
                  className="bg-bg-state-secondary! border-border-darker! text-text-default rounded-md! border shadow-sm lg:ml-[-149]"
                >
                  <Settings4 fill="var(--color-icon-default-muted)" /> Quick Setup
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="border-border-default bg-bg-default absolute bottom-0 mx-auto flex w-full justify-between border-t px-4 py-3 lg:px-40">
        <Button
          className="bg-bg-state-soft! hover:bg-bg-state-soft-hover! text-text-subtle h-7!"
          onClick={() => {
            router.push(`${pathname}?step=school-structure`);
          }}
        >
          Previous
        </Button>

        <Button
          type="button"
          onClick={() => {
            setCompletedSteps([...completedSteps, "class-and-arms"]);
            router.push(`${pathname}?step=grading-and-assessment`);
          }}
          className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default! h-7!"
        >
          Next
        </Button>
      </div>
    </section>
  );
};

export const ClassesSetup = ({
  levels,
  activeLevel,
  setActiveLevel,
  branchId,
  branchSpecific,
}: {
  levels: ClassLevel[];
  activeLevel: ClassLevel | null;
  setActiveLevel: (level: ClassLevel) => void;
  branchId?: number;
  branchSpecific: boolean;
}) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const openDelete = () => {
    setOpenDeleteModal(true);
  };

  return (
    <div>
      {/* {openDeleteModal && <DeleteClass setOpenDeleteModal={setOpenDeleteModal} open={openDeleteModal} />} */}
      <div className="w-full">
        {levels.length > 0 && (
          <ClassesResponsiveTabs
            levels={levels}
            activeLevel={activeLevel}
            setActiveLevel={setActiveLevel}
            branchSpecific={branchSpecific}
            branchId={branchId}
          />
        )}
      </div>
    </div>
  );
};

export const NurserySetup = ({ onOpenDelete }: { onOpenDelete?: (target?: { id: string; name?: string }) => void }) => {
  const nurseryClasses = [{ id: "n1" }, { id: "n2" }];
  return (
    <div className="mt-8 flex w-full flex-col gap-6">
      {nurseryClasses.map(nc => (
        <div key={nc.id} className="bg-bg-state-soft rounded-md p-1">
          <div className="flex items-center justify-between px-5 py-2">
            <div className="text-text-default text-sm font-medium">Nusery </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => onOpenDelete?.({ id: nc.id, name: "Nusery" })}
                className="bg-bg-state-secondary! hover:bg-bg-none! flex h-7! w-7! items-center justify-center rounded-md p-2"
              >
                <DeleteBin fill="var(--color-icon-destructive)" className="bg-bg-" />
              </Button>
              <Button className="bg-bg-state-secondary! hover:bg-bg-none! text-text-default flex h-7! items-center justify-center rounded-md p-2">
                <Edit fill="var(--color-icon-default-muted)" className="bg-bg-" /> Edit
              </Button>
            </div>
          </div>
          <div className="bg-bg-card border-border-darker flex flex-col gap-4 rounded-md border p-2 md:px-5 md:py-6">
            <div className="">
              <div className="text-text-default mb-3 flex items-center gap-2 text-sm font-medium">
                {" "}
                <BookFill fill="var(--color-bg-basic-blue-accent)" /> Subjects
              </div>
              <div className="border-border-default flex flex-wrap gap-3 border-b pb-4">
                {["English Language", "English Language2", "English Language3", "English Language4"].map((sub, i) => (
                  <Badge key={i} className="bg-bg-badge-gray! text-text-default flex h-6! items-center gap-3 rounded-md p-1 text-xs">
                    {sub}
                  </Badge>
                ))}
              </div>
              <div className="text-text-default my-2 flex items-center gap-2 text-sm font-medium">
                {" "}
                <GitMergeFill fill="var(--color-bg-basic-blue-accent)" /> Arm
              </div>

              <div className="flex flex-wrap gap-1">
                {["A", "B", "C"].map(arm => (
                  <div key={arm} className="">
                    <div className="text-text-subtle bg-bg-badge-gray flex h-6! w-6! items-center justify-center rounded-md text-sm font-medium">
                      {arm}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// export const SecondarySetup = ({ onOpenDelete }: { onOpenDelete?: (target?: { id: string; name?: string }) => void }) => {
//   const secondaryClasses = [
//     { id: "ss1", name: "SS 1", hasDelete: true },
//     { id: "ss2", name: "SS 1", hasDelete: true },
//   ];
//   return (
//     <div className="mt-8 flex flex-col gap-6">
//       {secondaryClasses.map(sc => (
//         <div key={sc.id} className="bg-bg-state-soft rounded-md p-1">
//           <div className="flex items-center justify-between px-5 py-2">
//             <div className="text-text-default text-sm font-medium">{sc.name} </div>
//             <div className="flex items-center gap-2">
//               {sc.hasDelete ? (
//                 <Button
//                   onClick={() => onOpenDelete?.({ id: sc.id, name: sc.name })}
//                   className="bg-bg-state-secondary! hover:bg-bg-none! flex h-7! w-7! items-center justify-center rounded-md p-2"
//                 >
//                   <DeleteBin fill="var(--color-icon-destructive)" className="bg-bg-" />
//                 </Button>
//               ) : (
//                 <Button className="bg-bg-state-secondary! hover:bg-bg-none! flex h-7! w-7! items-center justify-center rounded-md p-2">
//                   <DeleteBin fill="var(--color-icon-destructive)" className="bg-bg-" />
//                 </Button>
//               )}
//               <Button className="bg-bg-state-secondary! hover:bg-bg-none! text-text-default flex h-7! items-center justify-center rounded-md p-2">
//                 <Edit fill="var(--color-icon-default-muted)" className="bg-bg-" /> Edit
//               </Button>
//             </div>
//           </div>
//           <div className="bg-bg-card border-border-darker flex flex-col gap-4 rounded-md border p-2 md:px-5 md:py-2">
//             <div className="p-3">
//               <div className="text-text-default mb-3 flex items-center gap-2 text-sm font-medium">
//                 {" "}
//                 <GraduationCapFill fill="var(--color-bg-basic-blue-accent) " className="size-4" /> Departments
//               </div>
//               <div className="border-border-default flex flex-wrap gap-3 border-b pb-4">
//                 {["English Language", "English Language", "English Language", "English Language"].map(sub => (
//                   <Badge key={sub} className="bg-bg-badge-gray! text-text-default flex h-6! items-center gap-3 rounded-md p-1 text-xs">
//                     {sub}
//                   </Badge>
//                 ))}
//               </div>

//               <div className="text-text-default my-3 flex items-center gap-2 text-sm font-medium">
//                 {" "}
//                 <BookFill fill="var(--color-bg-basic-blue-accent)" />
//                 Art Subjects
//               </div>
//               <div className="border-border-default flex flex-wrap gap-3 border-b pb-4">
//                 {["English Language", "English Language", "English Language", "English Language"].map(sub => (
//                   <Badge key={sub} className="bg-bg-badge-gray! text-text-default flex h-6! items-center gap-3 rounded-md p-1 text-xs">
//                     {sub}
//                   </Badge>
//                 ))}
//               </div>

//               <div className="text-text-default my-3 flex items-center gap-2 text-sm font-medium">
//                 {" "}
//                 <BookFill fill="var(--color-bg-basic-blue-accent)" />
//                 Commercial Subjects
//               </div>
//               <div className="border-border-default flex flex-wrap gap-3 border-b pb-4">
//                 {["English Language", "English Language", "English Language", "English Language"].map(sub => (
//                   <Badge key={sub} className="bg-bg-badge-gray! text-text-default flex h-6! items-center gap-3 rounded-md p-1 text-xs">
//                     {sub}
//                   </Badge>
//                 ))}
//               </div>

//               <div className="text-text-default my-3 flex items-center gap-2 text-sm font-medium">
//                 {" "}
//                 <BookFill fill="var(--color-bg-basic-blue-accent)" />
//                 Science Subjects
//               </div>
//               <div className="border-border-default flex flex-wrap gap-3 border-b pb-4">
//                 {["English Language", "English Language", "English Language", "English Language"].map(sub => (
//                   <Badge key={sub} className="bg-bg-badge-gray! text-text-default flex h-6! items-center gap-3 rounded-md p-1 text-xs">
//                     {sub}
//                   </Badge>
//                 ))}
//               </div>

//               <div className="text-text-default my-2 flex items-center gap-2 text-sm font-medium">
//                 <GitMergeFill fill="var(--color-bg-basic-blue-accent)" /> Arm
//               </div>

//               <div className="flex flex-wrap gap-1">
//                 {["A", "B", "C"].map(arm => (
//                   <div key={arm} className="">
//                     <div className="text-text-subtle bg-bg-badge-gray flex h-6! w-6! items-center justify-center rounded-md text-sm font-medium">
//                       {arm}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };
