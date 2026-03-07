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
import { useState } from "react";
import { AllClassessTableMainColumns } from "../Column";
import { AllClassesMainTableProps } from "../types";
import { ApproveModal, NotifyTeacherModal } from "./AllClassesModal";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { filter } from "lodash";

type LevelFilter = "All" | "Primary School" | "Secondary School";

const LEVEL_FILTERS: { label: LevelFilter; prefix: string | null }[] = [
  { label: "All", prefix: null },
  { label: "Primary School", prefix: "pr" },
  { label: "Secondary School", prefix: "s" },
];

interface AllClassesMainTableProps_Component {
  data: AllClassesMainTableProps[];
  isFetchingBranch: boolean;
  isError: boolean;
}

export const AllClassesMainTable = ({ data, isFetchingBranch, isError }: AllClassesMainTableProps_Component) => {
  const [page, setPage] = useState(1);
  const [isLevelFilterOpen, setIsLevelFilterOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<LevelFilter>("All");
  const [pendingLevel, setPendingLevel] = useState<LevelFilter>("All");
  const [openMobileDrawer, setOpenMobilerDrawer] = useState(false);
  const [openNotifyModalMobile, setOpenNotifyModalMobile] = useState(false);
  const [openApproveModalMobile, setOpenApproveModalMobile] = useState(false);
  const router = useRouter();

  useBreadcrumb([
    { label: "All Classes", url: "/classes-and-subjects/all-classes" },
    { label: "JSS 1A", url: "" },
  ]);

  const filteredData = data.filter(item => {
    const filter = LEVEL_FILTERS.find(f => f.label === selectedLevel);
    if (!filter?.prefix) return true;
    return item.classArmName.toLowerCase().startsWith(filter.prefix);
  });

  const applyLevelFilter = () => {
    setSelectedLevel(pendingLevel);
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

          <DropdownMenuContent className="bg-bg-card border-border-default text-text-default py-2.5 shadow-sm">
            {LEVEL_FILTERS.map(({ label }) => (
              <DropdownMenuItem
                key={label}
                className="hover:bg-bg-basic-gray-alpha-2! cursor-pointer gap-2.5 px-3"
                onClick={() => {
                  setSelectedLevel(label);
                  setIsLevelFilterOpen(false);
                }}
              >
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <MobileDrawer open={isLevelFilterOpen} setIsOpen={setIsLevelFilterOpen} title="Filter">
          <div className="flex w-full flex-col gap-4 px-3 py-4">
            <div className="space-y-2">
              {LEVEL_FILTERS.map(({ label }) => (
                <p
                  key={label}
                  onClick={() => setPendingLevel(label)}
                  className={`text-text-default cursor-pointer px-3 text-sm ${pendingLevel === label ? "font-semibold" : ""}`}
                >
                  {label}
                </p>
              ))}
            </div>
          </div>
          <DrawerFooter className="border-border-default border-t">
            <div className="flex justify-between">
              <DrawerClose asChild>
                <Button className="bg-bg-state-soft text-text-subtle h-8! rounded-md! px-4 py-2 text-sm font-medium">Cancel</Button>
              </DrawerClose>
              <Button
                className="bg-bg-state-primary text-text-white-default h-8! rounded-md! px-4 py-2 text-sm tracking-[0.1rem]"
                onClick={applyLevelFilter}
              >
                Apply
              </Button>
            </div>
          </DrawerFooter>
        </MobileDrawer>
      </div>

      {isFetchingBranch && <Skeleton className="bg-bg-input-soft h-100 w-full" />}

      {isError && (
        <div className="flex h-80 items-center justify-center">
          <ErrorComponent
            title="Could not get Branch Details"
            description="This is our problem, we are looking into it so as to serve you better"
            buttonText="Go to the Home page"
          />
        </div>
      )}

      {!isFetchingBranch && !isError && filteredData.length === 0 && (
        <div className="flex h-80 items-center justify-center">
          <ErrorComponent title="No Branch" description="No branch details yet" buttonText="Add a branch" />
        </div>
      )}

      <div className="flex flex-col gap-4 pb-8">
        {openNotifyModalMobile && <NotifyTeacherModal openNotifyModal={openNotifyModalMobile} setOpenNotifyModal={setOpenNotifyModalMobile} />}
        {openApproveModalMobile && <ApproveModal openApproveModal={openApproveModalMobile} setOpenApproveModal={setOpenApproveModalMobile} />}

        {openMobileDrawer && (
          <MobileDrawer open={openMobileDrawer} setIsOpen={setOpenMobilerDrawer} title="Actions">
            <div className="flex flex-col gap-2 px-4 py-3">
              <Button className="border-border-darker bg-bg-state-secondary flex h-8! justify-center rounded-md border px-3.5 py-2">
                <div className="flex items-center gap-1">
                  <Eye fill="var(--color-icon-default-muted)" />
                  <span className="text-text-default text-sm font-medium">View Class</span>
                </div>
              </Button>
              <Button
                onClick={() => setOpenApproveModalMobile(true)}
                className="border-border-darker bg-bg-state-secondary flex h-8! justify-center rounded-md border px-3.5 py-2"
              >
                <div className="flex items-center gap-1">
                  <CheckboxCircle fill="var(--color-icon-default-muted)" className="size-4" />
                  <span className="text-text-default text-sm font-medium">Approve Submission</span>
                </div>
              </Button>
              <Button
                onClick={() => setOpenNotifyModalMobile(true)}
                className="border-border-darker bg-bg-state-secondary flex h-8! justify-center rounded-md border px-3.5 py-2"
              >
                <div className="flex items-center gap-1">
                  <Notification fill="var(--color-icon-default-muted)" className="size-4" />
                  <span className="text-text-default text-sm font-medium">Notify Class Teacher</span>
                </div>
              </Button>
              <Button className="border-border-darker bg-bg-state-secondary flex h-8! justify-center rounded-md border px-3.5 py-2">
                <div className="flex items-center gap-1">
                  <Key fill="var(--color-icon-default-muted)" className="size-4" />
                  <span className="text-text-default text-sm font-medium">Manage Edit Requests</span>
                </div>
              </Button>
            </div>
          </MobileDrawer>
        )}

        {!isFetchingBranch && !isError && filteredData.length > 0 && (
          <div className="">
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

            <div className="flex flex-col gap-4 md:hidden">
              {filteredData.map(item => (
                <div key={item.id} className="border-border-default bg-bg-subtle rounded-md border">
                  <div className="border-border-default border-b">
                    <div className="flex h-9.5 items-center justify-between p-3">
                      <div className="text-text-default text-sm font-medium">{item.classArmName}</div>
                      <Button onClick={() => setOpenMobilerDrawer(true)}>
                        <MoreHorizontalIcon className="text-icon-default-muted size-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="border-border-default border-b">
                    <div className="flex items-center justify-between px-3 py-[7px]">
                      <span className="text-text-muted text-sm font-medium">Class Teacher</span>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-6" />
                        <span className="text-text-default text-sm font-medium">{item.classTeacherName}</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-border-default border-b">
                    <div className="flex items-center justify-between px-3 py-[7px]">
                      <span className="text-text-muted text-sm font-medium">Subject Sheet</span>
                      <span className="text-text-default text-sm font-medium">
                        {item.numberOfSubjects}/{item.numberOfSubjects}
                      </span>
                    </div>
                  </div>
                  <div className="border-border-default border-b">
                    <div className="flex items-center justify-between px-3 py-1.5">
                      <span className="text-text-muted text-sm font-medium">Status</span>
                      <Badge
                        className={`h-5! ${item.status === "APPROVED" ? "bg-bg-badge-green text-bg-basic-green-strong" : ""} ${item.status === "EDIT_REQUEST" ? "bg-bg-badge-lime text-bg-basic-lime-strong" : ""} ${item.status === "NOT_SUBMITTED" ? "bg-bg-badge-red text-bg-basic-red-strong" : ""} ${item.status === "PENDING_APPROVAL" ? "bg-bg-badge-orange text-bg-basic-orange-strong" : ""} border-border-default rounded-md border p-1 text-xs font-medium`}
                      >
                        {item.status.toLocaleLowerCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-text-muted text-sm font-medium">Edit Requests</span>
                    <span className="text-text-default text-sm font-medium">{item.numberOfEditRequest}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
