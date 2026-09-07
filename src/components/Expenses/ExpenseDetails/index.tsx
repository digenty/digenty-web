"use client";

import { Calendar, DeleteBin, Download2, Edit, File, MapPin, User, Wallet } from "@digenty/icons";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ReactNode, useMemo, useState } from "react";

import { Avatar } from "@/components/Avatar";
import { BackLink } from "@/components/BackLink";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useGetExpenseById } from "@/hooks/queryHooks/useExpense";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { canViewExpenses } from "@/lib/permissions/expenses";

import { ExpenseCategoryBadge, PaymentMethodCell } from "../Columns";
import { DeleteExpenseModal } from "../DeleteExpenseModal";
import {
  expenseAddedByOf,
  expenseBranchNameOf,
  expenseCategoryNameOf,
  ExpenseListItem,
  expenseTitleOf,
  extractExpenseRecord,
  formatExpenseDate,
  formatFileSize,
  formatNaira,
} from "../types";

const DetailRow = ({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) => (
  <div className="border-border-default flex items-center justify-between gap-4 border-b py-3 last:border-b-0">
    <div className="text-text-muted flex items-center gap-2 text-sm">
      {icon}
      <span>{label}</span>
    </div>
    <div className="text-text-default text-right text-sm font-medium">{children}</div>
  </div>
);

const isImagePath = (path?: string) => !!path && /\.(png|jpe?g|gif|webp|avif)$/i.test(path.split("?")[0]);

const fileNameOf = (expense?: ExpenseListItem | null) => {
  if (expense?.receiptName) return expense.receiptName;
  const path = expense?.receiptPath;
  if (!path) return "";
  return decodeURIComponent(path.split("?")[0].split("/").pop() ?? "receipt");
};

const ExpenseDetailsContent = () => {
  const params = useParams();
  const router = useRouter();
  const expenseId = Number(params?.id);

  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data: rawData, isLoading } = useGetExpenseById(expenseId || undefined);
  const expense = useMemo(() => extractExpenseRecord<ExpenseListItem>(rawData), [rawData]);

  const title = expenseTitleOf(expense);
  const addedBy = expenseAddedByOf(expense);
  const receiptName = fileNameOf(expense);

  useBreadcrumb([
    { label: "Expenses", url: "/staff/expense" },
    { label: title || "Detail", url: "" },
  ]);

  if (isLoading) {
    return (
      <div>
        <div className="md:hidden">
          <BackLink href="/staff/expense" />
        </div>
        <div className="flex h-60 items-center justify-center">
          <Spinner className="size-12" />
        </div>
      </div>
    );
  }

  return (
    <>
      {confirmDelete && (
        <DeleteExpenseModal open={confirmDelete} setOpen={setConfirmDelete} expense={expense} onDeleted={() => router.push("/staff/expense")} />
      )}

      <div className="mx-auto flex w-full max-w-175 flex-col gap-4">
        <div className="md:hidden">
          <BackLink href="/staff/expense" />
        </div>

        <div className="border-border-default flex flex-col gap-4 rounded-md border p-4 md:flex-row md:items-center md:justify-between md:p-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h1 className="text-text-default text-xl font-semibold">{title || "Expense"}</h1>
              <ExpenseCategoryBadge name={expenseCategoryNameOf(expense)} />
            </div>
            <div className="text-text-subtle text-sm font-medium">{formatNaira(expense?.amount)}</div>
          </div>

          <div className="border-border-default flex items-center gap-3 border-t pt-4 md:border-none md:p-0">
            <Button
              onClick={() => setConfirmDelete(true)}
              className="border-border-darker bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! h-8! rounded-md border"
            >
              <DeleteBin fill="var(--color-icon-destructive)" />
            </Button>
            <Button
              onClick={() => expense?.id && router.push(`/staff/expense/add-expense?id=${expense.id}`)}
              className="border-border-darker text-text-default bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! h-8! rounded-md border text-sm font-medium"
            >
              <Edit fill="var(--color-icon-default)" /> Edit Expense
            </Button>
          </div>
        </div>

        <div className="border-border-default bg-bg-card-subtle flex flex-col rounded-md border px-4 py-2 md:px-6">
          <DetailRow icon={<Calendar fill="var(--color-icon-default-muted)" className="size-4" />} label="Date">
            {formatExpenseDate(expense?.date)}
          </DetailRow>

          <DetailRow icon={<Wallet fill="var(--color-icon-default-muted)" className="size-4" />} label="Payment Method">
            <PaymentMethodCell method={expense?.paymentMethod} />
          </DetailRow>

          <DetailRow icon={<User fill="var(--color-icon-default-muted)" className="size-4" />} label="Staff">
            <span className="flex items-center gap-2">
              <Avatar url={addedBy.imagePath} className="size-5" />
              <span>{addedBy.name || "-"}</span>
            </span>
          </DetailRow>

          <DetailRow icon={<MapPin fill="var(--color-icon-default-muted)" className="size-4" />} label="Branch">
            {expenseBranchNameOf(expense) || "-"}
          </DetailRow>
        </div>

        <div className="border-border-default flex flex-col gap-3 rounded-md border p-4 md:p-5">
          <h2 className="text-text-default text-sm font-semibold">Description</h2>
          <p className="text-text-subtle text-sm">{expense?.description || "No description was added for this expense."}</p>
        </div>

        <div className="border-border-default flex flex-col gap-3 rounded-md border p-4 md:p-5">
          <h2 className="text-text-default text-sm font-semibold">Receipts &amp; Attachments</h2>

          {expense?.receiptPath ? (
            <div className="border-border-default flex items-center gap-3 rounded-md border p-2">
              <div className="bg-bg-input-soft flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md">
                {isImagePath(expense.receiptPath) ? (
                  <Image src={expense.receiptPath} alt={receiptName} width={40} height={40} className="size-10 object-cover" />
                ) : (
                  <File fill="var(--color-icon-default-muted)" className="size-5" />
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col">
                <span className="text-text-default truncate text-sm font-medium">{receiptName}</span>
                {formatFileSize(expense.receiptSize) && <span className="text-text-muted text-xs">{formatFileSize(expense.receiptSize)}</span>}
              </div>

              <a
                href={expense.receiptPath}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="hover:bg-bg-state-ghost-hover flex size-8 items-center justify-center rounded-md"
                aria-label={`Download ${receiptName}`}
              >
                <Download2 fill="var(--color-icon-default-muted)" className="size-4" />
              </a>
            </div>
          ) : (
            <p className="text-text-muted text-sm">No receipt was attached to this expense.</p>
          )}
        </div>
      </div>
    </>
  );
};

export const ExpenseDetails = () => (
  <ModulePermissionsWrapper permissionUtility={canViewExpenses}>
    <ExpenseDetailsContent />
  </ModulePermissionsWrapper>
);
