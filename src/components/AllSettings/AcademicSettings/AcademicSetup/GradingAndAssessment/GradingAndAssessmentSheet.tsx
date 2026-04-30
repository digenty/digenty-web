"use client";

import { AddFill, DeleteBin2, Settings4 } from "@digenty/icons";
import { AssessmentType } from "@/api/types";

import { MobileDrawer } from "@/components/MobileDrawer";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAddAssessmentDefault, useGetAssessmentDefault } from "@/hooks/queryHooks/useAssessment";
import { useAddGradingDefault } from "@/hooks/queryHooks/useGrading";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import { schoolDefaultSchema, schoolDefaultUpdateSchema } from "@/schema/academic";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { FieldArray, FormikProvider, useFormik } from "formik";
import { useEffect, useState } from "react";

type AssessmentRow = { name: string; weight: string };
type GradeRow = { grade: string; upperLimit: string; lowerLimit: string; remark: string };

export type LevelFormValues = {
  assessments: AssessmentRow[];
  grades: GradeRow[];
};

const emptyAssessmentRow = (): AssessmentRow => ({ name: "", weight: "" });
const emptyGradeRow = (): GradeRow => ({ grade: "", upperLimit: "", lowerLimit: "", remark: "" });
const getTotalWeight = (assessments: AssessmentRow[]) => assessments.reduce((sum, a) => sum + (parseFloat(a.weight) || 0), 0);

