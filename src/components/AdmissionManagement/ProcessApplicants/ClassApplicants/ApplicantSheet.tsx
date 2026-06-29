"use client";

import { ApplicantStatus, getApplicantDocument } from "@/api/admission";
import { Avatar } from "@/components/Avatar";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetApplicantDetail,
  useGetApplicantScores,
  useSaveApplicantScores,
  useUpdateApplicantStatus,
} from "@/hooks/queryHooks/useAdmission";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { CheckIcon, EyeIcon, FileIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "./columns";
import { API_TO_DISPLAY_STATUS, Applicant } from "./types";

const InfoItem = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1">
    <p className="text-text-muted text-xs">{label}</p>
    <div className="text-text-default text-sm font-medium">{children}</div>
  </div>
);

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border-border-default rounded-xl border p-4">
    <p className="text-text-default mb-4 text-sm font-semibold">{title}</p>
    {children}
  </div>
);

const ApplicantDetailsTab = ({ cycleId, applicantId }: { cycleId: number; applicantId: number }) => {
  const { data: detail, isPending, isError } = useGetApplicantDetail(cycleId, applicantId);
  const [viewingDocId, setViewingDocId] = useState<number | null>(null);

  const viewDocument = async (docId: number) => {
    try {
      setViewingDocId(docId);
      const doc = await getApplicantDocument(cycleId, applicantId, docId);
      if (doc.fileUrl) window.open(doc.fileUrl, "_blank", "noopener,noreferrer");
      else toast.error("Document is not available");
    } catch {
      toast.error("Couldn't open document");
    } finally {
      setViewingDocId(null);
    }
  };

  if (isPending) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError || !detail) {
    return <p className="text-text-muted py-8 text-center text-sm">Couldn&apos;t load applicant details.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <SectionCard title="Applicant Information">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <InfoItem label="First Name">{detail.firstName}</InfoItem>
          <InfoItem label="Last Name">{detail.lastName}</InfoItem>
          <InfoItem label="Date of Birth">{detail.dateOfBirth}</InfoItem>
          <InfoItem label="Gender">{detail.gender}</InfoItem>
        </div>
      </SectionCard>

      <SectionCard title="Application Details">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <InfoItem label="Class Applied">{detail.className}</InfoItem>
          <InfoItem label="Branch">{detail.branchName}</InfoItem>
          <InfoItem label="Application Date">{detail.applicationDate}</InfoItem>
          <InfoItem label="Admission Status">
            <StatusBadge status={API_TO_DISPLAY_STATUS[detail.status]} />
          </InfoItem>
          <InfoItem label="Payment Status">
            <Badge
              className={cn(
                "border-border-default h-6 w-fit rounded-md border px-2 text-xs font-medium",
                detail.paymentStatus === "PAID" ? "bg-bg-badge-green text-bg-basic-green-strong" : "bg-bg-badge-orange text-bg-basic-orange-strong",
              )}
            >
              {detail.paymentStatus === "PAID" ? "Paid" : "⚠ Owing"}
            </Badge>
          </InfoItem>
        </div>
      </SectionCard>

      <SectionCard title="Submitted Documents">
        {detail.submittedDocuments.length === 0 ? (
          <p className="text-text-muted text-sm">No documents submitted.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {detail.submittedDocuments.map(doc => (
              <div key={doc.id} className="flex flex-col gap-2">
                <p className="text-text-muted text-xs">{doc.documentName}</p>
                <div className="border-border-default flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <div className="rounded bg-red-50 p-1.5">
                      <FileIcon className="size-4" />
                    </div>
                    <p className="text-text-default text-xs font-medium">{doc.documentName}</p>
                  </div>
                  <Button
                    onClick={() => viewDocument(doc.id)}
                    disabled={viewingDocId === doc.id}
                    className="border-border-darker text-text-default bg-bg-state-secondary flex h-7 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium disabled:opacity-50"
                  >
                    <EyeIcon className="size-3.5" />
                    {viewingDocId === doc.id ? "Opening..." : "View"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
};

const ScoresStatusTab = ({ cycleId, applicantId }: { cycleId: number; applicantId: number }) => {
  const { data, isPending, isError } = useGetApplicantScores(cycleId, applicantId);
  const { mutate: saveScores, isPending: saving } = useSaveApplicantScores();
  const { mutate: updateStatus, isPending: updatingStatus } = useUpdateApplicantStatus();

  const [scores, setScores] = useState<Record<string, number>>({});
  const [status, setStatus] = useState<ApplicantStatus | null>(null);

  useEffect(() => {
    if (data) {
      setScores(Object.fromEntries(data.scores.map(s => [s.subjectName, s.score])));
      setStatus(data.status === "PENDING" ? null : data.status);
    }
  }, [data]);

  if (isPending) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return <p className="text-text-muted py-8 text-center text-sm">Couldn&apos;t load scores.</p>;
  }

  if (data.scores.length === 0) {
    return <p className="text-text-muted py-8 text-center text-sm">No entrance exam subjects configured for this class.</p>;
  }

  const totalScore = data.scores.reduce((sum, s) => sum + (scores[s.subjectName] ?? 0), 0);

  const handleSaveScores = () => {
    saveScores(
      {
        cycleId,
        applicantId,
        payload: { scores: data.scores.map(s => ({ subjectName: s.subjectName, score: scores[s.subjectName] ?? 0, maxScore: s.maxScore })) },
      },
      {
        onSuccess: () => toast.success("Scores saved"),
        onError: (error: unknown) => toast.error((error as { message?: string })?.message ?? "Failed to save scores"),
      },
    );
  };

  const handleStatus = (next: ApplicantStatus) => {
    setStatus(next);
    updateStatus(
      { cycleId, applicantId, payload: { status: next } },
      {
        onSuccess: () => toast.success(`Applicant ${API_TO_DISPLAY_STATUS[next].toLowerCase()}`),
        onError: (error: unknown) => toast.error((error as { message?: string })?.message ?? "Failed to update status"),
      },
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4">
        {data.scores.map(subject => (
          <div key={subject.id} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <p className="text-text-default text-sm font-medium">{subject.subjectName}</p>
              <p className="text-text-muted text-xs">Max:{subject.maxScore}</p>
            </div>
            <Input
              type="number"
              min={0}
              max={subject.maxScore}
              value={scores[subject.subjectName] ?? 0}
              onChange={e => setScores(prev => ({ ...prev, [subject.subjectName]: Number(e.target.value) }))}
              className="bg-bg-input-soft! border-none text-sm shadow-none"
            />
          </div>
        ))}

        <div className="flex items-center justify-between">
          <p className="text-text-default text-sm font-semibold">Total Score</p>
          <p className="text-text-default text-sm font-semibold">
            {totalScore}
            <span className="text-text-muted font-normal">/{data.maxTotal}</span>
          </p>
        </div>

        <Button
          onClick={handleSaveScores}
          disabled={saving}
          className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default w-full rounded-md text-sm font-medium disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Scores"}
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-text-default text-sm font-semibold">Update Status</p>
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => handleStatus("ADMITTED")}
            disabled={updatingStatus}
            className={cn(
              "flex items-center gap-1.5 rounded-full border text-sm font-medium disabled:opacity-50",
              status === "ADMITTED"
                ? "bg-bg-badge-green text-bg-basic-green-strong border-green-200"
                : "bg-bg-state-secondary border-border-darker text-text-default hover:bg-bg-state-secondary-hover!",
            )}
          >
            <CheckIcon className="size-3.5" />
            Admitted
          </Button>
          <Button
            onClick={() => handleStatus("REJECTED")}
            disabled={updatingStatus}
            className={cn(
              "flex items-center gap-1.5 rounded-full border text-sm font-medium disabled:opacity-50",
              status === "REJECTED"
                ? "bg-bg-badge-red text-bg-basic-red-strong border-red-200"
                : "bg-bg-state-secondary border-border-darker text-text-default hover:bg-bg-state-secondary-hover!",
            )}
          >
            <XIcon className="size-3.5" />
            Rejected
          </Button>
        </div>
      </div>
    </div>
  );
};

interface ApplicantSheetProps {
  cycleId: number;
  applicant: Applicant | null;
  open: boolean;
  onClose: () => void;
}

export const ApplicantSheet = ({ cycleId, applicant, open, onClose }: ApplicantSheetProps) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState(0);

  if (!applicant) return null;

  const TABS = ["Applicant Details", "Scores & Status"];

  const headerContent = (
    <div className="border-border-default flex items-center gap-3 border-b px-5 py-4 pr-14">
      <Avatar className="size-10 shrink-0" url={applicant.image} />
      <div className="flex flex-col gap-0.5">
        <p className="text-text-default font-semibold">{applicant.name}</p>
        <p className="text-text-muted text-xs">{applicant.applicantId}</p>
      </div>
    </div>
  );

  const tabBar = (
    <div className="bg-bg-state-soft mx-5 mt-4 mb-1 flex gap-1 rounded-full p-1">
      {TABS.map((tab, i) => (
        <button
          key={tab}
          onClick={() => setActiveTab(i)}
          className={cn(
            "flex-1 rounded-full px-3 py-1.5 text-sm font-medium transition-all",
            activeTab === i ? "bg-bg-state-secondary border-border-darker text-text-default border shadow-sm" : "text-text-muted hover:text-text-subtle",
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );

  const scrollableContent = (
    <div className="flex-1 overflow-y-auto px-5 py-4">
      {activeTab === 0 ? <ApplicantDetailsTab cycleId={cycleId} applicantId={applicant.id} /> : <ScoresStatusTab cycleId={cycleId} applicantId={applicant.id} />}
    </div>
  );

  const footerContent = (
    <div className="border-border-default flex items-center justify-between border-t px-5 py-3">
      <Button onClick={onClose} className="bg-bg-state-soft! text-text-default border-none text-sm font-medium">
        Cancel
      </Button>
      <Button onClick={onClose} className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default rounded-md px-5 text-sm font-medium">
        Done
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <MobileDrawer
        open={open}
        setIsOpen={onClose}
        title={
          <div className="flex items-center gap-2">
            <Avatar className="size-8 shrink-0" url={applicant.image} />
            <div>
              <p className="text-text-default text-sm font-semibold">{applicant.name}</p>
              <p className="text-text-muted text-xs">{applicant.applicantId}</p>
            </div>
          </div>
        }
      >
        <div className="flex max-h-[75vh] flex-col overflow-hidden">
          {tabBar}
          {scrollableContent}
          {footerContent}
        </div>
      </MobileDrawer>
    );
  }

  return (
    <Sheet open={open} onOpenChange={val => !val && onClose()}>
      <SheetContent className="bg-bg-card border-border-default flex flex-col gap-0 overflow-hidden p-0 md:min-w-[480px]">
        <VisuallyHidden>
          <SheetTitle>{applicant.name}</SheetTitle>
          <SheetDescription>{applicant.applicantId}</SheetDescription>
        </VisuallyHidden>
        {headerContent}
        {tabBar}
        {scrollableContent}
        {footerContent}
      </SheetContent>
    </Sheet>
  );
};
