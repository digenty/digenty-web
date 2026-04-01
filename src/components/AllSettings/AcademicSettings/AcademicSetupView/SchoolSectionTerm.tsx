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

const toDateRange = (dateStr: string | undefined): DateRange | undefined => {
  if (!dateStr) return undefined;
  try {
    const date = parseISO(dateStr);
    return { from: date, to: date };
  } catch {
    return undefined;
  }
};

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
  const [firstTermStart, setFirstTermStart] = useState<DateRange | undefined>();
  const [firstTermEnd, setFirstTermEnd] = useState<DateRange | undefined>();
  const [secondTermStart, setSecondTermStart] = useState<DateRange | undefined>();
  const [secondTermEnd, setSecondTermEnd] = useState<DateRange | undefined>();
  const [thirdTermStart, setThirdTermStart] = useState<DateRange | undefined>();
  const [thirdTermEnd, setThirdTermEnd] = useState<DateRange | undefined>();

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
      setFirstTermStart(toDateRange(first.startDate));
      setFirstTermEnd(toDateRange(first.endDate));
    }
    if (second) {
      setSecondTermStart(toDateRange(second.startDate));
      setSecondTermEnd(toDateRange(second.endDate));
    }
    if (third) {
      setThirdTermStart(toDateRange(third.startDate));
      setThirdTermEnd(toDateRange(third.endDate));
    }
  }, [terms]);

  const handleTermChange = (selected: string) => {
    setCurrentTerm(selected);
    const matched = findTerm(selected);
    if (!matched) return;
    if (selected === "FIRST") {
      setFirstTermStart(toDateRange(matched.startDate));
      setFirstTermEnd(toDateRange(matched.endDate));
    } else if (selected === "SECOND") {
      setSecondTermStart(toDateRange(matched.startDate));
      setSecondTermEnd(toDateRange(matched.endDate));
    } else if (selected === "THIRD") {
      setThirdTermStart(toDateRange(matched.startDate));
      setThirdTermEnd(toDateRange(matched.endDate));
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
      setFirstTermStart(toDateRange(first.startDate));
      setFirstTermEnd(toDateRange(first.endDate));
    }
    if (second) {
      setSecondTermStart(toDateRange(second.startDate));
      setSecondTermEnd(toDateRange(second.endDate));
    }
    if (third) {
      setThirdTermStart(toDateRange(third.startDate));
      setThirdTermEnd(toDateRange(third.endDate));
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
          firstTermStartDate: toDateString(firstTermStart),
          firstTermEndDate: toDateString(firstTermEnd),
          secondTermStartDate: toDateString(secondTermStart),
          secondTermEndDate: toDateString(secondTermEnd),
          thirdTermStartDate: toDateString(thirdTermStart),
          thirdTermEndDate: toDateString(thirdTermEnd),
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
                    {getAcademicYears().map(year => (
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
                  value={firstTermStart}
                  onChange={setFirstTermStart}
                  className="bg-bg-input-soft! text-text-default h-9!"
                />
                <DateRangePicker
                  label="First Term End Date"
                  value={firstTermEnd}
                  onChange={setFirstTermEnd}
                  className="bg-bg-input-soft! text-text-default h-9!"
                />
                <DateRangePicker
                  label="Second Term Start Date"
                  value={secondTermStart}
                  onChange={setSecondTermStart}
                  className="bg-bg-input-soft! text-text-default h-9!"
                />
                <DateRangePicker
                  label="Second Term End Date"
                  value={secondTermEnd}
                  onChange={setSecondTermEnd}
                  className="bg-bg-input-soft! text-text-default h-9!"
                />
                <DateRangePicker
                  label="Third Term Start Date"
                  value={thirdTermStart}
                  onChange={setThirdTermStart}
                  className="bg-bg-input-soft! text-text-default h-9!"
                />
                <DateRangePicker
                  label="Third Term End Date"
                  value={thirdTermEnd}
                  onChange={setThirdTermEnd}
                  className="bg-bg-input-soft! text-text-default h-9!"
                />
              </>
            ) : (
              <>
                <ViewField label="First Term Start Date" value={toDateString(firstTermStart).replaceAll("-", "/")} />
                <ViewField label="First Term End Date" value={toDateString(firstTermEnd).replaceAll("-", "/")} />
                <ViewField label="Second Term Start Date" value={toDateString(secondTermStart).replaceAll("-", "/")} />
                <ViewField label="Second Term End Date" value={toDateString(secondTermEnd).replaceAll("-", "/")} />
                <ViewField label="Third Term Start Date" value={toDateString(thirdTermStart).replaceAll("-", "/")} />
                <ViewField label="Third Term End Date" value={toDateString(thirdTermEnd).replaceAll("-", "/")} />
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
