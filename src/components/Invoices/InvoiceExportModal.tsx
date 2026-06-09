"use client";

import { AlertFill, Check, CheckDouble, CloseLarge, Draft, FileList3, ShareBox } from "@digenty/icons";
import { BranchWithClassLevels, ClassType, Term, Terms } from "@/api/types";
import { useGetClasses } from "@/hooks/queryHooks/useClass";
import { useGetInvoices } from "@/hooks/queryHooks/useInvoice";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useEffect, useState } from "react";
import { DateRangePicker } from "../DatePicker";
import { MobileDrawer } from "../MobileDrawer";
import { Modal } from "../Modal";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { DrawerClose, DrawerFooter } from "../ui/drawer";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { formatInvoiceStatus, InvoicesOverviewTableProps } from "./types";

type InvoiceModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  branches?: { data: BranchWithClassLevels[] };
  terms?: { data: Terms };
  initialBranchId?: number;
};

const downloadCsv = (invoices: InvoicesOverviewTableProps[], filename: string) => {
  const header = ["Invoice ID", "Student Name", "Amount (NGN)", "Status", "Last Activity"];
  const rows = invoices.map(inv => [
    inv.invoiceId || "N/A",
    inv.studentName,
    String(inv.amount),
    formatInvoiceStatus(inv.status),
    new Date(inv.lastActivity).toLocaleDateString(),
  ]);
  const csv = [header, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const InvoiceExportModal = ({ open, setOpen, branches, terms, initialBranchId }: InvoiceModalProps) => {
  const isMobile = useIsMobile();

  const branchesList = branches?.data ?? [];
  const termsList = terms?.data?.terms ?? [];
  const sessionName = terms?.data?.academicSessionName ?? "";

  const [selectedBranchId, setSelectedBranchId] = useState<number | undefined>(initialBranchId);
  const [selectedClassId, setSelectedClassId] = useState<number | undefined>();
  const [selectedTermId, setSelectedTermId] = useState<number | undefined>();
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [fromValue, setFromValue] = useState<Date | undefined>();
  const [toValue, setToValue] = useState<Date | undefined>();

  useEffect(() => {
    if (initialBranchId && !selectedBranchId) setSelectedBranchId(initialBranchId);
  }, [initialBranchId, selectedBranchId]);

  const { data: classesData } = useGetClasses(selectedBranchId);
  const classesList: ClassType[] = (classesData as { data?: { content?: ClassType[] } } | undefined)?.data?.content ?? [];

  const { data: exportQueryData, isFetching } = useGetInvoices({
    branchId: selectedBranchId,
    classId: selectedClassId,
    termId: selectedTermId,
    status: selectedStatus !== "ALL" ? selectedStatus : undefined,
    startDate: fromValue ? fromValue.toISOString() : undefined,
    endDate: toValue ? toValue.toISOString() : undefined,
    page: 0,
    size: 1000,
  });

  const exportInvoices: InvoicesOverviewTableProps[] =
    (exportQueryData as { data?: { invoices?: InvoicesOverviewTableProps[] } } | undefined)?.data?.invoices ?? [];

  const handleExport = () => {
    if (exportInvoices.length === 0) return;
    const dateStr = new Date().toISOString().split("T")[0];
    downloadCsv(exportInvoices, `invoices-${dateStr}.csv`);
    setOpen(false);
  };

  const exportButton = (
    <Button
      onClick={handleExport}
      disabled={isFetching || exportInvoices.length === 0}
      className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-7! rounded-md px-2 py-1 text-sm disabled:opacity-50"
    >
      <ShareBox fill="var(--color-icon-white-default)" />
      {isFetching ? "Loading..." : "Export Invoice"}
    </Button>
  );

  const filterContent = (
    <div className="flex w-full flex-col gap-4 px-6 py-4">
      <h2 className="text-text-default text-sm font-bold">Filter Selection</h2>

      <div className="space-y-2">
        <Label className="text-text-default text-sm font-medium">Branch</Label>
        <Select
          value={selectedBranchId ? String(selectedBranchId) : ""}
          onValueChange={v => {
            setSelectedBranchId(Number(v));
            setSelectedClassId(undefined);
          }}
        >
          <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal">
            <SelectValue placeholder="Select Branch">
              <span className="text-text-default text-sm">
                {branchesList.find(b => b.branch.id === selectedBranchId)?.branch.name ?? "Select Branch"}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-bg-default border-border-default">
            {branchesList.map((b: BranchWithClassLevels) => (
              <SelectItem key={b.branch.id} value={String(b.branch.id)} className="text-text-default text-sm">
                {b.branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-text-default text-sm font-medium">Class</Label>
        <Select
          value={selectedClassId ? String(selectedClassId) : "none"}
          onValueChange={v => setSelectedClassId(v === "none" ? undefined : Number(v))}
        >
          <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal">
            <SelectValue>
              <span className="text-text-default text-sm">{classesList.find(c => c.id === selectedClassId)?.name ?? "All Classes"}</span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-bg-default border-border-default">
            <SelectItem value="none" className="text-text-default text-sm">
              All Classes
            </SelectItem>
            {classesList.map((c: ClassType) => (
              <SelectItem key={c.id} value={String(c.id)} className="text-text-default text-sm">
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-text-default text-sm font-medium">Status</Label>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal">
            <SelectValue placeholder="All Invoices" />
          </SelectTrigger>
          <SelectContent className="bg-bg-default border-border-default">
            <SelectGroup>
              <SelectItem value="ALL" className="text-text-default text-sm">
                <FileList3 fill="var(--color-icon-default-subtle)" /> All Invoices
              </SelectItem>
              <SelectItem value="UNPAID" className="text-text-default text-sm">
                <CloseLarge fill="var(--color-icon-default-subtle)" /> Unpaid
              </SelectItem>
              <SelectItem value="OUTSTANDING" className="text-text-default text-sm">
                <AlertFill fill="var(--color-icon-default-subtle)" /> Outstanding
              </SelectItem>
              <SelectItem value="PAID" className="text-text-default text-sm">
                <Check fill="var(--color-icon-default-subtle)" /> Paid
              </SelectItem>
              <SelectItem value="FULLY_PAID" className="text-text-default text-sm">
                <CheckDouble fill="var(--color-icon-default-subtle)" /> Fully Paid
              </SelectItem>
              <SelectItem value="DRAFT" className="text-text-default text-sm">
                <Draft fill="var(--color-icon-default-subtle)" /> Draft
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-text-default text-sm font-medium">Term</Label>
        <Select value={selectedTermId ? String(selectedTermId) : "none"} onValueChange={v => setSelectedTermId(v === "none" ? undefined : Number(v))}>
          <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal">
            <SelectValue>
              <span className="text-text-default text-sm capitalize">
                {selectedTermId
                  ? `${sessionName} ${termsList.find((t: Term) => t.termId === selectedTermId)?.term?.toLowerCase() ?? ""}`
                  : "All Terms"}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-bg-default border-border-default">
            <SelectItem value="none" className="text-text-default text-sm">
              All Terms
            </SelectItem>
            {termsList.map((t: Term) => (
              <SelectItem key={t.termId} value={String(t.termId)} className="text-text-default text-sm capitalize">
                {sessionName} {t.term.toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-4">
        <DateRangePicker label="From" date={fromValue} setDate={setFromValue} className="bg-bg-input-soft! text-text-default" />
        <DateRangePicker label="To" date={toValue} setDate={setToValue} className="bg-bg-input-soft!" />
      </div>

      <Badge className="border-border-default bg-bg-badge-green text-bg-basic-green-strong flex items-center rounded-xs p-0.5">
        {isFetching ? "Loading..." : `${exportInvoices.length} Invoice${exportInvoices.length !== 1 ? "s" : ""} Found`}
      </Badge>
    </div>
  );

  return (
    <div>
      {isMobile ? (
        <MobileDrawer open={open} setIsOpen={setOpen} title="Export Invoices">
          {filterContent}
          <DrawerFooter className="border-border-default border-t">
            <div className="flex justify-between">
              <DrawerClose asChild>
                <Button className="bg-bg-state-soft text-text-subtle h-7! rounded-md! px-2 py-1 text-sm font-medium">Cancel</Button>
              </DrawerClose>
              {exportButton}
            </div>
          </DrawerFooter>
        </MobileDrawer>
      ) : (
        <Modal
          open={open}
          setOpen={setOpen}
          title={
            <span className="flex items-center gap-2">
              <span className="bg-bg-state-soft flex size-8 items-center justify-center rounded-full">
                <ShareBox fill="var(--color-icon-default-subtle)" className="size-4" />
              </span>
              <span>Export Invoice</span>
            </span>
          }
          ActionButton={exportButton}
        >
          {filterContent}
        </Modal>
      )}
    </div>
  );
};
