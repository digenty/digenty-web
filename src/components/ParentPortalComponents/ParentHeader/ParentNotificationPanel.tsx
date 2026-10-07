"use client";

import { Notification2 } from "@digenty/icons";
import { useState } from "react";
import {
  useGetParentNotifications,
  useMarkAllParentNotificationsRead,
  useMarkParentNotificationRead,
} from "@/hooks/queryHooks/useParentNotification";
import { useIsMobile } from "@/hooks/useIsMobile";
import { MobileDrawer } from "@/components/MobileDrawer";
import { NotificationContent } from "@/components/Header/NotificationPanel";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const ParentNotificationPanel = () => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const { data, isLoading, isError } = useGetParentNotifications({ pageSize: 20 });
  const { mutate: markRead } = useMarkParentNotificationRead();
  const { mutate: markAllRead, isPending: isMarkingAll } = useMarkAllParentNotificationsRead();

  const notifications = data?.notifications ?? [];
  const unreadCount = data?.unreadCount ?? 0;

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

  const content = (
    <NotificationContent
      unreadCount={unreadCount}
      notifications={notifications}
      isLoading={isLoading}
      isError={isError}
      onMarkRead={id => markRead(id)}
      onMarkAllRead={() => markAllRead()}
      isMarkingAll={isMarkingAll}
    />
  );

  if (isMobile) {
    return (
      <>
        {triggerButton}
        <MobileDrawer open={open} setIsOpen={setOpen} title="Notifications">
          {content}
        </MobileDrawer>
      </>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="bg-bg-card border-border-default w-96 overflow-hidden rounded-xl p-0 shadow-lg">
        {content}
      </PopoverContent>
    </Popover>
  );
};
