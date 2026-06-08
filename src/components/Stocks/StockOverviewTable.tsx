"use client";

import { DeleteBin, Edit, Eye } from "@digenty/icons";
import { Ellipsis } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { useDeleteStock, useGetStockByCategory, useGetStockByStatus, useSearchStocks } from "@/hooks/queryHooks/useStock";
import { StockStatus } from "@/api/stock";
import { toast } from "../Toast";

import { DataTable } from "../DataTable";
import { Modal } from "../Modal";
import { MobileDrawer } from "../MobileDrawer";
import { stockStatus } from "../Status";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { buildStocksOverviewTableColumns, STATUS_DISPLAY } from "./Columns";
import { StockListItem } from "./types";

const PAGE_SIZE = 10;

type Props = {
  branchId?: number;
  search: string;
  statusFilter?: StockStatus;
  categoryFilter?: number;
};

const extractList = (resp: unknown): { items: StockListItem[]; total: number } => {
  if (!resp || typeof resp !== "object") return { items: [], total: 0 };
  const r = resp as { content?: StockListItem[]; totalElements?: number; data?: { content?: StockListItem[]; totalElements?: number } };
  if (Array.isArray(r.content)) return { items: r.content, total: r.totalElements ?? r.content.length };
  if (Array.isArray(r.data?.content)) return { items: r.data.content, total: r.data.totalElements ?? r.data.content.length };
  if (Array.isArray(r.data as unknown)) return { items: r.data as unknown as StockListItem[], total: (r.data as unknown as StockListItem[]).length };
  return { items: [], total: 0 };
};

export const StockOverviewTable = ({ branchId, search, statusFilter, categoryFilter }: Props) => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState({});
  const [, setSelectedRows] = useState<StockListItem[]>([]);
  const [drawerStock, setDrawerStock] = useState<StockListItem | null>(null);
  const [stockToDelete, setStockToDelete] = useState<StockListItem | null>(null);
  const [visibleCount, setVisibleCount] = useState(3);

  const useDefault = !statusFilter && !categoryFilter;
  const searchQ = useSearchStocks({
    branchId,
    search,
    page: page - 1,
    size: PAGE_SIZE,
  });
  const statusQ = useGetStockByStatus(statusFilter);
  const categoryQ = useGetStockByCategory(categoryFilter);

  const activeQuery = statusFilter ? statusQ : categoryFilter ? categoryQ : searchQ;
  const { items, total } = useMemo(() => extractList(activeQuery.data), [activeQuery.data]);

  const { mutate: deleteStock, isPending: deleting } = useDeleteStock();

  const handleDelete = () => {
    if (!stockToDelete) return;
    deleteStock(stockToDelete.id, {
      onSuccess: () => {
        toast({ title: "Stock deleted", type: "success" });
        setStockToDelete(null);
      },
      onError: (error: unknown) => {
        const message = (error as { message?: string } | null)?.message ?? "Could not delete stock";
        toast({ title: message, type: "error" });
      },
    });
  };

  const columns = useMemo(
    () =>
      buildStocksOverviewTableColumns({
        onView: row => router.push(`/staff/stock/${row.original.id}`),
        onDelete: row => setStockToDelete(row.original),
      }),
    [router],
  );

  const isLoading = activeQuery.isLoading;

  return (
    <div>
      {stockToDelete && (
        <Modal
          open={!!stockToDelete}
          setOpen={open => !open && setStockToDelete(null)}
          title="Delete Stock?"
          ActionButton={
            <Button
              onClick={handleDelete}
              disabled={deleting}
              className="text-text-white-default bg-bg-state-destructive hover:bg-bg-state-destructive-hover! h-7! rounded-md px-2 py-1 text-sm"
            >
              {deleting ? <Spinner /> : "Delete Stock"}
            </Button>
          }
        >
          <div className="px-4 py-4">
            <p className="text-text-subtle text-sm">
              Are you sure you want to permanently delete <span className="text-text-default font-medium">{stockToDelete.itemName}</span>? This action
              cannot be undone.
            </p>
          </div>
        </Modal>
      )}

      <div className="hidden md:block">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Spinner className="size-10" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={items}
            totalCount={total}
            page={page}
            setCurrentPage={setPage}
            pageSize={PAGE_SIZE}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            onSelectRows={setSelectedRows}
            clickHandler={row => {
              router.push(`/staff/stock/${row.original.id}`);
            }}
            showPagination={useDefault}
          />
        )}
      </div>

      <div className="flex flex-col gap-4 md:hidden">
        {items.slice(0, visibleCount).map(stock => {
          return (
            <div key={stock.id} className="border-border-default bg-bg-subtle rounded-md border">
              <MobileDrawer open={drawerStock?.id === stock.id} setIsOpen={open => setDrawerStock(open ? stock : null)} title="Actions">
                <div className="flex w-full flex-col gap-4 px-3 py-4">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      role="button"
                      onClick={() => router.push(`/staff/stock/${stock.id}`)}
                      className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm"
                    >
                      <Eye className="size-4" fill="var(--color-icon-default-subtle)" /> View stock
                    </div>
                    <div
                      role="button"
                      className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm"
                    >
                      <Edit fill="var(--color-icon-default-subtle)" className="size-4" /> Edit stock
                    </div>
                    <div
                      role="button"
                      onClick={() => {
                        setStockToDelete(stock);
                        setDrawerStock(null);
                      }}
                      className="text-text-destructive hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm"
                    >
                      <DeleteBin fill="var(--color-icon-destructive)" className="size-4" />
                      <span>Delete stock</span>
                    </div>
                  </div>
                </div>
              </MobileDrawer>

              <div>
                <div className="border-border-default flex justify-between border-b px-3 py-1 text-sm">
                  <div className="flex items-center gap-2">
                    <Image src={stock.image || "/staff/images/image.png"} alt={stock.itemName} width={20} height={20} />
                    <span className="text-text-default text-sm font-medium">{stock.itemName}</span>
                  </div>
                  <Button onClick={() => setDrawerStock(stock)} className="text-text-muted cursor-pointer p-0! focus-visible:ring-0!">
                    <Ellipsis className="size-5" />
                  </Button>
                </div>
              </div>

              <div>
                <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                  <span className="text-text-muted font-medium">Quantity</span>
                  <span className="text-text-default text-sm font-medium">{stock.quantity}</span>
                </div>
              </div>

              <div>
                <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                  <span className="text-text-muted font-medium">Amount</span>
                  <span className="text-text-default text-sm font-medium">₦ {Number(stock.amount ?? 0).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between px-3 py-2 text-sm">
                <span className="text-text-muted font-medium">Status</span>
                {stockStatus(STATUS_DISPLAY[stock.stockStatus] ?? stock.stockStatus)}
              </div>
            </div>
          );
        })}

        {!isLoading && items.length === 0 && <div className="text-text-muted py-6 text-center text-sm">No stock items found</div>}

        {visibleCount < items.length && (
          <Button
            onClick={() => setVisibleCount(items.length)}
            className="bg-bg-state-soft text-text-subtle mx-auto my-2 flex w-39 items-center justify-center rounded-md"
          >
            Load More
          </Button>
        )}
      </div>
    </div>
  );
};
