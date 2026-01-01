"use client";

import React, { useState } from "react";
import { classesFee, ClassFeeTypes } from "./classTypes";
import { DataTable } from "@/components/DataTable";
import { columnsClassFees } from "./ClassColumns";
import { useRouter } from "next/navigation";
import { OverviewCard } from "@/components/OverviewCard";
import GraduationCapFill from "@/components/Icons/GraduationCapFill";
import FileList3Fill from "@/components/Icons/FileList3Fill";
import { FeesHeader } from "../FeesHeader";
import { Button } from "@/components/ui/button";
import { Ellipsis, Trash2 } from "lucide-react";
import { MobileDrawer } from "@/components/MobileDrawer";
import Eye from "@/components/Icons/Eye";
import { Badge } from "@/components/ui/badge";
const branches = ["All Branches", "Lawanson", "Ilasamaja"];
const termsOptions = ["24/25 Third Term", "24/25 Second Term", "24/25 First Term"];
const arms = ["All Arms", "A", "B", "C"];
const classes = ["JSS 1", "JSS 2", "JSS 3", "SS 1", "SS 2", "SS 3"];
export const ClassFees = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRows, setSelectedRows] = useState<ClassFeeTypes[]>([]);
  const [branchSelected, setBranchSelected] = useState(branches[0]);
  const [termSelected, setTermSelected] = useState(termsOptions[0]);
  const [selectedClass, setSelectedClass] = useState(classes[0]);
  const [selectedArm, setSelectedArm] = useState(arms[0]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isOpen, setIsOpen] = useState(false);
  const pageSize = 4;
  console.log(selectedRows);
  return (
    <div>
      <FeesHeader
        title="Class Fees Overview"
        branches={branches}
        branchSelected={branchSelected}
        classes={classes}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        arms={arms}
        setSelectedArm={setSelectedArm}
        selectedArm={selectedArm}
        setBranchSelected={setBranchSelected}
        termsOptions={termsOptions}
        termSelected={termSelected}
        setTermSelected={setTermSelected}
        onAddClick={() => router.push("/fees/add")}
        exportTitle="Export Class Fees"
        exportActionButton="Export Class Fees"
        showArm={true}
        showClass={true}
      />

      {classesFee.map(clf => (
        <div key={clf.title} className="mb-10 flex flex-col gap-4">
          <h2 className="text-text-default text-lg font-semibold">{clf.title}</h2>
          <div className="flex gap-3">
            <OverviewCard
              title="Total Class Variations"
              Icon={() => (
                <div className="bg-bg-basic-sky-subtle border-bg-basic-sky-accent flex w-6 items-center justify-center rounded-xs border p-1">
                  <GraduationCapFill fill="var(--color-icon-default)" className="size-3" />
                </div>
              )}
              value="₦50,000"
            />
            <OverviewCard
              title="Total Fees"
              Icon={() => (
                <div className="bg-bg-basic-teal-subtle border-bg-basic-teal-accent flex w-6 items-center justify-center rounded-xs border p-1">
                  <FileList3Fill fill="var(--color-icon-default)" className="size-3" />
                </div>
              )}
              value="₦0"
            />
          </div>
          <div className="hidden md:block">
            <DataTable
              columns={columnsClassFees}
              data={clf.clasess}
              totalCount={clf.clasess.length}
              page={page}
              setCurrentPage={setPage}
              pageSize={pageSize}
              clickHandler={row => {
                router.push(`/fees/${row.original.id}`);
              }}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              onSelectRows={setSelectedRows}
              showPagination={false}
            />
          </div>

          <div className="flex flex-col gap-4 md:hidden">
            {clf.clasess.slice(0, visibleCount).map(fee => {
              return (
                <div key={fee.classname} className="border-border-default bg-bg-subtle rounded-md border">
                  <div className="flex h-[38px] items-center justify-between px-3 py-1.5">
                    <span className="text-text-default text-sm font-medium">{fee.classname}</span>
                    <Button onClick={() => setIsOpen(true)} className="text-text-muted cursor-pointer p-0! focus-visible:ring-0!">
                      <Ellipsis className="size-5" />
                    </Button>
                    <MobileDrawer open={isOpen} setIsOpen={setIsOpen} title="Actions">
                      <div className="flex w-full flex-col gap-4 px-3 py-4">
                        <div className="flex flex-col items-center gap-2">
                          <div className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm">
                            <Eye className="size-4" fill="var(--color-icon-default-subtle)" /> View Invoice
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
                          {fee.fee.count} {fee.fee.tution}
                        </Badge>
                      </div>{" "}
                    </div>
                  </div>

                  <div className="">
                    <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                      <span className="text-text-muted font-medium">Total Amount</span>
                      <span className="text-text-default text-sm font-medium">₦{fee.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* <div className="flex justify-between px-3 py-2 text-sm">
                    <span className="text-text-muted font-medium">Status</span>
                    {getBadge(invoice.status)}
                  </div> */}
                </div>
              );
            })}

            {visibleCount < clf.clasess.length && (
              <Button
                onClick={() => setVisibleCount(clf.clasess.length)}
                className="bg-bg-state-soft! text-text-subtle! mx-auto my-2 flex w-39 items-center justify-center rounded-md"
              >
                Load More
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
