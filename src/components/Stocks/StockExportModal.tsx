"use client";

import { ShareBox } from "@digenty/icons";
import { useMemo, useState } from "react";

import { StockStatus } from "@/api/stock";
import { BranchWithClassLevels } from "@/api/types";
import { toast } from "@/components/Toast";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useGetStockByCategory, useGetStockByStatus, useGetStockCategories, useSearchStocks } from "@/hooks/queryHooks/useStock";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { exportToCSV } from "@/lib/export-utils";

import { MobileDrawer } from "../MobileDrawer";
import { Modal } from "../Modal";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { DrawerClose, DrawerFooter } from "../ui/drawer";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { StockListItem } from "./types";

type InvoiceModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

type CategoryOption = { id: number; name: string };

const STATUS_LABELS: Record<StockStatus, string> = {
  IN_STOCK: "In Stock",
  LOW_STOCK: "Low Stock",
  OUT_OF_STOCK: "Out of Stock",
};

const statusOptions: { label: string; value: StockStatus | "ALL" }[] = [
  { label: "All Stock", value: "ALL" },
  { label: "In Stock", value: "IN_STOCK" },
  { label: "Low Stock", value: "LOW_STOCK" },
  { label: "Out of Stock", value: "OUT_OF_STOCK" },
];

const extractList = (resp: unknown): StockListItem[] => {
  if (!resp || typeof resp !== "object") return [];
  const r = resp as { content?: StockListItem[]; data?: { content?: StockListItem[] } | StockListItem[] };
  if (Array.isArray(r.content)) return r.content;
  if (Array.isArray((r.data as { content?: StockListItem[] })?.content)) return (r.data as { content: StockListItem[] }).content;
  if (Array.isArray(r.data)) return r.data as StockListItem[];
  return [];
};

export const StockExportModal = ({ open, setOpen }: InvoiceModalProps) => {
  const isMobile = useIsMobile();
  const user = useLoggedInUser();
  const defaultBranchId = user.branchIds?.[0];

  const { data: branchesResp } = useGetBranches();
  const branches = ((branchesResp?.data ?? []) as BranchWithClassLevels[]).map(b => b.branch);

  const { data: categoriesResp } = useGetStockCategories(0, 100);
  const categories: CategoryOption[] = useMemo(() => {
    const list: unknown = (categoriesResp as { content?: CategoryOption[]; data?: { content?: CategoryOption[] } | CategoryOption[] } | undefined)
      ?.content;
    if (Array.isArray(list)) return list as CategoryOption[];
    const data = (categoriesResp as { data?: { content?: CategoryOption[] } | CategoryOption[] } | undefined)?.data;
    if (Array.isArray((data as { content?: CategoryOption[] })?.content)) return (data as { content: CategoryOption[] }).content;
    if (Array.isArray(data)) return data as CategoryOption[];
    return [];
  }, [categoriesResp]);

  const [branchId, setBranchId] = useState<number | undefined>(defaultBranchId);
  const [statusValue, setStatusValue] = useState<StockStatus | "ALL">("ALL");
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);

  const effectiveBranchId = branchId ?? defaultBranchId;
  const status = statusValue === "ALL" ? undefined : statusValue;

  const searchQ = useSearchStocks({ branchId: effectiveBranchId, search: "", page: 0, size: 1000 });
  const statusQ = useGetStockByStatus(status);
  const categoryQ = useGetStockByCategory(categoryId);

  const stocks = useMemo<StockListItem[]>(() => {
    let rows: StockListItem[] = [];
    if (categoryId) rows = extractList(categoryQ.data);
    else if (status) rows = extractList(statusQ.data);
    else rows = extractList(searchQ.data);

    if (status && categoryId) rows = rows.filter(r => r.stockStatus === status);
    return rows;
  }, [categoryId, status, categoryQ.data, statusQ.data, searchQ.data]);

  const isFetching = searchQ.isFetching || statusQ.isFetching || categoryQ.isFetching;

  const selectedBranch = branches.find(b => b.id === effectiveBranchId);
  const selectedCategory = categories.find(c => c.id === categoryId);

  const handleExport = () => {
    if (stocks.length === 0) {
      toast({ title: "No stocks to export", type: "warning" });
      return;
    }
    const headers = ["S/N", "Item Name", "Quantity", "Amount (₦)", "Status"];
    const rows = stocks.map((s, i) => [
      i + 1,
      s.itemName ?? "-",
      s.quantity ?? 0,
      Number(s.amount ?? 0).toLocaleString(),
      STATUS_LABELS[s.stockStatus] ?? s.stockStatus ?? "-",
    ]);
    const branchSlug = selectedBranch?.name?.replaceAll(" ", "_") ?? "All_Branches";
    const filename = `Stocks_${branchSlug}_${new Date().toISOString().slice(0, 10)}.csv`;
    exportToCSV(filename, headers, rows);
    toast({ title: "Export started", type: "success" });
    setOpen(false);
  };

  const exportButton = (
    <Button
      type="button"
      onClick={handleExport}
      disabled={isFetching || stocks.length === 0}
      className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-7! rounded-md px-2 py-1 text-sm"
    >
      <ShareBox fill="var(--color-icon-white-default)" /> Export Stock
    </Button>
  );

  const body = (
    <div className="flex w-full flex-col gap-4 px-3 py-4 md:px-6">
      <h2 className="text-text-default text-sm font-bold">Filter Selection</h2>

      <div className="space-y-2">
        <Label className="text-text-default text-sm font-medium">Branch</Label>
        <Select value={effectiveBranchId ? String(effectiveBranchId) : ""} onValueChange={value => setBranchId(value ? Number(value) : undefined)}>
          <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal">
            <SelectValue placeholder="Select Branch">
              <span className="text-text-default text-sm">{selectedBranch?.name ?? "Select branch"}</span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-bg-default border-border-default">
            {branches.map(branch => (
              <SelectItem key={branch.id} value={String(branch.id)} className="text-text-default text-sm">
                {branch.name ?? `Branch ${branch.id}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-text-default text-sm font-medium">Category</Label>
        <Select value={categoryId ? String(categoryId) : "ALL"} onValueChange={value => setCategoryId(value === "ALL" ? undefined : Number(value))}>
          <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
            <SelectValue>
              <span className="text-text-default text-sm">{selectedCategory?.name ?? "All Categories"}</span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-bg-default border-border-default">
            <SelectItem value="ALL" className="text-text-default text-sm">
              All Categories
            </SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat.id} value={String(cat.id)} className="text-text-default text-sm">
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-text-default text-sm font-medium">Status</Label>
        <Select value={statusValue} onValueChange={value => setStatusValue(value as StockStatus | "ALL")}>
          <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
            <SelectValue>
              <span className="text-text-default text-sm">{statusOptions.find(o => o.value === statusValue)?.label}</span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-bg-default border-border-default">
            {statusOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value} className="text-text-default text-sm">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Badge className="border-border-default bg-bg-badge-green text-bg-basic-green-strong flex w-fit items-center rounded-sm p-0.5">
        {isFetching ? "Loading..." : `${stocks.length} Stock Found`}
      </Badge>
    </div>
  );

  return (
    <div>
      {isMobile ? (
        <MobileDrawer open={open} setIsOpen={setOpen} title="Filter">
          {body}
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
              <span>Export Stock</span>
            </span>
          }
          ActionButton={exportButton}
        >
          {body}
        </Modal>
      )}
    </div>
  );
};
