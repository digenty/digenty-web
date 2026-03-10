"use client";

import { AddFill } from "@/components/Icons/AddFill";
import { DeleteBin2 } from "@/components/Icons/DeleteBin2";
import Settings4 from "@/components/Icons/Settings4";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
// import { useIsMobile } from "@/hooks/useIsMobile";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useForm, useFieldArray } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useState } from "react";

type AssessmentRow = { name: string; weight: string };
type GradeRow = { grade: string; upperLimit: string; lowerLimit: string; remark: string };

export type LevelFormValues = {
  assessments: AssessmentRow[];
  grades: GradeRow[];
};

type GradingAndAssessmentSheetProps = {
  onApplyToAll: (values: LevelFormValues) => void;
};

const emptyAssessmentRow = (): AssessmentRow => ({ name: "", weight: "" });
const emptyGradeRow = (): GradeRow => ({ grade: "", upperLimit: "", lowerLimit: "", remark: "" });
const getTotalWeight = (assessments: AssessmentRow[]) => assessments.reduce((sum, a) => sum + (parseFloat(a.weight) || 0), 0);

export const GradingAndAssessmentSheet = ({ onApplyToAll }: GradingAndAssessmentSheetProps) => {
  // const isMobile = useIsMobile();
  const [sheetOpen, setSheetOpen] = useState(false);

  const form = useForm<LevelFormValues>({
    defaultValues: {
      assessments: [emptyAssessmentRow()],
      grades: [emptyGradeRow()],
    },
  });

  const { control, register, watch, handleSubmit } = form;

  const { fields: assessmentFields, append: appendAssessment, remove: removeAssessment } = useFieldArray({ control, name: "assessments" });

  const { fields: gradeFields, append: appendGrade, remove: removeGrade } = useFieldArray({ control, name: "grades" });

  const totalWeight = getTotalWeight(watch("assessments"));
  const isOverWeight = totalWeight > 100;

  const handleSave = handleSubmit(values => {
    onApplyToAll(values);
    setSheetOpen(false);
  });

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

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="bg-bg-card border-border-default w-full overflow-y-auto rounded-md border md:mt-4 md:mr-4 md:min-w-130">
          <SheetHeader className="border-border-darker bg-bg-card-subtle rounded-t-md border-b px-4 py-3">
            <VisuallyHidden>
              <SheetTitle>Quick Setup</SheetTitle>
            </VisuallyHidden>
            <div className="text-text-default text-md font-semibold">Set Grading & Assessment for all levels</div>
          </SheetHeader>

          <div className="flex flex-col gap-4 p-6">
            {/* Assessment */}
            <div className="bg-bg-state-soft rounded-md p-2">
              <div className="text-text-default text-md px-4 py-2 font-semibold">Assessment</div>
              <div className="bg-bg-card border-border-default rounded-md border px-5 py-6">
                <div className="flex flex-col gap-4">
                  {assessmentFields.map((field, index) => (
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
                      <Button type="button" onClick={() => removeAssessment(index)} className="bg-bg-state-soft! hover:bg-bg-state-soft-hover! w-fit">
                        <DeleteBin2 fill="var(--color-icon-default-subtle)" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Button
                    type="button"
                    className="text-text-subtle hover:bg-bg-none! w-fit bg-none! text-sm"
                    onClick={() => appendAssessment(emptyAssessmentRow())}
                  >
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

            {/* Grading */}
            <div className="bg-bg-state-soft overflow-x-auto rounded-md p-2">
              <div className="text-text-default text-md px-4 py-2 font-semibold">Grading</div>
              <div className="bg-bg-card border-border-default w-full rounded-md border py-6">
                <table className="w-full border-none">
                  <thead>
                    <tr>
                      <th className="text-text-muted px-3 py-2 text-left text-sm font-medium">Grade</th>
                      <th className="text-text-muted px-3 py-2 text-left text-sm font-medium">Score</th>
                      <th />
                      <th />
                      <th className="text-text-muted px-3 py-2 text-left text-sm font-medium">Remark</th>
                      <th className="px-3 py-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {gradeFields.map((field, index) => (
                      <tr key={field.id}>
                        <td className="px-3 py-2">
                          <div className="bg-bg-input-soft flex h-9 items-center rounded-md px-2">
                            <Input
                              {...register(`grades.${index}.grade`)}
                              type="text"
                              placeholder="A"
                              className="text-text-default h-7! border-none bg-transparent p-0"
                            />
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="bg-bg-input-soft flex h-9 items-center rounded-md px-2">
                            <Input
                              {...register(`grades.${index}.lowerLimit`)}
                              type="number"
                              placeholder="70"
                              className="text-text-default h-7! border-none bg-transparent p-0"
                            />
                          </div>
                        </td>
                        <td className="text-text-subtle w-1">-</td>
                        <td className="px-3 py-2">
                          <div className="bg-bg-input-soft flex h-9 items-center rounded-md px-2">
                            <Input
                              {...register(`grades.${index}.upperLimit`)}
                              type="number"
                              placeholder="100"
                              className="text-text-default h-7! border-none bg-transparent p-0"
                            />
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            {...register(`grades.${index}.remark`)}
                            className="bg-bg-input-soft! text-text-default h-9! border-none"
                            placeholder="Excellent"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Button
                            type="button"
                            onClick={() => removeGrade(index)}
                            className="bg-bg-state-soft! hover:bg-bg-state-soft-hover! h-8 w-8 p-0"
                          >
                            <DeleteBin2 fill="var(--color-icon-default-subtle)" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button
                type="button"
                className="text-text-subtle hover:bg-bg-none! mt-2 w-fit bg-none! text-sm"
                onClick={() => appendGrade(emptyGradeRow())}
              >
                <AddFill fill="var(--color-icon-default-muted)" /> Add Grade Row
              </Button>
            </div>
          </div>

          <SheetFooter className="border-border-default border-t px-6 pt-4 pb-8">
            <div className="flex w-full items-center justify-between">
              <SheetClose asChild>
                <Button type="button" variant="outline" className="bg-bg-state-soft! text-text-subtle hover:text-text-subtle! h-7 border-none px-3">
                  Close
                </Button>
              </SheetClose>
              <Button
                type="button"
                onClick={handleSave}
                disabled={isOverWeight}
                className="bg-bg-state-primary! text-text-white-default hover:bg-bg-state-primary-hover! h-7 px-3"
              >
                Apply to all levels
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};
