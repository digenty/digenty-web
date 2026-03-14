"use client";

import React, { useEffect, useState } from "react";
import { useFormik, FieldArray, FormikProvider } from "formik";
import Loader2Fill from "@/components/Icons/Loader2Fill";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AddFill } from "@/components/Icons/AddFill";
import { Input } from "@/components/ui/input";
import { DeleteBin2 } from "@/components/Icons/DeleteBin2";
import Edit from "@/components/Icons/Edit";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Label } from "@/components/ui/label";
import BookOpen from "@/components/Icons/BookOpen";
import School from "@/components/Icons/School";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/Toast";
import { useGetSchoolGradings, useUpdateSchoolGradings } from "@/hooks/queryHooks/useGrading";
import { useGetSchoolAssessment, useUpdateSchoolAssessment } from "@/hooks/queryHooks/useAssessment";
import { useGetClassLevel } from "@/hooks/queryHooks/useClass";
import { useQueryClient } from "@tanstack/react-query";
import { gradingKeys } from "@/queries/grading";
import { assessmentKeys } from "@/queries/assessment";
import { AssessmentAndGradingSchema } from "@/schema/academic";
import { AssessmentRow, BranchLevel, FormValues, GradeRow } from "@/api/types";

const emptyGradeRow = (): GradeRow => ({ grade: "", upperLimit: "", lowerLimit: "", remark: "" });
const emptyAssessmentRow = (): AssessmentRow => ({ name: "", weight: "" });
const getTotalWeight = (assessments: AssessmentRow[]) => assessments.reduce((sum, a) => sum + (parseFloat(a.weight) || 0), 0);

