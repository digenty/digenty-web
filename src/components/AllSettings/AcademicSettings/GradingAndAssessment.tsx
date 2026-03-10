"use client";

import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useForm, useFieldArray, UseFormReturn } from "react-hook-form";
import Loader2Fill from "@/components/Icons/Loader2Fill";
import { Toggle } from "@/components/Toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AddFill } from "@/components/Icons/AddFill";
import { Input } from "@/components/ui/input";
import { DeleteBin2 } from "@/components/Icons/DeleteBin2";
import { GradingAndAssessmentSheet, LevelFormValues } from "./GradingAndAssessmentSheet";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Label } from "@/components/ui/label";
import BookOpen from "@/components/Icons/BookOpen";
import School from "@/components/Icons/School";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/Toast";
import { useAddAssessmentDefault, useAddAssessment } from "@/hooks/queryHooks/useAssessment";
import { useAddGradingDefault, useAddGrading } from "@/hooks/queryHooks/useGrading";
import { Branch } from "@/api/types";

// TODO: replace with real levelIds from API when ready
const LEVEL_TABS = [
  { label: "Nursery", levelId: 1 },
  { label: "Primary", levelId: 2 },
  { label: "Secondary", levelId: 3 },
] as const;

export type GradingAndAssessmentHandle = {
  submit: () => Promise<boolean>;
};

type LevelFormHandle = {
  submit: () => Promise<LevelSubmitResult | null | undefined>;
  reset: (values: LevelFormValues) => void;
};

type LevelSubmitResult = {
  levelId: number;
  values: LevelFormValues;
};

type AssessmentRow = { name: string; weight: string };
type GradeRow = { grade: string; upperLimit: string; lowerLimit: string; remark: string };

type BranchSubmitResult = {
  branchId: number;
  levelResults: LevelSubmitResult[];
};

type BranchFormHandle = {
  submit: () => Promise<BranchSubmitResult | null>;
  applyToAll: (values: LevelFormValues) => void;
};

type BranchFormPanelProps = {
  branchId: number;
  isActive: boolean;
};
export type { LevelFormValues };
type LevelTabsContainerProps = {
  levelRefs: Record<number, React.RefObject<LevelFormHandle>>;
  onApplyToAll: (values: LevelFormValues) => void;
};

const emptyAssessmentRow = (): AssessmentRow => ({ name: "", weight: "" });
const emptyGradeRow = (): GradeRow => ({ grade: "", upperLimit: "", lowerLimit: "", remark: "" });

const emptyFormValues = (): LevelFormValues => ({
  assessments: [emptyAssessmentRow()],
  grades: [emptyGradeRow()],
});

const getTotalWeight = (assessments: AssessmentRow[]) => assessments.reduce((sum, a) => sum + (parseFloat(a.weight) || 0), 0);

const isLevelTouched = (values: LevelFormValues): boolean =>
  values.assessments.some(a => a.name.trim() || a.weight.trim()) ||
  values.grades.some(g => g.grade.trim() || g.upperLimit.trim() || g.lowerLimit.trim() || g.remark.trim());

const AssessmentFields = ({ form }: { form: UseFormReturn<LevelFormValues> }) => {
  const { control, register, watch } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "assessments" });
  const totalWeight = getTotalWeight(watch("assessments"));
  const isOverWeight = totalWeight > 100;

  return (
    <div className="bg-bg-state-soft rounded-md p-2">
      <div className="text-text-default text-md px-4 py-2 font-semibold">Assessment</div>
      <div className="bg-bg-card border-border-default rounded-md border px-5 py-6">
        <div className="flex flex-col gap-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center justify-between gap-2">
              <Input
                {...register(`assessments.${index}.name`)}
                className="bg-bg-input-soft! text-text-default h-9! flex-1 border-none"
                placeholder="Continuous Assessment 1"
              />
              <div className="bg-bg-input-soft flex h-9 w-17 items-center gap-1 rounded-md p-1">
                <Input
                  {...register(`assessments.${index}.weight`)}
                  className="text-text-default h-7! w-full border-none bg-none! p-0"
                  placeholder="20"
                  type="number"
                />
                <span className="text-text-muted">%</span>
              </div>
              <Button type="button" onClick={() => remove(index)} className="bg-bg-state-soft! hover:bg-bg-state-soft-hover! w-fit">
                <DeleteBin2 fill="var(--color-icon-default-subtle)" />
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Button type="button" className="text-text-subtle hover:bg-bg-none! w-fit bg-none! text-sm" onClick={() => append(emptyAssessmentRow())}>
            <AddFill fill="var(--color-icon-default-muted)" /> Add Continuous Assessment
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-text-subtle text-sm">Total Weight</span>
            <span className={cn("text-sm font-medium", isOverWeight ? "text-text-destructive" : "text-text-default")}>{totalWeight}%</span>
          </div>
        </div>
        {isOverWeight && <p className="text-text-destructive mt-2 text-xs">Total assessment weight cannot exceed 100%</p>}
      </div>
    </div>
  );
};

