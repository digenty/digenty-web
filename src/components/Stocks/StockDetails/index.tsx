"use client";

import { ArrowUpDown, IndeterminateCircleFill, ReplyFill, Store3 } from "@digenty/icons";
import { useParams } from "next/navigation";
import { useState } from "react";

import { OverviewCard } from "@/components/OverviewCard";
import { Tabs } from "@/components/Tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useGetStockById } from "@/hooks/queryHooks/useStock";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

import { stockStatus } from "@/components/Status";
import { StockDetailHeader } from "./StockDetailHeader";
import { StockDetailsAdjustQtyModal } from "./StockDetailsAdjustQtyModal";
import { StockDetailsManagement } from "./StockDetailsManagement";
import { StockHistories } from "./StockHistories";
import { StockDetailResponse } from "./type";

const extractStock = (resp: unknown): StockDetailResponse | null => {
  if (!resp || typeof resp !== "object") return null;
  const r = resp as { data?: StockDetailResponse } & StockDetailResponse;
  if (r.data && typeof r.data === "object" && "id" in r.data) return r.data as StockDetailResponse;
  if ("id" in r) return r as StockDetailResponse;
  return null;
};

const STATUS_LABELS: Record<string, string> = {
  IN_STOCK: "In Stock",
  LOW_STOCK: "Low Stock",
  OUT_OF_STOCK: "Out of Stock",
};

