import { EyeIcon, MoreHorizontalIcon } from "lucide-react";
import { useState } from "react";
import { Avatar } from "../Avatar";
import DeleteBin from "../Icons/DeleteBin";
import Edit from "../Icons/Edit";
import UserMinus from "../Icons/UserMinus";
import { MobileDrawer } from "../MobileDrawer";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Student } from "@/api/types";

export const MobileCard = ({
  student,
  setSelectedRows,
  handleWithdrawal,
  handleDeletion,
}: {
  student: Student;
  setSelectedRows: (student: Student[]) => void;
  handleWithdrawal: () => void;
  handleDeletion: () => void;
}) => {
  const router = useRouter();
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  return (
    <div
      role="button"
      className="bg-bg-subtle border-border-default rounded-sm border text-sm font-medium"
      onClick={() => router.push(`/student-and-parent-record/${student.id}`)}
    >
      <div className="border-border-default flex h-9.5 items-center justify-between border-b px-3">
        <div className="flex gap-2">
          <Avatar username={student.firstName} className="size-5" url={student.image ?? ""} />
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
                  router.push(`/student-and-parent-record/${student.id}`);
                }}
                className="bg-bg-state-secondary border-border-darker text-text-default h-8 border text-sm font-medium"
              >
                <EyeIcon className="text-icon-default-muted size-4" />
                <span>View Student Profile</span>
              </Button>
              <Button className="bg-bg-state-secondary border-border-darker text-text-default h-8 border text-sm font-medium">
                <Edit fill="var(--color-icon-default-muted)" className="size-4" />
                <span>Edit Student Profile</span>
              </Button>

              <Button
                onClick={evt => {
                  evt.stopPropagation();
                  setSelectedRows([student]);
                  handleWithdrawal();
                }}
                className="bg-bg-state-secondary border-border-darker text-text-default h-8 border text-sm font-medium"
              >
                <UserMinus fill="var(--color-icon-default-muted)" className="size-4" />
                <span>Withdraw Student</span>
              </Button>
              <Button
                onClick={evt => {
                  evt.stopPropagation();
                  setSelectedRows([student]);
                  handleDeletion();
                }}
                className="bg-bg-state-secondary border-border-darker text-text-default h-8 border text-sm font-medium"
              >
                <DeleteBin fill="var(--color-icon-destructive)" className="size-4" />
                <span className="text-icon-destructive">Delete Student Profile</span>
              </Button>
            </div>
          </MobileDrawer>
        )}
      </div>

      <div className="border-border-default flex h-9.5 items-center justify-between border-b px-3">
        <div className="">
          <p className="text-text-muted">Class</p>
        </div>

        <Button variant="ghost">
          <p className="text-text-default">{student.classId}</p>
        </Button>
      </div>

      <div className="flex h-9.5 items-center justify-between px-3">
        <div className="">
          <p className="text-text-muted">Branch</p>
        </div>

        <Button variant="ghost">
          <p className="text-text-default">{student.branchId}</p>
        </Button>
      </div>
    </div>
  );
};
