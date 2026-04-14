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
import { useAddAssessment, useUpdateAssessmentForLevel } from "@/hooks/queryHooks/useAssessment";
import { useAddGrading, useGetGradingsByLevel, useUpdateGradingsForLevel } from "@/hooks/queryHooks/useGrading";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn, extractUniqueLevelsByType } from "@/lib/utils";
import { FieldArray, FormikProvider, useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { GradingAndAssessmentSheet, LevelFormValues } from "./GradingAndAssessmentSheet";

import {
  AssessmentRow,
  AssessmentType,
  Branch,
  BranchWithClassLevels,
  ClassLevel,
  GradeRow,
  Level,
  LevelTabsContainerProps,
  SchoolGrading,
} from "@/api/types";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useGetLevels, useGetAssessmentsByLevel } from "@/hooks/queryHooks/useLevel";
import { schoolDefaultSchema } from "@/schema/academic";
import { usePathname, useRouter } from "next/navigation";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { Spinner } from "@/components/ui/spinner";

export type GradingAndAssessmentHandle = {
  submit: () => Promise<boolean>;
};

export type { LevelFormValues };

const emptyAssessmentRow = (): AssessmentRow => ({ name: "", weight: "" });
const emptyGradeRow = (): GradeRow => ({ grade: "", upperLimit: "", lowerLimit: "", remark: "" });
const emptyFormValues = (): LevelFormValues => ({ assessments: [emptyAssessmentRow()], grades: [emptyGradeRow()] });

const getTotalWeight = (assessments: AssessmentRow[]) => assessments.reduce((sum, a) => sum + (parseFloat(a.weight) || 0), 0);

type AssessmentFieldsProps = {
  values: LevelFormValues;
  handleChange: React.ChangeEventHandler;
  handleBlur: React.FocusEventHandler;
  level?: ClassLevel | null;
  branchId?: number;
  branchSpecific?: boolean;
  hasExistingAssessment?: boolean;
};

const AssessmentFields = ({ values, handleChange, handleBlur, level, branchId, branchSpecific, hasExistingAssessment }: AssessmentFieldsProps) => {
  const totalWeight = getTotalWeight(values.assessments);
  const isOverWeight = totalWeight > 100;

  const { mutateAsync: addAssessment } = useAddAssessment();
  const { mutate: updateAssessment } = useUpdateAssessmentForLevel();

  const submitAssessment = () => {
    const payload = {
      branchId,
      levelType: level?.levelType,
      branchSpecific,
      assessments: values.assessments.map(assessment => ({
        name: assessment.name,
        weight: Number(assessment.weight),
        assessmentType: "CONTINUOUS_ASSESSMENT",
      })),
    };

    if (hasExistingAssessment) {
      updateAssessment(payload, {
        onSuccess: () => {
          toast({
            title: "Assessment updated successfully",
            type: "success",
          });
        },
        onError: () => {
          toast({
            title: "Failed to update assessment",
            type: "error",
          });
        },
      });
    } else {
      addAssessment(payload, {
        onSuccess: () => {
          toast({
            title: "Assessment saved successfully",
            type: "success",
          });
        },
        onError: () => {
          toast({
            title: "Failed to save assessment",
            type: "error",
          });
        },
      });
    }
  };

  return (
    <div className="bg-bg-state-soft rounded-md px-2 pt-2">
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
                      className="bg-bg-input-soft! text-text-default placeholder:text-text-muted/30 h-9! flex-1 border-none text-sm"
                      placeholder="Continuous Assessment 1"
                    />
                    <div className="bg-bg-input-soft flex h-9 w-17 items-center gap-1 rounded-md p-1">
                      <Input
                        name={`assessments.${index}.weight`}
                        value={values.assessments[index].weight}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="text-text-default placeholder:text-text-muted/30 h-7! w-full border-none bg-none! text-sm"
                        placeholder="20"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        min="0"
                        onKeyDown={e => {
                          if (e.key === "-" || e.key === "e") {
                            e.preventDefault();
                          }
                        }}
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
      <div className="flex justify-end py-3">
        <Button onClick={submitAssessment} className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default! h-7!">
          Save
        </Button>
      </div>
    </div>
  );
};