const GradingFields = ({ form }: { form: UseFormReturn<LevelFormValues> }) => {
  const { control, register } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "grades" });

  return (
    <div className="bg-bg-state-soft overflow-x-auto rounded-md p-2">
      <div className="text-text-default text-md px-4 py-2 font-semibold">Grading</div>

      {/* Desktop */}
      <div className="bg-bg-card border-border-default hidden w-full rounded-md border px-5 py-6 md:block">
        <table className="w-full border-none">
          <thead>
            <tr>
              <th className="text-text-muted px-3 py-2 text-left text-sm font-medium">Grade</th>
              <th className="text-text-muted px-3 py-2 text-left text-sm font-medium">Score</th>
              <th />
              <th />
              <th className="text-text-muted w-full px-3 py-2 text-left text-sm font-medium">Remark</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <tr key={field.id}>
                <td className="px-3 py-2">
                  <div className="bg-bg-input-soft flex h-9 w-27 items-center rounded-md px-2">
                    <Input
                      {...register(`grades.${index}.grade`)}
                      type="text"
                      placeholder="A"
                      className="text-text-default h-7! w-full border-none bg-transparent p-0"
                    />
                  </div>
                </td>
                <td className="px-3 py-2">
                  <div className="bg-bg-input-soft flex h-9 w-27 items-center rounded-md px-2">
                    <Input
                      {...register(`grades.${index}.lowerLimit`)}
                      type="number"
                      placeholder="70"
                      className="text-text-default h-7! w-full border-none bg-transparent p-0"
                    />
                  </div>
                </td>
                <td className="text-text-subtle w-1">-</td>
                <td className="px-3 py-2">
                  <div className="bg-bg-input-soft flex h-9 w-27 items-center rounded-md px-2">
                    <Input
                      {...register(`grades.${index}.upperLimit`)}
                      type="number"
                      placeholder="100"
                      className="text-text-default h-7! w-full border-none bg-transparent p-0"
                    />
                  </div>
                </td>
                <td className="w-full px-3 py-2">
                  <Input
                    {...register(`grades.${index}.remark`)}
                    className="bg-bg-input-soft! text-text-default h-9! w-full border-none"
                    placeholder="Excellent"
                  />
                </td>
                <td className="px-3 py-2">
                  <Button type="button" onClick={() => remove(index)} className="bg-bg-state-soft! hover:bg-bg-state-soft-hover! h-8 w-8 p-0">
                    <DeleteBin2 fill="var(--color-icon-default-subtle)" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="flex flex-col gap-2 md:hidden">
        {fields.map((field, index) => (
          <div key={field.id} className="bg-bg-card border-border-default flex w-full flex-col gap-3 rounded-md border px-5 py-6">
            <div className="flex flex-col gap-1">
              <Label className="text-text-default text-sm font-medium">Grade</Label>
              <Input
                {...register(`grades.${index}.grade`)}
                type="text"
                placeholder="A"
                className="text-text-default bg-bg-input-soft! h-7! w-full border-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">Score</Label>
              <div className="flex w-full items-center gap-2">
                <Input
                  {...register(`grades.${index}.lowerLimit`)}
                  type="number"
                  placeholder="70"
                  className="text-text-default bg-bg-input-soft! h-7! w-full border-none"
                />
                <span className="text-text-default text-xs">to</span>
                <Input
                  {...register(`grades.${index}.upperLimit`)}
                  type="number"
                  placeholder="100"
                  className="text-text-default bg-bg-input-soft! h-7! w-full border-none"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">Remark</Label>
              <Input
                {...register(`grades.${index}.remark`)}
                className="bg-bg-input-soft! text-text-default h-7! w-full border-none"
                placeholder="Excellent"
              />
            </div>
            <Button type="button" onClick={() => remove(index)} className="bg-bg-state-soft! hover:bg-bg-state-soft-hover! h-8 w-8 p-0">
              <DeleteBin2 fill="var(--color-icon-default-subtle)" />
            </Button>
          </div>
        ))}
      </div>

      <Button type="button" className="text-text-subtle hover:bg-bg-none! mt-2 w-fit bg-none! text-sm" onClick={() => append(emptyGradeRow())}>
        <AddFill fill="var(--color-icon-default-muted)" /> Add Grade Row
      </Button>
    </div>
  );
};

