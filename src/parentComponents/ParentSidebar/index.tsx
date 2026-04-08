"use client";

import LeadIcon from "@/components/Icons/LeadIcon";
import { Tooltip } from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { parentNav } from "./constants";
import { NavigationType } from "@/components/Sidebar/types";
import Line from "@/components/Icons/Line";
import Logout from "@/components/Icons/Logout";
import { Sheet, SheetContent, SheetHeader, SheetOverlay, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useSidebarStore } from "@/store";
import CloseLarge from "@/components/Icons/CloseLarge";
import { Avatar } from "@/components/Avatar";

export const ParentSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [showLogo, setShowLogo] = useState(true);
  const { setIsSidebarOpen, isSidebarOpen, activeNav, setActiveNav } = useSidebarStore();

  useEffect(() => {
    setActiveNav(pathname.split("/")[1]);
  }, [pathname, setActiveNav]);

  return (
    <aside className="h-screen">
      <div
        className={cn(
          "border-border-default bg-bg-sidebar-subtle hide-scrollbar hidden h-screen w-69 space-y-4 overflow-y-auto border-r p-4 md:block md:space-y-8",
          !isSidebarOpen && "w-auto",
        )}
      >
        <div className={cn("flex", isSidebarOpen ? "justify-between" : "justify-center")}>
          {isSidebarOpen && (
            <div className="flex items-center gap-2">
              <Image src="/icons/Logomark.svg" width={24} height={24} alt="Digenty logo" className="text-icon-default-subtle" />
              <p className="text-text-default text-sm font-medium">Digenty</p>
            </div>
          )}

          {isSidebarOpen ? (
            <Button variant="ghost" onClick={() => setIsSidebarOpen(false)} className="p-0">
              <LeadIcon fill="var(--color-icon-default-subtle)" className="size-5" />
            </Button>
          ) : (
            <Tooltip
              description="Expand"
              Trigger={
                <Button
                  variant="ghost"
                  onClick={() => setIsSidebarOpen(true)}
                  onMouseEnter={() => setShowLogo(false)}
                  onMouseLeave={() => setShowLogo(true)}
                  className="p-0"
                >
                  {showLogo ? (
                    <Image src="/icons/Logomark.svg" width={24} height={24} alt="Digenty logo" />
                  ) : (
                    <LeadIcon fill="var(--color-icon-default-subtle)" className="size-5 rotate-180" />
                  )}
                </Button>
              }
            />
          )}
        </div>

        <div className="space-y-5 md:space-y-6">
          {parentNav.map((nav: NavigationType) => {
            return (
              <div key={nav.menu[0].title}>
                {!isSidebarOpen && nav.title ? (
                  <Line fill="var(--color-icon-default-subtle)" />
                ) : (
                  <p className="text-text-subtle text-xs leading-4 font-medium">{nav.title}</p>
                )}

                {nav.menu.map(menu => {
                  const isActive = activeNav === menu.url || (!activeNav && menu.title === "Overview");
                  return (
                    <Tooltip
                      key={menu.title}
                      description={menu.title}
                      Trigger={
                        <nav
                          className={cn(
                            "hover:bg-bg-state-soft flex cursor-pointer items-center gap-[11px] px-2 py-2 hover:rounded-full",
                            !isSidebarOpen && "justify-center px-0",
                            isActive && "bg-bg-state-soft rounded-full",
                          )}
                          onClick={() => router.push(`/${menu.url}`)}
                        >
                          <menu.icon fill={`${isActive ? "var(--color-icon-default)" : "var(--color-icon-default-disabled)"}`} />
                          {isSidebarOpen && (
                            <p className={`text-md leading-5 font-medium ${isActive ? "text-text-default" : "text-text-subtle"} `}>{menu.title}</p>
                          )}
                        </nav>
                      }
                    />
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="fixed bottom-0">
          <div className="flex w-full flex-col gap-3">
            <nav className={cn("flex cursor-pointer gap-2.75 py-2 pr-2")}>
              <Logout fill="var(--color-icon-default-subtle)" />
              {isSidebarOpen && <p className="text-text-subtle text-sm leading-5 font-medium">Sign out</p>}
            </nav>
            {isSidebarOpen ? (
              <div className="bg-bg-subtle border-border-default ml-[-5] flex h-13 w-61 max-w-full items-center gap-3 rounded-full border p-3">
                <Avatar />
                <div className="flex flex-col gap-1">
                  <div className="text-text-default text-sm font-medium">Damilare John</div>
                  <div className="text-text-muted text-xs">damilarejohn@gmail.com</div>
                </div>
              </div>
            ) : (
              <Avatar className="mb-2 ml-[-10]" />
            )}
          </div>
        </div>
      </div>

      {isMobile && (
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetOverlay className="block md:hidden" />
          <SheetContent
            side="left"
            className="2xs:w-81 hide-scrollbar border-border-default bg-bg-sidebar-subtle text-text-subtle flex h-screen w-69 overflow-y-auto p-4 text-left md:hidden"
          >
            <VisuallyHidden>
              <SheetHeader className="space-y-3 px-4">
                <SheetTitle>Sidebar</SheetTitle>
              </SheetHeader>
            </VisuallyHidden>

            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Image src="/icons/Logomark.svg" width={24} height={24} alt="Digenty logo" />
                <p className="text-text-default text-sm font-medium">Digenty</p>
              </div>

              <Button variant="ghost" onClick={() => setIsSidebarOpen(false)} className="p-0">
                <CloseLarge fill="var(--color-icon-default-subtle)" />
              </Button>
            </div>
            <div className="space-y-5 md:space-y-6">
              {parentNav.map((nav: NavigationType) => {
                return (
                  <div key={nav.menu[0].title}>
                    <p className="text-xs leading-4 font-medium">{nav.title}</p>

                    {nav.menu.map(menu => {
                      const isActive = activeNav === menu.url || (!activeNav && menu.title === "Dashboard");

                      return (
                        <nav
                          key={menu.title}
                          className={cn(
                            "flex cursor-pointer gap-2.75 p-2",
                            !isSidebarOpen && "justify-center px-0",
                            isActive && "bg-bg-state-soft rounded-md",
                          )}
                          onClick={() => router.push(`/${menu.url}`)}
                        >
                          <menu.icon fill={`${isActive ? "var(--color-icon-default)" : "var(--color-icon-default-disabled)"}`} />
                          {isSidebarOpen && (
                            <p className={`text-md leading-5 font-medium ${isActive ? "text-text-default" : "text-text-subtle"} `}>{menu.title}</p>
                          )}
                        </nav>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            <div className="fixed bottom-0">
              <div className="flex w-full flex-col gap-3">
                <nav className={cn("flex cursor-pointer gap-2.75 py-2 pr-2")}>
                  <Logout fill="var(--color-icon-default-subtle)" />
                  <p className="text-sm leading-5 font-medium">Sign out</p>
                </nav>
                <div className="bg-bg-subtle border-border-default flex h-13 w-61 max-w-full items-center gap-3 rounded-full border p-3">
                  <Avatar />
                  <div className="flex flex-col gap-1">
                    <div className="text-text-default text-sm font-medium">Damilare John</div>
                    <div className="text-text-muted text-xs">damilarejohn@gmail.com</div>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </aside>
  );
};
