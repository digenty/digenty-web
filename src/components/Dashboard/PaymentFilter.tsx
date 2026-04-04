"use client";

import { Term } from "@/api/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetTerms } from "@/hooks/queryHooks/useTerm";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";

export const PaymentFilter = ({ termSelected, setTermSelected }: { termSelected: Term | null; setTermSelected: (value: Term | null) => void }) => {
  const user = useLoggedInUser();
  const { data: terms, isPending: loadingTerms } = useGetTerms(user.schoolId);
  const [activeSession, setActiveSession] = useState<string | null>(null);

  useEffect(() => {
    if (terms) {
      const activeTerm = terms.data.terms.find((term: Term) => term.isActiveTerm);
      if (activeTerm && setTermSelected && !termSelected) {
        setTermSelected(activeTerm);
      }
      setActiveSession(terms.data.academicSessionName);
    }
  }, [terms, setTermSelected, termSelected]);

  return (
    <div className="space-y-3">
      <p className="text-text-default text-xs font-medium">Class Payment Completion</p>

      {loadingTerms || !terms ? (
        <Skeleton className="bg-bg-input-soft h-8 w-[160px]" />
      ) : (
        <Select
          onValueChange={value => {
            const term = terms.data.terms?.find((term: Term) => term.termId === Number(value));
            setTermSelected(term);
          }}
        >
          <SelectTrigger className="border-border-darker h-8! w-auto gap-2 border focus-visible:ring-0">
            <Calendar className="text-icon-black-muted size-4" />
            <span className="text-text-default text-sm font-medium capitalize">
              {activeSession} {termSelected?.term.toLowerCase()}
            </span>
          </SelectTrigger>
          <SelectContent className="bg-bg-card border-border-default border">
            {terms.data.terms.map((term: Term) => (
              <SelectItem key={term.termId} className="text-text-default text-sm font-medium capitalize" value={String(term.termId)}>
                {activeSession} {term.term.toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};
