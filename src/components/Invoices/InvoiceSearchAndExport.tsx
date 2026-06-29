"use client";

import { AlertFill, Check, CheckDouble, CloseCircle, Draft, ShareBox } from "@digenty/icons";
import { BranchWithClassLevels, Terms } from "@/api/types";
import Image from "next/image";
import { useState } from "react";
import { SearchInput } from "../SearchInput";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

import { Ellipsis, Plus } from "lucide-react";

import { MobileDrawer } from "../MobileDrawer";
import { DrawerClose, DrawerFooter } from "../ui/drawer";
import { InvoiceExportModal } from "./InvoiceExportModal";

import { useIsMobile } from "@/hooks/useIsMobile";

import { useRouter } from "next/navigation";

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";

type InvoiceSearchAndExportProps = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  branches?: { data: BranchWithClassLevels[] };
  terms?: { data: Terms };
  currentBranchId?: number;
};

const filterItems = [
  { icon: <CloseCircle className="size-4" fill="var(--color-icon-default-muted)" />, label: "Unpaid", value: "UNPAID" },
  { icon: <AlertFill className="size-4" fill="var(--color-icon-default-muted)" />, label: "Outstanding", value: "OUTSTANDING" },
  { icon: <Check className="size-4" fill="var(--color-icon-default-muted)" />, label: "Paid", value: "PAID" },
  { icon: <CheckDouble className="size-4" fill="var(--color-icon-default-muted)" />, label: "Fully Paid", value: "FULLY_PAID" },
  { icon: <Draft className="size-4" fill="var(--color-icon-default-muted)" />, label: "Draft", value: "DRAFT" },
];

export const InvoiceSearchAndExport = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  branches,
  terms,
  currentBranchId,
}: InvoiceSearchAndExportProps) => {
  const isMobile = useIsMobile();
  const router = useRouter();

  const [openExport, setOpenExport] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  const handleStatusClick = (value: string) => {
    setStatusFilter(statusFilter === value ? "" : value);
    setOpenFilter(false);
  };

  const activeLabel = filterItems.find(f => f.value === statusFilter)?.label;

  return (
    <>
      {openExport && (
        <InvoiceExportModal open={openExport} setOpen={setOpenExport} branches={branches} terms={terms} initialBranchId={currentBranchId} />
      )}

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-0">
        <div className="flex items-center gap-1">
          <SearchInput
            className="border-border-default rounded-md border text-sm"
            value={searchQuery}
            onChange={evt => setSearchQuery(evt.target.value)}
          />

          <DropdownMenu open={openFilter} onOpenChange={setOpenFilter}>
            <DropdownMenuTrigger asChild>
              <Badge
                className={`border-border-darker bg-bg-state-secondary text-text-muted hidden cursor-pointer items-center rounded-full border border-dashed md:flex ${statusFilter ? "bg-bg-state-primary/10 text-text-default border-solid" : ""}`}
              >
                <Image src="/staff/icons/open-filter-modal.svg" alt="filter icon" width={20} height={20} className="size-7 p-1.5" />
                {activeLabel ?? "Status"}
              </Badge>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="bg-bg-card border-border-default text-text-default hidden w-48 py-2.5 shadow-sm md:block">
              <div className="flex flex-col gap-1 px-1 py-2">
                {filterItems.map(item => (
                  <div
                    key={item.value}
                    onClick={() => handleStatusClick(item.value)}
                    className={`hover:bg-bg-state-ghost-hover flex w-full cursor-pointer items-center gap-2 rounded-md p-2 text-sm ${statusFilter === item.value ? "bg-bg-state-ghost-hover font-medium" : ""}`}
                  >
                    {item.icon}
                    <span className="text-text-default font-normal">{item.label}</span>
                    {statusFilter === item.value && <span className="ml-auto text-xs">✓</span>}
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center justify-between gap-1">
          <Button onClick={() => setOpenFilter(true)} className="bg-bg-state-soft block size-7 rounded-md p-1.5 md:hidden">
            <Image src="/staff/icons/open-filter-modal.svg" alt="filter icon" width={20} height={20} />
          </Button>

          <Button
            onClick={() => setOpenExport(true)}
            className="border-border-darker text-text-default hidden h-8 items-center rounded-md border px-2.5 text-sm font-medium md:flex"
          >
            <ShareBox fill="var(--color-icon-default-muted)" /> Export
          </Button>

          <div className="flex items-center gap-1">
            <Button
              onClick={() => router.push("/staff/invoices/new-invoice")}
              className="bg-bg-state-primary hover:bg-bg-state-primary/90! text-text-white-default flex h-8 w-31 items-center gap-1 rounded-md"
            >
              <Plus className="text-texticon-white-default size-4" />
              Add Invoice
            </Button>

            <Button
              onClick={() => setIsOpen(true)}
              className="bg-bg-state-soft text-text-muted flex h-7 w-7 cursor-pointer p-0! text-center focus-visible:ring-0! md:hidden"
            >
              <Ellipsis className="size-5" />
            </Button>
          </div>
        </div>

        {isOpen && (
          <MobileDrawer open={isOpen} setIsOpen={setIsOpen} title="Actions">
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

        {isMobile && (
          <MobileDrawer open={openFilter} setIsOpen={setOpenFilter} title="Filter by Status">
            <div className="flex w-full flex-col gap-2 px-6 py-4">
              {filterItems.map(item => (
                <div
                  key={item.value}
                  onClick={() => handleStatusClick(item.value)}
                  className={`flex w-full cursor-pointer items-center gap-2 rounded-md p-2 text-sm ${statusFilter === item.value ? "bg-bg-state-ghost-hover font-medium" : ""}`}
                >
                  {item.icon}
                  <span className="text-text-default font-normal">{item.label}</span>
                  {statusFilter === item.value && <span className="ml-auto text-xs">✓</span>}
                </div>
              ))}
            </div>

            <DrawerFooter className="border-border-default border-t">
              <div className="flex justify-between">
                <DrawerClose asChild>
                  <Button
                    onClick={() => setStatusFilter("")}
                    className="bg-bg-state-soft text-text-subtle h-8 rounded-md! px-2.5 py-1 text-sm font-medium"
                  >
                    Clear
                  </Button>
                </DrawerClose>

                <DrawerClose asChild>
                  <Button className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-8 rounded-md px-2.5 py-1 text-sm">
                    Apply
                  </Button>
                </DrawerClose>
              </div>
            </DrawerFooter>
          </MobileDrawer>
        )}
      </div>
    </>
  );
};
