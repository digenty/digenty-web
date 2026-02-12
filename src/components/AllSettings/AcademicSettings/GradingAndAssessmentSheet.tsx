import { AddFill } from "@/components/Icons/AddFill";
import { DeleteBin2 } from "@/components/Icons/DeleteBin2";
import Settings4 from "@/components/Icons/Settings4";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/useIsMobile";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import React, { useState } from "react";

export const GradingAndAssessmentSheet = () => {
  const [addAssessment, setAddAssessment] = useState([{ id: crypto.randomUUID() }]);
  const [gradeSetup, setGradeSetup] = useState([{ id: crypto.randomUUID() }]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="">
      <Button
        onClick={() => setSheetOpen(true)}
        className="bg-bg-state-secondary! border-border-darker! text-text-default rounded-md! border shadow-sm lg:ml-[-175]"
      >
        <Settings4 fill="var(--color-icon-default-muted)" />
        Set for all levels
      </Button>
      {!isMobile && (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <div>
            <SheetContent className="bg-bg-card border-border-default mt-4 mr-4 hidden overflow-y-auto rounded-md border md:block md:min-w-130">
              <SheetHeader className="border-border-darker bg-bg-card-subtle rounded-t-md border-b px-4 py-3">
                <VisuallyHidden>
                  <SheetTitle>Quick Setup</SheetTitle>
                </VisuallyHidden>
                <div className="flex items-center justify-between">
                  <div className="text-text-default text-md font-semibold">Set Grading & Assessment for all levels</div>
                </div>
              </SheetHeader>

              <div className="flex flex-col gap-4 p-6">
                <div className="bg-bg-state-soft rounded-md p-2">
                  <div className="text-text-default text-md px-4 py-2 font-semibold">Assessment</div>
                  <div className="bg-bg-card border-border-default rounded-md border px-5 py-6">
                    <div className="flex flex-col gap-4">
                      {addAssessment.map(asst => (
                        <div key={asst.id} className="mb-2 flex items-center justify-between gap-2">
                          <Input
                            className="bg-bg-input-soft! text-text-default h-9! flex-1 border-none"
                            placeholder="Continuous Assessment 1"
                            type="text"
                          />
                          <div className="bg-bg-input-soft flex h-9 w-17 items-center gap-1 rounded-md p-1">
                            <Input className="text-text-default h-7! w-full border-none bg-none! p-0" placeholder="20%" type="number" />
                            <span className="text-text-muted">%</span>
                          </div>
                          <Button
                            onClick={() => setAddAssessment(prev => prev.filter(a => a.id !== asst.id))}
                            className="text-text-subtle bg-bg-state-soft! hover:bg-bg-state-soft-hover! rounde-md w-fit text-sm"
                          >
                            <DeleteBin2 fill="var(--color-icon-default-subtle)" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <Button
                        className="text-text-subtle hover:bg-bg-none! rounde-md w-fit bg-none! text-sm"
                        onClick={() => setAddAssessment(prev => [...prev, { id: crypto.randomUUID() }])}
                      >
                        <AddFill fill="var(--color-icon-default-muted)" /> Add Continuous Assessment
                      </Button>

                      <div className="flex items-center gap-2">
                        <div className="text-text-subtle text-sm">Total Weight</div>
                        <div className="text-text-default text-sm font-medium">100%</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-bg-state-soft overflow-x-auto rounded-md p-2">
                  <div className="text-text-default text-md px-4 py-2 pb-2 font-semibold">Grading </div>
                  <div className="bg-bg-card border-border-default w-full rounded-md border py-6">
                    <table className="border-none">
                      <thead>
                        <tr className="">
                          <th className="text-text-muted w-fit px-3 py-2 text-left text-sm font-medium">Grade</th>
                          <th className="text-text-muted px-3 py-2 text-left text-sm font-medium">Score</th>
                          <th className=""></th>
                          <th className=""></th>
                          <th className="text-text-muted px-3 py-2 text-left text-sm font-medium">Remark</th>
                          <th className="px-3 py-2" />
                        </tr>
                      </thead>

                      <tbody>
                        {gradeSetup.map(grd => (
                          <tr key={grd.id} className="">
                            <td className="px-3 py-2">
                              <div className="bg-bg-input-soft flex h-9 items-center gap-1 rounded-md px-2">
                                <Input type="text" placeholder="A" className="text-text-default h-7! border-none bg-transparent p-0" />
                              </div>
                            </td>
                            <td className="px-3 py-2">
                              <div className="bg-bg-input-soft flex h-9 items-center gap-1 rounded-md px-2">
                                <Input type="number" placeholder="70" className="text-text-default h-7! border-none bg-transparent p-0" />
                              </div>
                            </td>
                            <td className="text-text-subtle w-1">-</td>
                            <td className="px-3 py-2">
                              <div className="bg-bg-input-soft flex h-9 items-center gap-1 rounded-md px-2">
                                <Input type="number" placeholder="100" className="text-text-default h-7! border-none bg-transparent p-0" />
                              </div>
                            </td>
                            <td className="px-3 py-2">
                              <Input className="bg-bg-input-soft! text-text-default h-9! border-none" placeholder="Excellent" />
                            </td>
                            <td className="px-3 py-2">
                              <Button
                                onClick={() => setGradeSetup(prev => prev.filter(a => a.id !== grd.id))}
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
                    className="text-text-subtle hover:bg-bg-none! rounde-md mt-2 w-fit bg-none! text-sm"
                    onClick={() => setGradeSetup(prev => [...prev, { id: crypto.randomUUID() }])}
                  >
                    <AddFill fill="var(--color-icon-default-muted)" /> Add Grade Row
                  </Button>
                </div>
              </div>

              <SheetFooter className="border-border-default border-t pb-8">
                <div className="flex items-center justify-between">
                  <SheetClose asChild>
                    <Button
                      variant="outline"
                      className="bg-bg-state-soft! text-text-subtle hover:text-text-subtle! rounde-sm h-7 w-17 border-none px-2 py-1"
                    >
                      Close
                    </Button>
                  </SheetClose>
                  <Button
                    type="submit"
                    className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary/90! flex h-7 w-17 items-center gap-1 rounded-sm px-2 py-1"
                  >
                    Save
                  </Button>
                </div>
              </SheetFooter>
            </SheetContent>
          </div>
        </Sheet>
      )}
    </div>
  );
};
