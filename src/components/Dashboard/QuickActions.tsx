import { UserFill } from "@digenty/icons";
import { useRouter } from "next/navigation";

import { Skeleton } from "../ui/skeleton";
import { useGetCurrentSubscription } from "@/hooks/queryHooks/useSubscription";
import { ChevronRight, Shield, UserRoundCheck, UserRoundPlus, Users } from "lucide-react";
import { ReactNode } from "react";

type Action = { label: string; href: string; icon: ReactNode };

const iconProps = { fill: "var(--color-icon-default-muted)", stroke: "var(--color-icon-default-muted)", className: "size-4.5" };

const ACTIONS: Action[] = [
  {
    label: "Add Student",
    href: "/staff/student-and-parent-record/add-student",
    icon: <UserFill fill="var(--color-icon-default-muted)" className="size-4.5" />,
  },
  { label: "Add Parent", href: "/staff/student-and-parent-record/add-parent", icon: <Users {...iconProps} /> },
  { label: "Add Roles", href: "/staff/settings/permissions/add-role", icon: <Shield {...iconProps} /> },
  { label: "Add Staff", href: "/staff/settings/permissions/add-staff", icon: <UserRoundPlus {...iconProps} /> },
  { label: "View Attendance", href: "/staff/attendance", icon: <UserRoundCheck {...iconProps} /> },
];

export const QuickActions = () => {
  const router = useRouter();
  const { data: subscription, isLoading } = useGetCurrentSubscription();
  // Without an active subscription these actions are unavailable, so show placeholders instead.
  const showSkeleton = isLoading || subscription?.data?.status !== "ACTIVE";

  return (
    <section className="space-y-3">
      <h2 className="text-text-default text-base font-semibold md:text-lg">Quick actions</h2>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {showSkeleton
          ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="bg-bg-input-soft h-14 w-full rounded-xl" />)
          : ACTIONS.map(action => (
              <button
                key={action.href}
                type="button"
                onClick={() => router.push(action.href)}
                className="border-border-default bg-bg-default shadow-light hover:border-border-darker group flex h-14 w-full cursor-pointer items-center gap-3 rounded-xl border px-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="bg-bg-state-soft flex size-8 shrink-0 items-center justify-center rounded-lg">{action.icon}</span>
                <span className="text-text-default min-w-0 flex-1 truncate text-sm font-medium">{action.label}</span>
                <ChevronRight className="text-text-muted size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            ))}
      </div>
    </section>
  );
};
