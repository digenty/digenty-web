import { Term } from "@/api/types";
import { DateRangePicker } from "@/components/DatePicker";
import Edit from "@/components/Icons/Edit";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddSubmission, useGetSubmissionDeadline, useUpdateSubmissionDeadline } from "@/hooks/queryHooks/useResult";
import { useGetTerms } from "@/hooks/queryHooks/useTerm";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

interface TermDeadlineState {
  openDate: DateRange | undefined;
  closeDate: DateRange | undefined;
  autoLockAfterDeadline: boolean;
}

export const Submission = () => {
  const user = useLoggedInUser();
  const [isEditing, setIsEditing] = useState(false);
  const [termStates, setTermStates] = useState<Record<number, TermDeadlineState>>({});
  const { data: termLists, isLoading: isLoadingTerms } = useGetTerms(user.schoolId);
  const { data: deadlineData, isLoading: isLoadingDeadlines } = useGetSubmissionDeadline();
  const { mutate: updateSubmission, isPending: isUpdating } = useUpdateSubmissionDeadline();
  const { mutate: addSubmission, isPending: isAdding } = useAddSubmission();
  const terms = termLists?.data?.terms ?? [];
  const deadlines = deadlineData?.data ?? [];
  const isLoading = isLoadingTerms || isLoadingDeadlines;
  console.log(deadlines);

  useEffect(() => {
    if (isEditing) {
      const initial: Record<number, TermDeadlineState> = {};
      for (const deadline of deadlines) {
        initial[deadline.termId] = {
          openDate: deadline.openDate ? { from: new Date(deadline.openDate), to: undefined } : undefined,
          closeDate: deadline.closeDate ? { from: new Date(deadline.closeDate), to: undefined } : undefined,
          autoLockAfterDeadline: deadline.autoLockAfterDeadline,
        };
      }
      setTermStates(initial);
    }
  }, [isEditing]);

  const getDeadline = (termId: number) => deadlines.find((d: Term) => d.termId === termId);

  const getTermState = (termId: number): TermDeadlineState =>
    termStates[termId] ?? { openDate: undefined, closeDate: undefined, autoLockAfterDeadline: false };

  const updateTermState = (termId: number, updates: Partial<TermDeadlineState>) => {
    setTermStates(prev => ({
      ...prev,
      [termId]: { ...getTermState(termId), ...updates },
    }));
  };

  const handleSave = () => {
    const termsDeadline = terms.map((term: Term) => {
      const state = getTermState(term.termId);
      return {
        termId: term.termId,
        openDate: state.openDate?.from?.toISOString().split("T")[0] ?? "",
        closeDate: state.closeDate?.from?.toISOString().split("T")[0] ?? "",
        autoLockAfterDeadline: state.autoLockAfterDeadline,
      };
    });

    addSubmission(
      { termsDeadline },
      {
        onSuccess: () => {
          toast({ title: "Successful ", description: "Submission deadlines saved successfully.", type: "success" });
        },
        onError: (error: unknown) => {
          const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";

          toast({
            title: "Failed to add submission deadlines",
            description: message,
            type: "error",
          });
        },
      },
    );
    // };
    updateSubmission(
      { termsDeadline },
      {
        onSuccess: () => {
          toast({ title: "Successful", description: "Submission deadlines updated successfully.", type: "success" });
          setIsEditing(false);
        },
        onError: (error: unknown) => {
          const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
          toast({ title: "Failed to update submission deadlines", description: message, type: "error" });
        },
      },
    );
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTermStates({});
  };

  return (
    <div className="mx-auto my-8 flex w-full max-w-181 items-center justify-center">
      <div className="flex w-full flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="text-text-default text-xl font-semibold">Submission Deadline</div>
          {!isLoading && !isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              className="border-border-darker bg-bg-state-secondary hover:bg-bg-state-secondary-hover! text-text-default h-8 border"
            >
              <Edit fill="var(--color-icon-default-muted)" /> Edit
            </Button>
          )}
        </div>

        {isLoading && (
          <div className="flex flex-col gap-4">
            <Skeleton className="bg-bg-input-soft h-40 w-full" />
            <Skeleton className="bg-bg-input-soft h-40 w-full" />
            <Skeleton className="bg-bg-input-soft h-40 w-full" />
          </div>
        )}

        {!isLoading && (
          <>
            {terms.map((term: Term) => {
              const deadline = getDeadline(term.termId);
              const state = getTermState(term.termId);

              return (
                <div key={term.termId} className="bg-bg-card border-border-darker w-full rounded-md border p-4 md:p-6">
                  <div className="text-text-default text-md mb-4 font-semibold">{term.term} Term</div>

                  {!isEditing && (
                    <>
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <div className="flex w-full flex-col gap-1">
                          <span className="text-text-muted text-sm font-normal">Open Date</span>
                          <div className="bg-bg-input-soft text-text-default flex h-9 w-full items-center rounded-md px-3 text-sm">
                            {deadline?.openDate ?? <span className="text-text-muted">Not set</span>}
                          </div>
                        </div>
                        <div className="flex w-full flex-col gap-1">
                          <span className="text-text-muted text-sm font-normal">Close Date</span>
                          <div className="bg-bg-input-soft text-text-default flex h-9 w-full items-center rounded-md px-3 text-sm">
                            {deadline?.closeDate ?? <span className="text-text-muted">Not set</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox checked={deadline?.autoLockAfterDeadline ?? false} disabled />
                        <div className="text-text-muted text-sm font-medium">Auto-lock after deadline</div>
                      </div>
                    </>
                  )}

                  {isEditing && (
                    <>
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <DateRangePicker
                          label="Open Date"
                          value={state.openDate}
                          onChange={val => updateTermState(term.termId, { openDate: val, closeDate: undefined })}
                          className="bg-bg-input-soft! text-text-default h-9! w-full"
                        />
                        <DateRangePicker
                          label="Close Date"
                          value={state.closeDate}
                          disabled={
                            state.openDate?.from
                              ? { before: new Date(new Date(state.openDate.from).setDate(state.openDate.from.getDate() + 1)) }
                              : undefined
                          }
                          onChange={val => updateTermState(term.termId, { closeDate: val })}
                          className="bg-bg-input-soft! text-text-default h-9! w-full"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={state.autoLockAfterDeadline}
                          onCheckedChange={checked => updateTermState(term.termId, { autoLockAfterDeadline: checked === true })}
                        />
                        <div className="text-text-muted text-sm font-medium">Auto-lock after deadline</div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}

            {isEditing && (
              <div className="flex w-full items-center justify-between">
                <Button className="bg-bg-state-soft! text-text-subtle rounded-md" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isUpdating || isAdding}
                  className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default"
                >
                  {isUpdating || isAdding ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