type GradingFieldsProps = {
  values: LevelFormValues;
  handleChange: React.ChangeEventHandler;
  handleBlur: React.FocusEventHandler;
  level?: ClassLevel | null;
  branchId?: number;
  branchSpecific?: boolean;
  hasExistingGradings?: boolean;
};

const GradingFields = ({ values, handleChange, handleBlur, level, branchId, branchSpecific, hasExistingGradings }: GradingFieldsProps) => {
  const { mutateAsync: addGrading, isPending: isAddingGrading } = useAddGrading();
  const { mutate: updateGrading, isPending: isUpdating } = useUpdateGradingsForLevel();

  const submitGrading = () => {
    const payload = {
      branchId,
      levelType: level?.levelType,
      branchSpecific,
      gradingDtoList: values.grades.map(grade => ({
        grade: grade.grade,
        upperLimit: Number(grade.upperLimit),
        lowerLimit: Number(grade.lowerLimit),
        remark: grade.remark,
      })),
    };

    if (hasExistingGradings) {
      updateGrading(payload, {
        onSuccess: () => {
          toast({
            title: "Assessment updated successfully",
            type: "success",
          });
        },
        onError: () => {
          toast({
            title: "Failed to update assessment",
            type: "error",
          });
        },
      });
    } else {
      addGrading(payload, {
        onSuccess: () => {
          toast({
            title: "Grading saved successfully",
            type: "success",
          });
        },
        onError: () => {
          toast({
            title: "Failed to save grading",
            type: "error",
          });
        },
      });
    }
  };

  return (
    <div className="bg-bg-state-soft overflow-x-auto rounded-md px-2 pt-2">
      <div className="text-text-default text-md px-4 py-2 font-semibold">Grading</div>

      <div className="bg-bg-card border-border-default w-full rounded-md border px-5 py-6">
        <FieldArray name="grades">
          {({ remove, push }) => (
            <div className="flex flex-col gap-4">
              {values.grades.map((_, index) => (
                <div key={index} className="flex flex-col items-center gap-2 md:flex-row">
                  <div className="flex w-full flex-col items-center gap-2 md:w-1/3 md:flex-row">
                    <div className="flex w-full flex-col gap-2 md:w-24">
                      <Label className="text-text-muted text-sm">Grade</Label>
                      <div className="bg-bg-input-soft flex h-9 items-center rounded-md px-2">
                        <Input
                          name={`grades.${index}.grade`}
                          value={values.grades[index].grade}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          type="text"
                          placeholder="A"
                          className="text-text-default placeholder:text-text-muted/30 h-7! w-full border-none bg-transparent text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex w-full flex-col gap-2">
                      <Label className="text-text-muted text-sm">Score</Label>
                      <div className="flex w-full items-center gap-2">
                        <div className="bg-bg-input-soft flex h-9 w-full items-center rounded-md px-2 md:w-24">
                          <Input
                            name={`grades.${index}.lowerLimit`}
                            value={values.grades[index].lowerLimit}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="70"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            min="0"
                            onKeyDown={e => {
                              if (e.key === "-" || e.key === "e") {
                                e.preventDefault();
                              }
                            }}
                            className="text-text-default placeholder:text-text-muted/30 h-7! w-full border-none bg-transparent px-0! pl-1 text-sm"
                          />
                        </div>
                        <div className="text-text-subtle w-1">-</div>
                        <div className="bg-bg-input-soft flex h-9 w-full items-center rounded-md px-2 md:w-24">
                          <Input
                            name={`grades.${index}.upperLimit`}
                            value={values.grades[index].upperLimit}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            min="0"
                            onKeyDown={e => {
                              if (e.key === "-" || e.key === "e") {
                                e.preventDefault();
                              }
                            }}
                            placeholder="100"
                            className="text-text-default placeholder:text-text-muted/30 h-7! w-full border-none bg-transparent px-0! text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full flex-col gap-2">
                    <Label className="text-text-muted text-sm">Remark</Label>

                    <div className="flex items-center gap-2">
                      <Input
                        name={`grades.${index}.remark`}
                        value={values.grades[index].remark}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="bg-bg-input-soft! placeholder:text-text-muted/30 text-text-default h-9! w-full border-none text-sm"
                        placeholder="Excellent"
                      />
                      <Button type="button" onClick={() => remove(index)} className="bg-bg-state-soft! hover:bg-bg-state-soft-hover! h-8 w-8 p-0">
                        <DeleteBin2 fill="var(--color-icon-default-subtle)" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <div>
                <div className="pt-4">
                  <Button type="button" className="text-text-subtle hover:bg-bg-none! w-fit bg-none! text-sm" onClick={() => push(emptyGradeRow())}>
                    <AddFill fill="var(--color-icon-default-muted)" className="size-3" /> Add Grade Row
                  </Button>
                </div>
              </div>
            </div>
          )}
        </FieldArray>
      </div>
      <div className="flex justify-end py-3">
        <Button type="button" onClick={submitGrading} className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default! h-7!">
          {isAddingGrading && <Spinner className="text-text-white-default size-3" />}
          Save
        </Button>
      </div>
    </div>
  );
};

function BranchTabs({ activeBranch, setActiveBranch }: { activeBranch: Branch | null; setActiveBranch: (t: Branch | null) => void }) {
  const { data: branchesData, isFetching: isLoadingBranches } = useGetBranches();
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

const LevelFormPanel = ({ level, branchId, branchSpecific }: { level: ClassLevel | null; branchId?: number; branchSpecific?: boolean }) => {
  const [hasExistingAssessment, setHasExistingAssessment] = useState(false);
  const [hasExistingGradings, setHasExistingGradings] = useState(false);

  const formik = useFormik<LevelFormValues>({
    initialValues: emptyFormValues(),
    validationSchema: schoolDefaultSchema,
    onSubmit: () => {},
  });

  const { data: assessmentsData } = useGetAssessmentsByLevel(level?.id);
  const { data: gradingsData } = useGetGradingsByLevel(level?.id);

  useEffect(() => {
    if (assessmentsData?.data && assessmentsData.data?.assessments?.length > 0) {
      formik.setFieldValue(
        "assessments",
        assessmentsData.data.assessments.map((a: AssessmentType) => ({
          name: a.name,
          weight: a.weight?.toString() || "",
        })),
      );
      setHasExistingAssessment(true);
    } else {
      formik.setFieldValue("assessments", [emptyAssessmentRow()]);
    }
  }, [assessmentsData, level?.id]);

  useEffect(() => {
    if (gradingsData?.data && gradingsData.data?.length > 0) {
      formik.setFieldValue(
        "grades",
        gradingsData.data.map((g: SchoolGrading) => ({
          grade: g.grade,
          upperLimit: g.upperLimit?.toString() || "",
          lowerLimit: g.lowerLimit?.toString() || "",
          remark: g.remark || "",
        })),
      );
      setHasExistingGradings(true);
    } else {
      formik.setFieldValue("grades", [emptyGradeRow()]);
    }
  }, [gradingsData, level?.id]);

  return (
    <div className="w-full">
      <FormikProvider value={formik}>
        <div className="flex flex-col gap-6">
          <AssessmentFields
            level={level}
            branchId={branchId}
            branchSpecific={branchSpecific}
            values={formik.values}
            handleChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            hasExistingAssessment={hasExistingAssessment}
          />
          <GradingFields
            level={level}
            branchId={branchId}
            branchSpecific={branchSpecific}
            values={formik.values}
            handleChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            hasExistingGradings={hasExistingGradings}
          />
        </div>
      </FormikProvider>
    </div>
  );
};

const LevelTabsContainer = ({ levels, activeLevel, setActiveLevel, branchId, branchSpecific }: LevelTabsContainerProps) => {
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = React.useState(0);

  if (levels.length === 0) return null;

  return (
    <div>
      <div className="flex w-full flex-col-reverse gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="w-full">
            {isMobile ? (
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
                      <span className="text-text-default text-sm capitalize">{levels[activeIndex].levelName.replaceAll("_", " ").toLowerCase()}</span>
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
              </div>
            ) : (
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
              </div>
            )}
          </div>
        </div>

        <GradingAndAssessmentSheet branchId={branchId} branchSpecific={branchSpecific} />
      </div>

      <div className="flex w-full items-center justify-center pt-10">
        <LevelFormPanel level={activeLevel} branchId={branchId} branchSpecific={branchSpecific} />
      </div>
    </div>
  );
};

export const GradingAndAssessment = ({
  setCompletedSteps,
  completedSteps,
  isEditing,
  setIsEditing,
}: {
  setCompletedSteps?: (steps: string[]) => void;
  completedSteps?: string[];
  isEditing?: boolean;
  setIsEditing?: (editing: boolean) => void;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>("");
  const [branchSpecific, setBranchSpecific] = useState(false);
  const [activeBranch, setActiveBranch] = useState<Branch | null>(null);
  const [activeLevel, setActiveLevel] = useState<ClassLevel | null>(null);

  useBreadcrumb([
    { label: "Academic Settings", url: "/staff/settings/academic" },
    { label: "Grading and Assessment", url: "/staff/settings/academic?step=grading-and-assessment" },
  ]);

  const { data: classLevelData, isLoading } = useGetLevels(activeBranch?.id);
  const branchLevels: Level[] = React.useMemo(() => classLevelData?.data ?? [], [classLevelData]);
  const levels = extractUniqueLevelsByType(classLevelData?.data || []);

  useEffect(() => {
    if (!activeLevel) {
      setActiveLevel(levels[0]);
    }
  }, [activeLevel, levels]);

  useEffect(() => {
    if (branchLevels.length > 0 && !activeTab) {
      setActiveTab(String(branchLevels[0].branchId));
    }
  }, [branchLevels, activeTab]);

  return (
    <section>
      <div className="mx-auto flex w-full flex-col gap-4 px-4 lg:px-36">
        <div className="bg-bg-subtle border-border-default mb-5 flex w-full items-start justify-between rounded-md border p-4">
          <div>
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
          <div className="border-border-default mb-5 flex w-full items-center gap-3">
            <BranchTabs activeBranch={activeBranch} setActiveBranch={setActiveBranch} />
          </div>
        )}

        {isLoading && <Skeleton className="bg-bg-input-soft h-100 w-full" />}

        {!isLoading && (
          <LevelTabsContainer
            levels={levels}
            activeLevel={activeLevel}
            setActiveLevel={setActiveLevel}
            branchId={activeBranch?.id}
            branchSpecific={branchSpecific}
          />
        )}
      </div>

      <div className="border-border-default bg-bg-default absolute bottom-0 mx-auto flex w-full justify-between border-t px-4 py-3 lg:px-40">
        <Button
          className="bg-bg-state-soft! hover:bg-bg-state-soft-hover! text-text-subtle h-7!"
          onClick={() => {
            setIsEditing?.(false);
          }}
        >
          Cancel
        </Button>

        <Button
          type="button"
          onClick={() => {
            setIsEditing?.(false);
          }}
          className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default! h-7!"
        >
          Save Changes
        </Button>
      </div>

      {completedSteps && setCompletedSteps && (
        <div className="border-border-default bg-bg-default absolute bottom-0 mt-auto flex w-full justify-between border-t px-4 py-3 lg:px-40">
          <Button
            className="bg-bg-state-soft! hover:bg-bg-state-soft-hover! text-text-subtle h-7!"
            onClick={() => {
              router.push(`${pathname}?step=class-and-arms`);
            }}
          >
            Previous
          </Button>

          <Button
            type="button"
            onClick={() => {
              setCompletedSteps([...completedSteps, "grading-and-assessment"]);
              router.push(`${pathname}?step=admission-number`);
            }}
            className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default! h-7!"
          >
            Next
          </Button>
        </div>
      )}
    </section>
  );
};
