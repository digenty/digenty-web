"use client";

import { Avatar } from "@/components/Avatar";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Button } from "@/components/ui/button";
import { CheckIcon, EyeIcon, MoreHorizontalIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "./columns";
import { Applicant } from "./types";

export const MobileCard = ({ applicant, onView }: { applicant: Applicant; onView: (applicant: Applicant) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-bg-subtle border-border-default rounded-sm border text-sm font-medium">
      {/* Name row + actions trigger */}
      <div className="border-border-default flex h-9.5 items-center justify-between border-b px-3">
        <div className="flex items-center gap-2">
          <Avatar className="size-5 shrink-0" url={applicant.image} />
          <p className="text-text-default font-medium">{applicant.name}</p>
        </div>
        <Button
          variant="ghost"
          className="size-7 p-0"
          onClick={e => {
            e.stopPropagation();
            setIsOpen(true);
          }}
        >
          <MoreHorizontalIcon className="text-icon-default size-4" />
        </Button>

        {isOpen && (
          <MobileDrawer open={isOpen} setIsOpen={setIsOpen} title="Actions">
            <div className="flex flex-col gap-2 px-3 py-4">
              <Button
                onClick={() => { setIsOpen(false); onView(applicant); }}
                className="bg-bg-state-secondary border-border-darker text-text-default h-8 border text-sm font-medium"
              >
                <EyeIcon className="text-icon-default-muted size-4" />
                View Applicant
              </Button>
              <Button className="bg-bg-state-secondary border-border-darker text-text-default h-8 border text-sm font-medium">
                <CheckIcon className="size-4 text-green-600" />
                Admit Applicant
              </Button>
              <Button className="bg-bg-state-secondary border-border-darker text-text-default h-8 border text-sm font-medium">
                <XIcon className="text-icon-destructive size-4" />
                <span className="text-icon-destructive">Reject Applicant</span>
              </Button>
            </div>
          </MobileDrawer>
        )}
      </div>

      {/* Applicant ID */}
      <div className="border-border-default flex h-9.5 items-center justify-between border-b px-3">
        <p className="text-text-muted">Applicant ID</p>
        <p className="text-text-default">{applicant.applicantId}</p>
      </div>

      {/* Status */}
      <div className="border-border-default flex h-9.5 items-center justify-between border-b px-3">
        <p className="text-text-muted">Admission Status</p>
        <StatusBadge status={applicant.status} />
      </div>

      {/* Total Score */}
      <div className="border-border-default flex h-9.5 items-center justify-between border-b px-3">
        <p className="text-text-muted">Total Score</p>
        <p className="text-text-default">{applicant.totalScore !== null ? applicant.totalScore : "-"}</p>
      </div>

      {/* Date Applied */}
      <div className="flex h-9.5 items-center justify-between px-3">
        <p className="text-text-muted">Date Applied</p>
        <p className="text-text-default">{applicant.dateApplied}</p>
      </div>
    </div>
  );
};
