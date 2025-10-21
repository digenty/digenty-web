import { Student } from "@/components/DataTable/types";
import { MoreHorizontalIcon } from "lucide-react";
import { Avatar } from "../Avatar";
import { Button } from "../ui/button";

export const MobileCard = ({ student }: { student: Student }) => {
  return (
    <div className="bg-bg-subtle border-border-default rounded-sm border text-sm font-medium">
      <div className="border-border-default flex h-9.5 items-center justify-between border-b px-3">
        <div className="flex gap-2">
          <Avatar username="Damilare John" className="size-5" url="" />
          <p className="text-text-default">{student.name}</p>
        </div>

        <Button variant="ghost">
          <MoreHorizontalIcon className="text-icon-default size-5" />
        </Button>
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
