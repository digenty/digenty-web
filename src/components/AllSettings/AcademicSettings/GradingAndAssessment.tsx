"use client";

import { AddFill } from "@/components/Icons/AddFill";
import BookOpen from "@/components/Icons/BookOpen";
import { DeleteBin2 } from "@/components/Icons/DeleteBin2";
import Loader2Fill from "@/components/Icons/Loader2Fill";
import School from "@/components/Icons/School";
import { toast } from "@/components/Toast";
import { Toggle } from "@/components/Toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddAssessment, useAddAssessmentDefault } from "@/hooks/queryHooks/useAssessment";
import { useAddGrading, useAddGradingDefault } from "@/hooks/queryHooks/useGrading";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import { FieldArray, FormikProvider, useFormik } from "formik";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { GradingAndAssessmentSheet, LevelFormValues } from "./GradingAndAssessmentSheet";

import {
  AssessmentRow,
  BranchFormHandle,
  BranchFormPanelProps,
  Level,
  BranchSubmitResult,
  GradeRow,
  LevelFormHandle,
  LevelSubmitResult,
  LevelTab,
  LevelTabsContainerProps,
} from "@/api/types";
import { useGetLevels } from "@/hooks/queryHooks/useLevel";
import { levelFormSchema } from "@/schema/academic";

export type GradingAndAssessmentHandle = {
  submit: () => Promise<boolean>;
};

export type { LevelFormValues };

const emptyAssessmentRow = (): AssessmentRow => ({ name: "", weight: "" });
const emptyGradeRow = (): GradeRow => ({ grade: "", upperLimit: "", lowerLimit: "", remark: "" });
const emptyFormValues = (): LevelFormValues => ({ assessments: [emptyAssessmentRow()], grades: [emptyGradeRow()] });

const getTotalWeight = (assessments: AssessmentRow[]) => assessments.reduce((sum, a) => sum + (parseFloat(a.weight) || 0), 0);
const isLevelTouched = (values: LevelFormValues): boolean =>
  values.assessments.some(a => a.name.trim() !== "" || a.weight.trim() !== "") ||
  values.grades.some(g => g.grade.trim() !== "" || g.upperLimit.trim() !== "" || g.lowerLimit.trim() !== "" || g.remark.trim() !== "");

type AssessmentFieldsProps = {
  values: LevelFormValues;
  handleChange: React.ChangeEventHandler;
  handleBlur: React.FocusEventHandler;
};

