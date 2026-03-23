import { Avatar } from "@/components/Avatar";
import GraduationCap from "@/components/Icons/GraduationCap";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatRelativeDate } from "@/lib/utils";
import { Message3 } from "@/components/Icons/Message3";
import { EditRequestResponseTypes } from "@/api/types";

interface ManageEditMobileCardProps {
  request: EditRequestResponseTypes;
  openModal: (request: EditRequestResponseTypes, action: "accepted" | "rejected") => void;
  isSelected: boolean;
  onSelect: (editRequestId: number, selected: boolean) => void;
}

export const ManageEditMobileCard = ({ request, openModal, isSelected, onSelect }: ManageEditMobileCardProps) => {
  return (
    <div className="border-border-default bg-bg-card flex w-full items-start gap-4 rounded-md border p-4">
      <Checkbox checked={isSelected} onCheckedChange={(value: boolean) => onSelect(request.editRequestId, value)} />
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Avatar className="size-6" url="" />
            <span className="text-text-default text-sm font-medium">{request.teacherName}</span>
          </div>
          <span className="text-text-subtle text-xs">{request.dateCreated ? formatRelativeDate(new Date(request.dateCreated)) : "--"}</span>
        </div>

        <div className="flex items-center gap-2">
          <GraduationCap fill="var(--color-icon-default-muted)" className="size-4" />
          <span className="text-text-subtle text-sm capitalize">
            {request.classArmName} {request.subjectName ? request.subjectName.toLowerCase() : ""}
          </span>
        </div>

        <div className="text-text-default flex flex-col gap-2 text-sm font-medium">
          {request.reason}

          <div className="flex items-center gap-2">
            <Message3 fill="var(--color-icon-default-muted)" className="size-4" />
            <span className="text-text-muted w-40 cursor-pointer truncate text-xs font-normal">{request.additionalDetails || "None"}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={e => {
              e.stopPropagation();
              openModal(request, "rejected");
            }}
            className="text-text-default border-border-darker! h-8! flex-1 rounded-md border text-sm transition-colors"
          >
            <span className="text-text-destructive">✕</span>
            <span> Reject</span>
          </Button>

          <Button
            onClick={e => {
              e.stopPropagation();
              openModal(request, "accepted");
            }}
            className="text-text-default border-border-darker! h-8! flex-1 rounded-md border text-sm transition-colors"
          >
            <span className="text-text-success font-semibold">✓</span>
            <span> Approve</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
