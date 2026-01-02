import React, { useState } from "react";
import { FeesHeader } from "../FeesHeader";
import { FeeItemProp } from "./feeItemType";
import { DataTable } from "@/components/DataTable";
import { FeeItemsColumns } from "./FeetItemColumns";
import { Button } from "@/components/ui/button";
import { Ellipsis, Trash2 } from "lucide-react";
import { MobileDrawer } from "@/components/MobileDrawer";
import Eye from "@/components/Icons/Eye";
import { Badge } from "@/components/ui/badge";
import { getStatusBadge } from "@/components/Status";
import Edit from "@/components/Icons/Edit";
import { FileCopy } from "@/components/Icons/FileCopy";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useRouter } from "next/navigation";
const branches = ["All Branches", "Lawanson", "Ilasamaja"];
const termsOptions = ["24/25 Third Term", "24/25 Second Term", "24/25 First Term"];

export const FeesItem = () => {
  const router = useRouter();
  useBreadcrumb([
    { label: "Fees", url: "/fees" },
    { label: "Fee Items", url: "/fees?tab=Fee Items" },
  ]);
  const [branchSelected, setBranchSelected] = useState(branches[0]);
  const [termSelected, setTermSelected] = useState(termsOptions[0]);
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRows, setSelectedRows] = useState<FeeItemProp[]>([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const feesItems: FeeItemProp[] = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    feeName: "Tuition Fee",
    status: "Required",
    applyTo: { school: "Lawanson: SS1", count: 20 },
    totalAmount: 1500000,
  }));

  // Empty Fee Item STate
  // <EmptyFeeState
  //       title="No Fees Created"
  //       description="Add fees here to start managing tuition, exams, levies, or other charges for your classes."
  //       buttonText="Add First Fee"
  //     />

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <FeesHeader
        title="Fee Items"
        branches={branches}
        branchSelected={branchSelected}
        setBranchSelected={setBranchSelected}
        termsOptions={termsOptions}
        termSelected={termSelected}
        setTermSelected={setTermSelected}
        onAddClick={() => {}}
        showToggle={false}
        exportTitle="Export Fee Items"
        exportActionButton="Export Fees"
      />

      <div className="hidden md:block">
        <DataTable
          columns={FeeItemsColumns}
          data={feesItems}
          totalCount={feesItems.length}
          page={page}
          setCurrentPage={setPage}
          pageSize={pageSize}
          clickHandler={row => {
            router.push(`/fees/fee-item/${row.original.id}`);
          }}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          onSelectRows={setSelectedRows}
          showPagination={false}
          classNames={{
            tableRow: "cursor-pointer",
          }}
        />
      </div>
      <div className="flex flex-col gap-4 md:hidden">
        {feesItems.slice(0, visibleCount).map(item => {
          return (
            <div key={item.id} className="border-border-default bg-bg-subtle rounded-md border">
              <div className="flex h-[38px] items-center justify-between px-3 py-1.5">
                <span className="text-text-default text-sm font-medium">{item.feeName}</span>
                <Button onClick={() => setIsOpen(true)} className="text-text-muted cursor-pointer p-0! focus-visible:ring-0!">
                  <Ellipsis className="size-5" />
                </Button>
                <MobileDrawer open={isOpen} setIsOpen={setIsOpen} title="Actions">
                  <div className="flex w-full flex-col gap-4 px-3 py-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm">
                        <Eye className="size-4" fill="var(--color-icon-default-subtle)" /> View fee item
                      </div>
                      <div className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm">
                        <Edit className="size-4" fill="var(--color-icon-default-subtle)" /> Edit fee item
                      </div>

                      <div className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm">
                        <FileCopy className="size-4" fill="var(--color-icon-default-subtle)" /> Duplicate fee item
                      </div>
                      <div className="hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm text-red-600">
                        <Trash2 className="size-4" /> Delete invoice
                      </div>
                    </div>
                  </div>
                </MobileDrawer>
              </div>
              <div className="border-border-default flex justify-between border-t px-3 py-2 text-sm">
                <span className="text-text-muted font-medium">Requirement</span>
                {getStatusBadge(item.status)}
              </div>
              <div className="border-border-default border-t">
                <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                  <span className="text-text-muted font-medium">Applies To</span>
                  <div className="flex items-center gap-2">
                    <Badge className="text-text-default bg-bg-badge-default border-border-default rounded-md border text-sm font-medium">
                      {item.applyTo.school}
                    </Badge>
                    <Badge className="text-text-default bg-bg-badge-default border-border-default rounded-md border text-sm font-medium">
                      +{item.applyTo.count}
                    </Badge>
                  </div>{" "}
                </div>
              </div>

              <div className="">
                <div className="border-border-default flex justify-between px-3 py-2 text-sm">
                  <span className="text-text-muted font-medium">Total Amount</span>
                  <span className="text-text-default text-sm font-medium">₦{item.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}

        {visibleCount < feesItems.length && (
          <Button
            onClick={() => setVisibleCount(feesItems.length)}
            className="bg-bg-state-soft! text-text-subtle! mx-auto my-2 flex w-39 items-center justify-center rounded-md"
          >
            Load More
          </Button>
        )}
      </div>
    </div>
  );
};
