import { Student } from "@/api/types";
import { useStudentStore } from "@/store/student";
import { EyeIcon, MoreHorizontalIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar } from "../../Avatar";
import DeleteBin from "../../Icons/DeleteBin";
import Edit from "../../Icons/Edit";
import UserMinus from "../../Icons/UserMinus";
import { MobileDrawer } from "../../MobileDrawer";
import { Button } from "../../ui/button";
import { PermissionCheck } from "@/components/ModulePermissionsWrapper/PermissionCheck";
import { canManage } from "@/lib/permissions/students-and-parents";

export const MobileCard = ({ student }: { student: Student }) => {
  const router = useRouter();
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const { setOpenWithdraw, setOpenDelete, setStudentIdsToDelete, setStudentIdsToWithdraw } = useStudentStore();

  return (
    <div role="button" className="bg-bg-subtle border-border-default rounded-sm border text-sm font-medium">
      <div className="border-border-default flex h-9.5 items-center justify-between border-b px-3">
        <div className="flex gap-2">
          <Avatar className="size-5" url={student.image ?? ""} />
          <p className="text-text-default">
            {student.firstName} {student.lastName}
          </p>
        </div>

        <Button
          variant="ghost"
          onClick={evt => {
            evt.stopPropagation();
            setIsOptionsOpen(true);
          }}
        >
          <MoreHorizontalIcon className="text-icon-default size-5" />
        </Button>

        {isOptionsOpen && (
          <MobileDrawer open={isOptionsOpen} setIsOpen={setIsOptionsOpen} title="Actions">
            <div className="flex flex-col gap-2 px-3 py-4">
              <Button
                onClick={evt => {
                  evt.stopPropagation();
                  router.push(`/student-and-parent-record/students/${student.id}`);
                }}
                className="bg-bg-state-secondary border-border-darker text-text-default h-8 border text-sm font-medium"
              >
                <EyeIcon className="text-icon-default-muted size-4" />
                <span>View Student Profile</span>
              </Button>
              <PermissionCheck permissionUtility={canManage}>

              <Button
                onClick={() => router.push(`/student-and-parent-record/students/${student.id}/edit`)}
                className="bg-bg-state-secondary border-border-darker text-text-default h-8 border text-sm font-medium"
              >
                <Edit fill="var(--color-icon-default-muted)" className="size-4" />
                <span>Edit Student Profile</span>
              </Button>

              <Button
                onClick={evt => {
                  evt.stopPropagation();
                  setOpenWithdraw(true);
                  setStudentIdsToWithdraw([student.id]);
                }}
                className="bg-bg-state-secondary border-border-darker text-text-default h-8 border text-sm font-medium"
              >
                <UserMinus fill="var(--color-icon-default-muted)" className="size-4" />
                <span>Withdraw Student</span>
              </Button>
              <Button
                onClick={evt => {
                  evt.stopPropagation();
                  setOpenDelete(true);
                  setStudentIdsToDelete([student.id]);
                }}
                className="bg-bg-state-secondary border-border-darker text-text-default h-8 border text-sm font-medium"
              >
                <DeleteBin fill="var(--color-icon-destructive)" className="size-4" />
                <span className="text-icon-destructive">Delete Student Profile</span>
              </Button>
              </PermissionCheck>
            </div>
          </MobileDrawer>
        )}
      </div>

      <div className="border-border-default flex h-9.5 items-center justify-between border-b px-3">
        <div className="">
          <p className="text-text-muted">Class</p>
        </div>

        <Button variant="ghost">
          <p className="text-text-default">{student.class}</p>
        </Button>
      </div>

      <div className="flex h-9.5 items-center justify-between px-3">
        <div className="">
          <p className="text-text-muted">Branch</p>
        </div>

        <Button variant="ghost">
          <p className="text-text-default">{student.branch}</p>
        </Button>
      </div>
    </div>
  );
};