const BranchTabSwitch = ({
  activeTab,
  setActiveTab,
  branchLevels,
}: {
  activeTab: string;
  setActiveTab: (t: string) => void;
  branchLevels: BranchLevel[];
}) => {
  const isMobile = useIsMobile();

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

const LevelTabs = ({
  levels,
  activeIndex,
  setActiveIndex,
}: {
  levels: { levelName: string }[];
  activeIndex: number;
  setActiveIndex: (i: number) => void;
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="w-full">
        <Label className="text-text-default mb-2 text-sm font-medium">
          <BookOpen fill="var(--color-icon-default-muted)" /> Select Level
        </Label>
        <Select value={String(activeIndex)} onValueChange={v => setActiveIndex(Number(v))}>
          <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-sm">
            <SelectValue>
              <span className="text-text-default text-sm">{levels[activeIndex]?.levelName}</span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-bg-default border-border-default">
            {levels.map((l, idx) => (
              <SelectItem key={idx} value={String(idx)} className="text-text-default text-sm">
                {l.levelName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="bg-bg-state-soft flex w-fit items-center gap-2.5 rounded-full p-0.5">
      {levels.map((l, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={index}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={cn(
              "flex items-center gap-1 px-4 py-2 text-sm font-medium transition-all duration-150",
              isActive
                ? "bg-bg-state-secondary border-border-darker text-text-default h-8 justify-center rounded-full border shadow-sm"
                : "text-text-muted h-8",
            )}
          >
            <span>{l.levelName}</span>
            <Loader2Fill fill={isActive ? "var(--color-icon-informative)" : "var(--color-icon-default-muted)"} className="size-4" />
          </button>
        );
      })}
    </div>
  );
};

const AssessmentGradingForm = ({ formik, isEditing }: { formik: ReturnType<typeof useFormik<FormValues>>; isEditing: boolean }) => {
  const totalWeight = getTotalWeight(formik.values.assessments);
  const isOverWeight = totalWeight > 100;

  return (
    <FormikProvider value={formik}>
      <div className="mt-8 flex flex-col gap-6">
        {/* Assessment */}
        <div className="bg-bg-state-soft rounded-md p-2">
          <div className="text-text-default text-md px-4 py-2 font-semibold">Assessment</div>
          <div className="bg-bg-card border-border-default rounded-md border px-5 py-6">
            <FieldArray name="assessments">
              {({ remove, push }) => (
                <>
                  <div className="flex flex-col gap-4">
                    {formik.values.assessments.map((_, index) => (
                      <div key={index} className="flex items-center justify-between gap-2">
                        <Input
                          name={`assessments.${index}.name`}
                          value={formik.values.assessments[index].name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          disabled={!isEditing}
                          className="bg-bg-input-soft! text-text-default h-9! flex-1 border-none"
                          placeholder="Continuous Assessment 1"
                        />
                        <div className="bg-bg-input-soft flex h-9 w-17 items-center gap-1 rounded-md p-1">
                          <Input
                            name={`assessments.${index}.weight`}
                            value={formik.values.assessments[index].weight}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            disabled={!isEditing}
                            className="text-text-default h-7! w-full border-none bg-none!"
                            placeholder="20"
                          />
                          <span className="text-text-muted w-3">%</span>
                        </div>
                        {isEditing && (
                          <Button type="button" onClick={() => remove(index)} className="bg-bg-state-soft! hover:bg-bg-state-soft-hover! w-fit">
                            <DeleteBin2 fill="var(--color-icon-default-subtle)" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <Button
                        type="button"
                        className="text-text-subtle hover:bg-bg-none! w-fit bg-none! text-sm"
                        onClick={() => push(emptyAssessmentRow())}
                      >
                        <AddFill fill="var(--color-icon-default-muted)" /> Add Continuous Assessment
                      </Button>
                      <div className="flex items-center gap-2">
                        <span className="text-text-subtle text-sm">Total Weight</span>
                        <span className={cn("text-sm font-medium", isOverWeight ? "text-text-destructive" : "text-text-default")}>
                          {totalWeight}%
                        </span>
                      </div>
                    </div>
                  )}
                  {isOverWeight && <p className="text-text-destructive mt-2 text-xs">Total assessment weight cannot exceed 100%</p>}
                </>
              )}
            </FieldArray>
          </div>
        </div>

        <div className="bg-bg-state-soft overflow-x-auto rounded-md p-2">
          <div className="text-text-default text-md px-4 py-2 font-semibold">Grading</div>

          <div className="bg-bg-card border-border-default hidden w-full rounded-md border px-5 py-6 md:block">
            <table className="w-full border-none">
              <thead>
                <tr>
                  <th className="text-text-muted px-3 py-2 text-left text-sm font-medium">Grade</th>
                  <th className="text-text-muted px-3 py-2 text-left text-sm font-medium">Score</th>
                  <th />
                  <th />
                  <th className="text-text-muted w-full px-3 py-2 text-left text-sm font-medium">Remark</th>
                  {isEditing && <th className="px-3 py-2" />}
                </tr>
              </thead>
              <tbody>
                <FieldArray name="grades">
                  {({ remove, push }) => (
                    <>
                      {formik.values.grades.map((_, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2">
                            <div className="bg-bg-input-soft flex h-9 w-27 items-center rounded-md px-2">
                              <Input
                                name={`grades.${index}.grade`}
                                value={formik.values.grades[index].grade}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={!isEditing}
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
                                value={formik.values.grades[index].lowerLimit}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={!isEditing}
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
                                value={formik.values.grades[index].upperLimit}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={!isEditing}
                                type="number"
                                placeholder="100"
                                className="text-text-default h-7! w-full border-none bg-transparent"
                              />
                            </div>
                          </td>
                          <td className="w-full px-3 py-2">
                            <Input
                              name={`grades.${index}.remark`}
                              value={formik.values.grades[index].remark}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              disabled={!isEditing}
                              className="bg-bg-input-soft! text-text-default h-9! w-full border-none"
                              placeholder="Excellent"
                            />
                          </td>
                          {isEditing && (
                            <td className="px-3 py-2">
                              <Button
                                type="button"
                                onClick={() => remove(index)}
                                className="bg-bg-state-soft! hover:bg-bg-state-soft-hover! h-8 w-8 p-0"
                              >
                                <DeleteBin2 fill="var(--color-icon-default-subtle)" />
                              </Button>
                            </td>
                          )}
                        </tr>
                      ))}
                      {isEditing && (
                        <tr>
                          <td colSpan={6} className="px-3 pt-4">
                            <Button
                              type="button"
                              className="text-text-subtle hover:bg-bg-none! w-fit bg-none! text-sm"
                              onClick={() => push(emptyGradeRow())}
                            >
                              <AddFill fill="var(--color-icon-default-muted)" /> Add Grade Row
                            </Button>
                          </td>
                        </tr>
                      )}
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
                  {formik.values.grades.map((_, index) => (
                    <div key={index} className="bg-bg-card border-border-default flex w-full flex-col gap-3 rounded-md border px-5 py-6">
                      <div className="flex flex-col gap-1">
                        <Label className="text-text-default text-sm font-medium">Grade</Label>
                        <Input
                          name={`grades.${index}.grade`}
                          value={formik.values.grades[index].grade}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          disabled={!isEditing}
                          type="text"
                          placeholder="A"
                          className="text-text-default bg-bg-input-soft! h-7! w-full border-none"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label className="text-text-default text-sm font-medium">Score</Label>
                        <div className="flex w-full items-center gap-2">
                          <Input
                            name={`grades.${index}.lowerLimit`}
                            value={formik.values.grades[index].lowerLimit}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            disabled={!isEditing}
                            type="number"
                            placeholder="70"
                            className="text-text-default bg-bg-input-soft! h-7! w-full border-none"
                          />
                          <span className="text-text-default text-xs">to</span>
                          <Input
                            name={`grades.${index}.upperLimit`}
                            value={formik.values.grades[index].upperLimit}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            disabled={!isEditing}
                            type="number"
                            placeholder="100"
                            className="text-text-default bg-bg-input-soft! h-7! w-full border-none"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label className="text-text-default text-sm font-medium">Remark</Label>
                        <Input
                          name={`grades.${index}.remark`}
                          value={formik.values.grades[index].remark}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          disabled={!isEditing}
                          className="bg-bg-input-soft! text-text-default h-7! w-full border-none"
                          placeholder="Excellent"
                        />
                      </div>
                      {isEditing && (
                        <Button type="button" onClick={() => remove(index)} className="bg-bg-state-soft! hover:bg-bg-state-soft-hover! h-8 w-8 p-0">
                          <DeleteBin2 fill="var(--color-icon-default-subtle)" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <Button
                      type="button"
                      className="text-text-subtle hover:bg-bg-none! mt-2 w-fit bg-none! text-sm"
                      onClick={() => push(emptyGradeRow())}
                    >
                      <AddFill fill="var(--color-icon-default-muted)" /> Add Grade Row
                    </Button>
                  )}
                </>
              )}
            </FieldArray>
          </div>
        </div>
      </div>
    </FormikProvider>
  );
};

export const AcademicAssAndGradeSetupDone = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("");
  const [activeLevelIndex, setActiveLevelIndex] = useState(0);

  const { data: classLevelData, isLoading: isLoadingLevels } = useGetClassLevel();
  const { data: gradingsResponse, isLoading: isLoadingGradings } = useGetSchoolGradings();
  const { data: assessmentsResponse, isLoading: isLoadingAssessments } = useGetSchoolAssessment();
  const { mutateAsync: updateGradings } = useUpdateSchoolGradings();
  const { mutateAsync: updateAssessments } = useUpdateSchoolAssessment();

  const branchLevels: BranchLevel[] = classLevelData?.data ?? [];
  const gradingRows = gradingsResponse?.data ?? [];
  // TOdo: replace with actual fields once backend fixes assessment GET response
  const assessmentRows = assessmentsResponse?.data ?? [];
  const isLoading = isLoadingLevels || isLoadingGradings || isLoadingAssessments;

  const formik = useFormik<FormValues>({
    initialValues: {
      grades: [],
      assessments: [],
    },
    validationSchema: AssessmentAndGradingSchema,
    onSubmit: () => {},
  });

  useEffect(() => {
    if (gradingRows.length > 0 || assessmentRows.length > 0) {
      formik.resetForm({
        values: {
          grades: gradingRows.map((g: GradeRow) => ({
            grade: g.grade ?? "",
            upperLimit: String(g.upperLimit ?? ""),
            lowerLimit: String(g.lowerLimit ?? ""),
            remark: g.remark ?? "",
          })),
          // TODO: map actual assessment fields once backend fixes GET response
          assessments: assessmentRows.map(() => ({ name: "", weight: "" })),
        },
      });
    }
  }, [gradingRows.length, assessmentRows.length]);

  useEffect(() => {
    if (branchLevels.length > 0 && !activeTab) {
      setActiveTab(String(branchLevels[0].branchId));
    }
  }, [branchLevels, activeTab]);

  const activeBranch = branchLevels.find(b => String(b.branchId) === activeTab);

  const handleCancel = () => {
    formik.resetForm({
      values: {
        grades: gradingRows.map((g: GradeRow) => ({
          grade: g.grade ?? "",
          upperLimit: String(g.upperLimit ?? ""),
          lowerLimit: String(g.lowerLimit ?? ""),
          remark: g.remark ?? "",
        })),
        assessments: assessmentRows.map(() => ({ name: "", weight: "" })),
      },
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      formik.setTouched({
        grades: formik.values.grades.map(() => ({ grade: true, upperLimit: true, lowerLimit: true, remark: true })),
        assessments: formik.values.assessments.map(() => ({ name: true, weight: true })),
      });
      toast({ title: "Please complete all fields", description: "All grading and assessment fields are required.", type: "warning" });
      return;
    }

    const totalWeight = getTotalWeight(formik.values.assessments);
    if (totalWeight > 100) {
      toast({ title: "Assessment weight error", description: "Total assessment weight cannot exceed 100%.", type: "error" });
      return;
    }

    setIsSaving(true);
    try {
      await Promise.all([
        updateGradings({
          gradingDtoList: formik.values.grades.map(g => ({
            grade: g.grade,
            upperLimit: parseFloat(g.upperLimit),
            lowerLimit: parseFloat(g.lowerLimit),
            remark: g.remark,
          })),
        }),
        updateAssessments({
          assessments: formik.values.assessments.map(a => ({
            name: a.name,
            weight: parseFloat(a.weight),
            assessmentType: "CONTINUOUS_ASSESSMENT" as const,
          })),
        }),
      ]);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: gradingKeys.getSchoolGrading }),
        queryClient.invalidateQueries({ queryKey: assessmentKeys.getSchoolAssessment }),
      ]);

      toast({ title: "Saved successfully", description: "Assessment and grading have been updated.", type: "success" });
      setIsEditing(false);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      toast({ title: "Failed to save", description: message, type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-5 flex w-full items-start justify-between">
        <div className="text-text-default text-xl font-semibold">Assessment & Grading</div>
        {!isEditing && (
          <Button
            type="button"
            onClick={() => setIsEditing(true)}
            className="bg-bg-state-secondary! border-border-darker hover:bg-bg-none! text-text-default flex h-7! items-center justify-center rounded-md border p-2"
          >
            <Edit fill="var(--color-icon-default-muted)" /> Edit
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="bg-bg-input-soft h-9 w-64" />
          <Skeleton className="bg-bg-input-soft h-40 w-full" />
        </div>
      ) : (
        <>
          <div className="border-border-default mb-5 w-full border-b md:w-fit">
            <BranchTabSwitch
              activeTab={activeTab}
              setActiveTab={id => {
                setActiveTab(id);
                setActiveLevelIndex(0);
              }}
              branchLevels={branchLevels}
            />
          </div>

          {activeBranch && activeBranch.classLevels.length > 0 && (
            <div className="mb-6">
              <LevelTabs levels={activeBranch.classLevels} activeIndex={activeLevelIndex} setActiveIndex={setActiveLevelIndex} />
            </div>
          )}

          <AssessmentGradingForm formik={formik} isEditing={isEditing} />
        </>
      )}

      {isEditing && (
        <div className="border-border-default bg-bg-default sticky bottom-0 mx-auto flex w-full justify-between border-t py-3">
          <Button type="button" onClick={handleCancel} disabled={isSaving} className="bg-bg-state-soft! text-text-subtle rounded-md">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default rounded-md"
          >
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      )}
    </div>
  );
};
