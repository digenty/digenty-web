import { Badge } from "@/components/ui/badge";
import { PendingFeeItem } from "@/api/parent-fees";
import { feeStatusConfig } from "@/components/ParentPortalComponents/feeStatus";

export const InstallmentSchedule = ({ fee }: { fee: PendingFeeItem }) => {
  if (!fee.installments || fee.installments.length === 0) return null;
  return (
    <div className="flex flex-col gap-1.5">
      {fee.installments.map(inst => {
        const status = feeStatusConfig[inst.status];
        return (
          <div key={inst.id} className="bg-bg-input-soft flex items-center justify-between rounded-md px-2.5 py-1.5">
            <span className="text-text-muted text-xs">
              Instalment {inst.sequence} · Due {inst.dueDate}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-text-default text-xs font-medium">₦{inst.amount.toLocaleString()}</span>
              <Badge className={`${status?.className ?? ""} rounded-md text-[10px] font-medium`}>{status?.label ?? inst.status}</Badge>
            </div>
          </div>
        );
      })}
    </div>
  );
};
