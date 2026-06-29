"use client";

import { Calendar } from "@digenty/icons";
import { useEffect } from "react";

import { Term } from "@/api/types";
import { useGetTerms } from "@/hooks/queryHooks/useTerm";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";

import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { Skeleton } from "../ui/skeleton";

type Props = {
  termId: number | undefined;
  onTermChange: (termId: number | undefined) => void;
};

export const CommunicationsHeader = ({ termId, onTermChange }: Props) => {
  const user = useLoggedInUser();
  const { data: terms, isPending: loadingTerms } = useGetTerms(user.schoolId);

  useBreadcrumb([{ label: "Communications", url: "/staff/communications" }]);

  // Auto-select the active term on first load
  useEffect(() => {
    if (terms && !termId) {
      const active: Term | undefined = terms.data.terms.find((t: Term) => t.isActiveTerm);
      if (active) onTermChange(active.termId);
    }
  }, [terms]);

  const sessionName: string = terms?.data?.academicSessionName ?? "";

  return (
    <div className="flex w-full items-center justify-between">
      <h2 className="text-text-default text-xl font-semibold">Overview</h2>

      {loadingTerms ? (
        <Skeleton className="bg-bg-input-soft h-8 w-36" />
      ) : (
        <Select
          value={termId ? String(termId) : undefined}
          onValueChange={value => onTermChange(Number(value))}
        >
          <SelectTrigger className="border-border-darker h-8! w-auto border focus-visible:ring-0">
            <div className="flex items-center gap-2">
              <Calendar fill="var(--color-icon-black-muted)" className="size-4" />
              <span className="text-text-default text-sm font-medium capitalize">
                {sessionName} {terms?.data?.terms?.find((t: Term) => t.termId === termId)?.term?.toLowerCase() ?? "Select term"}
              </span>
            </div>
          </SelectTrigger>
          <SelectContent className="bg-bg-card border-border-default">
            {(terms?.data?.terms ?? []).map((term: Term) => (
              <SelectItem key={term.termId} value={String(term.termId)} className="text-text-default text-sm capitalize">
                {sessionName} {term.term.toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};
