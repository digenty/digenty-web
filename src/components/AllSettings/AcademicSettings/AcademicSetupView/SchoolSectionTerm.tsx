"use client";

import { AcademicSession, Level, Term } from "@/api/types";
import { DateRangePicker } from "@/components/DatePicker";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { toast } from "@/components/Toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useGetActiveSession, useUpdateAcademic } from "@/hooks/queryHooks/useAcademic";
import { useGetClassLevel } from "@/hooks/queryHooks/useClass";
import { useGetTerms } from "@/hooks/queryHooks/useTerm";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { getAcademicYears } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { Edit2 } from "lucide-react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

const toDateString = (range: DateRange | undefined): string => (range?.from ? format(range.from, "yyyy-MM-dd") : "");

const ViewField = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-1">
    <Label className="text-text-default text-sm font-medium">{label}</Label>
    <div className="text-text-default bg-bg-input-soft rounded-md p-2 text-sm font-medium">{value || "—"}</div>
  </div>
);

export const SchoolSectionAndTerm = ({ session, isLoadingSession }: { session: AcademicSession | undefined; isLoadingSession: boolean }) => {
  const user = useLoggedInUser();
  const schoolId = user?.schoolId;

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const [currentTerm, setCurrentTerm] = useState("");
  const [firstTermStart, setFirstTermStart] = useState<Date | undefined>();
  const [firstTermEnd, setFirstTermEnd] = useState<Date | undefined>();
  const [secondTermStart, setSecondTermStart] = useState<Date | undefined>();
  const [secondTermEnd, setSecondTermEnd] = useState<Date | undefined>();
  const [thirdTermStart, setThirdTermStart] = useState<Date | undefined>();
  const [thirdTermEnd, setThirdTermEnd] = useState<Date | undefined>();

  const { data: termList } = useGetTerms(schoolId);
  const { data: levelsData, isLoading: isLoadingLevels, isError: isLevelError } = useGetClassLevel();
  const { mutateAsync: updateAcademic } = useUpdateAcademic();

  const terms: Term[] = termList?.data?.terms ?? [];
  const levels = levelsData?.data ?? [];

  const findTerm = (name: string) => terms.find(t => t.term === name);

  useEffect(() => {
    if (termList) {
      const activeTerm = termList.data.terms.find((term: Term) => term.isActiveTerm);
      setCurrentTerm(activeTerm?.term);
      setSessionName(termList.data.academicSessionName);
    }
  }, [termList]);

  useEffect(() => {
    if (!terms.length) return;
    const first = findTerm("FIRST");
    const second = findTerm("SECOND");
    const third = findTerm("THIRD");
    if (first) {
      setFirstTermStart(first.startDate ? parseISO(first.startDate) : undefined);
      setFirstTermEnd(first.endDate ? parseISO(first.endDate) : undefined);
    }
    if (second) {
      setSecondTermStart(second.startDate ? parseISO(second.startDate) : undefined);
      setSecondTermEnd(second.endDate ? parseISO(second.endDate) : undefined);
    }
    if (third) {
      setThirdTermStart(third.startDate ? parseISO(third.startDate) : undefined);
      setThirdTermEnd(third.endDate ? parseISO(third.endDate) : undefined);
    }
  }, [terms]);

  const handleTermChange = (selected: string) => {
    setCurrentTerm(selected);
    const matched = findTerm(selected);
    if (!matched) return;
    if (selected === "FIRST") {
      setFirstTermStart(matched.startDate ? parseISO(matched.startDate) : undefined);
      setFirstTermEnd(matched.endDate ? parseISO(matched.endDate) : undefined);
    } else if (selected === "SECOND") {
      setSecondTermStart(matched.startDate ? parseISO(matched.startDate) : undefined);
      setSecondTermEnd(matched.endDate ? parseISO(matched.endDate) : undefined);
    } else if (selected === "THIRD") {
      setThirdTermStart(matched.startDate ? parseISO(matched.startDate) : undefined);
      setThirdTermEnd(matched.endDate ? parseISO(matched.endDate) : undefined);
    }
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    if (session) {
      setSessionName(session.name ?? "");
      setCurrentTerm(session.currentTerm ?? "");
    }
    const first = findTerm("FIRST");
    const second = findTerm("SECOND");
    const third = findTerm("THIRD");
    if (first) {
      setFirstTermStart(first.startDate ? parseISO(first.startDate) : undefined);
      setFirstTermEnd(first.endDate ? parseISO(first.endDate) : undefined);
    }
    if (second) {
      setSecondTermStart(second.startDate ? parseISO(second.startDate) : undefined);
      setSecondTermEnd(second.endDate ? parseISO(second.endDate) : undefined);
    }
    if (third) {
      setThirdTermStart(third.startDate ? parseISO(third.startDate) : undefined);
      setThirdTermEnd(third.endDate ? parseISO(third.endDate) : undefined);
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!session?.id) return;

    setIsSaving(true);
    try {
      await updateAcademic({
        payload: {
          name: sessionName,
          currentTerm: currentTerm,
          firstTermStartDate: firstTermStart ? format(firstTermStart, "yyyy-MM-dd") : "",
          firstTermEndDate: firstTermEnd ? format(firstTermEnd, "yyyy-MM-dd") : "",
          secondTermStartDate: secondTermStart ? format(secondTermStart, "yyyy-MM-dd") : "",
          secondTermEndDate: secondTermEnd ? format(secondTermEnd, "yyyy-MM-dd") : "",
          thirdTermStartDate: thirdTermStart ? format(thirdTermStart, "yyyy-MM-dd") : "",
          thirdTermEndDate: thirdTermEnd ? format(thirdTermEnd, "yyyy-MM-dd") : "",
        },
        sessionId: session.id,
      });

      toast({ title: "Session updated", description: "Academic session has been updated successfully.", type: "success" });
      setIsEditing(false);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";

      toast({
        title: "Failed to update",
        description: message,
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="">
      <div className="mx-auto mb-10 flex w-full flex-col gap-4 px-4 pb-12 md:w-150">
        <div className="flex items-center justify-between">
          <div className="text-text-default text-lg font-semibold">Academic Session & Term</div>
          {!isEditing && (
            <Button
              type="button"
              onClick={handleEdit}
              className="bg-bg-state-soft! hover:bg-bg-state-soft-hover! text-text-subtle border-border-darker flex h-7 items-center gap-1.5 border text-sm"
            >
              <Edit2 className="h-3.5 w-3.5" /> Edit
            </Button>
          )}
        </div>

        {isLoadingSession ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="bg-bg-input-soft h-9 w-full" />
            ))}
          </div>
        ) : (
          <div className="border-border-default grid w-full grid-cols-1 items-start gap-6 border-b pb-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">Academic Session</Label>
              {isEditing ? (
                <Select value={sessionName} onValueChange={setSessionName}>
                  <SelectTrigger className="bg-bg-input-soft! h-9! w-full border-none">
                    <SelectValue>
                      <span className="text-text-default text-sm font-medium">{sessionName || "Select session"}</span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-bg-card border-border-default">
                    {getAcademicYears(new Date().getFullYear() - 2).map(year => (
                      <SelectItem key={year} value={year} className="text-text-default text-sm font-medium">
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="bg-bg-input-soft text-text-default flex h-9 items-center rounded-md px-3 text-sm font-medium">
                  {sessionName || "—"}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">
                Current Term {isEditing && <span className="text-text-destructive">*</span>}
              </Label>
              {isEditing ? (
                <Select value={currentTerm} onValueChange={handleTermChange}>
                  <SelectTrigger className="bg-bg-input-soft! h-9! w-full border-none">
                    <SelectValue>
                      <span className="text-text-default text-sm font-medium capitalize">{currentTerm.toLowerCase() || "Select term"}</span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-bg-card border-border-default">
                    {terms.map((t: Term) => (
                      <SelectItem key={t.termId} value={t.term} className="text-text-default text-sm font-semibold capitalize">
                        {t.term.toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="bg-bg-input-soft text-text-default flex h-9 items-center rounded-md px-3 text-sm font-medium capitalize">
                  {currentTerm.toLowerCase() || "—"}
                </div>
              )}
            </div>

            {isEditing ? (
              <>
                <DateRangePicker
                  label="First Term Start Date"
                  date={firstTermStart}
                  setDate={setFirstTermStart}
                  className="bg-bg-input-soft! text-text-default h-9!"
                />
                <DateRangePicker
                  label="First Term End Date"
                  date={firstTermEnd}
                  setDate={setFirstTermEnd}
                  className="bg-bg-input-soft! text-text-default h-9!"
                />
                <DateRangePicker
                  label="Second Term Start Date"
                  date={secondTermStart}
                  setDate={setSecondTermStart}
                  className="bg-bg-input-soft! text-text-default h-9!"
                />
                <DateRangePicker
                  label="Second Term End Date"
                  date={secondTermEnd}
                  setDate={setSecondTermEnd}
                  className="bg-bg-input-soft! text-text-default h-9!"
                />
                <DateRangePicker
                  label="Third Term Start Date"
                  date={thirdTermStart}
                  setDate={setThirdTermStart}
                  className="bg-bg-input-soft! text-text-default h-9!"
                />
                <DateRangePicker
                  label="Third Term End Date"
                  date={thirdTermEnd}
                  setDate={setThirdTermEnd}
                  className="bg-bg-input-soft! text-text-default h-9!"
                />
              </>
            ) : (
              <>
                <ViewField label="First Term Start Date" value={firstTermStart ? format(firstTermStart, "yyyy/MM/dd") : ""} />
                <ViewField label="First Term End Date" value={firstTermEnd ? format(firstTermEnd, "yyyy/MM/dd") : ""} />
                <ViewField label="Second Term Start Date" value={secondTermStart ? format(secondTermStart, "yyyy/MM/dd") : ""} />
                <ViewField label="Second Term End Date" value={secondTermEnd ? format(secondTermEnd, "yyyy/MM/dd") : ""} />
                <ViewField label="Third Term Start Date" value={thirdTermStart ? format(thirdTermStart, "yyyy/MM/dd") : ""} />
                <ViewField label="Third Term End Date" value={thirdTermEnd ? format(thirdTermEnd, "yyyy/MM/dd") : ""} />
              </>
            )}
          </div>
        )}

        {isLoadingLevels && <Skeleton className="bg-bg-input-soft h-50 w-full" />}

        {isLevelError && (
          <div className="flex h-80 items-center justify-center">
            <ErrorComponent
              title="Could not get Branch"
              description="This is our problem, we are looking into it so as to serve you better"
              buttonText="Go to the Home page"
              url="/staff/"
            />
          </div>
        )}

        {!isLoadingLevels && !isLevelError && levels.length === 0 && (
          <div className="flex h-80 items-center justify-center">
            <ErrorComponent title="No Branch" description="No Branch has been added yet" buttonText="Add a branch" url="/staff/settings/general" />
          </div>
        )}

        <div className="text-text-default text-lg font-semibold">Branches & Levels</div>

        {!isLoadingLevels && !isLevelError && levels.length > 0 && (
          <div className="flex flex-col gap-6">
            {levels.map((level: Level, index: number) => (
              <div key={level.branchId} className="bg-bg-state-soft rounded-md p-1">
                <div className="flex items-center justify-between px-5 py-2">
                  <Badge className="bg-bg-badge-default! text-text-subtle rounded-md">Branch {index + 1}</Badge>
                </div>
                <div className="bg-bg-card flex flex-col gap-4 rounded-md px-5 py-6">
                  <div className="flex flex-col gap-2">
                    <Label className="text-text-default text-sm font-medium">Branch Name</Label>
                    <div className="bg-bg-input-soft! text-text-muted rounded-md border-none p-2 text-sm">{level.branchName}</div>
                  </div>
                  <div className="border-border-darker rounded-md border p-3">
                    <div className="text-text-default mb-3 text-sm font-medium">Levels</div>
                    <div className="flex flex-wrap gap-3">
                      {level.classLevels.map(lvl => (
                        <div
                          key={lvl.id}
                          className="bg-bg-card text-text-default border-border-darker flex h-8 items-center gap-3 rounded-md border p-2.5 text-sm capitalize shadow-xs md:h-9"
                        >
                          {lvl.levelName.replaceAll("_", " ").toLowerCase()}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isEditing && (
        <div className="border-border-default bg-bg-default absolute bottom-0 mx-auto flex w-full justify-between border-t px-4 py-3 md:px-36">
          <Button onClick={handleCancel} disabled={isSaving} className="bg-bg-state-soft! text-text-subtle h-7! rounded-md">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default! h-7! rounded-md">
            {isSaving && <Spinner className="text-text-white-default size-4" />}
            Save changes
          </Button>
        </div>
      )}
    </div>
  );
};
