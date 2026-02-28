import { Term } from "@/api/types";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { MobileDrawer } from "@/components/MobileDrawer";
import { StudentResult } from "@/components/StudentResult";
import { Button } from "@/components/ui/button";
import { SelectTrigger, Select, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetStudentReport } from "@/hooks/queryHooks/useStudent";
import { useGetTerms } from "@/hooks/queryHooks/useTerms";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { Calendar } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const termsOptions = ["24/25 Third Term", "24/25 Second Term", "24/25 First Term"];

export default function StudentAcademicRecord({ studentId, armId }: { studentId: number; armId: number | null }) {
  const [termSelected, setTermSelected] = useState<Term | null>(null);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const user = useLoggedInUser();
  const { data: terms, isPending: loadingTerms } = useGetTerms(user.schoolId);
  const { data: reportData, isPending: loadingReport, isError } = useGetStudentReport({ studentId, termId: termSelected?.termId, armId });

  useEffect(() => {
    if (terms) {
      const activeTerm = terms.data.terms.find((term: Term) => term.isActiveTerm);
      setTermSelected(activeTerm);
      setActiveSession(terms.data.academicSessionName);
    }
  }, [setActiveSession, setTermSelected, terms]);
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-text-default text-lg font-semibold">Academic Records</h2>
        {/* <Select value={termSelected} onValueChange={setTermSelected}>
          <SelectTrigger className="border-border-darker h-8 w-auto border focus-visible:ring-0">
            <SelectValue>
              <div className="flex items-center gap-2">
                <Calendar className="text-icon-black-muted size-4" />
                <span className="text-text-default text-sm font-semibold">{termSelected}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-bg-card border-border-default">
            {termsOptions.map(term => (
              <SelectItem key={term} value={term} className="text-text-default text-sm font-semibold">
                {term}
              </SelectItem>
            ))}
          </SelectContent>
        </Select> */}

        <div className="hidden md:block">
          {!terms || loadingTerms ? (
            <Skeleton className="bg-bg-input-soft h-9 w-full" />
          ) : (
            <Select
              onValueChange={value => {
                const term = terms.data.terms?.find((term: Term) => term.termId === Number(value));
                setTermSelected(term);
              }}
            >
              <SelectTrigger className="border-border-darker h-8! w-fit border focus-visible:ring-0">
                <Calendar className="text-icon-black-muted size-4" />
                <span className="text-text-default text-sm font-medium capitalize">
                  {activeSession} {termSelected?.term.toLowerCase()}
                </span>
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-border-default">
                {terms.data.terms.map((term: Term) => (
                  <SelectItem key={term.termId} value={String(term.termId)} className="text-text-default text-sm font-medium capitalize">
                    {activeSession} {term.term.toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="md:hidden">
          <Button className="bg-bg-state-soft block size-7 rounded-md p-1.5 md:hidden" onClick={() => setIsFilterOpen(true)}>
            <Image src="/icons/open-filter-modal.svg" alt="filter icon" width={20} height={20} />
          </Button>

          <MobileDrawer open={isFilterOpen} setIsOpen={setIsFilterOpen} title="Filter">
            <div className="flex w-full flex-col gap-4 px-4 py-4">
              {!terms || loadingTerms ? (
                <Skeleton className="bg-bg-input-soft h-9 w-full" />
              ) : (
                <div className="flex flex-col gap-2">
                  {terms.data.terms.map((term: Term) => (
                    <Button
                      onClick={() => {
                        setTermSelected(term);
                        setIsFilterOpen(false);
                      }}
                      key={term.termId}
                      className="text-text-default justify-start text-sm font-medium capitalize"
                    >
                      {activeSession} {term.term.toLowerCase()}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </MobileDrawer>
        </div>
      </div>

      {isError && (
        <div className="flex h-80 items-center justify-center">
          <ErrorComponent
            title="Could not get Student's report"
            description="This is our problem, we are looking into it so as to serve you better"
            buttonText="Go to the Home page"
          />
        </div>
      )}
      {loadingReport && <Skeleton className="bg-bg-input-soft h-100 w-full" />}

      {!loadingReport && !isError && !reportData && (
        <div className="flex h-80 items-center justify-center">
          <ErrorComponent title="No Student's report" description="No report for this student yet" />
        </div>
      )}

      {/* Student result table */}
      {!loadingReport && !isError && reportData && (
        <div className="md:px-25 lg:px-35 xl:px-40">
          <StudentResult studentReport={reportData?.data} termSelected={termSelected} />
        </div>
      )}
    </div>
  );
}
