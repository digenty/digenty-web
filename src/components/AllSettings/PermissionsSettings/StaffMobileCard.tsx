import { Staff } from "@/api/types";
import { Avatar } from "@/components/Avatar";
import Edit from "@/components/Icons/Edit";
import Eye from "@/components/Icons/Eye";
import { UserForbid } from "@/components/Icons/UserForbid";
import { MobileDrawer } from "@/components/MobileDrawer";
import { getStatusBadge, staffStatusBadge } from "@/components/Status";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStaffStore } from "@/store/staff";

export const StaffMobileCard = ({ staff }: { staff: Staff }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { setOpenDeactivation, setStaffIdToDeactivate } = useStaffStore();

  const handleDeactivate = () => {
    setOpenDeactivation(true);
    setStaffIdToDeactivate(staff.staffId);
  };
  return (
    <div key={staff.staffId} className="border-border-default bg-bg-subtle rounded-md border">
      <div className="border-border-default flex h-[38px] items-center justify-between border-b px-3 py-1.5">
        <div className="flex items-center gap-2">
          <Avatar className="size-5" url="" />
          <span className="text-text-default text-sm font-medium">{staff.fullName}</span>
        </div>
        <Button onClick={() => setIsOpen(true)} className="text-text-muted cursor-pointer p-0! focus-visible:ring-0!">
          <Ellipsis className="size-5" />
        </Button>
        <MobileDrawer open={isOpen} setIsOpen={setIsOpen} title="Actions">
          <div className="flex w-full flex-col gap-4 px-3 py-4">
            <div className="flex flex-col items-center gap-2">
              <div
                onClick={() => router.push(`/settings/permissions/staff/${staff.staffId}`)}
                className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm"
              >
                <Eye className="size-4" fill="var(--color-icon-default-subtle)" /> View Staff
              </div>
              <div
                role="button"
                onClick={() => router.push(`/settings/permissions/edit-staff/${staff.staffId}`)}
                className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm"
              >
                <Edit fill="var(--color-icon-default-subtle)" className="size-4" /> Edit Staff
              </div>

              <div
                onClick={handleDeactivate}
                className="hover:bg-bg-muted border-border-darker text-text-destructive flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm"
              >
                <UserForbid fill="var(--color-icon-destructive)" className="size-4" /> Deactivate Staff
              </div>
            </div>
          </div>
        </MobileDrawer>
      </div>

      <div className="">
        <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
          <span className="text-text-muted font-medium">Role</span>
          <span className="text-text-default text-sm font-medium">{staff.roleName ? staffStatusBadge(staff.roleName) : "--"}</span>
        </div>
      </div>
      <div className="">
        <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
          <span className="text-text-muted font-medium">Branch</span>
          <span className="text-text-default text-sm font-medium">{staff.branchName}</span>
        </div>
      </div>

      <div className="flex justify-between px-3 py-2 text-sm">
        <span className="text-text-muted font-medium">Status</span>
        {getStatusBadge(staff.status ? "Active" : "Inactive")}
      </div>
    </div>
  );
};