type LevelFormPanelProps = {
  levelId: number;
  isActive: boolean;
};

const LevelFormPanel = forwardRef<LevelFormHandle, LevelFormPanelProps>(({ levelId, isActive }, ref) => {
  const form = useForm<LevelFormValues>({ defaultValues: emptyFormValues() });

  useImperativeHandle(ref, () => ({
    submit: () =>
      new Promise<LevelSubmitResult | null | undefined>(resolve => {
        const values = form.getValues();
        if (!isLevelTouched(values)) {
          resolve(null);
          return;
        }

        form.handleSubmit(
          filledValues => resolve({ levelId, values: filledValues }),
          () => resolve(undefined),
        )();
      }),

    reset: (values: LevelFormValues) => {
      form.reset(values);
    },
  }));

  return (
    <div className={isActive ? "block" : "hidden"}>
      <div className="flex flex-col gap-6">
        <AssessmentFields form={form} />
        <GradingFields form={form} />
      </div>
    </div>
  );
});

LevelFormPanel.displayName = "LevelFormPanel";

const LevelTabsContainer = ({ levelRefs, onApplyToAll }: LevelTabsContainerProps) => {
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = React.useState(0);

  return (
    <div className="w-full">
      {isMobile ? (
        <div className="w-full">
          <Label className="text-text-default mb-2 text-sm font-medium">
            <BookOpen fill="var(--color-icon-default-muted)" /> Select Level
          </Label>
          <Select value={String(activeIndex)} onValueChange={v => setActiveIndex(Number(v))}>
            <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-sm">
              <SelectValue>
                <span className="text-text-default text-sm">{LEVEL_TABS[activeIndex].label}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-bg-default border-border-default">
              {LEVEL_TABS.map((tab, idx) => (
                <SelectItem key={tab.levelId} value={String(idx)} className="text-text-default text-sm">
                  {tab.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div className="flex w-full items-center justify-between">
          <div className="bg-bg-state-soft flex w-fit items-center gap-2.5 rounded-full p-0.5">
            {LEVEL_TABS.map((tab, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={tab.levelId}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "flex items-center gap-1 px-4 py-2 text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-bg-state-secondary border-border-darker text-text-default h-8 justify-center rounded-full border shadow-sm"
                      : "text-text-muted h-8",
                  )}
                >
                  <span>{tab.label}</span>
                  <span className="flex items-center">
                    {isActive ? (
                      <Loader2Fill fill="var(--color-icon-informative)" className="size-4" />
                    ) : (
                      <Loader2Fill fill="var(--color-icon-default-muted)" className="size-4" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          <GradingAndAssessmentSheet onApplyToAll={onApplyToAll} />
        </div>
      )}

      {isMobile && (
        <div className="mt-3">
          <GradingAndAssessmentSheet onApplyToAll={onApplyToAll} />
        </div>
      )}

      <div className="mt-8">
        {LEVEL_TABS.map((tab, index) => (
          <LevelFormPanel key={tab.levelId} ref={levelRefs[tab.levelId]} levelId={tab.levelId} isActive={activeIndex === index} />
        ))}
      </div>
    </div>
  );
};

const BranchFormPanel = forwardRef<BranchFormHandle, BranchFormPanelProps>(({ branchId, isActive }, ref) => {
  const levelRefs = useRef<Record<number, React.RefObject<LevelFormHandle>>>(
    Object.fromEntries(LEVEL_TABS.map(tab => [tab.levelId, React.createRef<LevelFormHandle>()])),
  );

  const applyToAll = (values: LevelFormValues) => {
    LEVEL_TABS.forEach(tab => levelRefs.current[tab.levelId].current?.reset(values));
  };

  useImperativeHandle(ref, () => ({
    submit: async (): Promise<BranchSubmitResult | null> => {
      const results = await Promise.all(LEVEL_TABS.map(tab => levelRefs.current[tab.levelId].current?.submit()));

      if (results.some(r => r === undefined)) return null;

      const filled = results.filter((r): r is LevelSubmitResult => r !== null && r !== undefined);
      return { branchId, levelResults: filled };
    },
    applyToAll,
  }));

  return (
    <div className={isActive ? "block" : "hidden"}>
      <LevelTabsContainer levelRefs={levelRefs.current} onApplyToAll={applyToAll} />
    </div>
  );
});

BranchFormPanel.displayName = "BranchFormPanel";

const BranchTabSwitch = ({
  activeTab,
  setActiveTab,
  branches,
  isLoading,
}: {
  activeTab: string;
  setActiveTab: (t: string) => void;
  branches: Branch[];
  isLoading: boolean;
}) => {
  const isMobile = useIsMobile();

  if (isLoading) return <Skeleton className="bg-bg-input-soft h-9 w-full md:w-64" />;

  if (isMobile) {
    return (
      <div className="w-full">
        <Label className="text-text-default mb-2 text-sm font-medium">
          <School fill="var(--color-icon-default-muted)" /> Select Branch
        </Label>
        <Select value={activeTab} onValueChange={setActiveTab}>
          <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-sm">
            <SelectValue>
              <span className="text-text-default text-sm">{branches.find(b => String(b.id) === activeTab)?.name ?? ""}</span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-bg-default border-border-default">
            {branches.map(branch => (
              <SelectItem key={branch.id} value={String(branch.id)} className="text-text-default text-sm">
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {branches.map(branch => {
        const isActive = activeTab === String(branch.id);
        return (
          <Button
            key={branch.id}
            type="button"
            onClick={() => setActiveTab(String(branch.id))}
            className={cn(
              "hover:bg-bg-none! cursor-pointer rounded-none py-2.5 transition-all duration-150",
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
};

export const GradingAndAssessment = forwardRef<GradingAndAssessmentHandle>((_, ref) => {
  const [activeTab, setActiveTab] = React.useState<string>("");
  const [forBranch, setForBranch] = React.useState(false);

  const { data, isLoading } = useGetBranches();
  const branches = data?.data?.content ?? [];

  const defaultLevelRefs = useRef<Record<number, React.RefObject<LevelFormHandle>>>(
    Object.fromEntries(LEVEL_TABS.map(tab => [tab.levelId, React.createRef<LevelFormHandle>()])),
  );

  const branchPanelRefs = useRef<Record<string, React.RefObject<BranchFormHandle>>>({});
  branches.forEach(branch => {
    const key = String(branch.id);
    if (!branchPanelRefs.current[key]) {
      branchPanelRefs.current[key] = React.createRef<BranchFormHandle>();
    }
  });

  const { mutateAsync: submitAssessmentDefault } = useAddAssessmentDefault();
  const { mutateAsync: submitAssessment } = useAddAssessment();
  const { mutateAsync: submitGradingDefault } = useAddGradingDefault();
  const { mutateAsync: submitGrading } = useAddGrading();

  const handleDefaultApplyToAll = (values: LevelFormValues) => {
    LEVEL_TABS.forEach(tab => defaultLevelRefs.current[tab.levelId].current?.reset(values));
  };

  useEffect(() => {
    if (branches.length > 0 && !activeTab) {
      setActiveTab(String(branches[0].id));
    }
  }, [branches, activeTab]);

  useImperativeHandle(ref, () => ({
    submit: async (): Promise<boolean> => {
      try {
        if (!forBranch) {
          const results = await Promise.all(LEVEL_TABS.map(tab => defaultLevelRefs.current[tab.levelId].current?.submit()));
          if (results.some(r => r === undefined)) {
            toast({
              title: "Please complete all fields",
              description: "If you've started filling a level, all its fields must be completed.",
              type: "warning",
            });
            return false;
          }

          const filled = results.filter((r): r is LevelSubmitResult => r !== null && r !== undefined);

          if (filled.length === 0) {
            toast({
              title: "At least one level required",
              description: "Please fill in assessment and grading for at least one level.",
              type: "warning",
            });
            return false;
          }

          if (filled.some(r => getTotalWeight(r.values.assessments) > 100)) {
            toast({ title: "Assessment weight error", description: "Total assessment weight cannot exceed 100%.", type: "error" });
            return false;
          }

          await Promise.all(
            branches.flatMap(branch =>
              filled.flatMap(({ values }) => [
                submitAssessmentDefault({
                  branchId: branch.id,
                  createAssessmentDtoLists: values.assessments.map(a => ({
                    name: a.name,
                    weight: parseFloat(a.weight),
                    assessmentType: "CONTINUOUS_ASSESSMENT" as const,
                  })),
                }),
                submitGradingDefault({
                  branchId: branch.id,
                  gradingDtoList: values.grades.map(g => ({
                    grade: g.grade,
                    upperLimit: parseFloat(g.upperLimit),
                    lowerLimit: parseFloat(g.lowerLimit),
                    remark: g.remark,
                  })),
                }),
              ]),
            ),
          );
        } else {
          if (branches.length === 0) {
            toast({ title: "No branches found", description: "Please add branches before setting up grading.", type: "error" });
            return false;
          }

          const branchResults = await Promise.all(branches.map(branch => branchPanelRefs.current[String(branch.id)].current?.submit()));

          if (branchResults.some(r => r === null || r === undefined)) {
            toast({ title: "Please complete all fields", description: "All branches must have at least one level completed.", type: "warning" });
            return false;
          }

          const validResults = branchResults.filter((r): r is BranchSubmitResult => r != null);

          if (validResults.some(br => br.levelResults.some(lr => getTotalWeight(lr.values.assessments) > 100))) {
            toast({ title: "Assessment weight error", description: "Total assessment weight cannot exceed 100%.", type: "error" });
            return false;
          }

          await Promise.all(
            validResults.flatMap(({ branchId, levelResults }) =>
              levelResults.flatMap(({ levelId, values }) => [
                submitAssessment({
                  branchId,
                  levelId,
                  createAssessmentDtoList: values.assessments.map(a => ({
                    name: a.name,
                    weight: parseFloat(a.weight),
                    assessmentType: "CONTINUOUS_ASSESSMENT" as const,
                  })),
                }),
                submitGrading({
                  branchId,
                  levelId,
                  gradingDtoList: values.grades.map(g => ({
                    grade: g.grade,
                    upperLimit: parseFloat(g.upperLimit),
                    lowerLimit: parseFloat(g.lowerLimit),
                    remark: g.remark,
                  })),
                }),
              ]),
            ),
          );
        }

        toast({ title: "Grading & Assessment saved", description: "Your setup has been saved successfully.", type: "success" });
        return true;
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
        toast({
          title: "Failed to save grading & assessment",
          description: message,
          type: "error",
        });
        return false;
      }
    },
  }));

  return (
    <div className="mx-auto flex w-full flex-col gap-4 px-4 lg:px-36">
      <div className="bg-bg-subtle border-border-default mb-5 flex w-full items-start justify-between rounded-md border p-4">
        <div>
          <div className="text-text-default text-md font-semibold">Do academic structures differ by school branch?</div>
          <div className="text-text-subtle text-sm font-normal">Turn ON for branch-specific structures. Keep OFF to share one setup.</div>
        </div>
        <Toggle checked={forBranch} onChange={e => setForBranch((e.target as HTMLInputElement).checked)} />
      </div>

      {!forBranch && <LevelTabsContainer levelRefs={defaultLevelRefs.current} onApplyToAll={handleDefaultApplyToAll} />}
      {forBranch && (
        <>
          <div className="border-border-default mb-5 w-full border-b md:w-fit">
            <BranchTabSwitch activeTab={activeTab} setActiveTab={setActiveTab} branches={branches} isLoading={isLoading} />
          </div>

          {branches.map(branch => (
            <BranchFormPanel
              key={branch.id}
              ref={branchPanelRefs.current[String(branch.id)]}
              branchId={branch.id}
              isActive={activeTab === String(branch.id)}
            />
          ))}
        </>
      )}
    </div>
  );
});

GradingAndAssessment.displayName = "GradingAndAssessment";
