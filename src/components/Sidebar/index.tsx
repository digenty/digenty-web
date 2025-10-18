"use client";
import { Sheet, SheetContent, SheetHeader, SheetOverlay, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Logout from "../Icons/Logout";
import { Button } from "../ui/button";
import { navigation } from "./constants";
import { NavigationType } from "./types";
import CloseLarge from "../Icons/CloseLarge";


export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogo, setShowLogo] = useState(true);
  const { setIsSidebarOpen, isSidebarOpen, activeNav, setActiveNav } = useSidebarStore();

  useEffect(() => {
    setActiveNav(pathname.split("/")[1]);
  }, [pathname, setActiveNav]);

  return (
    <>
      <div
        className={cn(
          "border-border-default bg-bg-sidebar-subtle hidden w-69 space-y-4 border-r p-4 md:block md:space-y-8",
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
              <Image src="/icons/lead-icon.svg" width={24} height={24} alt="Close button" />
            </Button>
          ) : (
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
                <Image src="/icons/lead-icon.svg" width={24} height={24} alt="Close button" />
              )}
            </Button>
          )}
        </div>

        <div className="space-y-5 md:space-y-6">
          {navigation.map((nav: NavigationType) => {
            return (
              <div key={nav.menu[0].title}>
                {!isSidebarOpen && nav.title ? ( // Exclude divider and title for  groups without title
                  <Image src="/icons/Line.svg" width={40} height={0} alt="Line" />
                ) : (
                  <p className="text-text-subtle text-xs leading-4 font-medium">{nav.title}</p>
                )}

                {nav.menu.map(menu => {
                  const isActive = activeNav === menu.url || (!activeNav && menu.title === "Dashboard");
                  return (
                    <nav
                      key={menu.title}
                      className={cn(
                        "flex cursor-pointer items-center gap-[11px] px-2 py-2",
                        !isSidebarOpen && "justify-center px-0",
                        isActive && "bg-bg-state-soft rounded-md",
                      )}
                      onClick={() => router.push(menu.url)}
                    >
                      <menu.icon fill="var(--color-icon-default-subtle)" />
                      {isSidebarOpen && <p className="text-text-subtle text-sm leading-5 font-medium">{menu.title}</p>}
                    </nav>
                  );
                })}
              </div>
            );
          })}
        </div>

        <nav className={cn("flex cursor-pointer items-center gap-[11px] py-2", !isSidebarOpen && "justify-center")}>
          <Image src="/icons/logout.svg" width={18} height={18} alt="Logout button" />
          {isSidebarOpen && <p className="text-text-subtle text-sm leading-5 font-medium">Sign out</p>}
        </nav>
      </div>

      {/* Mobile */}

      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetOverlay className="block md:hidden" />
        <SheetContent
          side="left"
          className="2xs:w-81 border-border-default flex h-screen w-69 bg-bg-sidebar-subtle p-4 text-left text-text-subtle md:hidden"
        >
          <VisuallyHidden>
            <SheetHeader className="space-y-3 px-4">
              <SheetTitle>Sidebar</SheetTitle>
            </SheetHeader>
          </VisuallyHidden>

          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Image src="/icons/Logomark.svg" width={24} height={24} alt="Digenty logo" />
              <p className="text-sm font-medium text-zinc-950">Digenty</p>
            </div>

            <Button variant="ghost" onClick={() => setIsSidebarOpen(false)} className="p-0">
              <CloseLarge fill="var(--color-icon-default-subtle)" />
            </Button>
          </div>
          <div className="space-y-5 md:space-y-6">
            {navigation.map((nav: NavigationType) => {
              return (
                <div key={nav.menu[0].title}>
                  <p className="text-xs leading-4 font-medium">{nav.title}</p>

                  {nav.menu.map(menu => (
                    <nav key={menu.title} className={cn("flex cursor-pointer gap-[11px] py-2")}>
                      <menu.icon fill="var(--color-icon-default-subtle)" />
                      <p className="text-sm leading-5 font-medium">{menu.title}</p>
                    </nav>
                  ))}
                </div>
              );
            })}
          </div>

          <nav className={cn("flex cursor-pointer gap-[11px] py-2 pr-2")}>
            <Logout fill="var(--color-icon-default-subtle)" />
            <p className="text-sm leading-5 font-medium">Sign out</p>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
};
