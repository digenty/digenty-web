import { Parent } from "@/api/types";
import { Avatar } from "@/components/Avatar";
import DeleteBin from "@/components/Icons/DeleteBin";
import Edit from "@/components/Icons/Edit";

import { MobileDrawer } from "@/components/MobileDrawer";
import { PermissionCheck } from "@/components/ModulePermissionsWrapper/PermissionCheck";
import { Button } from "@/components/ui/button";
import { canManage } from "@/lib/permissions/students-and-parents";
import { useParentStore } from "@/store/useParentStore";
import { EyeIcon, MoreHorizontalIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const ParentsMobileCard = ({ parent }: { parent: Parent }) => {
  const router = useRouter();
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const { setOpenDelete, setParentIds } = useParentStore();

  return (
    <div className="bg-bg-subtle border-border-default rounded-sm border text-sm font-medium">
      <div className="border-border-default flex h-9.5 items-center justify-between border-b px-3">
        <div className="flex gap-2">
          <Avatar className="size-5" url="" />
          <p className="text-text-default">
            {parent.firstName} {parent.lastName}
          </p>
        </div>

        <Button variant="ghost" onClick={() => setIsOptionsOpen(true)}>
          <MoreHorizontalIcon className="text-icon-default size-5" />
        </Button>

        {isOptionsOpen && (
          <MobileDrawer open={isOptionsOpen} setIsOpen={setIsOptionsOpen} title="Actions">
            <div className="flex flex-col gap-2 p-4">
              <Button
                onClick={() => router.push(`/student-and-parent-record/parents/${parent.id}`)}
                className="bg-bg-state-secondary border-border-darker text-text-default h-8 border text-sm font-medium"
              >
                <EyeIcon className="text-icon-default-muted size-4" />
                <span>View Parent Profile</span>
              </Button>

              <PermissionCheck permissionUtility={canManage}>
              <Button
                onClick={() => router.push(`/student-and-parent-record/parents/${parent.id}/edit`)}
                className="bg-bg-state-secondary border-border-darker text-text-default h-8 border text-sm font-medium"
              >
                <Edit fill="var(--color-icon-default-muted)" className="size-4" />
                <span>Edit Parent Profile</span>
              </Button>

              <Button
                onClick={() => {
                  setOpenDelete(true);
                  setParentIds([parent.id]);
                }}
                className="bg-bg-state-secondary border-border-darker text-text-default h-8 border text-sm font-medium"
              >
                <DeleteBin fill="var(--color-icon-destructive)" className="size-4" />
                <span className="text-icon-destructive">Delete Parent Profile</span>
              </Button>
              </PermissionCheck>
            </div>
          </MobileDrawer>
        )}
      </div>

      <div className="border-border-default flex h-9.5 items-center justify-between border-b px-3">
        <div className="">
          <p className="text-text-muted">Tag</p>
        </div>

        <Button variant="ghost">
          <span className="border-border-default bg-bg-badge-fuchsia text-bg-basic-fuchsia-strong rounded-md border px-2 text-xs font-medium">
            {/* {parent.tags[0].label} */}
          </span>
        </Button>
      </div>

      <div className="border-border-default flex h-9.5 items-center justify-between border-b px-3">
        <div className="">
          <p className="text-text-muted">Phone Number</p>
        </div>

        <Button variant="ghost">
          <p className="text-text-default">{parent.phoneNumber}</p>
        </Button>
      </div>

      <div className="flex h-9.5 items-center justify-between px-3">
        <div className="">
          <p className="text-text-muted">Email Address</p>
        </div>

        <Button variant="ghost">
          <p className="text-text-default">{parent.email}</p>
        </Button>
      </div>

      <div className="border-border-default flex h-9.5 items-center justify-between border-t px-3">
        <div className="">
          <p className="text-text-muted">Branch</p>
        </div>

        <Button variant="ghost">
          <p className="text-text-default">{parent.branchId}</p>
        </Button>
      </div>
    </div>
  );
};