export const GradingAndAssessmentSheet = ({ branchId, branchSpecific }: { branchId?: number; branchSpecific?: boolean }) => {
  const isMobile = useIsMobile();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [hasExistingAssessment, setHasExistingAssessment] = useState(false);
  const [hasExistingGrading, setHasExistingGrading] = useState(false);

  const { mutateAsync: addAssessmentDefault } = useAddAssessmentDefault();
  const { mutateAsync: addGradingDefault } = useAddGradingDefault();
  const { data: assessmentDefaultData } = useGetAssessmentDefault();

  const formik = useFormik<LevelFormValues>({
    enableReinitialize: true,
    initialValues: {
      assessments: [emptyAssessmentRow()],
      grades: [emptyGradeRow()],
    },
    validationSchema: !hasExistingAssessment && !hasExistingGrading && schoolDefaultSchema,
    onSubmit: async values => {
      const assessmentPayload = {
        branchId,
        branchSpecific,
        assessments: values.assessments.map(assessment => ({
          name: assessment.name,
          weight: Number(assessment.weight),
          assessmentType: "CONTINUOUS_ASSESSMENT",
        })),
      };

      const gradingPayload = {
        branchId,
        branchSpecific,
        gradingDtoList: values.grades.map(grade => ({
          grade: grade.grade,
          upperLimit: Number(grade.upperLimit),
          lowerLimit: Number(grade.lowerLimit),
          remark: grade.remark,
        })),
      };

      try {
        const results = await Promise.allSettled([addAssessmentDefault(assessmentPayload), addGradingDefault(gradingPayload)]);

        const [assessmentRes, gradingRes] = results;

        if (assessmentRes.status === "fulfilled" && gradingRes.status === "fulfilled") {
          setSheetOpen(false);
          toast({
            title: "Grading & Assessment saved",
            description: "Grading and Assessment settings have been applied to all levels.",
            type: "success",
          });
        } else {
          if (assessmentRes.status === "rejected") {
            const message = assessmentRes.reason instanceof Error ? assessmentRes.reason.message : "Failed to save assessment settings";
            toast({ title: "Assessment Save Failed", description: message, type: "error" });
          }
          if (gradingRes.status === "rejected") {
            const message = gradingRes.reason instanceof Error ? gradingRes.reason.message : "Failed to save grading settings";
            toast({ title: "Grading Save Failed", description: message, type: "error" });
          }
        }
      } catch (error) {
        toast({
          title: "Submission Error",
          description: "An unexpected error occurred during submission.",
          type: "error",
        });
      }
    },
  });

  useEffect(() => {
    const assessments = assessmentDefaultData?.data?.assessments;
    if (assessments && assessments.length > 0) {
      setHasExistingAssessment(true);
      formik.setFieldValue(
        "assessments",
        assessments.map((a: AssessmentType) => ({
          name: a.name,
          weight: a.weight?.toString() || "",
        })),
      );
    }
  }, [assessmentDefaultData]);

  const totalWeight = getTotalWeight(formik.values.assessments);
  const isOverWeight = totalWeight > 100;

  const ContentNode = (
    <FormikProvider value={formik}>
      <div className="flex flex-col gap-4 p-6">
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
                          className="bg-bg-input-soft! text-text-default placeholder:text-text-muted/30 h-9! flex-1 border-none text-sm"
                          placeholder="Continuous Assessment 1"
                        />
                        <div className="bg-bg-input-soft flex h-9 w-17 items-center gap-1 rounded-md p-1">
                          <Input
                            name={`assessments.${index}.weight`}
                            value={formik.values.assessments[index].weight}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
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
        </div>

        {/* Grading */}
        <div className="bg-bg-state-soft overflow-x-auto rounded-md p-2">
          <div className="text-text-default text-md px-4 py-2 font-semibold">Grading</div>
          <div className="bg-bg-card border-border-default w-full rounded-md border px-5 py-6">
            <FieldArray name="grades">
              {({ remove, push }) => (
                <div className="flex flex-col gap-4">
                  {formik.values.grades.map((_, index) => (
                    <div key={index} className="flex flex-col items-center gap-2 md:flex-row">
                      <div className="flex w-full flex-col items-center gap-2 md:flex-row">
                        <div className="flex w-full flex-col gap-2 md:w-14">
                          <Label className="text-text-muted text-sm">Grade</Label>
                          <div className="bg-bg-input-soft flex h-9 items-center rounded-md">
                            <Input
                              name={`grades.${index}.grade`}
                              value={formik.values.grades[index].grade}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              type="text"
                              placeholder="A"
                              className="text-text-default placeholder:text-text-muted/30 h-7! w-full border-none bg-transparent text-sm"
                            />
                          </div>
                        </div>

                        <div className="flex w-full flex-col gap-2">
                          <Label className="text-text-muted text-sm">Score</Label>
                          <div className="flex w-full items-center gap-2">
                            <div className="bg-bg-input-soft flex h-9 w-full items-center rounded-md">
                              <Input
                                name={`grades.${index}.lowerLimit`}
                                value={formik.values.grades[index].lowerLimit}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                min="0"
                                onKeyDown={e => {
                                  if (e.key === "-" || e.key === "e") {
                                    e.preventDefault();
                                  }
                                }}
                                placeholder="70"
                                className="text-text-default placeholder:text-text-muted/30 h-7! w-full border-none bg-transparent text-sm"
                              />
                            </div>
                            <div className="text-text-subtle w-1">-</div>
                            <div className="bg-bg-input-soft flex h-9 w-full items-center rounded-md">
                              <Input
                                name={`grades.${index}.upperLimit`}
                                value={formik.values.grades[index].upperLimit}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                min="0"
                                onKeyDown={e => {
                                  if (e.key === "-" || e.key === "e") {
                                    e.preventDefault();
                                  }
                                }}
                                placeholder="100"
                                className="text-text-default placeholder:text-text-muted/30 h-7! w-full border-none bg-transparent text-sm"
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
                            value={formik.values.grades[index].remark}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
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
                      <Button
                        type="button"
                        className="text-text-subtle hover:bg-bg-none! w-fit bg-none! text-sm"
                        onClick={() => push(emptyGradeRow())}
                      >
                        <AddFill fill="var(--color-icon-default-muted)" className="size-3" /> Add Grade Row
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </FieldArray>
          </div>
        </div>
      </div>
    </FormikProvider>
  );

  return (
    <div>
      <Button
        type="button"
        onClick={() => setSheetOpen(true)}
        className="bg-bg-state-secondary! border-border-darker! text-text-default rounded-md! border shadow-sm"
      >
        <Settings4 fill="var(--color-icon-default-muted)" />
        Set for all levels
      </Button>

      {!isMobile && (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent className="bg-bg-card border-border-default w-full overflow-y-auto rounded-md border md:mt-4 md:mr-4 md:min-w-130">
            <SheetHeader className="border-border-darker bg-bg-card-subtle rounded-t-md border-b px-4 py-3">
              <VisuallyHidden>
                <SheetTitle>Quick Setup</SheetTitle>
              </VisuallyHidden>
              <div className="text-text-default text-md font-semibold">Set Grading & Assessment for all levels</div>
            </SheetHeader>

            {ContentNode}

            <SheetFooter className="border-border-default border-t px-6 pt-4 pb-8">
              <div className="flex w-full items-center justify-between">
                <SheetClose asChild>
                  <Button type="button" variant="outline" className="bg-bg-state-soft! text-text-subtle hover:text-text-subtle! h-7 border-none px-3">
                    Close
                  </Button>
                </SheetClose>
                <Button
                  type="button"
                  onClick={() => formik.submitForm()}
                  disabled={isOverWeight}
                  className="bg-bg-state-primary! text-text-white-default hover:bg-bg-state-primary-hover! h-7 px-3"
                >
                  Apply to all levels
                </Button>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}

      {/* Mobile */}
      {isMobile && (
        <MobileDrawer open={sheetOpen} setIsOpen={setSheetOpen} title="Quick Setup">
          {ContentNode}
          <SheetFooter className="border-border-default border-t px-6 pt-4 pb-8">
            <div className="flex w-full items-center justify-between">
              <SheetClose asChild>
                <Button type="button" variant="outline" className="bg-bg-state-soft! text-text-subtle hover:text-text-subtle! h-7 border-none px-3">
                  Close
                </Button>
              </SheetClose>
              <Button
                type="button"
                onClick={() => formik.submitForm()}
                disabled={isOverWeight}
                className="bg-bg-state-primary! text-text-white-default hover:bg-bg-state-primary-hover! h-7 px-3"
              >
                Apply to all levels
              </Button>
            </div>
          </SheetFooter>
        </MobileDrawer>
      )}
    </div>
  );
};
