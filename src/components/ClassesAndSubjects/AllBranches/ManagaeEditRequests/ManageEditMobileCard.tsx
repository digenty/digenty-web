import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import GraduationCap from "@/components/Icons/GraduationCap";
import { BranchEditRequestTypes } from "./types";

interface ManageEditMobileCardProps {
  staff: BranchEditRequestTypes;
  decision: "accepted" | "rejected" | null;
  onDecision: (staffId: number, action: "accepted" | "rejected") => void;
  isSelected: boolean;
  onSelect: (editRequestId: number, selected: boolean) => void;
}

export const ManageEditMobileCard = ({ staff, decision, onDecision, isSelected, onSelect }: ManageEditMobileCardProps) => {
  return (
    <div className="border-border-default bg-bg-card flex w-full items-start gap-4 rounded-md border p-4">
      <Checkbox checked={isSelected} onCheckedChange={(value: boolean) => onSelect(staff.editRequestId, value)} />
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Avatar className="size-8" url="" />
            <span className="text-text-default text-sm font-medium">{staff.teacherName}</span>
          </div>
          <span className="text-text-subtle text-xs">{staff.dateCreated}</span>
        </div>

        <div className="flex items-center gap-2">
          <GraduationCap fill="var(--color-icon-default-muted)" className="size-4" />
          <span className="text-text-subtle text-sm">
            {staff.classArmName} {staff.subjectName}
          </span>
        </div>

        <div className="text-text-default text-sm font-medium">{staff.reason}</div>

        <div className="flex gap-3">
          <Button
            onClick={e => {
              e.stopPropagation();
              onDecision(staff.editRequestId, "rejected");
            }}
            disabled={!isSelected || decision === "accepted"}
            className={`text-text-default flex-1 rounded-md border py-2 text-sm transition-colors ${
              !isSelected || decision === "accepted"
                ? "border-border-disabled bg-bg-disabled text-text-disabled cursor-not-allowed opacity-50"
                : decision === "rejected"
                  ? "border-border-default bg-bg-state-secondary hover:bg-bg-state-secondary-hover!"
                  : "border-border-default bg-bg-state-secondary hover:bg-bg-state-secondary-hover!"
            }`}
          >
            <span className="text-text-destructive">✕</span>
            <span> Reject</span>
          </Button>

          <Button
            onClick={e => {
              e.stopPropagation();
              onDecision(staff.editRequestId, "accepted");
            }}
            disabled={!isSelected || decision === "rejected"}
            className={`text-text-default flex-1 rounded-md border py-2 text-sm transition-colors ${
              !isSelected || decision === "rejected"
                ? "border-border-disabled bg-bg-disabled text-text-disabled cursor-not-allowed opacity-50"
                : decision === "accepted"
                  ? "border-border-default bg-bg-state-secondary hover:bg-bg-state-secondary-hover!"
                  : "border-border-default bg-bg-state-secondary hover:bg-bg-state-secondary-hover!"
            }`}
          >
            <span className="text-text-success font-semibold">✓</span>
            <span> Approve</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
