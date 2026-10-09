"use client";

import { CheckboxCircle, Eye, Key, Notification } from "@digenty/icons";
import { Avatar } from "@/components/Avatar";
import { DataTable } from "@/components/DataTable";

import { MobileDrawer } from "@/components/MobileDrawer";
import { SearchInput } from "@/components/SearchInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { MoreHorizontalIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AllClassessTableMainColumns } from "../Column";
import { AllClassesMainTableProps } from "../types";
import { ApproveModal, NotifyTeacherModal } from "./AllClassesModal";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { useGetLevels } from "@/hooks/queryHooks/useLevel";
import { ClassLevel } from "@/api/types";
import { useSubmitClassReport } from "@/hooks/queryHooks/useClass";
import { PermissionCheck } from "@/components/ModulePermissionsWrapper/PermissionCheck";
import { canManageClassesAndSubjects } from "@/lib/permissions/classes-and-subjects";

interface AllClassesMainTableProps_Component {
  data: AllClassesMainTableProps[];
  isFetchingBranch: boolean;
  isError: boolean;
  levelSelected: ClassLevel | null;
  setLevelSelected: (level: ClassLevel | null) => void;
  branchId: number;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
}

export const AllClassesMainTable = ({
  data,
  isFetchingBranch,
  isError,
  levelSelected,
  setLevelSelected,
  branchId,
  searchQuery,
  setSearchQuery,
}: AllClassesMainTableProps_Component) => {
  const [page, setPage] = useState(1);
  const [openMobileDrawer, setOpenMobilerDrawer] = useState(false);
  const [openNotifyModalMobile, setOpenNotifyModalMobile] = useState(false);
  const [openApproveModalMobile, setOpenApproveModalMobile] = useState(false);
  const [activeClassId, setActiveClassId] = useState<number | null>(null);
  const [activeArmId, setActiveArmId] = useState<number | null>(null);
  const [activeClassArmReportId, setActiveClassArmReportId] = useState<number | null>(null);
  const [activeClassTeacherId, setActiveClassTeacherId] = useState<number | null>(null);
  const [activeArmName, setActiveArmName] = useState<string>("");
  const router = useRouter();

  const { data: levels, isLoading: loadingLevels } = useGetLevels(branchId);

  const levelList: ClassLevel[] = useMemo(() => levels?.data?.[0]?.classLevels ?? [], [levels]);
  const formatLevelName = (name: string) => name.replaceAll("_", " ").toLowerCase();

  // Always show one level's classes: default to the first level, and re-pick when the branch changes its level list.
  useEffect(() => {
    if (levelList.length === 0) return;
    if (!levelSelected || !levelList.some(level => level.id === levelSelected.id)) setLevelSelected(levelList[0]);
  }, [levelList, levelSelected, setLevelSelected]);

  const { mutate: approveReport, isPending: isSubmitting } = useSubmitClassReport();

  const handleApprove = () => {
    if (!activeClassArmReportId) return;
    approveReport(
      { classArmReportId: activeClassArmReportId, status: "APPROVED" },
      {
        onSuccess: () => {
          setOpenApproveModalMobile(false);
          setOpenMobilerDrawer(false);
        },
      },
    );
  };

  return (
    <div className="px-4 py-3 md:px-8">
      <div className="mb-4 flex h-8 w-full items-center gap-3 md:w-92">
        <SearchInput
          className="bg-bg-input-soft rounded-lg border-none"
          value={searchQuery}
          onChange={evt => {
            setSearchQuery(evt.target.value);
          }}
        />
      </div>

      {loadingLevels && !levels ? (
        <Skeleton className="bg-bg-input-soft mb-4 h-8 w-full rounded-md md:w-120 md:rounded-full" />
      ) : (
        levelList.length > 0 && (
          <div className="mb-4">
            <div className="md:hidden">
              <Select
                value={levelSelected ? String(levelSelected.id) : undefined}
                onValueChange={value => setLevelSelected(levelList.find(level => String(level.id) === value) ?? null)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {levelList.map(level => (
                    <SelectItem key={level.id} value={String(level.id)} className="bg-bg-card! capitalize">
                      {formatLevelName(level.levelName)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-bg-state-soft hide-scrollbar hidden w-fit max-w-full items-center gap-1.5 overflow-x-auto rounded-full p-1 md:flex">
              {levelList.map(level => {
                const isActive = levelSelected?.id === level.id;
                return (
                  <div
                    key={level.id}
                    onClick={() => setLevelSelected(level)}
                    className={cn(
                      "flex shrink-0 cursor-pointer items-center rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap capitalize transition-all duration-200",
                      isActive
                        ? "bg-bg-state-secondary text-text-default shadow-sm"
                        : "text-text-muted hover:text-text-default hover:bg-bg-state-ghost-hover/50",
                    )}
                  >
                    {formatLevelName(level.levelName)}
                  </div>
                );
              })}
            </div>
          </div>
        )
      )}

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

      {!isFetchingBranch && !isError && data.length === 0 && (
        <div className="flex h-80 items-center justify-center">
          <ErrorComponent
            title="No Classes"
            description="No classes to view "
            buttonText="Add a class"
            url="/staff/settings/academic/academic-setup"
          />
        </div>
      )}

      <div className="flex flex-col gap-4 pb-8">
        {openNotifyModalMobile && (
          <NotifyTeacherModal
            openNotifyModal={openNotifyModalMobile}
            setOpenNotifyModal={setOpenNotifyModalMobile}
            classTeacherId={activeClassTeacherId}
          />
        )}
        {openApproveModalMobile && (
          <ApproveModal
            openApproveModal={openApproveModalMobile}
            setOpenApproveModal={setOpenApproveModalMobile}
            onConfirm={handleApprove}
            isSubmitting={isSubmitting}
            classArmName={activeArmName}
          />
        )}

        {openMobileDrawer && (
          <MobileDrawer open={openMobileDrawer} setIsOpen={setOpenMobilerDrawer} title="Actions">
            <div className="flex flex-col gap-2 px-4 py-3">
              <Button
                onClick={() =>
                  router.push(
                    `/staff/classes-and-subjects/all-classes/${activeClassId}/arm/${activeArmId}?classArmName=${activeArmName.replaceAll(" ", "-")}`,
                  )
                }
                className="border-border-darker bg-bg-state-secondary flex h-8! justify-center rounded-md border px-3.5 py-2"
              >
                <div className="flex items-center gap-1">
                  <Eye fill="var(--color-icon-default-muted)" />
                  <span className="text-text-default text-sm font-medium">View Class</span>
                </div>
              </Button>
              <PermissionCheck permissionUtility={canManageClassesAndSubjects}>
                <Button
                  onClick={() => setOpenApproveModalMobile(true)}
                  // disabled={row.original.status === "NOT_SUBMITTED" || row.original.status === "APPROVED" }

                  className="border-border-darker bg-bg-state-secondary flex h-8! justify-center rounded-md border px-3.5 py-2"
                >
                  <div className="flex items-center gap-1">
                    <CheckboxCircle fill="var(--color-icon-default-muted)" className="size-4" />
                    <span className="text-text-default text-sm font-medium">Approve Submission</span>
                  </div>
                </Button>
              </PermissionCheck>
              <PermissionCheck permissionUtility={canManageClassesAndSubjects}>
                <Button
                  onClick={() => setOpenNotifyModalMobile(true)}
                  className="border-border-darker bg-bg-state-secondary flex h-8! justify-center rounded-md border px-3.5 py-2"
                >
                  <div className="flex items-center gap-1">
                    <Notification fill="var(--color-icon-default-muted)" className="size-4" />
                    <span className="text-text-default text-sm font-medium">Notify Class Teacher</span>
                  </div>
                </Button>
              </PermissionCheck>
              <PermissionCheck permissionUtility={canManageClassesAndSubjects}>
                <Button
                  onClick={() => router.push(`/staff/classes-and-subjects/all-branches/${branchId}/manage-edits`)}
                  className="border-border-darker bg-bg-state-secondary flex h-8! justify-center rounded-md border px-3.5 py-2"
                >
                  <div className="flex items-center gap-1">
                    <Key fill="var(--color-icon-default-muted)" className="size-4" />
                    <span className="text-text-default text-sm font-medium">Manage Edit Requests</span>
                  </div>
                </Button>
              </PermissionCheck>
            </div>
          </MobileDrawer>
        )}

        {!isFetchingBranch && !isError && data.length > 0 && (
          <div className="">
            <div className="hidden md:block">
              <DataTable
                pageSize={100}
                columns={AllClassessTableMainColumns(branchId)}
                data={data}
                totalCount={data.length}
                page={page}
                setCurrentPage={setPage}
                showPagination={false}
              />
            </div>

            <div className="flex flex-col gap-4 md:hidden">
              {data.map(arm => {
                const statusStyles: Record<AllClassesMainTableProps["status"], string> = {
                  APPROVED: "bg-bg-badge-green text-bg-basic-green-strong ",
                  PENDING_APPROVAL: "bg-bg-badge-orange text-bg-basic-orange-strong ",
                  NOT_SUBMITTED: "bg-bg-badge-red text-bg-basic-red-strong ",
                  EDIT_REQUEST: "bg-bg-badge-lime text-bg-basic-lime-strong ",
                };
                return (
                  <div key={arm.armId} className="border-border-default bg-bg-subtle rounded-md border">
                    <div className="border-border-default border-b">
                      <div className="flex h-9.5 items-center justify-between py-3 pl-3">
                        <div className="text-text-default text-sm font-medium">{arm.classArmName}</div>
                        <Button
                          onClick={() => {
                            setOpenMobilerDrawer(true);
                            setActiveClassId(arm.classId);
                            setActiveArmId(arm.armId);
                            setActiveArmName(arm.classArmName);
                            setActiveClassArmReportId(arm.classArmReportId);
                            setActiveClassTeacherId(arm.classTeacherId);
                          }}
                        >
                          <MoreHorizontalIcon className="text-icon-default-muted size-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="border-border-default border-b">
                      <div className="flex items-center justify-between px-3 py-[7px]">
                        <span className="text-text-muted text-sm font-medium">Class Teacher</span>
                        <div className="flex items-center gap-2">
                          <Avatar className="size-6" />
                          <span className="text-text-default text-sm font-medium">{arm.classTeacherName}</span>
                        </div>
                      </div>
                    </div>
                    <div className="border-border-default border-b">
                      <div className="flex items-center justify-between px-3 py-[7px]">
                        <span className="text-text-muted text-sm font-medium">Subject Sheet</span>
                        <span className="text-text-default text-sm font-medium">
                          {arm.numberOfSubmittedSubjects}/{arm.numberOfSubjects}
                        </span>
                      </div>
                    </div>
                    <div className="border-border-default border-b">
                      <div className="flex items-center justify-between px-3 py-1.5">
                        <span className="text-text-muted text-sm font-medium">Status</span>

                        <Badge className={`border-border-default rounded-md border p-1 text-xs font-medium capitalize ${statusStyles[arm.status]} `}>
                          {arm.status ? arm.status.replaceAll("_", " ").toLowerCase() : ""}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-text-muted text-sm font-medium">Edit Requests</span>
                      <span className="text-text-default text-sm font-medium">{arm.numberOfEditRequest}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