export const StockDetails = () => {
  const params = useParams();
  const stockId = Number(params?.id);

  const { data: rawData, isLoading } = useGetStockById(stockId || undefined);
  const stock = extractStock(rawData);

  useBreadcrumb([
    { label: "Stock", url: "/staff/stock" },
    { label: stock?.name ?? stock?.itemName ?? "Detail", url: "" },
  ]);

  const [adjustQty, setAdjustQty] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <Spinner className="size-12" />
      </div>
    );
  }

  const currentQty = stock?.totalQuantity ?? stock?.quantity ?? 0;
  const branchName = stock?.branchName ?? stock?.branch?.name;
  const unitName = stock?.unit?.name ?? stock?.unitName;

  const branchEntries = stock?.branchStocks ?? stock?.branches ?? [];
  const mobileQtyItems = Array.isArray(branchEntries) && branchEntries.length > 0
    ? branchEntries
    : stock ? [{ location: branchName ?? "-", quantity: currentQty, amount: stock.price ?? 0, status: stock.stockStatus ?? stock.status ?? "IN_STOCK" }]
    : [];

  return (
    <div>
      {adjustQty && stock?.id && (
        <StockDetailsAdjustQtyModal
          open={adjustQty}
          setOpen={setAdjustQty}
          stockId={stock.id}
          stockName={stock.name ?? stock.itemName}
          stockImage={stock.imagePath ?? stock.image}
          branchName={branchName}
          unitName={unitName}
          currentQuantity={currentQty}
        />
      )}

      <div className="hidden flex-col gap-6 md:flex">
        <StockDetailHeader stock={stock} />

        <div className="grid w-full grid-cols-2 gap-3 lg:grid-cols-3">
          <OverviewCard
            title="Total Sold"
            Icon={() => (
              <div className="bg-bg-basic-rose-subtle border-bg-basic-rose-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
                <Store3 fill="var(--color-icon-default)" />
              </div>
            )}
            value={String(stock?.totalSold ?? 0)}
          />
          <OverviewCard
            title="Total Removed"
            Icon={() => (
              <div className="bg-bg-basic-pink-subtle border-bg-basic-pink-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
                <IndeterminateCircleFill fill="var(--color-icon-default)" />
              </div>
            )}
            value={String(stock?.totalRemoved ?? 0)}
          />
          <div className="col-span-2 lg:col-span-1">
            <OverviewCard
              title="Total Returned"
              Icon={() => (
                <div className="bg-bg-basic-fuchsia-subtle border-bg-basic-fuchsia-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
                  <ReplyFill fill="var(--color-icon-default)" />
                </div>
              )}
              value={String(stock?.totalReturned ?? 0)}
            />
          </div>
        </div>

        <StockDetailsManagement stock={stock} />
        <StockHistories stockId={stockId || undefined} stock={stock} />
      </div>

      <div className="w-full items-center md:hidden">
        <Tabs
          className="w-full"
          items={[
            {
              label: "Overview",
              content: (
                <div className="my-4 flex w-full flex-col gap-4">
                  <StockDetailHeader stock={stock} />

                  <div className="grid w-full grid-cols-2 gap-3 lg:grid-cols-3">
                    <OverviewCard
                      title="Total Sold"
                      Icon={() => (
                        <div className="bg-bg-basic-rose-subtle border-bg-basic-rose-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
                          <Store3 fill="var(--color-icon-default)" />
                        </div>
                      )}
                      value={String(stock?.totalSold ?? 0)}
                    />
                    <OverviewCard
                      title="Total Removed"
                      Icon={() => (
                        <div className="bg-bg-basic-pink-subtle border-bg-basic-pink-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
                          <IndeterminateCircleFill fill="var(--color-icon-default)" />
                        </div>
                      )}
                      value={String(stock?.totalRemoved ?? 0)}
                    />
                    <div className="col-span-2 lg:col-span-1">
                      <OverviewCard
                        title="Total Returned"
                        Icon={() => (
                          <div className="bg-bg-basic-fuchsia-subtle border-bg-basic-fuchsia-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
                            <ReplyFill fill="var(--color-icon-default)" />
                          </div>
                        )}
                        value={String(stock?.totalReturned ?? 0)}
                      />
                    </div>
                  </div>

                  <div className="border-border-default flex h-full w-full flex-col gap-5 rounded-sm border p-4 md:w-118">
                    <div className="text-text-default text-sm font-semibold">Item Details</div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <div className="text-text-muted text-sm">{branchName ? `${branchName} Price` : "Price"}</div>
                        <div className="text-text-default text-md font-medium">₦{Number(stock?.price ?? 0).toLocaleString()}</div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="text-text-muted text-sm">Cost Price</div>
                        <div className="text-text-default text-md font-medium">₦{Number(stock?.costPrice ?? 0).toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-text-muted text-sm">Unit</div>
                      <div className="text-text-default text-md font-medium">{unitName ?? "-"}</div>
                    </div>
                  </div>
                </div>
              ),
            },

            {
              label: "Quantity",
              content: (
                <div className="border-border-default my-4 flex w-full flex-1 flex-col gap-6 rounded-sm border p-4">
                  <div className="text-text-default text-sm font-semibold">Quantity Management</div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="text-text-muted text-sm">Current Quantity</div>
                      <div className="text-text-default text-2xl font-semibold">{currentQty}</div>
                    </div>
                    <Button
                      onClick={() => setAdjustQty(true)}
                      disabled={!stock?.id}
                      className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-8!"
                    >
                      <ArrowUpDown fill="var(--color-icon-white-default)" />
                      Adjust Quantity
                    </Button>
                  </div>

                  <div className="flex flex-col gap-4">
                    {mobileQtyItems.map((entry, i) => {
                      const loc = (entry as { location?: string; branchName?: string })?.location
                        ?? (entry as { branchName?: string })?.branchName ?? "-";
                      const qty = (entry as { quantity?: number })?.quantity ?? 0;
                      const amt = (entry as { amount?: number; price?: number })?.amount ?? (entry as { price?: number })?.price ?? 0;
                      const st = (entry as { status?: string; stockStatus?: string })?.status ?? (entry as { stockStatus?: string })?.stockStatus ?? "";
                      const stLabel = STATUS_LABELS[st] ?? st.replace(/_/g, " ");
                      return (
                        <div key={i} className="border-border-default bg-bg-subtle rounded-md border">
                          <div className="border-border-default flex justify-between border-b px-3 py-1">
                            <div className="text-text-muted text-sm font-medium">{loc}</div>
                            <ArrowUpDown fill="var(--color-icon-default)" />
                          </div>
                          <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                            <span className="text-text-muted font-medium">Quantity</span>
                            <div className="text-text-default text-sm font-medium">{qty}</div>
                          </div>
                          <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                            <span className="text-text-muted font-medium">Amount</span>
                            <span className="text-text-default text-sm font-medium">₦{Number(amt).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between px-3 py-2 text-sm">
                            <span className="text-text-muted font-medium">Status</span>
                            <span>{stLabel ? stockStatus(stLabel) : <Badge className="bg-bg-badge-default text-text-subtle border-border-default h-5 rounded-md border text-xs">{st}</Badge>}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ),
            },

            {
              label: "Stock History",
              content: (
                <div className="my-4 w-full">
                  <StockHistories stockId={stockId || undefined} stock={stock} />
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};
