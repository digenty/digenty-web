"use client";
import React, { useState } from "react";
import { FeesHeader } from "../FeesHeader";
import { DataTable } from "@/components/DataTable";
import { FeeGroupProp } from "./feeGroupType";
import { FeeGroupColumn } from "./FeeGroupColumns";
import { Button } from "@/components/ui/button";
import { Ellipsis, Trash2 } from "lucide-react";
import { MobileDrawer } from "@/components/MobileDrawer";
import Eye from "@/components/Icons/Eye";
import Edit from "@/components/Icons/Edit";
import { FileCopy } from "@/components/Icons/FileCopy";
import { Badge } from "@/components/ui/badge";

const branches = ["All Branches", "Lawanson", "Ilasamaja"];
const termsOptions = ["24/25 Third Term", "24/25 Second Term", "24/25 First Term"];

export const FeesGroup = () => {
  const [branchSelected, setBranchSelected] = useState(branches[0]);
  const [termSelected, setTermSelected] = useState(termsOptions[0]);
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRows, setSelectedRows] = useState<FeeGroupProp[]>([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const feesGroup: FeeGroupProp[] = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    classname: "SS 1",
    applyTo: { item1: "Tuition", item2: "School Uniform", count: 20 },
    totalAmount: 1500000,
  }));
  return (
    <div className="flex flex-col gap-6">
      <FeesHeader
        title="Fee Groups"
        branches={branches}
        branchSelected={branchSelected}
        setBranchSelected={setBranchSelected}
        termSelected={termSelected}
        setTermSelected={setTermSelected}
        onAddClick={() => {}}
        showToggle={false}
        showExport={false}
        showTermFilter={false}
        exportTitle="Export Group Fee"
        exportActionButton="Export Group"
        showArm={false}
        showClass={false}

        // onExportConfirm={() => {
        //   console.log("exporting fee groups...");
        // }}
      />
      <div className="hidden md:block">
        <DataTable
          columns={FeeGroupColumn}
          data={feesGroup}
          totalCount={feesGroup.length}
          page={page}
          setCurrentPage={setPage}
          pageSize={pageSize}
          clickHandler={() => {}}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          onSelectRows={setSelectedRows}
          showPagination={true}
        />
      </div>
      <div className="flex flex-col gap-4 md:hidden">
        {feesGroup.slice(0, visibleCount).map(item => {
          return (
            <div key={item.id} className="border-border-default bg-bg-subtle rounded-md border">
              <div className="flex h-[38px] items-center justify-between px-3 py-1.5">
                <span className="text-text-default text-sm font-medium">{item.classname}</span>
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

              <div className="border-border-default border-t">
                <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                  <span className="text-text-muted font-medium">Fee</span>
                  <div className="flex items-center gap-2">
                    <Badge className="text-text-default bg-bg-badge-default border-border-default rounded-md border text-sm font-medium">
                      {item.applyTo.count} {item.applyTo.item1}
                    </Badge>
                  </div>{" "}
                </div>
              </div>

              <div className="">
                <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                  <span className="text-text-muted font-medium">Total Amount</span>
                  <span className="text-text-default text-sm font-medium">₦{item.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}

        {visibleCount < feesGroup.length && (
          <Button
            onClick={() => setVisibleCount(feesGroup.length)}
            className="bg-bg-state-soft! text-text-subtle! mx-auto my-2 flex w-39 items-center justify-center rounded-md"
          >
            Load More
          </Button>
        )}
      </div>
    </div>
  );
};
