"use client";

import { AcademicSession, Branch, Term } from "@/api/types";
import { DateRangePicker } from "@/components/DatePicker";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useGetTerms } from "@/hooks/queryHooks/useTerm";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { toast } from "@/components/Toast";
import { format, parseISO } from "date-fns";
import React, { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { Edit2 } from "lucide-react";
import { useGetAcademic, useUpdateAcademic } from "@/hooks/queryHooks/useAcademic";

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
    <Label className="text-text-muted text-xs">{label}</Label>
    <div className="text-text-default bg-bg-input-soft rounded-md p-2 text-sm font-medium">{value || "—"}</div>
  </div>
);

export const SchoolSectionAndTerm = () => {
  const user = useLoggedInUser();
  const schoolId = user?.schoolId;
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [term, setTerm] = useState("");
  const [firstTermStart, setFirstTermStart] = useState<DateRange | undefined>();
  const [firstTermEnd, setFirstTermEnd] = useState<DateRange | undefined>();
  const [secondTermStart, setSecondTermStart] = useState<DateRange | undefined>();
  const [secondTermEnd, setSecondTermEnd] = useState<DateRange | undefined>();
  const [thirdTermStart, setThirdTermStart] = useState<DateRange | undefined>();
  const [thirdTermEnd, setThirdTermEnd] = useState<DateRange | undefined>();
  const { data: academicResponse, isLoading: isLoadingAcademic } = useGetAcademic();
  const { data: termList } = useGetTerms(schoolId);
  const { data: branchData, isLoading: isLoadingBranch, isError: isBranchError } = useGetBranches();
  const { mutateAsync: updateAcademic } = useUpdateAcademic();
  const session: AcademicSession | undefined = academicResponse?.data?.[0];
  const terms: Term[] = termList?.data?.terms ?? [];
  const branches = branchData?.data?.content ?? [];

  useEffect(() => {
    if (!session) return;
    setTerm(session.name ?? "");
    setFirstTermStart(toDateRange(session.firstTermStartDate));
    setFirstTermEnd(toDateRange(session.firstTermEndDate));
    setSecondTermStart(toDateRange(session.secondTermStartDate));
    setSecondTermEnd(toDateRange(session.secondTermEndDate));
    setThirdTermStart(toDateRange(session.thirdTermStartDate));
    setThirdTermEnd(toDateRange(session.thirdTermEndDate));
  }, [session]);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    if (session) {
      setTerm(session.name ?? "");
      setFirstTermStart(toDateRange(session.firstTermStartDate));
      setFirstTermEnd(toDateRange(session.firstTermEndDate));
      setSecondTermStart(toDateRange(session.secondTermStartDate));
      setSecondTermEnd(toDateRange(session.secondTermEndDate));
      setThirdTermStart(toDateRange(session.thirdTermStartDate));
      setThirdTermEnd(toDateRange(session.thirdTermEndDate));
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!session?.id) return;
    setIsSaving(true);
    try {
      await updateAcademic({
        payload: {
          name: term,
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
        title: "Failed to update session",
        description: message,
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="">
      <div className="mx-auto flex w-full flex-col gap-4 md:w-150 md:px-4">
        <div className="flex items-center justify-between">
          <div className="text-text-default text-xl font-semibold">School, Session & Term</div>
          {!isEditing && (
            <Button
              type="button"
              onClick={handleEdit}
              className="bg-bg-state-secondary border-border-default text-text-default flex items-center gap-1.5 rounded-md border text-sm"
            >
              <Edit2 className="h-3.5 w-3.5" /> Edit
            </Button>
          )}
        </div>

        <div className="text-text-default text-lg font-semibold">Academic Session & Term</div>

        {isLoadingAcademic ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="bg-bg-input-soft h-9 w-full" />
            ))}
          </div>
        ) : (
          <div className="border-border-default grid w-full grid-cols-1 items-start gap-6 border-b pb-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">Academic Session</Label>
              <div className="bg-bg-input-soft text-text-default flex h-9 items-center rounded-md px-3 text-sm font-medium">
                {session?.name || "—"}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">
                Current Term <span className="text-text-destructive">*</span>
              </Label>
              {isEditing ? (
                <Select value={term} onValueChange={setTerm}>
                  <SelectTrigger className="bg-bg-input-soft! h-9! w-full border-none">
                    <SelectValue>
                      <span className="text-text-default text-sm font-medium">{term || "Select term"}</span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-bg-card border-border-default">
                    {terms.map((t: Term) => (
                      <SelectItem key={t.termId} value={t.term} className="text-text-default text-sm font-semibold">
                        {t.term}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="bg-bg-input-soft text-text-default flex h-9 items-center rounded-md px-3 text-sm font-medium">{term || "—"}</div>
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
                <ViewField label="First Term Start Date" value={toDateString(firstTermStart)} />
                <ViewField label="First Term End Date" value={toDateString(firstTermEnd)} />
                <ViewField label="Second Term Start Date" value={toDateString(secondTermStart)} />
                <ViewField label="Second Term End Date" value={toDateString(secondTermEnd)} />
                <ViewField label="Third Term Start Date" value={toDateString(thirdTermStart)} />
                <ViewField label="Third Term End Date" value={toDateString(thirdTermEnd)} />
              </>
            )}
          </div>
        )}

        {isLoadingBranch && <Skeleton className="bg-bg-input-soft h-50 w-full" />}

        {isBranchError && (
          <div className="flex h-80 items-center justify-center">
            <ErrorComponent
              title="Could not get Branch"
              description="This is our problem, we are looking into it so as to serve you better"
              buttonText="Go to the Home page"
              url="/"
            />
          </div>
        )}

        {!isLoadingBranch && !isBranchError && branches.length === 0 && (
          <div className="flex h-80 items-center justify-center">
            <ErrorComponent title="No Branch" description="No Branch has been added yet" buttonText="Add a branch" url="/settings/general" />
          </div>
        )}

        {!isLoadingBranch && !isBranchError && branches.length > 0 && (
          <div className="flex flex-col gap-6">
            {branches.map((branch: Branch, index: number) => (
              <div key={branch.id} className="bg-bg-state-soft rounded-md p-1">
                <div className="flex items-center justify-between px-5 py-2">
                  <Badge className="bg-bg-badge-default! text-text-subtle rounded-md">Branch {index + 1}</Badge>
                </div>
                <div className="bg-bg-card flex flex-col gap-4 rounded-md px-5 py-6">
                  <div className="flex flex-col gap-2">
                    <Label className="text-text-default text-sm font-medium">Branch Name</Label>
                    <Input className="bg-bg-input-soft! text-text-muted rounded-md border-none" value={String(branch.name)} readOnly />
                  </div>
                  <div className="border-border-darker rounded-md border p-3">
                    <div className="text-text-default mb-3 text-sm font-medium">Levels</div>
                    <div className="flex flex-wrap gap-3">
                      {["Creche", "Kindergarten", "Nursery", "Primary", "Secondary"].map(level => (
                        <div
                          key={level}
                          className="bg-bg-card text-text-default border-border-darker flex h-8 items-center gap-3 rounded-md border p-2.5 text-sm shadow-xs md:h-9"
                        >
                          {/* <Checkbox checked={branch.levels?.includes(level.toUpperCase())} disabled /> */}
                          {level}
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
        <div className="border-border-default bg-bg-default sticky bottom-0 mx-auto flex w-full justify-between border-t py-3 md:px-36">
          <Button onClick={handleCancel} disabled={isSaving} className="bg-bg-state-soft! text-text-subtle rounded-md">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default rounded-md"
          >
            {isEditing ? "Save changes" : "Saving"}
          </Button>
        </div>
      )}
    </div>
  );
};
