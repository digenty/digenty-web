"use client";

import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useSetCycleGlobalFees } from "@/hooks/queryHooks/useAdmission";
import { AddFill, Bill, BookOpen, DeleteBin, Information } from "@digenty/icons";
import { useState } from "react";
import { toast } from "sonner";
import { AddExamSubjectModal, ExamSubject } from "./AddExamSubjectModal";

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  cycleId: number;
  branchId?: number;
}

export const SetGlobalFeesModal = ({ open, setOpen, cycleId, branchId }: Props) => {
  const isMobile = useIsMobile();
  const { mutate, isPending } = useSetCycleGlobalFees();
  const [applicationFeeEnabled, setApplicationFeeEnabled] = useState(false);
  const [applicationFeeAmount, setApplicationFeeAmount] = useState("");
  const [entranceExamEnabled, setEntranceExamEnabled] = useState(false);
  const [subjects, setSubjects] = useState<ExamSubject[]>([]);
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);

  const handleOpenChange = (val: boolean) => {
    if (!val) {
      setApplicationFeeEnabled(false);
      setApplicationFeeAmount("");
      setEntranceExamEnabled(false);
      setSubjects([]);
    }
    setOpen(val);
  };

  const handleApply = () => {
    mutate(
      {
        cycleId,
        branchId,
        payload: {
          applicationFee: { enabled: applicationFeeEnabled, amount: applicationFeeAmount === "" ? 0 : Number(applicationFeeAmount) },
          entranceExam: {
            enabled: entranceExamEnabled,
            subjects: subjects.map(s => ({ subjectId: s.subjectId, customName: s.subjectId ? undefined : s.name, maxScore: s.maxScore })),
          },
        },
      },
      {
        onSuccess: () => {
          toast.success("Global fees applied to all levels");
          handleOpenChange(false);
        },
        onError: (error: unknown) => toast.error((error as { message?: string })?.message ?? "Failed to apply global fees"),
      },
    );
  };

  const removeSubject = (id: string) => setSubjects(prev => prev.filter(s => s.id !== id));

  const iconFill = "var(--color-icon-default-subtle)";

  const formContent = (
    <div className="flex flex-col gap-4 p-4">
      {/* Application Fee */}
      <div className="border-border-default flex flex-col gap-4 rounded-xl border p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Bill fill={iconFill} className="size-4 shrink-0" />
            <div className="flex flex-col gap-0.5">
              <p className="text-text-default text-sm font-semibold">Application Fee</p>
              <p className="text-text-muted text-xs">Require application fee for all levels</p>
            </div>
          </div>
          <Switch checked={applicationFeeEnabled} onCheckedChange={setApplicationFeeEnabled} className="shrink-0" />
        </div>

        {applicationFeeEnabled && (
          <div className="flex flex-col gap-1.5">
            <label className="text-text-default text-sm font-semibold">Fee Amount</label>
            <div className="bg-bg-input-soft flex items-center gap-2 rounded-lg px-3 py-2.5">
              <span className="text-text-muted text-sm font-medium">₦</span>
              <input
                type="number"
                min={0}
                step="0.01"
                placeholder="0.00"
                value={applicationFeeAmount}
                onChange={e => setApplicationFeeAmount(e.target.value)}
                className="bg-transparent text-text-default placeholder:text-text-muted w-full text-sm outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Entrance Exam */}
      <div className="border-border-default flex flex-col gap-4 rounded-xl border p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <BookOpen fill={iconFill} className="size-4 shrink-0" />
            <div className="flex flex-col gap-0.5">
              <p className="text-text-default text-sm font-semibold">Entrance Exam</p>
              <p className="text-text-muted text-xs">Require entrance fee for all levels</p>
            </div>
          </div>
          <Switch checked={entranceExamEnabled} onCheckedChange={setEntranceExamEnabled} className="shrink-0" />
        </div>

        {entranceExamEnabled && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-text-default text-sm font-semibold">Entrance Subjects</p>
              <Button
                onClick={() => setIsAddSubjectOpen(true)}
                className="border-border-darker text-text-default bg-bg-state-secondary hover:bg-bg-state-secondary-hover! flex h-7 shrink-0 items-center gap-1 border text-xs font-medium transition-colors"
              >
                <AddFill fill="var(--color-icon-default-subtle)" className="size-3.5 shrink-0" />
                Add Subjects
              </Button>
            </div>

            {subjects.length === 0 ? (
              <div className="bg-bg-subtle flex flex-col items-center gap-2 rounded-xl py-8">
                <BookOpen fill="var(--color-icon-default-muted)" className="size-10 shrink-0 opacity-40" />
                <p className="text-text-default text-sm font-medium">No subjects added yet</p>
                <p className="text-text-muted text-xs">Click &quot;Add Subject&quot; to add exam subjects.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {subjects.map(subject => (
                  <div key={subject.id} className="bg-bg-input-soft flex items-center justify-between gap-3 rounded-lg px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-text-default text-sm font-medium">{subject.name}</span>
                      <span className="text-text-muted text-xs">· Max {subject.maxScore}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSubject(subject.id)}
                      className="text-text-muted hover:text-text-destructive shrink-0 cursor-pointer transition-colors"
                      aria-label={`Remove ${subject.name}`}
                    >
                      <DeleteBin fill="currentColor" className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Info banner */}
      <div className="bg-bg-badge-sky flex items-start gap-2.5 rounded-xl p-3">
        <Information fill="var(--color-icon-default-subtle)" className="mt-0.5 size-4 shrink-0" />
        <p className="text-text-subtle text-xs leading-relaxed">
          This will update fees for all configured levels. Individual levels can still override these fees if needed.
        </p>
      </div>
    </div>
  );

  const submitButton = (
    <Button
      onClick={handleApply}
      disabled={isPending}
      className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
    >
      {isPending ? "Applying..." : "Apply to All Levels"}
    </Button>
  );

  const cancelButton = (
    <Button
      variant="outline"
      onClick={() => handleOpenChange(false)}
      className="bg-bg-state-soft! hover:bg-bg-state-soft! text-text-subtle hover:text-text-subtle! h-7 border-none px-2 py-1 text-sm font-medium"
    >
      Cancel
    </Button>
  );

  return (
    <>
      {isMobile ? (
        <MobileDrawer open={open} setIsOpen={handleOpenChange} title="Set Global Fees">
          {formContent}
          <div className="border-border-default flex items-center justify-between border-t p-4">
            {cancelButton}
            {submitButton}
          </div>
        </MobileDrawer>
      ) : (
        <Modal open={open} setOpen={handleOpenChange} title="Set Global Fees" ActionButton={submitButton} cancelButton={cancelButton}>
          {formContent}
        </Modal>
      )}

      <AddExamSubjectModal open={isAddSubjectOpen} setOpen={setIsAddSubjectOpen} onAdd={subject => setSubjects(prev => [...prev, subject])} />
    </>
  );
};