const AssessmentFields = ({ values, handleChange, handleBlur }: AssessmentFieldsProps) => {
  const totalWeight = getTotalWeight(values.assessments);
  const isOverWeight = totalWeight > 100;

  return (
    <div className="bg-bg-state-soft rounded-md p-2">
      <div className="text-text-default text-md px-4 py-2 font-semibold">Assessment</div>
      <div className="bg-bg-card border-border-default rounded-md border px-5 py-6">
        <FieldArray name="assessments">
          {({ remove, push }) => (
            <>
              <div className="flex flex-col gap-4">
                {values.assessments.map((_, index) => (
                  <div key={index} className="flex items-center justify-between gap-2">
                    <Input
                      name={`assessments.${index}.name`}
                      value={values.assessments[index].name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="bg-bg-input-soft! text-text-default h-9! flex-1 border-none text-sm"
                      placeholder="Continuous Assessment 1"
                    />
                    <div className="bg-bg-input-soft flex h-9 w-17 items-center gap-1 rounded-md p-1">
                      <Input
                        name={`assessments.${index}.weight`}
                        value={values.assessments[index].weight}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="text-text-default h-7! w-full border-none bg-none! text-sm"
                        placeholder="20"
                      />
                      <span className="text-text-muted w-3">%</span>
                    </div>
                    <Button type="button" onClick={() => remove(index)} className="bg-bg-state-soft! hover:bg-bg-state-soft-hover! w-fit">
                      <DeleteBin2 fill="var(--color-icon-default-subtle)" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <Button
                  type="button"
                  className="text-text-subtle hover:bg-bg-none! w-fit bg-none! text-sm"
                  onClick={() => push(emptyAssessmentRow())}
                >
                  <AddFill fill="var(--color-icon-default-muted)" className="size-3" /> Add Continuous Assessment
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-text-subtle text-sm">Total Weight</span>
                  <span className={cn("text-sm font-medium", isOverWeight ? "text-text-destructive" : "text-text-default")}>{totalWeight}%</span>
                </div>
              </div>
              {isOverWeight && <p className="text-text-destructive mt-2 text-xs">Total assessment weight cannot exceed 100%</p>}
            </>
          )}
        </FieldArray>
      </div>
    </div>
  );
};

type GradingFieldsProps = {
  values: LevelFormValues;
  handleChange: React.ChangeEventHandler;
  handleBlur: React.FocusEventHandler;
};

const GradingFields = ({ values, handleChange, handleBlur }: GradingFieldsProps) => {
  const isMobile = useIsMobile();

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
            <FieldArray name="grades">
              {({ remove, push }) => (
                <>
                  {values.grades.map((_, index) => (
                    <tr key={index}>
                      <td className="px-3 py-2">
                        <div className="bg-bg-input-soft flex h-9 w-27 items-center rounded-md px-2">
                          <Input
                            name={`grades.${index}.grade`}
                            value={values.grades[index].grade}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            type="text"
                            placeholder="A"
                            className="text-text-default h-7! w-full border-none bg-transparent"
                          />
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="bg-bg-input-soft flex h-9 w-27 items-center rounded-md px-2">
                          <Input
                            name={`grades.${index}.lowerLimit`}
                            value={values.grades[index].lowerLimit}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            type="number"
                            placeholder="70"
                            className="text-text-default h-7! w-full border-none bg-transparent"
                          />
                        </div>
                      </td>
                      <td className="text-text-subtle w-1">-</td>
                      <td className="px-3 py-2">
                        <div className="bg-bg-input-soft flex h-9 w-27 items-center rounded-md px-2">
                          <Input
                            name={`grades.${index}.upperLimit`}
                            value={values.grades[index].upperLimit}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            type="number"
                            placeholder="100"
                            className="text-text-default h-7! w-full border-none bg-transparent"
                          />
                        </div>
                      </td>
                      <td className="w-full px-3 py-2">
                        <Input
                          name={`grades.${index}.remark`}
                          value={values.grades[index].remark}
                          onChange={handleChange}
                          onBlur={handleBlur}
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
                  <tr>
                    <td colSpan={6} className="px-3 pt-4">
                      <Button
                        type="button"
                        className="text-text-subtle hover:bg-bg-none! w-fit bg-none! text-sm"
                        onClick={() => push(emptyGradeRow())}
                      >
                        <AddFill fill="var(--color-icon-default-muted)" className="size-3" /> Add Grade Row
                      </Button>
                    </td>
                  </tr>
                </>
              )}
            </FieldArray>
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="flex flex-col gap-2 md:hidden">
        <FieldArray name="grades">
          {({ remove, push }) => (
            <>
              {values.grades.map((_, index) => (
                <div key={index} className="bg-bg-card border-border-default flex w-full flex-col gap-3 rounded-md border px-5 py-6">
                  <div className="flex flex-col gap-1">
                    <Label className="text-text-default text-sm font-medium">Grade</Label>
                    <Input
                      name={`grades.${index}.grade`}
                      value={values.grades[index].grade}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="text"
                      placeholder="A"
                      className="text-text-default bg-bg-input-soft! h-7! w-full border-none text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-text-default text-sm font-medium">Score</Label>
                    <div className="flex w-full items-center gap-2">
                      <Input
                        name={`grades.${index}.lowerLimit`}
                        value={values.grades[index].lowerLimit}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type="number"
                        placeholder="70"
                        className="text-text-default bg-bg-input-soft! h-7! w-full border-none text-sm"
                      />
                      <span className="text-text-default text-xs">to</span>
                      <Input
                        name={`grades.${index}.upperLimit`}
                        value={values.grades[index].upperLimit}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type="number"
                        placeholder="100"
                        className="text-text-default bg-bg-input-soft! h-7! w-full border-none text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-text-default text-sm font-medium">Remark</Label>
                    <Input
                      name={`grades.${index}.remark`}
                      value={values.grades[index].remark}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="bg-bg-input-soft! text-text-default h-7! w-full border-none"
                      placeholder="Excellent"
                    />
                  </div>
                  <Button type="button" onClick={() => remove(index)} className="bg-bg-state-soft! hover:bg-bg-state-soft-hover! h-8 w-8 p-0">
                    <DeleteBin2 fill="var(--color-icon-default-subtle)" />
                  </Button>
                </div>
              ))}
              <Button type="button" className="text-text-subtle hover:bg-bg-none! mt-2 w-fit bg-none! text-sm" onClick={() => push(emptyGradeRow())}>
                <AddFill fill="var(--color-icon-default-muted)" /> Add Grade Row
              </Button>
            </>
          )}
        </FieldArray>
      </div>
    </div>
  );
};

type LevelFormPanelProps = { levelId: number; isActive: boolean };

const LevelFormPanel = forwardRef<LevelFormHandle, LevelFormPanelProps>(({ levelId, isActive }, ref) => {
  const formik = useFormik<LevelFormValues>({
    initialValues: emptyFormValues(),
    validationSchema: levelFormSchema,
    onSubmit: () => {},
  });

  useImperativeHandle(ref, () => ({
    submit: async (): Promise<LevelSubmitResult | null | undefined> => {
      if (!isLevelTouched(formik.values)) return null;

      const errors = await formik.validateForm();
      if (Object.keys(errors).length > 0) {
        formik.setTouched({
          assessments: formik.values.assessments.map(() => ({ name: true, weight: true })),
          grades: formik.values.grades.map(() => ({ grade: true, upperLimit: true, lowerLimit: true, remark: true })),
        });
        return undefined;
      }
      return { levelId, values: formik.values };
    },
    reset: (values: LevelFormValues) => {
      formik.resetForm({ values });
    },
  }));

  return (
    <div className={isActive ? "block" : "hidden"}>
      <FormikProvider value={formik}>
        <div className="flex flex-col gap-6">
          <AssessmentFields values={formik.values} handleChange={formik.handleChange} handleBlur={formik.handleBlur} />
          <GradingFields values={formik.values} handleChange={formik.handleChange} handleBlur={formik.handleBlur} />
        </div>
      </FormikProvider>
    </div>
  );
});

LevelFormPanel.displayName = "LevelFormPanel";

const LevelTabsContainer = ({ levelTabs, levelRefs, onApplyToAll }: LevelTabsContainerProps) => {
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = React.useState(0);

  if (levelTabs.length === 0) return null;

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
                <span className="text-text-default text-sm capitalize">{levelTabs[activeIndex]?.label.replaceAll("_", " ").toLowerCase()}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-bg-default border-border-default">
              {levelTabs.map((tab, idx) => (
                <SelectItem key={tab.levelId} value={String(idx)} className="text-text-default text-sm capitalize">
                  {tab.label.replaceAll("_", " ").toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div className="flex w-full items-center justify-between">
          <div className="bg-bg-state-soft flex max-w-160 items-center gap-2.5 overflow-x-auto rounded-full p-0.5">
            {levelTabs.map((tab, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={tab.levelId}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "flex items-center gap-1 px-4 py-2 text-sm font-medium whitespace-nowrap capitalize transition-all duration-150",
                    isActive
                      ? "bg-bg-state-secondary border-border-darker text-text-default h-8 justify-center rounded-full border shadow-sm"
                      : "text-text-muted h-8",
                  )}
                >
                  <span>{tab.label.replaceAll("_", " ").toLowerCase()}</span>
                  <Loader2Fill fill={isActive ? "var(--color-icon-informative)" : "var(--color-icon-default-muted)"} className="size-4" />
                </button>
              );
            })}
          </div>
          <GradingAndAssessmentSheet onApplyToAll={onApplyToAll} />
        </div>
        //   <div className="h-9 w-full">
        //   <div
        //     className="bg-bg-state-soft hide-scrollbar flex max-w-150 items-center gap-2.5 overflow-x-auto rounded-full p-0.5 lg:max-w-160 xl:max-w-216"
        //     style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        //   >
        //     {levelTabs.map((tab, index) => {
        //       const isActive = index === activeIndex;

        //       return (
        //         <button
        //           key={tab.levelId}
        //           type="button"
        //           onClick={() => setActiveIndex(index)}
        //           className={cn(
        //             "transit flex shrink-0 justify-center px-4 py-2 text-sm font-medium whitespace-nowrap capitalize",
        //             isActive
        //               ? "bg-bg-state-secondary border-border-darker text-text-default flex h-8 items-center justify-center gap-1 rounded-full border shadow-sm"
        //               : "text-text-muted flex h-8 items-center gap-1",
        //           )}
        //         >
        //           <span>{tab.label.replaceAll("_", " ").toLowerCase()}</span>
        //           {isActive ? (
        //             <Loader2Fill fill="var(--color-icon-informative)" className="size-4" />
        //           ) : (
        //             <Loader2Fill fill="var(--color-icon-default-muted)" className="size-4" />
        //           )}
        //         </button>
        //       );
        //     })}
        //   </div>
        // </div>
      )}

      {isMobile && (
        <div className="mt-3">
          <GradingAndAssessmentSheet onApplyToAll={onApplyToAll} />
        </div>
      )}

      <div className="mt-8">
        {levelTabs.map((tab, index) => (
          <LevelFormPanel key={tab.levelId} ref={levelRefs[tab.levelId]} levelId={tab.levelId} isActive={activeIndex === index} />
        ))}
      </div>
    </div>
  );
};

const BranchFormPanel = forwardRef<BranchFormHandle, BranchFormPanelProps>(({ branchId, isActive, levelTabs }, ref) => {
  const levelRefs = useRef<Record<number, React.RefObject<LevelFormHandle>>>(
    Object.fromEntries(levelTabs.map(tab => [tab.levelId, React.createRef<LevelFormHandle>()])) as Record<number, React.RefObject<LevelFormHandle>>,
  );

  const applyToAll = (values: LevelFormValues) => {
    levelTabs.forEach(tab => levelRefs.current[tab.levelId]?.current?.reset(values));
  };

  useImperativeHandle(ref, () => ({
    submit: async (): Promise<BranchSubmitResult | null> => {
      const results = await Promise.all(levelTabs.map(tab => levelRefs.current[tab.levelId]?.current?.submit()));
      if (results.some(r => r === undefined)) return null;
      const filled = results.filter((r): r is LevelSubmitResult => r !== null && r !== undefined);
      return { branchId, levelResults: filled };
    },
    applyToAll,
  }));

  return (
    <div className={isActive ? "block" : "hidden"}>
      <LevelTabsContainer levelTabs={levelTabs} levelRefs={levelRefs.current} onApplyToAll={applyToAll} />
    </div>
  );
});

BranchFormPanel.displayName = "BranchFormPanel";

const BranchTabSwitch = ({
  activeTab,
  setActiveTab,
  branchLevels,
  isLoading,
}: {
  activeTab: string;
  setActiveTab: (t: string) => void;
  branchLevels: Level[];
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
              <span className="text-text-default text-sm">{branchLevels.find(b => String(b.branchId) === activeTab)?.branchName ?? ""}</span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-bg-default border-border-default">
            {branchLevels.map(b => (
              <SelectItem key={b.branchId} value={String(b.branchId)} className="text-text-default text-sm">
                {b.branchName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {branchLevels.map(b => {
        const isActive = activeTab === String(b.branchId);
        return (
          <Button
            key={b.branchId}
            type="button"
            onClick={() => setActiveTab(String(b.branchId))}
            className={cn(
              "hover:bg-bg-none! cursor-pointer rounded-none py-2.5 transition-all duration-150",
              isActive && "border-border-informative border-b-[1.5px]",
            )}
          >
            <span className={cn("text-sm font-medium", isActive ? "text-text-informative" : "text-text-muted")}>{b.branchName}</span>
            <Loader2Fill fill={isActive ? "var(--color-icon-informative)" : "var(--color-icon-default-muted)"} />
          </Button>
        );
      })}
    </div>
  );
};

export const GradingAndAssessment = forwardRef<GradingAndAssessmentHandle>((_, ref) => {
  const [activeTab, setActiveTab] = useState<string>("");
  const [forBranch, setForBranch] = useState(false);
  const { data: classLevelData, isLoading } = useGetLevels();
  const branchLevels: Level[] = classLevelData?.data ?? [];

  const dedupedLevelTabs: LevelTab[] = React.useMemo(() => {
    const seen = new Set<string>();
    const tabs: LevelTab[] = [];
    for (const b of branchLevels) {
      for (const cl of b.classLevels) {
        if (!seen.has(cl.levelType)) {
          seen.add(cl.levelType);
          tabs.push({ label: cl.levelName, levelId: cl.id, levelType: cl.levelType });
        }
      }
    }
    return tabs;
  }, [branchLevels]);

  const defaultLevelRefs = useRef<Record<number, React.RefObject<LevelFormHandle | null>>>({});
  dedupedLevelTabs.forEach(tab => {
    if (!defaultLevelRefs.current[tab.levelId]) {
      defaultLevelRefs.current[tab.levelId] = React.createRef<LevelFormHandle>();
    }
  });

  const branchPanelRefs = useRef<Record<string, React.RefObject<BranchFormHandle | null>>>({});
  branchLevels.forEach(b => {
    const key = String(b.branchId);
    if (!branchPanelRefs.current[key]) {
      branchPanelRefs.current[key] = React.createRef<BranchFormHandle | null>();
    }
  });

  const { mutateAsync: submitAssessmentDefault } = useAddAssessmentDefault();
  const { mutateAsync: submitAssessment } = useAddAssessment();
  const { mutateAsync: submitGradingDefault } = useAddGradingDefault();
  const { mutateAsync: submitGrading } = useAddGrading();

  const handleDefaultApplyToAll = (values: LevelFormValues) => {
    dedupedLevelTabs.forEach(tab => defaultLevelRefs.current[tab.levelId]?.current?.reset(values));
  };

  useEffect(() => {
    if (branchLevels.length > 0 && !activeTab) {
      setActiveTab(String(branchLevels[0].branchId));
    }
  }, [branchLevels, activeTab]);

  useImperativeHandle(ref, () => ({
    submit: async (): Promise<boolean> => {
      try {
        if (!forBranch) {
          const results = await Promise.all(dedupedLevelTabs.map(tab => defaultLevelRefs.current[tab.levelId]?.current?.submit()));

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
            filled.flatMap(({ levelId, values }) => {
              const levelType = dedupedLevelTabs.find(t => t.levelId === levelId)?.levelType;
              const targets = branchLevels.flatMap(b =>
                b.classLevels.filter(cl => cl.levelType === levelType).map(cl => ({ branchId: b.branchId, levelId: cl.id })),
              );
              return targets.flatMap(({ branchId }) => [
                submitAssessmentDefault({
                  branchId,
                  assessments: values.assessments.map(a => ({
                    name: a.name,
                    weight: parseFloat(a.weight),
                    assessmentType: "CONTINUOUS_ASSESSMENT" as const,
                  })),
                }),
                submitGradingDefault({
                  branchId,
                  gradingDtoList: values.grades.map(g => ({
                    grade: g.grade,
                    upperLimit: parseFloat(g.upperLimit),
                    lowerLimit: parseFloat(g.lowerLimit),
                    remark: g.remark,
                  })),
                }),
              ]);
            }),
          );
        } else {
          if (branchLevels.length === 0) {
            toast({ title: "No branches found", description: "Please add branches before setting up grading.", type: "error" });
            return false;
          }

          const branchResults = await Promise.all(branchLevels.map(b => branchPanelRefs.current[String(b.branchId)]?.current?.submit()));

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
                  assessments: values.assessments.map(a => ({
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
        toast({ title: "Failed to save grading & assessment", description: message, type: "error" });
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

      {isLoading && <Skeleton className="h-40 w-full" />}

      {!isLoading && !forBranch && (
        <LevelTabsContainer levelTabs={dedupedLevelTabs} levelRefs={defaultLevelRefs.current} onApplyToAll={handleDefaultApplyToAll} />
      )}

      {!isLoading && forBranch && (
        <>
          <div className="border-border-default mb-5 w-full border-b md:w-fit">
            <BranchTabSwitch activeTab={activeTab} setActiveTab={setActiveTab} branchLevels={branchLevels} isLoading={isLoading} />
          </div>

          {branchLevels.map(b => (
            <BranchFormPanel
              key={b.branchId}
              ref={branchPanelRefs.current[String(b.branchId)]}
              branchId={b.branchId}
              isActive={activeTab === String(b.branchId)}
              levelTabs={b.classLevels.map(cl => ({ label: cl.levelName, levelId: cl.id, levelType: cl.levelType }))}
            />
          ))}
        </>
      )}
    </div>
  );
});

GradingAndAssessment.displayName = "GradingAndAssessment";
