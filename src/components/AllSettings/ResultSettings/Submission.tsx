import { Term } from "@/api/types";
import { DateRangePicker } from "@/components/DatePicker";
import Edit from "@/components/Icons/Edit";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useAddSubmission, useGetSubmissionDeadline, useUpdateSubmissionDeadline } from "@/hooks/queryHooks/useResult";
import { useGetTerms } from "@/hooks/queryHooks/useTerm";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { resultKeys } from "@/queries/result";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface TermDeadlineState {
  openDate: Date | undefined;
  closeDate: Date | undefined;
  autoLockAfterDeadline: boolean;
}

interface SubmissionDeadline {
  termId: number;
  openDate: string | null;
  closeDate: string | null;
  autoLockAfterDeadline: boolean;
}

const toDateString = (date: Date | undefined): string => (date ? date.toISOString().split("T")[0] : "");

const defaultTermState = (): TermDeadlineState => ({
  openDate: undefined,
  closeDate: undefined,
  autoLockAfterDeadline: false,
});

const seedTermStates = (deadlines: SubmissionDeadline[]): Record<number, TermDeadlineState> => {
  const map: Record<number, TermDeadlineState> = {};
  for (const d of deadlines) {
    map[d.termId] = {
      openDate: d.openDate ? new Date(d.openDate) : undefined,
      closeDate: d.closeDate ? new Date(d.closeDate) : undefined,
      autoLockAfterDeadline: d.autoLockAfterDeadline,
    };
  }
  return map;
};

export const Submission = () => {
  const user = useLoggedInUser();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const [hasOpenedForm, setHasOpenedForm] = useState(false);
  const [termStates, setTermStates] = useState<Record<number, TermDeadlineState>>({});

  const { data: termLists, isLoading: isLoadingTerms } = useGetTerms(user.schoolId);
  const { data: deadlineData, isLoading: isLoadingDeadlines } = useGetSubmissionDeadline();
  const { mutate: updateSubmission, isPending: isUpdating } = useUpdateSubmissionDeadline();
  const { mutate: addSubmission, isPending: isAdding } = useAddSubmission();

  const terms: Term[] = termLists?.data?.terms ?? [];
  const deadlines: SubmissionDeadline[] = deadlineData?.data ?? [];
  const isLoading = isLoadingTerms || isLoadingDeadlines;
  const hasExistingDeadlines = deadlines.length > 0;
  const isBusy = isUpdating || isAdding;

  useEffect(() => {
    if (isEditing && deadlines.length > 0) {
      setTermStates(seedTermStates(deadlines));
    }
  }, [isEditing, deadlines]);

  const getDeadline = (termId: number): SubmissionDeadline | undefined => deadlines.find(d => d.termId === termId);

  const getTermState = (termId: number): TermDeadlineState => termStates[termId] ?? defaultTermState();

  const updateTermState = (termId: number, updates: Partial<TermDeadlineState>) => {
    setTermStates(prev => ({
      ...prev,
      [termId]: { ...getTermState(termId), ...updates },
    }));
  };

  const validate = (): boolean => {
    const atLeastOneFilled = terms.some(term => {
      const state = getTermState(term.termId);
      return state.openDate && state.closeDate;
    });

    if (!atLeastOneFilled) {
      toast({
        title: "Validation Error",
        description: "Please fill in at least one term's open and close dates before saving.",
        type: "error",
      });
      return false;
    }

    for (const term of terms) {
      const state = getTermState(term.termId);
      const termLabel = `${term.term.charAt(0) + term.term.slice(1).toLowerCase()} Term`;

      if (state.openDate && !state.closeDate) {
        toast({
          title: "Validation Error",
          description: `${termLabel}: Please set a close date.`,
          type: "error",
        });
        return false;
      }
      if (!state.openDate && state.closeDate) {
        toast({
          title: "Validation Error",
          description: `${termLabel}: Please set an open date.`,
          type: "error",
        });
        return false;
      }
    }

    return true;
  };

  const handleSave = () => {
    if (!validate()) return;

    const termsDeadline = terms.map((term: Term) => {
      const state = getTermState(term.termId);
      return {
        termId: term.termId,
        openDate: toDateString(state.openDate),
        closeDate: toDateString(state.closeDate),
        autoLockAfterDeadline: state.autoLockAfterDeadline,
      };
    });

    const onSuccess = () => {
      toast({
        title: "Successful",
        description: `Submission deadlines ${hasExistingDeadlines ? "updated" : "saved"} successfully.`,
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: resultKeys.getSubmissionDeadline });

      setIsEditing(false);
      setHasOpenedForm(false);
    };

    const onError = (error: unknown) => {
      const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      toast({
        title: `Failed to ${hasExistingDeadlines ? "update" : "save"} submission deadlines`,
        description: message,
        type: "error",
      });
    };

    if (hasExistingDeadlines) {
      updateSubmission({ termsDeadline }, { onSuccess, onError });
    } else {
      addSubmission({ termsDeadline }, { onSuccess, onError });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setHasOpenedForm(false);
    setTermStates({});
  };

  return (
    <div className="mx-auto my-8 flex w-full max-w-181 items-center justify-center">
      <div className="flex w-full flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="text-text-default text-xl font-semibold">Submission Deadline</div>
          {!isLoading && hasExistingDeadlines && !isEditing && (
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

        {!isLoading && !hasExistingDeadlines && !hasOpenedForm && (
          <div className="flex h-screen items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="text-text-muted text-sm">No submission deadlines have been set yet.</div>
              <Button
                onClick={() => {
                  setHasOpenedForm(true);
                  setIsEditing(true);
                }}
                className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default! h-8! rounded-md px-4"
              >
                Set Up Submission Deadlines
              </Button>
            </div>
          </div>
        )}

        {!isLoading && (hasExistingDeadlines || isEditing) && (
          <>
            {terms.map((term: Term) => {
              const deadline = getDeadline(term.termId);
              const state = getTermState(term.termId);

              return (
                <div key={term.termId} className="bg-bg-card border-border-darker w-full rounded-md border p-4 md:p-6">
                  <div className="text-text-default text-md mb-4 font-semibold capitalize">
                    {term.term.charAt(0) + term.term.slice(1).toLowerCase()} Term
                  </div>

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
                          date={state.openDate}
                          setDate={val => updateTermState(term.termId, { openDate: val, closeDate: undefined })}
                          className="bg-bg-input-soft! text-text-default h-9! w-full"
                        />
                        <DateRangePicker
                          label="Close Date"
                          date={state.closeDate}
                          setDate={val => updateTermState(term.termId, { closeDate: val })}
                          disabled={
                            state.openDate
                              ? {
                                  before: new Date(new Date(state.openDate).setDate(state.openDate.getDate() + 1)),
                                }
                              : undefined
                          }
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
                <Button onClick={handleCancel} disabled={isBusy} className="bg-bg-state-soft! text-text-subtle rounded-md">
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isBusy}
                  className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default"
                >
                  {isBusy ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      {isEditing && (
        <div className="border-border-default bg-bg-default absolute bottom-0 mx-auto flex w-full justify-between border-t px-4 py-3 md:px-36">
          <Button onClick={handleCancel} disabled={isUpdating} className="bg-bg-state-soft! text-text-subtle h-7! rounded-md">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isUpdating}
            className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default! h-7! rounded-md"
          >
            {isUpdating && <Spinner className="text-text-white-default size-4" />}
            Save changes
          </Button>
        </div>
      )}
    </div>
  );
};
