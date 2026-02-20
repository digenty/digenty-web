"use client";
import { deleteSession } from "@/app/actions/auth";
import { Sheet, SheetContent, SheetHeader, SheetOverlay, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { canViewStudentParentRecords } from "@/lib/permissions/students-and-parents";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store";
import { JWTPayload } from "@/types";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BankCard from "../Icons/BankCard";
import Bill from "../Icons/Bill";
import CalendarCheck from "../Icons/CalendarCheck";
import ColorFilter from "../Icons/ColorFilter";
import FileList3 from "../Icons/FileList3";
import Global from "../Icons/Global";
import GraduationCap from "../Icons/GraduationCap";
import Group from "../Icons/Group";
import Home2 from "../Icons/Home2";
import LeadIcon from "../Icons/LeadIcon";
import Line from "../Icons/Line";
import LineChart from "../Icons/LineChart";
import Logout from "../Icons/Logout";
import Macbook from "../Icons/Macbook";
import Megaphone from "../Icons/Megaphone";
import Settings4 from "../Icons/Settings4";
import Store3 from "../Icons/Store3";
import Wallet from "../Icons/Wallet";
import { Tooltip } from "../Tooltip";
import { Button } from "../ui/button";
import { NavigationType } from "./types";
import { canViewClassesAndSubjects } from "@/lib/permissions/classes-and-subjects";
import { canViewAttendance } from "@/lib/permissions/attendance";
import { canViewFinanceReport } from "@/lib/permissions/finance-report";
import { canViewFeeCollection } from "@/lib/permissions/fee-collection";
import { canViewExpenses } from "@/lib/permissions/expenses";
import { canViewFees } from "@/lib/permissions/fees";
import { canViewInvoices } from "@/lib/permissions/invoices";
import { canViewStock } from "@/lib/permissions/stock";
import { canViewSettings } from "@/lib/permissions/settings";
import { canViewCommunication } from "@/lib/permissions/communication";
import { canViewPortalCustomization } from "@/lib/permissions/portal-customization";
import { canViewPortalOverview } from "@/lib/permissions/portal-overview";
import { canViewDomain } from "@/lib/permissions/domain";

export const Sidebar = () => {
  const user: Partial<JWTPayload> = useLoggedInUser();

  const navigation = [
    {
      title: "",
      menu: [
        {
          title: "Dashboard",
          url: "/",
          icon: Home2,
        },

        ...(canViewStudentParentRecords(user?.permissions)
          ? [
              {
                title: "Student & Parent Record",
                url: "student-and-parent-record",
                icon: Group,
              },
            ]
          : []),

        ...(canViewClassesAndSubjects(user?.permissions)
          ? [
              {
                title: "Classes & Subjects",
                url: "classes-and-subjects",
                icon: GraduationCap,
              },
            ]
          : []),

        ...(canViewAttendance(user?.permissions)
          ? [
              {
                title: "Attendance",
                url: "attendance",
                icon: CalendarCheck,
              },
            ]
          : []),
      ],
    },

    ...(canViewFinanceReport(user?.permissions) ||
    canViewFeeCollection(user?.permissions) ||
    canViewExpenses(user?.permissions) ||
    canViewFees(user?.permissions) ||
    canViewInvoices(user?.permissions) ||
    canViewStock(user?.permissions)
      ? [
          {
            title: "Finance",
            menu: [
              ...(canViewInvoices(user?.permissions)
                ? [
                    {
                      title: "Invoices",
                      url: "invoices",
                      icon: FileList3,
                    },
                  ]
                : []),

              ...(canViewFees(user?.permissions)
                ? [
                    {
                      title: "Fees",
                      url: "fees",
                      icon: Bill,
                    },
                  ]
                : []),

              ...(canViewExpenses(user?.permissions)
                ? [
                    {
                      title: "Expenses",
                      url: "expense",
                      icon: BankCard,
                    },
                  ]
                : []),

              ...(canViewStock(user?.permissions)
                ? [
                    {
                      title: "Stock",
                      url: "stock",
                      icon: Store3,
                    },
                  ]
                : []),

              ...(canViewFeeCollection(user?.permissions)
                ? [
                    {
                      title: "Fee Collection",
                      url: "fee-collection",
                      icon: Wallet,
                    },
                  ]
                : []),

              ...(canViewFinanceReport(user?.permissions)
                ? [
                    {
                      title: "Finance Report",
                      url: "finance-report",
                      icon: LineChart,
                    },
                  ]
                : []),
            ],
          },
        ]
      : []),

    ...(canViewCommunication(user?.permissions) ||
    canViewPortalCustomization(user?.permissions) ||
    canViewPortalOverview(user?.permissions) ||
    canViewDomain(user?.permissions)
      ? [
          {
            title: "Communication & Portal",
            menu: [
              ...(canViewCommunication(user?.permissions)
                ? [
                    {
                      title: "Communications",
                      url: "communications",
                      icon: Megaphone,
                    },
                  ]
                : []),

              ...(canViewPortalOverview(user?.permissions)
                ? [
                    {
                      title: "Portal Overview",
                      url: "portal-overview",
                      icon: Macbook,
                    },
                  ]
                : []),

              ...(canViewPortalCustomization(user?.permissions)
                ? [
                    {
                      title: "Portal Customization",
                      url: "portal-customization",
                      icon: ColorFilter,
                    },
                  ]
                : []),

              ...(canViewDomain(user?.permissions)
                ? [
                    {
                      title: "Domain",
                      url: "domain",
                      icon: Global,
                    },
                  ]
                : []),
            ],
          },
        ]
      : []),

    ...(canViewSettings(user?.permissions)
      ? [
          {
            title: "",
            menu: [
              {
                title: "Settings",
                url: "settings",
                icon: Settings4,
              },
            ],
          },
        ]
      : []),
  ];

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
          {navigation.map((nav: NavigationType) => {
            return (
              <div key={nav.menu[0].title}>
                {!isSidebarOpen && nav.title ? ( // Exclude divider and title for  groups without title
                  <Line fill="var(--color-icon-default-subtle)" />
                ) : (
                  <p className="text-text-subtle text-xs leading-4 font-medium">{nav.title}</p>
                )}

                {nav.menu.map(menu => {
                  const isActive = activeNav === menu.url || (!activeNav && menu.title === "Dashboard");
                  return (
                    <Tooltip
                      key={menu.title}
                      description={menu.title}
                      Trigger={
                        <nav
                          className={cn(
                            "flex cursor-pointer items-center gap-[11px] px-2 py-2",
                            !isSidebarOpen && "justify-center px-0",
                            isActive && "bg-bg-state-soft rounded-md",
                          )}
                          onClick={() => router.push(`/${menu.url}`)}
                        >
                          <menu.icon fill="var(--color-icon-default-subtle)" />
                          {isSidebarOpen && <p className="text-text-subtle text-sm leading-5 font-medium">{menu.title}</p>}
                        </nav>
                      }
                    />
                  );
                })}
              </div>
            );
          })}
        </div>

        <nav onClick={() => deleteSession()} className={cn("flex cursor-pointer items-center gap-[11px] py-2", !isSidebarOpen && "justify-center")}>
          <Logout fill="var(--color-icon-default-subtle)" />
          {isSidebarOpen && <p className="text-text-subtle text-sm leading-5 font-medium">Sign out</p>}
        </nav>
      </div>

      {/* Mobile */}

      {isMobile && (
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetOverlay className="block md:hidden" />
          <SheetContent
            side="left"
            className="2xs:w-81 border-border-default bg-bg-sidebar-subtle text-text-subtle flex h-screen w-69 p-4 text-left md:hidden"
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

              {/* <Button variant="ghost" onClick={() => setIsSidebarOpen(false)} className="p-0">
              <CloseLarge fill="var(--color-icon-default-subtle)" />
            </Button> */}
            </div>
            <div className="space-y-5 md:space-y-6">
              {navigation.map((nav: NavigationType) => {
                return (
                  <div key={nav.menu[0].title}>
                    <p className="text-xs leading-4 font-medium">{nav.title}</p>

                    {nav.menu.map(menu => {
                      const isActive = activeNav === menu.url || (!activeNav && menu.title === "Dashboard");

                      return (
                        <nav
                          key={menu.title}
                          className={cn(
                            "flex cursor-pointer gap-[11px] p-2",
                            !isSidebarOpen && "justify-center px-0",
                            isActive && "bg-bg-state-soft rounded-md",
                          )}
                          onClick={() => router.push(`/${menu.url}`)}
                        >
                          <menu.icon fill="var(--color-icon-default-subtle)" />
                          <p className="text-sm leading-5 font-medium">{menu.title}</p>
                        </nav>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            <nav onClick={() => deleteSession()} className={cn("flex cursor-pointer gap-[11px] py-2 pr-2")}>
              <Logout fill="var(--color-icon-default-subtle)" />
              <p className="text-sm leading-5 font-medium">Sign out</p>
            </nav>
          </SheetContent>
        </Sheet>
      )}
    </aside>
  );
};
