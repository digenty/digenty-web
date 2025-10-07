"use client";
import { Sheet, SheetContent, SheetHeader, SheetOverlay, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import { useState } from "react";
import { Button } from "../ui/button";
import { navigation } from "./constants";
import { NavigationType } from "./types";

export const Sidebar = () => {
  const [showLogo, setShowLogo] = useState(true);
  const { setIsSidebarOpen: setIsCollapsed, isSidebarOpen: isCollapsed } = useSidebarStore();

  return (
    <>
      <div
        className={cn("border-default-transparent/10 hidden w-69 space-y-4 border-r bg-zinc-50 p-4 md:block md:space-y-8", isCollapsed && "w-auto")}
      >
        <div className={cn("flex", isCollapsed ? "justify-center" : "justify-between")}>
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Image src="/icons/Logomark.svg" width={24} height={24} alt="Digenty logo" />
              <p className="text-sm font-medium text-zinc-950/70">Digenty</p>
            </div>
          )}

          {isCollapsed ? (
            <Button
              variant="ghost"
              onClick={() => setIsCollapsed(false)}
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
          ) : (
            <Button variant="ghost" onClick={() => setIsCollapsed(true)} className="p-0">
              <Image src="/icons/lead-icon.svg" width={24} height={24} alt="Close button" />
            </Button>
          )}
        </div>

        <div className="space-y-5 md:space-y-6">
          {navigation.map((nav: NavigationType) => {
            return (
              <div key={nav.menu[0].title}>
                {isCollapsed && nav.title ? ( // Exclude divider and title for  groups without title
                  <Image src="/icons/Line.svg" width={40} height={0} alt="Line" />
                ) : (
                  <p className="text-xs leading-4 font-medium">{nav.title}</p>
                )}

                {nav.menu.map(menu => (
                  <nav key={menu.title} className={cn("flex cursor-pointer items-center gap-[11px] py-2", isCollapsed && "justify-center")}>
                    <Image src={menu.iconPath} width={18} height={18} alt={menu.title} />
                    {!isCollapsed && <p className="text-sm leading-5 font-medium">{menu.title}</p>}
                  </nav>
                ))}
              </div>
            );
          })}
        </div>

        <nav className={cn("flex cursor-pointer items-center gap-[11px] py-2 pr-2", isCollapsed && "justify-center")}>
          <Image src="/icons/logout.svg" width={18} height={18} alt="Logout button" />
          {!isCollapsed && <p className="text-sm leading-5 font-medium">Sign out</p>}
        </nav>
      </div>

      {/* Mobile */}

      {/* <Sheet open={isCollapsed} onOpenChange={setIsCollapsed}>
        <SheetOverlay className="block md:hidden" />
        <SheetContent side="left" className="flex h-screen w-69 2xs:w-81  bg-zinc-50 p-4 text-left md:hidden text-zinc-600">
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

            <Button variant="ghost" onClick={() => setIsCollapsed(false)} className="p-0">
              <Image src="/icons/close-large.svg" width={20} height={20} alt="Close button" />
            </Button>
          </div>
          <div className="space-y-5 md:space-y-6">
            {navigation.map((nav: NavigationType) => {
              return (
                <div key={nav.menu[0].title}>
                    <p className="text-xs leading-4 font-medium">{nav.title}</p>

                  {nav.menu.map(menu => (
                    <nav key={menu.title} className={cn("flex cursor-pointer  gap-[11px] py-2")}>
                      <Image src={menu.iconPath} width={18} height={18} alt={menu.title} />
                      <p className="text-sm leading-5 font-medium">{menu.title}</p>
                    </nav>
                  ))}
                </div>
              );
            })}
          </div>

          <nav className={cn("flex cursor-pointer gap-[11px] py-2 pr-2")}>
            <Image src="/icons/logout.svg" width={18} height={18} alt="Logout button" />
            <p className="text-sm leading-5 font-medium">Sign out</p>
          </nav>
        </SheetContent>
      </Sheet> */}
    </>
  );
};
