"use client";

import { DeleteBin, Edit } from "@digenty/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetFeeItemById, useDeleteFeeItem } from "@/hooks/queryHooks/useFee";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Copy, Building2 } from "lucide-react";
import type { FeeItemDetailResponse } from "@/api/fee";
import { useDuplicateFeeItem } from "@/hooks/queryHooks/useFee";
import { EmptyFeeState } from "../../EmptyFeeState";
import { ErrorComponent } from "@/components/Error/ErrorComponent";

export const FeeItemDetail = () => {
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id);

  const { data, isPending, isError } = useGetFeeItemById(id);
  const item = data as FeeItemDetailResponse | undefined;
  const { mutate: deleteFeeItem, isPending: deleting } = useDeleteFeeItem();
  const { mutate: duplicateFeeItem, isPending: duplicating } = useDuplicateFeeItem();

  useBreadcrumb([
    { label: "Fees", url: "/staff/fees" },
    { label: "Fee Items", url: "/staff/fees?tab=Fee Items" },
    { label: item?.feeName ?? "Fee Item", url: `/staff/fees/fee-item/${id}` },
  ]);

  const handleDelete = () => {
    deleteFeeItem(id, {
      onSuccess: () => {
        toast.success("Fee item deleted");
        router.push("/staff/fees?tab=Fee Items");
      },
      onError: (error: unknown) => toast.error((error as { message?: string })?.message ?? "Failed to delete fee item"),
    });
  };

  const amountDisplay = () => {
    if (!item) return "—";
    if (item.minAmount != null && item.maxAmount != null && item.minAmount !== item.maxAmount) {
      return `₦${item.minAmount.toLocaleString()} - ₦${item.maxAmount.toLocaleString()}`;
    }
    return `₦${(item.amount ?? item.minAmount ?? 0).toLocaleString()}`;
  };

  const totalClasses = item?.appliedClasses?.reduce((acc, g) => acc + g.classes.length, 0) ?? 0;

  if (isPending) {
    return (
      <div className="mx-auto flex w-full max-w-225 flex-col gap-6 px-4 py-3 md:px-8">
        <Skeleton className="bg-bg-input-soft h-8 w-48" />
        <Skeleton className="bg-bg-input-soft h-24 w-full" />
        <Skeleton className="bg-bg-input-soft h-40 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center px-4 py-3 pb-8 md:px-8">
        <ErrorComponent title="Could not load fee item" description="Failed to load fee item details. Please try again." buttonText="Go back" />;
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex items-center justify-center px-4 py-3 pb-8 md:px-8">
        <EmptyFeeState buttonText="Go back" url="/staff/fees" title="No fee details" description="Fee item not found" />;
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center px-4 py-3 pb-8 md:px-8">
      <div className="mx-auto flex w-full max-w-225 flex-col gap-6 md:gap-8">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-text-default text-xl font-semibold">{item.feeName}</h1>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-bg-state-destructive! hover:bg-bg-state-destructive-hover! text-text-white-default h-8! rounded-md"
            >
              <DeleteBin fill="var(--color-icon-white-default)" />
              {deleting ? "Deleting..." : "Delete"}
            </Button>
            <Button
              disabled={duplicating}
              className="text-text-default bg-bg-state-default hover:bg-bg-state-default-hover border-border-darker h-8! rounded-md border"
              onClick={() =>
                duplicateFeeItem(id, {
                  onSuccess: result => {
                    toast.success("Fee item duplicated");
                    router.push(`/staff/fees/fee-item/${result.feeItemId}`);
                  },
                  onError: (error: unknown) => toast.error((error as { message?: string })?.message ?? "Failed to duplicate fee item"),
                })
              }
            >
              <Copy className="size-4" /> {duplicating ? "Duplicating..." : "Duplicate"}
            </Button>
            <Button
              className="text-text-default bg-bg-state-default hover:bg-bg-state-default-hover border-border-darker h-8! rounded-md border"
              onClick={() => router.push(`/staff/fees/fee-item/${id}/edit`)}
            >
              <Edit fill="var(--color-icon-default)" /> Edit Fee
            </Button>
          </div>
        </div>

        {/* Info row */}
        <div className="border-border-default grid grid-cols-2 rounded-sm border md:grid-cols-4">
          <div className="border-border-default flex flex-col gap-3 border-r border-b p-4 md:border-b-0">
            <span className="text-text-muted text-xs font-medium">Status</span>
            <Badge
              className={`w-fit rounded-md text-xs font-medium ${
                item.active
                  ? "bg-bg-badge-green text-bg-basic-green-strong border-transparent"
                  : "bg-bg-badge-default text-text-subtle border-border-default border"
              }`}
            >
              {item.active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <div className="border-border-default flex flex-col gap-3 border-b p-4 md:border-r md:border-b-0">
            <span className="text-text-muted text-xs font-medium">Term &amp; Session</span>
            <span className="text-text-default text-sm font-medium">{item.termLabel}</span>
          </div>
          <div className="border-border-default flex flex-col gap-3 border-r p-4">
            <span className="text-text-muted text-xs font-medium">Amount</span>
            <span className="text-text-default text-sm font-medium">{amountDisplay()}</span>
          </div>
          <div className="flex flex-col gap-3 p-4">
            <span className="text-text-muted text-xs font-medium">Quantity</span>
            <span className="text-text-default text-sm font-medium">{item.quantity}</span>
          </div>
        </div>

        {/* Applied Branches */}
        {(item.branches?.length ?? 0) > 0 && (
          <div className="border-border-default flex flex-col gap-4 rounded-sm border p-4 md:p-6">
            <div className="flex items-center gap-2">
              <Building2 className="text-icon-default-subtle size-4" />
              <span className="text-text-default text-sm font-semibold">Applied Branches ({item.branches.length})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {item.branches.map(b => (
                <Badge
                  key={b.branchId}
                  className="bg-bg-badge-default border-border-default text-text-default rounded-md border px-3 py-1 text-sm font-medium"
                >
                  <Building2 className="mr-1.5 size-3" />
                  {b.branchName}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Applied Classes */}
        {(item.appliedClasses?.length ?? 0) > 0 && (
          <div className="border-border-default flex flex-col gap-4 rounded-sm border p-4 md:p-6">
            <span className="text-text-default text-sm font-semibold">Applied Classes ({totalClasses})</span>
            {item.appliedClasses.map(group => (
              <div key={group.branchId} className="flex flex-col gap-2">
                <span className="text-text-muted text-xs font-medium">{group.branchName}</span>
                <div className="border-border-default rounded-sm border">
                  {group.classes.map((c, i) => (
                    <div
                      key={`${c.classId}-${c.armId ?? i}`}
                      className="border-border-default flex items-center justify-between px-3 py-2.5 [&:not(:last-child)]:border-b"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-5 items-center justify-center rounded-sm bg-purple-100">
                          <div className="size-2.5 rounded-xs bg-purple-400" />
                        </div>
                        <span className="text-text-default text-sm font-medium">
                          {c.className}
                          {c.armName ? ` ${c.armName}` : ""}
                        </span>
                        <Badge className="bg-bg-badge-default border-border-default text-text-subtle rounded border text-xs font-medium">
                          {c.type === "DEPARTMENT" ? "Department" : "Class"}
                        </Badge>
                      </div>
                      <span className="text-text-default text-sm font-medium">₦{c.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
