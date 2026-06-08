"use client";

import { ShareBox } from "@digenty/icons";
import { Ellipsis, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useIsMobile } from "@/hooks/useIsMobile";
import { useGetStockCategories } from "@/hooks/queryHooks/useStock";
import { StockStatus } from "@/api/stock";

import { MobileDrawer } from "../MobileDrawer";
import { SearchInput } from "../SearchInput";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { DrawerClose, DrawerFooter } from "../ui/drawer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { StockExportModal } from "./StockExportModal";

const statusOptions: { label: string; value: StockStatus | "" }[] = [
  { label: "All Stock", value: "" },
  { label: "In Stock", value: "IN_STOCK" },
  { label: "Low Stock", value: "LOW_STOCK" },
  { label: "Out of Stock", value: "OUT_OF_STOCK" },
];

type Props = {
  search: string;
  setSearch: (s: string) => void;
  statusFilter?: StockStatus;
  setStatusFilter: (s: StockStatus | undefined) => void;
  categoryFilter?: number;
  setCategoryFilter: (c: number | undefined) => void;
};

type StockCategoryOption = { id: number; name: string };

export const StocksSearchAndFilter = ({ search, setSearch, statusFilter, setStatusFilter, categoryFilter, setCategoryFilter }: Props) => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const { data: categoriesResp } = useGetStockCategories(0, 100);
  const categories: StockCategoryOption[] = categoriesResp?.content ?? categoriesResp?.data?.content ?? categoriesResp?.data ?? [];

  const [openExport, setOpenExport] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);

  return (
    <>
      {openExport && <StockExportModal open={openExport} setOpen={setOpenExport} />}

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-0">
        <div className="flex items-center gap-1">
          <SearchInput
            value={search}
            onChange={evt => setSearch(evt.target.value)}
            className="border-border-default border text-sm"
            placeholder="Search stocks"
          />

          <DropdownMenu open={openFilter} onOpenChange={setOpenFilter}>
            <DropdownMenuTrigger asChild>
              <Badge className="border-border-darker bg-bg-state-secondary text-text-muted hidden cursor-pointer items-center rounded-full border border-dashed md:flex">
                <Image src="/staff/icons/open-filter-modal.svg" alt="filter icon" width={20} height={20} className="size-7 p-1.5" />
                {statusOptions.find(opt => opt.value === (statusFilter ?? ""))?.label ?? "Status"}
              </Badge>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="bg-bg-card border-border-default text-text-default hidden w-48 py-2.5 shadow-sm md:block">
              <div className="flex flex-col gap-1 px-1 py-2">
                {statusOptions.map(item => (
                  <div
                    key={item.label}
                    onClick={() => {
                      setStatusFilter(item.value || undefined);
                      setOpenFilter(false);
                    }}
                    className="hover:bg-bg-state-ghost-hover flex w-full cursor-pointer items-center gap-2 rounded-md p-2 text-sm"
                  >
                    <span className="text-text-default font-normal">{item.label}</span>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu open={openCategory} onOpenChange={setOpenCategory}>
            <DropdownMenuTrigger asChild>
              <Badge className="border-border-darker bg-bg-state-secondary text-text-muted hidden cursor-pointer items-center rounded-full border border-dashed md:flex">
                <Image src="/staff/icons/open-filter-modal.svg" alt="filter icon" width={20} height={20} className="size-7 p-1.5" />
                {categories.find(c => c.id === categoryFilter)?.name ?? "Category"}
              </Badge>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="bg-bg-card border-border-default text-text-default hidden w-48 py-2.5 shadow-sm md:block">
              <div className="flex flex-col gap-1 px-1 py-2">
                <div
                  onClick={() => {
                    setCategoryFilter(undefined);
                    setOpenCategory(false);
                  }}
                  className="hover:bg-bg-state-ghost-hover flex w-full cursor-pointer items-center gap-2 rounded-md p-2 text-sm"
                >
                  <span className="text-text-default font-normal">All Categories</span>
                </div>
                {categories.map(cat => (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setCategoryFilter(cat.id);
                      setOpenCategory(false);
                    }}
                    className="hover:bg-bg-state-ghost-hover flex w-full cursor-pointer items-center gap-2 rounded-md p-2 text-sm"
                  >
                    <span className="text-text-default font-normal">{cat.name}</span>
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
              onClick={() => router.push("/staff/stock/add-stock")}
              className="bg-bg-state-primary hover:bg-bg-state-primary/90! text-text-white-default flex h-8 w-31 items-center gap-1 rounded-md"
            >
              <Plus className="text-texticon-white-default size-4" />
              Add Stock
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
          <MobileDrawer open={openFilter} setIsOpen={setOpenFilter} title="Filter">
            <div className="flex w-full flex-col gap-2 px-4 py-4">
              <div className="space-y-2">
                <Label className="text-text-default text-sm font-medium">Status</Label>

                <Select value={statusFilter ?? ""} onValueChange={value => setStatusFilter((value as StockStatus) || undefined)}>
                  <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                    <SelectValue placeholder="All Stock" />
                  </SelectTrigger>
                  <SelectContent className="bg-bg-default border-border-default">
                    {statusOptions.map(opt => (
                      <SelectItem key={opt.label} value={opt.value} className="text-text-default text-sm">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-text-default text-sm font-medium">Category</Label>

                <Select
                  value={categoryFilter ? String(categoryFilter) : ""}
                  onValueChange={value => setCategoryFilter(value ? Number(value) : undefined)}
                >
                  <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="bg-bg-default border-border-default">
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={String(cat.id)} className="text-text-default text-sm">
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DrawerFooter className="border-border-default border-t">
              <div className="flex justify-between">
                <DrawerClose asChild>
                  <Button className="bg-bg-state-soft text-text-subtle h-8 rounded-md! px-2.5 py-1 text-sm font-medium">Cancel</Button>
                </DrawerClose>

                <Button className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-8 rounded-md px-2.5 py-1 text-sm">
                  Apply
                </Button>
              </div>
            </DrawerFooter>
          </MobileDrawer>
        )}
      </div>
    </>
  );
};
