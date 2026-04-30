"use client";

import { Avatar } from "@/components/Avatar";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { CheckIcon, EyeIcon, FileIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "./columns";
import { Applicant } from "./types";

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

const ApplicantDetailsTab = ({ applicant }: { applicant: Applicant }) => {
  const parts = applicant.name.split(" ");
  const firstName = parts[0];
  const lastName = parts.slice(1).join(" ");

  return (
    <div className="flex flex-col gap-4">
      <SectionCard title="Applicant Information">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <InfoItem label="First Name">{firstName}</InfoItem>
          <InfoItem label="Last Name">{lastName}</InfoItem>
          <InfoItem label="Date of Birth">June 20, 2004</InfoItem>
          <InfoItem label="Gender">Male</InfoItem>
        </div>
      </SectionCard>

      <SectionCard title="Application Details">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <InfoItem label="Class Applied">JSS 1</InfoItem>
          <InfoItem label="Branch">Lawanson</InfoItem>
          <InfoItem label="Application Date">June 20, 2024</InfoItem>
          <InfoItem label="Admission Status">
            <StatusBadge status={applicant.status} />
          </InfoItem>
          <InfoItem label="Payment Status">
            <Badge className="bg-bg-badge-orange text-bg-basic-orange-strong border-border-default h-6 w-fit rounded-md border px-2 text-xs font-medium">
              ⚠ Owing
            </Badge>
          </InfoItem>
        </div>
      </SectionCard>

      <SectionCard title="Submitted Documents">
        <div className="flex flex-col gap-4">
          {["Birth Certificate", "Birth Certificate"].map((label, i) => (
            <div key={i} className="flex flex-col gap-2">
              <p className="text-text-muted text-xs">{label}</p>
              <div className="border-border-default flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <div className="rounded bg-red-50 p-1.5">
                    <FileIcon className="size-4" />
                  </div>
                  <div>
                    <p className="text-text-default text-xs font-medium">filename.pdf</p>
                    <p className="text-text-muted text-xs">1.5 MB</p>
                  </div>
                </div>
                <Button className="border-border-darker text-text-default bg-bg-state-secondary flex h-7 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium">
                  <EyeIcon className="size-3.5" />
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

const SUBJECTS = [
  { name: "Maths", max: 100 },
  { name: "English Language", max: 100 },
  { name: "General Studies", max: 100 },
];

const ScoresStatusTab = ({ applicant }: { applicant: Applicant }) => {
  const [scores, setScores] = useState<Record<string, number>>({ Maths: 0, "English Language": 0, "General Studies": 0 });
  const [status, setStatus] = useState<"Admitted" | "Rejected" | null>(
    applicant.status === "Admitted" || applicant.status === "Rejected" ? applicant.status : null,
  );

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const maxTotal = SUBJECTS.reduce((a, s) => a + s.max, 0);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4">
        {SUBJECTS.map(subject => (
          <div key={subject.name} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <p className="text-text-default text-sm font-medium">{subject.name}</p>
              <p className="text-text-muted text-xs">Max:{subject.max}</p>
            </div>
            <Input
              type="number"
              min={0}
              max={subject.max}
              value={scores[subject.name]}
              onChange={e => setScores(prev => ({ ...prev, [subject.name]: Number(e.target.value) }))}
              className="bg-bg-input-soft! border-none text-sm shadow-none"
            />
          </div>
        ))}

        <div className="flex items-center justify-between">
          <p className="text-text-default text-sm font-semibold">Total Score</p>
          <p className="text-text-default text-sm font-semibold">
            {totalScore}
            <span className="text-text-muted font-normal">/{maxTotal}</span>
          </p>
        </div>

        <Button className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default w-full rounded-md text-sm font-medium">
          Save Scores
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-text-default text-sm font-semibold">Update Status</p>
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => setStatus("Admitted")}
            className={cn(
              "flex items-center gap-1.5 rounded-full border text-sm font-medium",
              status === "Admitted"
                ? "bg-bg-badge-green text-bg-basic-green-strong border-green-200"
                : "bg-bg-state-secondary border-border-darker text-text-default hover:bg-bg-state-secondary-hover!",
            )}
          >
            <CheckIcon className="size-3.5" />
            Admitted
          </Button>
          <Button
            onClick={() => setStatus("Rejected")}
            className={cn(
              "flex items-center gap-1.5 rounded-full border text-sm font-medium",
              status === "Rejected"
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
  applicant: Applicant | null;
  open: boolean;
  onClose: () => void;
}

export const ApplicantSheet = ({ applicant, open, onClose }: ApplicantSheetProps) => {
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
            activeTab === i
              ? "bg-bg-state-secondary border-border-darker text-text-default border shadow-sm"
              : "text-text-muted hover:text-text-subtle",
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );

  const scrollableContent = (
    <div className="flex-1 overflow-y-auto px-5 py-4">
      {activeTab === 0 ? <ApplicantDetailsTab applicant={applicant} /> : <ScoresStatusTab applicant={applicant} />}
    </div>
  );

  const footerContent = (
    <div className="border-border-default flex items-center justify-between border-t px-5 py-3">
      <Button onClick={onClose} className="bg-bg-state-soft! text-text-default border-none text-sm font-medium">
        Cancel
      </Button>
      <Button
        onClick={onClose}
        className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default rounded-md px-5 text-sm font-medium"
      >
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
