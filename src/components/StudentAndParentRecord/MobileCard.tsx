import { Student } from "@/components/StudentAndParentRecord/types";
import { EyeIcon, MoreHorizontalIcon } from "lucide-react";
import { useState } from "react";
import { Avatar } from "../Avatar";
import DeleteBin from "../Icons/DeleteBin";
import Edit from "../Icons/Edit";
import UserMinus from "../Icons/UserMinus";
import { MobileDrawer } from "../MobileDrawer";
import { Button } from "../ui/button";

export const MobileCard = ({ student }: { student: Student }) => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  return (
    <div className="bg-bg-subtle border-border-default rounded-sm border text-sm font-medium">
      <div className="border-border-default flex h-9.5 items-center justify-between border-b px-3">
        <div className="flex gap-2">
          <Avatar username="Damilare John" className="size-5" url="" />
          <p className="text-text-default">{student.name}</p>
        </div>

        <Button variant="ghost" onClick={() => setIsOptionsOpen(true)}>
          <MoreHorizontalIcon className="text-icon-default size-5" />
        </Button>

        {isOptionsOpen && (
          <MobileDrawer open={isOptionsOpen} setIsOpen={setIsOptionsOpen} title="Actions">
            <div className="flex flex-col gap-2 px-3 py-4">
              <Button className="bg-bg-state-secondary border-border-darker text-text-default h-8 border text-sm font-medium">
                <EyeIcon className="text-icon-default-muted size-4" />
                <span>View Student Profile</span>
              </Button>
              <Button className="bg-bg-state-secondary border-border-darker text-text-default h-8 border text-sm font-medium">
                <Edit fill="var(--color-icon-default-muted)" className="size-4" />
                <span>Edit Student Profile</span>
              </Button>

              <Button className="bg-bg-state-secondary border-border-darker text-text-default h-8 border text-sm font-medium">
                <UserMinus fill="var(--color-icon-default-muted)" className="size-4" />
                <span>Withdraw Student</span>
              </Button>
              <Button className="bg-bg-state-secondary border-border-darker text-text-default h-8 border text-sm font-medium">
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
