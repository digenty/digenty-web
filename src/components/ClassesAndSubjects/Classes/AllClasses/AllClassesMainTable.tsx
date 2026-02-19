"use client";

import { Avatar } from "@/components/Avatar";
import { DataTable } from "@/components/DataTable";
import { CheckboxCircle } from "@/components/Icons/CheckboxCircle";
import Eye from "@/components/Icons/Eye";
import { Filter } from "@/components/Icons/Filter";
import { Key } from "@/components/Icons/Key";
import { Notification } from "@/components/Icons/Notification";
import { MobileDrawer } from "@/components/MobileDrawer";
import { SearchInput } from "@/components/SearchInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { MoreHorizontalIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AllClassessTableMainColumns } from "../Column";
import { ApproveModal, NotifyTeacherModal } from "./AllClassesModal";
import { AllClassesProps } from "./type";
import { Skeleton } from "@/components/ui/skeleton";

export const AllClassesMainTable = ({ allClassesDetails, isFetching }: { allClassesDetails: AllClassesProps[]; isFetching: boolean }) => {
  const [page, setPage] = useState(1);
  const [isLevelFilterOpen, setIsLevelFilterOpen] = useState(false);
  const [openMobileDrawer, setOpenMobilerDrawer] = useState(false);
  const [openNotifyModalMobile, setOpenNotifyModalMobile] = useState(false);
  const [openApproveModalMobile, setOpenApproveModalMobile] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<"all" | "primary" | "secondary">("all");

  const router = useRouter();

  useBreadcrumb([
    { label: "All Classes", url: "/classes-and-subjects/all-classes" },
    { label: `JSS 1A`, url: "" },
  ]);

  const filteredData = useMemo(() => {
    if (selectedLevel === "all") {
      return allClassesDetails;
    }

    if (selectedLevel === "primary") {
      return allClassesDetails.filter(item => item.className.toLowerCase().startsWith("pr"));
    }

    if (selectedLevel === "secondary") {
      return allClassesDetails.filter(item => item.className.toLowerCase().startsWith("ss") || item.className.toLowerCase().startsWith("jss"));
    }

    return allClassesDetails;
  }, [allClassesDetails, selectedLevel]);

  const handleLevelChange = (level: "all" | "primary" | "secondary") => {
    setSelectedLevel(level);
    setIsLevelFilterOpen(false);
  };

  return (
    <div className="px-4 py-3 md:px-8">
      <div className="mb-4 flex h-8 w-full items-center gap-3 md:w-92">
        <SearchInput className="bg-bg-input-soft h-7! rounded-md border-none md:h-8!" />
        <DropdownMenu open={isLevelFilterOpen} onOpenChange={setIsLevelFilterOpen}>
          <DropdownMenuTrigger asChild>
            <div>
              <Button className="text-text-muted border-border-darker bg-bg-state-secondary hidden h-8 w-20 items-center gap-1 rounded-full border border-dashed px-2.5 py-1.5 text-sm md:flex">
                <Filter fill="var(--color-icon-default-muted)" /> Level
              </Button>
              <div className="bg-bg-input-soft flex h-8 items-center gap-1 rounded-sm px-2.5 py-1.5 text-sm md:hidden">
                <Filter fill="var(--color-icon-default-muted)" />
              </div>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="bg-bg-card border-border-default text-text-default hidden py-2.5 shadow-sm md:block">
            <DropdownMenuItem onClick={() => handleLevelChange("all")} className="hover:bg-bg-basic-gray-alpha-2! cursor-pointer gap-2.5 px-3">
              All
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => handleLevelChange("primary")} className="hover:bg-bg-basic-gray-alpha-2! cursor-pointer gap-2.5 px-3">
              Primary School
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => handleLevelChange("secondary")} className="hover:bg-bg-basic-gray-alpha-2! cursor-pointer gap-2.5 px-3">
              Secondary School
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <MobileDrawer open={isLevelFilterOpen} setIsOpen={setIsLevelFilterOpen} title="Filter">
          <div className="flex w-full flex-col gap-4 px-3 py-4">
            <div className="space-y-2">
              <p className="text-text-default px-3 text-sm">All</p>

              <p className="text-text-default px-3 text-sm">Primary School</p>

              <p className="text-text-default px-3 text-sm">Secondary School</p>
            </div>
          </div>

          <DrawerFooter className="border-border-default border-t">
            <div className="flex justify-between">
              <DrawerClose asChild>
                <Button className="bg-bg-state-soft text-text-subtle h-8! rounded-md! px-4 py-2 text-sm font-medium">Cancel</Button>
              </DrawerClose>

              <Button className="bg-bg-state-primary text-text-white-default h-8! rounded-md! px-4 py-2 text-sm tracking-[0.1rem]">
                <span>Apply</span>
              </Button>
            </div>
          </DrawerFooter>
        </MobileDrawer>
      </div>

      {isFetching || !allClassesDetails ? (
        <Skeleton className="bg-bg-input-soft h-100 w-full" />
      ) : (
        <>
          <div className="hidden md:block">
            <DataTable
              pageSize={15}
              clickHandler={() => {}}
              rowSelection={{}}
              setRowSelection={() => {}}
              onSelectRows={() => {}}
              columns={AllClassessTableMainColumns}
              data={filteredData}
              totalCount={filteredData.length}
              page={page}
              setCurrentPage={setPage}
              showPagination={false}
            />
          </div>

          {/* Mobile  */}
          <div className="flex flex-col gap-4 pb-8 md:hidden">
            <>
              {openNotifyModalMobile && <NotifyTeacherModal openNotifyModal={openNotifyModalMobile} setOpenNotifyModal={setOpenNotifyModalMobile} />}
              {openApproveModalMobile && <ApproveModal openApproveModal={openApproveModalMobile} setOpenApproveModal={setOpenApproveModalMobile} />}

              {openMobileDrawer && (
                <MobileDrawer open={isLevelFilterOpen} setIsOpen={setIsLevelFilterOpen} title="Filter">
                  <div className="flex w-full flex-col gap-4 px-3 py-4">
                    <div className="space-y-2">
                      <p
                        onClick={() => setSelectedLevel("all")}
                        className={`cursor-pointer px-3 text-sm ${selectedLevel === "all" ? "text-text-default font-semibold" : "text-text-muted"}`}
                      >
                        All
                      </p>

                      <p
                        onClick={() => setSelectedLevel("primary")}
                        className={`cursor-pointer px-3 text-sm ${selectedLevel === "primary" ? "text-text-default font-semibold" : "text-text-muted"}`}
                      >
                        Primary School
                      </p>

                      <p
                        onClick={() => setSelectedLevel("secondary")}
                        className={`cursor-pointer px-3 text-sm ${selectedLevel === "secondary" ? "text-text-default font-semibold" : "text-text-muted"}`}
                      >
                        Secondary School
                      </p>
                    </div>
                  </div>

                  <DrawerFooter className="border-border-default border-t">
                    <div className="flex justify-between">
                      <DrawerClose asChild>
                        <Button className="bg-bg-state-soft text-text-subtle h-8! rounded-md! px-4 py-2 text-sm font-medium">Cancel</Button>
                      </DrawerClose>

                      <Button
                        onClick={() => setIsLevelFilterOpen(false)}
                        className="bg-bg-state-primary text-text-white-default h-8! rounded-md! px-4 py-2 text-sm tracking-[0.1rem]"
                      >
                        <span>Apply</span>
                      </Button>
                    </div>
                  </DrawerFooter>
                </MobileDrawer>
              )}

              {filteredData.map((item: AllClassesProps) => (
                <div key={item.ClassArmId} className="border-border-default bg-bg-subtle rounded-md border">
                  <div className="border-border-default border-b">
                    <div className="flex h-9.5 items-center justify-between p-3">
                      <div className="text-text-default text-sm font-medium">{item.className}</div>
                      <Button onClick={() => setOpenMobilerDrawer(true)}>
                        <MoreHorizontalIcon className="text-icon-default-muted size-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="border-border-default border-b">
                    <div className="flex items-center justify-between p-3">
                      <span className="text-text-muted text-sm font-medium">Class Teacher</span>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-6" />
                        <span className="text-text-default text-sm font-medium">{item.teacherName}</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-border-default border-b">
                    <div className="flex items-center justify-between p-3">
                      <span className="text-text-muted text-sm font-medium">Subject Sheet</span>
                      <span className="text-text-default text-sm font-medium">
                        {item.subjectSheet}/{item.subjectSheet}
                      </span>
                    </div>
                  </div>
                  <div className="border-border-default border-b">
                    <div className="flex items-center justify-between px-3 py-1.5">
                      <span className="text-text-muted text-sm font-medium">Status</span>
                      <Badge
                        className={`h-5! ${item.status === "Approved" ? "bg-bg-badge-green text-bg-basic-green-strong" : ""} ${item.status === "Edit Request" ? "bg-bg-badge-lime text-bg-basic-lime-strong" : ""} ${item.status === "Not Submitted" ? "bg-bg-badge-red text-bg-basic-red-strong" : ""} ${item.status === "Pending Approval" ? "bg-bg-badge-orange text-bg-basic-orange-strong" : null} border-border-default rounded-md border p-1 text-xs font-medium`}
                      >
                        {item.status.toLocaleUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-text-muted text-sm font-medium">Edit Requests</span>
                    <span className="text-text-default text-sm font-medium">{item.editRequest}</span>
                  </div>
                </div>
              ))}
            </>
          </div>
        </>
      )}
    </div>
  );
};
