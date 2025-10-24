import FileList3Fill from "../Icons/FileList3Fill";
import IndeterminateCircleFill from "../Icons/IndeterminateCircleFill";
import Notification2Fill from "../Icons/Notification2Fill";
import SendPlaneFill from "../Icons/SendPlaneFill";
import UserFill from "../Icons/UserFill";
import { Button } from "../ui/button";

export const QuickActions = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-text-default text-lg font-semibold md:text-2xl">Quick Actions</h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8 lg:grid-cols-5">
        <Button className="bg-bg-state-secondary border-border-darker shadow-light h-10 gap-2 rounded-md border px-[14px]!">
          <FileList3Fill fill="var(--color-icon-default-muted)" className="size-[15px]" />
          <span className="text-text-default font-medium">Create Invoice</span>
        </Button>

        <Button className="bg-bg-state-secondary border-border-darker shadow-light h-10 gap-2 rounded-md border px-[14px]!">
          <Notification2Fill fill="var(--color-icon-default-muted)" className="size-[15px]" />
          <span className="text-text-default font-medium">Send Reminders</span>
        </Button>

        <Button className="bg-bg-state-secondary border-border-darker shadow-light h-10 gap-2 rounded-md border px-[14px]!">
          <UserFill fill="var(--color-icon-default-muted)" className="size-[15px]" />
          <span className="text-text-default font-medium">Add Student</span>
        </Button>

        <Button className="bg-bg-state-secondary border-border-darker shadow-light h-10 gap-2 rounded-md border px-[14px]!">
          <IndeterminateCircleFill fill="var(--color-icon-default-muted)" className="size-[15px]" />
          <span className="text-text-default font-medium">Add Expense</span>
        </Button>

        <Button className="bg-bg-state-secondary border-border-darker shadow-light h-10 gap-2 rounded-md border px-[14px]!">
          <SendPlaneFill fill="var(--color-icon-default-muted)" className="size-[15px]" />
          <span className="text-text-default font-medium">Send Campaign</span>
        </Button>
      </div>
    </div>
  );
};
