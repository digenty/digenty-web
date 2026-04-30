import { FileList3Fill, IndeterminateCircleFill, Notification2Fill, SendPlaneFill, UserFill } from "@digenty/icons";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";
import { Shield, UserRoundCheck, UserRoundPlus, Users } from "lucide-react";

export const QuickActions = () => {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <h2 className="text-text-default text-lg font-semibold md:text-2xl">Quick Actions</h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8 lg:grid-cols-5">
        {/* <Button className="bg-bg-state-secondary border-border-darker shadow-light h-10 gap-2 rounded-md border px-3.5!">
          <FileList3Fill fill="var(--color-icon-default-muted)" className="size-4.5" />
          <span className="text-text-default truncate font-medium">Create Invoice</span>
        </Button> */}

        {/* <Button className="bg-bg-state-secondary border-border-darker shadow-light h-10 gap-2 rounded-md border px-3.5!">
          <Notification2Fill fill="var(--color-icon-default-muted)" className="size-4.5" />
          <span className="text-text-default truncate font-medium">Send Reminders</span>
        </Button> */}

        <Button
          onClick={() => router.push("/staff/student-and-parent-record/add-student")}
          className="bg-bg-state-secondary border-border-darker shadow-light h-10 gap-2 rounded-md border px-3.5!"
        >
          <UserFill fill="var(--color-icon-default-muted)" className="size-4.5" />
          <span className="text-text-default truncate font-medium">Add Student</span>
        </Button>

        {/* Temporary actions start */}
        <Button
          onClick={() => router.push("/staff/student-and-parent-record/add-parent")}
          className="bg-bg-state-secondary border-border-darker shadow-light h-10 gap-2 rounded-md border px-3.5!"
        >
          <Users fill="var(--color-icon-default-muted)" stroke="var(--color-icon-default-muted)" className="size-4.5" />
          <span className="text-text-default truncate font-medium">Add Parent</span>
        </Button>

        <Button
          onClick={() => router.push("/staff/settings/permissions/add-role")}
          className="bg-bg-state-secondary border-border-darker shadow-light h-10 gap-2 rounded-md border px-3.5!"
        >
          <Shield fill="var(--color-icon-default-muted)" stroke="var(--color-icon-default-muted)" className="text-text-icon-default-muted size-4.5" />
          <span className="text-text-default truncate font-medium">Add Roles</span>
        </Button>

        <Button
          onClick={() => router.push("/staff/settings/permissions/add-staff")}
          className="bg-bg-state-secondary border-border-darker shadow-light h-10 gap-2 rounded-md border px-3.5!"
        >
          <UserRoundPlus fill="var(--color-icon-default-muted)" stroke="var(--color-icon-default-muted)" className="size-4.5" />
          <span className="text-text-default truncate font-medium">Add Staff</span>
        </Button>

        <Button
          onClick={() => router.push("/staff/attendance")}
          className="bg-bg-state-secondary border-border-darker shadow-light h-10 gap-2 rounded-md border px-3.5!"
        >
          <UserRoundCheck fill="var(--color-icon-default-muted)" stroke="var(--color-icon-default-muted)" className="size-4.5" />
          <span className="text-text-default truncate font-medium">View Attendance</span>
        </Button>
        {/* Temporary actions end */}

        {/* <Button className="bg-bg-state-secondary border-border-darker shadow-light h-10 gap-2 rounded-md border px-3.5!">
          <IndeterminateCircleFill fill="var(--color-icon-default-muted)" className="size-4.5" />
          <span className="text-text-default truncate font-medium">Add Expense</span>
        </Button> */}

        {/* <Button className="bg-bg-state-secondary border-border-darker shadow-light h-10 gap-2 rounded-md border px-3.5!">
          <SendPlaneFill fill="var(--color-icon-default-muted)" className="size-4.5" />
          <span className="text-text-default truncate font-medium">Send Campaign</span>
        </Button> */}
      </div>
    </div>
  );
};
