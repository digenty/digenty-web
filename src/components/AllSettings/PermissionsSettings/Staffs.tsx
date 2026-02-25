import { Branch, Staff } from "@/api/types";
import { DataTable } from "@/components/DataTable";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import ShareBox from "@/components/Icons/ShareBox";
import { MobileDrawer } from "@/components/MobileDrawer";
import { SearchInput } from "@/components/SearchInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useGetStaffs } from "@/hooks/queryHooks/useStaff";
import useDebounce from "@/hooks/useDebounce";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Ellipsis, PlusIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SettingPermissionModalExport } from "./SettingPermissionModalExport";
import { StaffMobileCard } from "./StaffMobileCard";
import { StaffColumns } from "./StaffTableColumns";

export type StaffProps = {
  id: number;
  staffName: string;
  role: string;
  email: string;
  status: string;
  branch: string;
  lastLogin: string;
};

export const Staffs = () => {
  const [page, setPage] = useState(1);
  const isMobile = useIsMobile();
  const router = useRouter();
  const [openExport, setOpenExport] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [openActions, setOpenAction] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [branchSelected, setBranchSelected] = useState<Branch | undefined>();
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRows, setSelectedRows] = useState<Staff[]>([]);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const pageSize = 15;

  const { data: branches, isPending: loadingBranches } = useGetBranches();
  const { data, isPending, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetStaffs({
    limit: pageSize,
    branchId: branchSelected?.id,
    search: debouncedSearchQuery,
  });
  const staff = data?.pages.flatMap(page => page.content) ?? [];

  useEffect(() => {
    // Make sure that page is fetched
    if (page > (data?.pages.length ?? 0)) {
      fetchNextPage();
    }
  }, [page, data?.pages.length, fetchNextPage]);

  const dataForDesktop = data?.pages[page - 1]?.content ?? [];

  return (
    <div>
      {openExport && branches && (
        <SettingPermissionModalExport
          open={openExport}
          setOpen={setOpenExport}
          branches={branches.data.content}
          branchSelected={branchSelected}
          setBranchSelected={setBranchSelected}
          loadingBranches={loadingBranches}
          filteredCount={data?.pages[0].totalElements}
        />
      )}

      <div className="flex flex-col gap-3 py-6 md:flex-row md:items-center md:justify-between md:gap-0">
        <div className="flex items-center gap-1">
          <SearchInput
            className="bg-bg-input-soft! h-8 rounded-lg border-none md:w-70.5"
            value={searchQuery}
            onChange={evt => {
              setSearchQuery(evt.target.value);
            }}
          />

          {loadingBranches || !branches ? (
            <Skeleton className="bg-bg-state-soft h-8 w-22 rounded-full" />
          ) : (
            <DropdownMenu open={openFilter} onOpenChange={setOpenFilter}>
              <DropdownMenuTrigger asChild>
                <Badge className="border-border-darker bg-bg-state-secondary text-text-muted hidden cursor-pointer items-center rounded-full border border-dashed md:flex">
                  <Image src="/icons/open-filter-modal.svg" alt="filter icon" width={20} height={20} className="size-7 p-1.5" />
                  Branch
                </Badge>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="bg-bg-card border-border-default text-text-default hidden w-48 py-2.5 shadow-sm md:block">
                <div className="flex flex-col gap-1 px-1 py-2">
                  {branches.data.content?.map((branch: Branch) => (
                    <DropdownMenuItem
                      key={branch.id}
                      className="hover:bg-bg-state-ghost-hover flex w-full cursor-pointer items-center gap-2 rounded-md p-2 text-sm"
                      onClick={() => setBranchSelected(branch)}
                    >
                      <span className="text-text-default font-normal">{branch.name}</span>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex items-center justify-between gap-1">
          <Button onClick={() => setOpenFilter(true)} className="bg-bg-state-soft block size-7 rounded-md p-1.5 md:hidden">
            <Image src="/icons/open-filter-modal.svg" alt="filter icon" width={20} height={20} />
          </Button>

          <Button
            onClick={() => setOpenExport(true)}
            className="border-border-darker text-text-default hidden h-8 items-center rounded-md border px-2.5 text-sm font-medium md:flex"
          >
            <ShareBox fill="var(--color-icon-default-muted)" /> Export
          </Button>

          <div className="flex items-center gap-1">
            <Button
              onClick={() => router.push("/settings/permissions/add-staff")}
              className="bg-bg-state-primary hover:bg-bg-state-primary/90! text-text-white-default flex h-8 w-31 items-center gap-1 rounded-md"
            >
              <PlusIcon className="text-icon-white-default size-4" />
              Add Staff
            </Button>

            <Button
              onClick={() => setOpenAction(true)}
              className="bg-bg-state-soft text-text-muted flex h-7 w-7 cursor-pointer p-0! text-center focus-visible:ring-0! md:hidden"
            >
              <Ellipsis className="size-5" />
            </Button>
          </div>
        </div>

        {openActions && (
          <MobileDrawer open={openActions} setIsOpen={setOpenAction} title="Actions">
            <div className="flex w-full flex-col gap-4 px-3 py-4">
              <div className="flex flex-col items-center gap-2" onClick={() => setOpenExport(true)}>
                <div className="text-text-default hover:bg-bg-state-ghost-hover border-border-darker flex w-full items-center justify-center gap-2 rounded-md border p-2 text-sm">
                  <ShareBox className="size-4" fill="var(--color-icon-default-muted)" />
                  Export
                </div>
              </div>
            </div>
          </MobileDrawer>
        )}

        {isMobile && branches && (
          <MobileDrawer open={openFilter} setIsOpen={setOpenFilter} title="Select Branch">
            <div className="flex w-full flex-col gap-2 px-6 py-4">
              {branches.data.content?.map((br: Branch) => (
                <div key={br.id} className="flex flex-col items-center gap-2">
                  <div role="button" onClick={() => setBranchSelected(br)} className="flex w-full items-center gap-2 p-2 text-sm">
                    <span className="text-text-default font-normal">{br.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </MobileDrawer>
        )}
      </div>

      {isError && (
        <div className="flex h-80 items-center justify-center">
          <ErrorComponent
            title="Could not get Staff"
            description="This is our problem, we are looking into it so as to serve you better"
            buttonText="Go to the Home page"
          />
        </div>
      )}
      {isPending && <Skeleton className="bg-bg-input-soft h-100 w-full" />}

      {!isPending && !isError && staff.length === 0 && (
        <div className="flex h-80 items-center justify-center">
          <ErrorComponent title="No Staff" description="No staff has been added yet" buttonText="Add a staff" url="/settings/permissions/add-staff" />
        </div>
      )}

      {!isPending && !isError && staff.length > 0 && (
        <div>
          <div className="hidden py-4 md:block">
            <DataTable
              columns={StaffColumns}
              data={dataForDesktop}
              totalCount={data?.pages[0].totalElements}
              page={page}
              setCurrentPage={setPage}
              pageSize={pageSize}
              clickHandler={() => {}}
              showPagination={true}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              onSelectRows={setSelectedRows}
            />
          </div>

          <div className="flex flex-col gap-4 md:hidden">
            {staff.map((staff: Staff) => {
              return <StaffMobileCard key={staff.staffId} staff={staff} />;
            })}

            {hasNextPage && (
              <Button onClick={() => fetchNextPage()} className="bg-bg-state-soft text-text-subtle w-fit self-center px-10">
                Load More
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
