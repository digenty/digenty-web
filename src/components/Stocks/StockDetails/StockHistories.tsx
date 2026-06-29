"use client";

import { Eye } from "@digenty/icons";
import { useMemo, useState } from "react";

import { Avatar } from "@/components/Avatar";
import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useGetStockTransactions } from "@/hooks/queryHooks/useStock";

import { StocksHistoryColumns } from "./Columns";
import { ADJUST_REASON_LABELS } from "./constants";
import { StockHistoryDetailsModal } from "./StockHistoryDetailsModal";
import { StockDetailResponse, StockTransactionRecord } from "./type";

type Props = {
  stockId?: number;
  stock?: StockDetailResponse | null;
};

const formatDate = (raw?: string) => {
  if (!raw) return "-";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });
};

const extractTransactions = (resp: unknown): StockTransactionRecord[] => {
  if (!resp || typeof resp !== "object") return [];
  const r = resp as { content?: StockTransactionRecord[]; data?: { content?: StockTransactionRecord[] } | StockTransactionRecord[] };
  if (Array.isArray(r.content)) return r.content;
  if (Array.isArray((r.data as { content?: StockTransactionRecord[] })?.content))
    return (r.data as { content: StockTransactionRecord[] }).content;
  if (Array.isArray(r.data)) return r.data as StockTransactionRecord[];
  return [];
};

export const StockHistories = ({ stockId, stock }: Props) => {
  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState({});
  const [, setSelectedRows] = useState<StockTransactionRecord[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<StockTransactionRecord | null>(null);
  const pageSize = 10;

  const { data, isLoading } = useGetStockTransactions(stockId, page - 1, pageSize);

  const transactions = useMemo(() => extractTransactions(data), [data]);
  const totalCount = useMemo(() => {
    if (!data || typeof data !== "object") return 0;
    const r = data as { totalElements?: number };
    return r.totalElements ?? transactions.length;
  }, [data, transactions.length]);

  const formatReason = (reason?: string) =>
    ADJUST_REASON_LABELS[reason as keyof typeof ADJUST_REASON_LABELS] ?? reason ?? "-";

  return (
    <>
      {selectedTransaction && (
        <StockHistoryDetailsModal
          open={!!selectedTransaction}
          setOpen={open => !open && setSelectedTransaction(null)}
          transaction={selectedTransaction}
          stockName={stock?.name ?? stock?.itemName}
          stockImage={stock?.imagePath ?? stock?.image}
        />
      )}

      <div className="border-border-default flex flex-col gap-4 rounded-sm border p-4">
        <div className="text-text-default text-sm font-semibold">Stock History</div>

        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Spinner className="size-8" />
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              <DataTable
                columns={StocksHistoryColumns}
                data={transactions}
                totalCount={totalCount}
                page={page}
                setCurrentPage={setPage}
                pageSize={pageSize}
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
                onSelectRows={setSelectedRows}
                clickHandler={row => setSelectedTransaction(row.original)}
                showPagination={true}
                border={false}
                headerBg={false}
              />
            </div>

            <div className="flex flex-col gap-4 md:hidden">
              {transactions.length === 0 && <div className="text-text-muted py-4 text-center text-sm">No history found</div>}
              {transactions.map(tx => {
                const change = tx.change ?? tx.quantityAdjustment ?? 0;
                return (
                  <div key={tx.id} className="border-border-default bg-bg-subtle rounded-md border">
                    <div className="border-border-default flex justify-between border-b px-3 py-1">
                      <div className="text-text-muted text-sm font-medium">Date</div>
                      <div className="text-text-default text-sm font-medium">{formatDate(tx.date ?? tx.createdAt)}</div>
                    </div>

                    <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                      <span className="text-text-muted font-medium">Change By</span>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-4" />
                        <div className="text-text-default text-sm font-medium">
                          {tx.changedBy ?? tx.userName ?? tx.user?.name ?? "-"}
                        </div>
                      </div>
                    </div>

                    <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                      <span className="text-text-muted font-medium">Reason</span>
                      <div className="flex items-center gap-1">
                        <span className="text-text-default text-sm font-medium">{formatReason(tx.reason)}</span>
                        <Badge
                          className={`border-border-default rounded-md border text-xs ${change >= 0 ? "bg-bg-badge-green text-bg-basic-green-strong" : "bg-bg-badge-red text-bg-basic-red-strong"}`}
                        >
                          {change >= 0 ? `+${change}` : change}
                        </Badge>
                      </div>
                    </div>

                    <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                      <span className="text-text-muted font-medium">Branch</span>
                      <span className="text-text-default text-sm font-medium">{tx.branchName ?? tx.branch ?? "-"}</span>
                    </div>

                    <div className="p-2">
                      <Button
                        onClick={() => setSelectedTransaction(tx)}
                        className="bg-bg-state-secondary! border-border-darker text-text-default h-8! w-full rounded-md border text-sm font-medium"
                      >
                        <Eye fill="var(--color-icon-default-muted)" />
                        View
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
};
