"use client";

import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useGetArmsByClass } from "@/hooks/queryHooks/useArm";
import { useGetClasses } from "@/hooks/queryHooks/useClass";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useState } from "react";
import { PromotionStudent } from "../students";
import { Arm, ClassType } from "@/api/types";

interface PromotionDecisionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedStudents: PromotionStudent[];
  isLoading?: boolean;
  setDecisions: (
    data: {
      status: string;
      studentId: number;
      toClassId?: number;
      toArmId?: number;
      className?: string;
      armName?: string;
    }[],
  ) => void;
  setClassToPromoteTo: (data: string) => void;
  setArmToPromoteTo: (data: string) => void;
  promotionType: string;
}

export const PromotionDecisionModal = ({
  open,
  onOpenChange,
  selectedStudents,
  isLoading,
  setDecisions,
  setClassToPromoteTo,
  setArmToPromoteTo,
  promotionType,
}: PromotionDecisionModalProps) => {
  const isMobile = useIsMobile();
  const [decision, setDecision] = useState<string>("PROMOTED");
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedArmId, setSelectedArmId] = useState<string>("");

  const { data: classes } = useGetClasses();
  const { data: arms } = useGetArmsByClass(Number(selectedClassId));

  const handleSave = () => {
    const classOption = classes?.data?.content?.find((cls: ClassType) => cls.id.toString() === selectedClassId);
    const armOption = arms?.data?.find((arm: Arm) => arm.id.toString() === selectedArmId);

    setDecisions([
      ...selectedStudents.map(student => ({
        status: decision,
        studentId: student.studentId,
        toClassId: decision === "PROMOTED" ? Number(selectedClassId) : undefined,
        toArmId: decision === "PROMOTED" ? Number(selectedArmId) : undefined,
        className: decision === "PROMOTED" ? classOption?.name : undefined,
        armName: decision === "PROMOTED" ? armOption?.name : undefined,
      })),
    ]);

    onOpenChange(false);
  };

  const title =
    selectedStudents.length === 1
      ? `Promotion Decision - ${selectedStudents[0].studentName}`
      : `Promotion Decision - ${selectedStudents.length} Students`;

  const content = (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {promotionType !== "PROMOTE_ALL" && (
        <div className="flex flex-col gap-3">
          <Label className="text-text-default text-sm font-medium">
            Promotion Decision <span className="text-red-500">*</span>
          </Label>
          <div className="flex flex-col gap-4">
            {[
              { id: "PROMOTED", label: "Promote" },
              { id: "REPEATED", label: "Repeat" },
              { id: "GRADUATED", label: "Graduate" },
            ].map(opt => (
              <label key={opt.id} className="group flex cursor-pointer items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <input
                    type="radio"
                    name="promotion-decision"
                    value={opt.id}
                    checked={decision === opt.id}
                    onChange={e => setDecision(e.target.value)}
                    className="peer border-border-strong checked:border-bg-state-primary checked:bg-bg-state-primary pointer-events-none size-4 appearance-none rounded-full border transition-all"
                  />
                  <div className="pointer-events-none absolute size-1.5 rounded-full bg-white opacity-0 transition-opacity peer-checked:opacity-100" />
                </div>
                <span className="text-text-subtle group-hover:text-text-default text-sm font-normal transition-colors">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {(decision === "PROMOTED" || promotionType === "PROMOTE_ALL") && (
        <>
          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">Destination Class</Label>
            <Select
              value={selectedClassId}
              onValueChange={value => {
                const cls = classes?.data?.content?.find((cls: ClassType) => cls.id.toString() === value);
                setSelectedClassId(value);
                setClassToPromoteTo(cls?.name);
              }}
            >
              <SelectTrigger className="bg-bg-input-soft h-11 w-full border-none">
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-none">
                {classes?.data?.content?.map((cls: ClassType) => (
                  <SelectItem key={cls.id} value={cls.id.toString()}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">Arm</Label>
            <Select
              value={selectedArmId}
              onValueChange={value => {
                const arm = arms?.data?.find((arm: Arm) => arm.id.toString() === value);
                setSelectedArmId(value);
                setArmToPromoteTo(arm?.name);
              }}
              disabled={!selectedClassId}
            >
              <SelectTrigger className="bg-bg-input-soft h-11 w-full border-none capitalize">
                <SelectValue placeholder="Select Arm" className="capitalize" />
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-none">
                {arms?.data?.map((arm: Arm) => (
                  <SelectItem key={arm.id} value={arm.id.toString()} className="capitalize">
                    {arm.name.toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  );

  const footerActions = (
    <div className="flex w-full items-center justify-between">
      <Button
        variant="outline"
        onClick={() => onOpenChange(false)}
        className="bg-bg-state-secondary border-border-darker text-text-default h-7! px-4 text-sm font-medium"
      >
        Cancel
      </Button>
      <Button
        onClick={handleSave}
        disabled={isLoading || (decision === "PROMOTED" && (!selectedClassId || !selectedArmId))}
        className="bg-bg-state-primary hover:bg-bg-state-primary-hover! h-7! px-4 text-sm font-medium text-white"
      >
        {isLoading && <Spinner className="text-text-white-default" />}
        Save
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <MobileDrawer open={open} setIsOpen={onOpenChange} title={title}>
        <div className="flex flex-col">
          {content}
          <div className="border-border-default border-t px-4 py-3">{footerActions}</div>
        </div>
      </MobileDrawer>
    );
  }

  return (
    <Modal open={open} setOpen={onOpenChange} title={title} showFooter={false} className="md:max-w-150">
      {content}
      <div className="border-border-default border-t px-4 py-3">{footerActions}</div>
    </Modal>
  );
};
