import { Calendar, CheckboxCircleFill, Question, ShareBox } from "@digenty/icons";
import { Term } from "@/api/types";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetTerms } from "@/hooks/queryHooks/useTerm";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { cn } from "@/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { StudentRow } from "./students";
import { SubmitClassReportModal } from "./SubmitClassReportModal";
import { SubmitPromotionModal } from "./SubmitPromotionModal";
import { useSetPromotionDecision, useSubmitClassReport } from "@/hooks/queryHooks/useClass";
import { toast } from "@/components/Toast";
import RequestEdit from "../../../RequestEditAccess";
import { Decision } from ".";
import { useGetActiveSession } from "@/hooks/queryHooks/useAcademic";

export const ClassReportHeader = ({
  students,
  activeFilter,
  setActiveFilter,
  termSelected,
  setTermSelected,
  activeSession,
  setActiveSession,
  classArmName,
  onExport,
  classArmReportId,
  status,
  decisions,
}: {
  students: StudentRow[];
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  termSelected: Term | null;
  setTermSelected: (term: Term) => void;
  activeSession: string | null;
  setActiveSession: React.Dispatch<React.SetStateAction<string | null>>;
  classArmName: string;
  onExport?: () => void;
  classArmReportId?: number;
  status?: string;
  decisions: Decision[];
}) => {
  const path = usePathname();
  const armId = path.split("/")[5];
  const classId = path.split("/")[7];

  const isMobile = useIsMobile();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openPromotionModal, setOpenPromotionModal] = useState<boolean>(false);
  const [openRequest, setOpenRequest] = useState<boolean>(false);

  const user = useLoggedInUser();
  const schoolId = user?.schoolId;

  const { data: terms, isFetching: isLoadingTerm } = useGetTerms(schoolId!);
  const { data: session } = useGetActiveSession();

  useEffect(() => {
    if (terms) {
      const activeTerm = terms.data.terms.find((term: Term) => term.isActiveTerm);
      setTermSelected(activeTerm);
      setActiveSession(terms.data.academicSessionName);
    }
  }, [setActiveSession, setTermSelected, terms]);

  const handleOpenModal = () => {
    if (activeFilter !== "spreadsheet") return;
    setOpenModal(true);
  };

  const { mutate: submitReport, isPending: isSubmitting } = useSubmitClassReport();
  const { mutate: setDecision, isPending: isSaving } = useSetPromotionDecision();

  const handleReportSubmission = () => {
    if (classArmReportId) {
      submitReport(
        {
          classArmReportId: classArmReportId,
          status: "PENDING_APPROVAL",
        },
        {
          onSuccess: () => {
            toast({ title: "Submitted", description: "Class report submitted successfully", type: "success" });
            setOpenModal(false);
          },
          onError: () => {
            toast({ title: "Failed to submit", description: "Failed to submit class report", type: "error" });
          },
        },
      );
    }
  };

  const handlePromotionSubmission = () => {
    const payload = {
      armId: Number(armId),
      sessionId: session?.data?.id as number,
      decisions: decisions.map((decision: Decision) => ({
        studentId: decision.studentId,
        status: decision.status,
        toClassId: decision.toClassId,
        toArmId: decision.toArmId,
      })),
    };

    setDecision(payload, {
      onSuccess: () => {
        toast({ title: "Success", description: "Promotions saved successfully", type: "success" });
        setOpenPromotionModal(false);
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to save promotions", type: "error" });
      },
    });
  };

  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isMobile && activeFilter !== "spreadsheet" && activeFilter !== "promotion" && activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeFilter, isMobile]);

  return (
    <div className="w-min-full w-screen pr-12">
      {openModal && (
        <SubmitClassReportModal open={openModal} onOpenChange={setOpenModal} onConfirm={handleReportSubmission} isLoading={isSubmitting} />
      )}
      {openPromotionModal && (
        <SubmitPromotionModal
          open={openPromotionModal}
          onOpenChange={setOpenPromotionModal}
          onConfirm={handlePromotionSubmission}
          isLoading={isSaving}
        />
      )}
      {openRequest && <RequestEdit open={openRequest} onOpenChange={setOpenRequest} classId={Number(classId)} armId={Number(armId)} />}

      <div className="border-border-default border-b md:p-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between md:px-8 md:py-2">
          <div className="flex items-center justify-between gap-4 md:justify-start">
            <h2 className="text-text-default truncate px-4 py-2 text-lg font-semibold md:p-0">{classArmName}</h2>

            {activeFilter !== "promotion" && (
              <>
                {isLoadingTerm || !terms ? (
                  <Skeleton className="bg-bg-input-soft h-8 w-[200px]" />
                ) : (
                  <Select
                    onValueChange={value => {
                      const term = terms.data.terms?.find((term: Term) => term.termId === Number(value));
                      setTermSelected(term);
                    }}
                  >
                    <SelectTrigger className="border-border-darker h-8! w-fit border focus-visible:ring-0">
                      <Calendar fill="var(--color-icon-default-muted )" className="size-4" />
                      <span className="text-text-default text-sm font-medium capitalize">
                        {activeSession} {termSelected?.term.toLowerCase()}
                      </span>
                    </SelectTrigger>
                    <SelectContent className="bg-bg-card border-border-default">
                      {terms?.data?.terms?.map((term: Term) => (
                        <SelectItem key={term.termId} value={String(term.termId)} className="text-text-default text-sm font-medium capitalize">
                          {activeSession} {term.term.toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </>
            )}
          </div>

          <div className="border-border-default overflow-x-auto border-t px-4 py-2 md:border-none md:p-0">
            <div className="flex items-center gap-2 md:gap-1">
              <Button
                size="sm"
                onClick={onExport}
                className="border-border-default bg-bg-state-secondary text-text-default flex h-8 items-center gap-1 border text-sm md:flex-auto"
              >
                <ShareBox fill="var(--color-icon-default-muted)" /> Export
              </Button>

              {status === "NOT_SUBMITTED" && (
                <Button
                  onClick={handleOpenModal}
                  size="sm"
                  className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! flex h-8 items-center gap-1 text-sm font-normal md:w-fit"
                >
                  <CheckboxCircleFill fill="var(--color-icon-white-default)" className="size-3" />
                  Submit
                </Button>
              )}

              {/* {promotionStatus === "NOT_SUBMITTED" && activeFilter === "promotion" && (
                <Button
                  onClick={() => setOpenPromotionModal(true)}
                  size="sm"
                  className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! flex h-8 items-center gap-1 text-sm font-normal md:w-fit"
                >
                  <CheckboxCircleFill fill="var(--color-icon-white-default)" className="size-3" />
                  Submit
                </Button>
              )} */}

              {status === "PENDING_APPROVAL" && (
                <Button
                  size="sm"
                  onClick={() => setOpenRequest(true)}
                  className="border-border-default bg-bg-state-secondary text-text-default flex h-8 w-auto items-center justify-between gap-1 border text-sm md:flex-auto"
                >
                  <Question fill="var(--color-icon-default-muted)" /> Request Edit Access
                </Button>
              )}

              {status === "EDIT_REQUEST" && (
                <Button
                  disabled
                  size="sm"
                  className="border-border-default bg-bg-state-secondary text-text-default flex h-8 w-auto items-center justify-between gap-1 border text-sm md:flex-auto"
                >
                  <Question fill="var(--color-icon-default-muted)" /> Requested Edit Access
                </Button>
              )}

              {status === "APPROVED" && (
                <Button
                  size="sm"
                  className="border-border-default bg-bg-basic-green-subtle text-bg-basic-green-strong flex h-8 w-auto items-center justify-between gap-1 border text-sm md:flex-auto"
                >
                  <Question fill="var(--color-bg-basic-green-strong)" /> Approved
                </Button>
              )}
            </div>
          </div>

          {isMobile && (
            <div className="border-border-default hide-scrollbar flex w-screen overflow-x-auto border-t py-2">
              <div className="bg-bg-card sticky left-0 z-10 flex gap-2 px-4">
                <Button
                  onClick={() => setActiveFilter("spreadsheet")}
                  className={cn(
                    "bg-bg-state-soft text-text-subtle no-wrap h-7! w-fit rounded-md px-2 text-sm font-medium",
                    activeFilter === "spreadsheet" && "bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary-hover!",
                  )}
                >
                  Spreadsheet
                </Button>
                {termSelected?.term === "THIRD" && (
                  <Button
                    onClick={() => setActiveFilter("promotion")}
                    className={cn(
                      "bg-bg-state-soft text-text-subtle no-wrap h-7! w-fit rounded-md px-2 text-sm font-medium",
                      activeFilter === "promotion" && "bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary-hover!",
                    )}
                  >
                    Promotion
                  </Button>
                )}
              </div>

              <div className="flex gap-2 pr-4">
                {students.map(student => (
                  <Button
                    ref={activeFilter === student.id.toString() ? activeRef : null}
                    onClick={() => setActiveFilter(student.id.toString())}
                    key={student.id}
                    className={cn(
                      "bg-bg-state-soft text-text-subtle no-wrap h-7! w-fit rounded-md px-2 text-sm font-medium",
                      activeFilter === student.id.toString() && "bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary-hover!",
                    )}
                  >
                    {student.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
