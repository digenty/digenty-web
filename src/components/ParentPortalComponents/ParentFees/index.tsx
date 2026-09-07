"use client";

import { useEffect, useState } from "react";
import { StudentFilter } from "../FilterStudents";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Button } from "@/components/ui/button";

import { PaymentHistory } from "./PaymentHistory";
import { useRouter } from "next/navigation";
import { Calendar } from "@digenty/icons";
import { FeesBreakdown } from "./FessBreakdown";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetActiveParentPortalTerm, useGetParentPortalTerms } from "@/hooks/queryHooks/useParentLookup";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { TermLookup } from "@/api/parent-lookup";

const tabs = ["Fees Breakdown", "Payment History"];
export const ParentFees = () => {
  const user = useLoggedInUser();
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [termSelected, setTermSelected] = useState<TermLookup | null>(null);
  const router = useRouter();

  const { data: activeTerm, isLoading: loadingActiveTerm } = useGetActiveParentPortalTerm();
  const { data: terms, isLoading: loadingTerms } = useGetParentPortalTerms(activeTerm?.academicSessionId);

  useEffect(() => {
    if (activeTerm && !termSelected) {
      setTermSelected(activeTerm);
    }
  }, [activeTerm, termSelected]);

  return (
    <div className="flex w-full flex-col gap-10 p-4 md:p-8">
      <div className="flex w-full items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <div className="text-text-default text-2xl font-semibold">Fees</div>
          <div className="text-text-muted text-xs">Manage and view your child&apos;s school fees, payment history, and invoices.</div>
        </div>
        <div className="hidden md:block">
          <StudentFilter parentId={user?.id} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        {loadingActiveTerm || loadingTerms || !terms ? (
          <Skeleton className="bg-bg-input-soft h-8 w-40 rounded-md" />
        ) : (
          <Select
            value={termSelected ? String(termSelected.id) : ""}
            onValueChange={value => {
              const term = terms.find(t => String(t.id) === value);
              setTermSelected(term ?? null);
            }}
          >
            <SelectTrigger className="border-border-darker h-8! w-auto border">
              <SelectValue className="text-text-default flex font-medium">
                <Calendar className="text-icon-black-muted size-4" />
                <p className="text-text-default text-sm">
                  {termSelected ? `${termSelected.academicSessionName} ${termSelected.term.toLowerCase()}` : "Select Term"}
                </p>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-border-default border">
              {terms.map(t => (
                <SelectItem key={t.id} className="text-text-default" value={String(t.id)}>
                  {t.academicSessionName} {t.term.toLocaleLowerCase()} term
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* <Button
          onClick={() => router.push("/parents/parent-fees/fees-to-pay")}
          className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default rounded-full"
        >
          Record Payment
        </Button> */}
      </div>

      <div className="bg-bg-state-soft flex h-9 w-full rounded-md p-0.5 md:w-87">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-full items-center px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab ? "text-text-default bg-bg-state-secondary! rounded-md" : "text-text-muted hover:text-text-default"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Fees Breakdown" && <FeesBreakdown termId={termSelected?.id} />}
      {activeTab === "Payment History" && <PaymentHistory />}
    </div>
  );
};
