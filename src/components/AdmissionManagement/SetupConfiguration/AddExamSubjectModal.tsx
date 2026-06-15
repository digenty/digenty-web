"use client";

import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAllSubjects } from "@/hooks/queryHooks/useSubject";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useState } from "react";

export interface ExamSubject {
  id: string;
  subjectId?: number;
  name: string;
  maxScore: number;
}

interface SubjectOption {
  id: number;
  name: string;
}

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  onAdd: (subject: ExamSubject) => void;
}

export const AddExamSubjectModal = ({ open, setOpen, onAdd }: Props) => {
  const isMobile = useIsMobile();
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [maxScore, setMaxScore] = useState("");

  const { data: subjectsData, isPending: loadingSubjects } = useGetAllSubjects();
  const subjectOptions: SubjectOption[] = Array.isArray(subjectsData?.data) ? subjectsData.data : [];

  const selectedOption = subjectOptions.find(s => String(s.id) === selectedSubjectId);
  const subjectName = customSubject.trim() || selectedOption?.name || "";
  const canSubmit = subjectName.length > 0 && Number(maxScore) > 0;

  const reset = () => {
    setSelectedSubjectId("");
    setCustomSubject("");
    setMaxScore("");
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) reset();
    setOpen(val);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onAdd({
      id: `${Date.now()}`,
      subjectId: customSubject.trim() ? undefined : selectedOption?.id,
      name: subjectName,
      maxScore: Number(maxScore),
    });
    reset();
    setOpen(false);
  };

  const formFields = (
    <div className="flex flex-col gap-5 p-4">
      <div className="flex flex-col gap-1.5">
        <Label className="text-text-default text-sm font-semibold">Select Subject</Label>
        <Select
          value={selectedSubjectId}
          onValueChange={val => {
            setSelectedSubjectId(val);
            setCustomSubject("");
          }}
          disabled={loadingSubjects}
        >
          <SelectTrigger className="bg-bg-input-soft border-none text-sm shadow-none">
            <SelectValue placeholder={loadingSubjects ? "Loading subjects..." : "Select a subject"} />
          </SelectTrigger>
          <SelectContent className="bg-bg-card border-border-default">
            {subjectOptions.map(s => (
              <SelectItem key={s.id} value={String(s.id)} className="text-text-default text-sm">
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-text-muted text-xs">or enter custom subject</p>
        <Input
          placeholder="Custom subject name"
          value={customSubject}
          onChange={e => {
            setCustomSubject(e.target.value);
            if (e.target.value) setSelectedSubjectId("");
          }}
          className="bg-bg-input-soft! border-none text-sm shadow-none"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-text-default text-sm font-semibold">Maximum Score</Label>
        <Input
          type="number"
          min={1}
          placeholder="e.g 100"
          value={maxScore}
          onChange={e => setMaxScore(e.target.value)}
          className="bg-bg-input-soft! border-none text-sm shadow-none"
        />
      </div>
    </div>
  );

  const submitButton = (
    <Button
      onClick={handleSubmit}
      disabled={!canSubmit}
      className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
    >
      Add Exam Subject
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

  if (isMobile) {
    return (
      <MobileDrawer open={open} setIsOpen={handleOpenChange} title="Add Exam Subject">
        {formFields}
        <div className="border-border-default flex items-center justify-between border-t p-4">
          {cancelButton}
          {submitButton}
        </div>
      </MobileDrawer>
    );
  }

  return (
    <Modal open={open} setOpen={handleOpenChange} title="Add Exam Subject" ActionButton={submitButton} cancelButton={cancelButton}>
      {formFields}
    </Modal>
  );
};
