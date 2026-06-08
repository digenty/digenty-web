"use client";

import { Calendar, CheckboxCircleFill, Key, Notification2 } from "@digenty/icons";
import { Notification, NotificationType } from "@/api/notification";
import { useGetNotifications, useMarkAllNotificationsRead, useMarkNotificationRead } from "@/hooks/queryHooks/useNotification";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { MobileDrawer } from "../MobileDrawer";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const TYPE_CONFIG: Record<NotificationType, { icon: React.ElementType; bg: string; fill: string }> = {
  APPROVAL: {
    icon: Notification2,
    bg: "bg-bg-badge-orange",
    fill: "var(--color-bg-basic-orange-strong)",
  },
  EDIT_REQUEST: {
    icon: Key,
    bg: "bg-bg-badge-lime",
    fill: "var(--color-bg-basic-lime-strong)",
  },
  RESULT_APPROVED: {
    icon: CheckboxCircleFill,
    bg: "bg-bg-badge-green",
    fill: "var(--color-bg-basic-green-strong)",
  },
  RESULT_RETURNED: {
    icon: CheckboxCircleFill,
    bg: "bg-bg-badge-red",
    fill: "var(--color-bg-basic-red-strong)",
  },
  REMINDER: {
    icon: Calendar,
    bg: "bg-bg-badge-blue",
    fill: "var(--color-bg-basic-blue-strong)",
  },
  SYSTEM: {
    icon: Notification2,
    bg: "bg-bg-state-soft",
    fill: "var(--color-icon-default-subtle)",
  },
  DIRECT_MESSAGE: {
    icon: Notification2,
    bg: "bg-bg-badge-blue",
    fill: "var(--color-bg-basic-blue-strong)",
  },
};

const relativeTime = (iso: string) => {
  try {
    return formatDistanceToNowStrict(new Date(iso), { addSuffix: true });
  } catch {
    return "";
  }
};

const NotificationItem = ({ notification, onMarkRead }: { notification: Notification; onMarkRead: (id: number) => void }) => {
  const config = TYPE_CONFIG[notification.type] ?? TYPE_CONFIG.SYSTEM;
  const { icon: Icon, bg, fill } = config;

  return (
    <div
      role="button"
      onClick={() => !notification.read && onMarkRead(notification.id)}
      className={cn(
        "flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors hover:bg-bg-state-ghost-hover",
        !notification.read && "bg-bg-state-soft",
      )}
    >
      <div className={cn("mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full", bg)}>
        <Icon className="size-4" fill={fill} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {!notification.read && <span className="size-1.5 shrink-0 rounded-full bg-blue-500" />}
            <p className={cn("text-sm leading-tight", notification.read ? "text-text-subtle" : "text-text-default font-medium")}>
              {notification.title}
            </p>
          </div>
          <span className="text-text-hint mt-0.5 shrink-0 text-xs">{relativeTime(notification.createdAt)}</span>
        </div>
        <p className="text-text-muted mt-1 line-clamp-2 text-xs leading-relaxed">{notification.message}</p>
      </div>
    </div>
  );
};

const NotificationSkeleton = () => (
  <div className="flex items-start gap-3 px-4 py-3">
    <Skeleton className="bg-bg-input-soft mt-0.5 size-8 shrink-0 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="bg-bg-input-soft h-3.5 w-3/4" />
      <Skeleton className="bg-bg-input-soft h-3 w-full" />
      <Skeleton className="bg-bg-input-soft h-3 w-1/2" />
    </div>
  </div>
);

const NotificationContent = ({
  unreadCount,
  notifications,
  isLoading,
  isError,
  onMarkAllRead,
  onMarkRead,
  isMarkingAll,
}: {
  unreadCount: number;
  notifications: Notification[];
  isLoading: boolean;
  isError: boolean;
  onMarkAllRead: () => void;
  onMarkRead: (id: number) => void;
  isMarkingAll: boolean;
}) => (
  <div className="flex flex-col">
    <div className="border-border-default flex items-center justify-between border-b px-4 py-3">
      <div className="flex items-center gap-2">
        <p className="text-text-default text-sm font-semibold">Notifications</p>
        {unreadCount > 0 && (
          <span className="bg-bg-state-primary text-text-white-default flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-semibold">
            {unreadCount}
          </span>
        )}
      </div>
      {unreadCount > 0 && (
        <button
          onClick={onMarkAllRead}
          disabled={isMarkingAll}
          className="text-text-subtle hover:text-text-default disabled:text-text-hint text-xs font-medium transition-colors disabled:cursor-not-allowed"
        >
          {isMarkingAll ? "Marking…" : "Mark all as read"}
        </button>
      )}
    </div>

    <div className="hide-scrollbar max-h-[420px] overflow-y-auto">
      {isLoading ? (
        <div className="divide-border-default divide-y">
          {Array.from({ length: 4 }).map((_, i) => (
            <NotificationSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center gap-2 py-12">
          <p className="text-text-subtle text-sm">Could not load notifications</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-12">
          <div className="bg-bg-state-soft flex size-10 items-center justify-center rounded-full">
            <Notification2 fill="var(--color-icon-default-muted)" className="size-5" />
          </div>
          <p className="text-text-subtle text-sm">No notifications yet</p>
        </div>
      ) : (
        <div className="divide-border-default divide-y">
          {notifications.map(n => (
            <NotificationItem key={n.id} notification={n} onMarkRead={onMarkRead} />
          ))}
        </div>
      )}
    </div>
  </div>
);

export const NotificationPanel = () => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const { data, isLoading, isError } = useGetNotifications({ pageSize: 20 });
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead, isPending: isMarkingAll } = useMarkAllNotificationsRead();

  const notifications = data?.data?.notifications ?? [];
  const unreadCount = data?.data?.unreadCount ?? 0;

  const triggerButton = (
    <Button variant="ghost" className="relative p-0!" onClick={() => isMobile && setOpen(true)}>
      <Notification2 fill="var(--color-icon-default-subtle)" />
      {unreadCount > 0 && (
        <span className="bg-bg-state-primary text-text-white-default absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </Button>
  );

  const contentProps = {
    unreadCount,
    notifications,
    isLoading,
    isError,
    onMarkRead: (id: number) => markRead(id),
    onMarkAllRead: () => markAllRead(),
    isMarkingAll,
  };

  if (isMobile) {
    return (
      <>
        {triggerButton}
        <MobileDrawer open={open} setIsOpen={setOpen} title="Notifications">
          <NotificationContent {...contentProps} />
        </MobileDrawer>
      </>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="bg-bg-card border-border-default w-96 overflow-hidden rounded-xl p-0 shadow-lg">
        <NotificationContent {...contentProps} />
      </PopoverContent>
    </Popover>
  );
};
