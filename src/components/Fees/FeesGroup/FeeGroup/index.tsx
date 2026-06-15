"use client";

import { DeleteBin, Edit } from "@digenty/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteFeeGroup, useGetFeeGroupById } from "@/hooks/queryHooks/useFee";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import type { FeeGroupDetailResponse } from "@/api/fee";

export const FeeGroup = () => {
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id);

  const { data, isPending, isError } = useGetFeeGroupById(id);
  const group = data as FeeGroupDetailResponse | undefined;
  const { mutate: deleteFeeGroup, isPending: deleting } = useDeleteFeeGroup();

  useBreadcrumb([
    { label: "Fees", url: "/staff/fees" },
    { label: "Fee Groups", url: "/staff/fees?tab=Fee Groups" },
    { label: group?.name ?? "Fee Group", url: `/staff/fees/fee-group/${id}` },
  ]);

  const handleDelete = () => {
    deleteFeeGroup(id, {
      onSuccess: () => {
        toast.success("Fee group deleted");
        router.push("/staff/fees?tab=Fee Groups");
      },
      onError: (error: unknown) => toast.error((error as { message?: string })?.message ?? "Failed to delete fee group"),
    });
  };

  if (isPending) {
    return (
      <div className="mx-auto w-full px-4 py-3 md:px-30 lg:px-60">
        <Skeleton className="bg-bg-input-soft mb-6 h-8 w-56" />
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="bg-bg-input-soft h-16 w-full rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !group) {
    return <div className="text-text-muted flex items-center justify-center py-20 text-sm">Could not load this fee group.</div>;
  }

  const items = group.items ?? [];

  return (
    <div className="mx-auto flex items-center justify-center">
      <div className="w-full px-4 py-3 md:px-30 lg:px-60">
        <div className="mb-4 flex flex-col justify-between gap-3 md:mb-9 md:flex-row">
          <div>
            <div className="text-text-default text-xl font-semibold">{group.name}</div>
            {group.description && <div className="text-text-muted mt-1 text-sm">{group.description}</div>}
            {group.branchName && <div className="text-text-subtle mt-1 text-sm">{group.branchName}</div>}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push(`/staff/fees/fee-group/${id}/edit`)}
              className="bg-bg-state-secondary! border-border-darker hover:bg-bg-state-secondary-hover! text-text-default h-8! border shadow-sm!"
            >
              <Edit fill="var(--color-icon-default)" className="size-4" />
              Edit
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-bg-state-secondary! border-border-darker hover:bg-bg-state-secondary-hover! h-8! w-8! border shadow-sm!"
            >
              <DeleteBin fill="var(--color-bg-state-destructive)" className="size-4" />
            </Button>
          </div>
        </div>

        <div>
          <div className="flex flex-col gap-6">
            {items.length === 0 ? (
              <div className="text-text-muted text-sm">This fee group has no items.</div>
            ) : (
              items.map(itm => (
                <div className="border-border-default flex items-center justify-between rounded-md border px-6 py-4" key={itm.id}>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <div className="text-text-default font-medium">{itm.itemName}</div>
                      <Badge className="bg-bg-state-secondary! border-border-default text-text-default size-5 rounded-md border">
                        {itm.quantity}
                      </Badge>
                    </div>
                    <Badge
                      className={`border-border-default rounded-md border text-xs font-medium ${
                        itm.optional ? "text-bg-basic-fuchsia-strong bg-bg-badge-fuchsia" : "text-bg-basic-blue-strong bg-bg-badge-blue"
                      }`}
                    >
                      {itm.optional ? "Optional" : "Required"}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-text-default text-base font-semibold">₦{itm.total.toLocaleString()}</div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="border-border-default mt-6 flex items-center justify-between rounded-md border px-6 py-4">
            <div className="text-text-muted text-md font-semibold">Total</div>
            <div className="text-text-default text-sm font-medium">₦{(group.totalAmount ?? 0).toLocaleString()}</div>
          </div>

          {group.allowPartPayment && (
            <div className="border-border-default mt-4 rounded-md border px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-text-default text-sm font-medium">Part Payment Enabled</span>
                  <span className="text-text-muted text-xs">Parents can pay this fee in instalments</span>
                </div>
                {group.minimumPartPayment > 0 && (
                  <div className="text-right">
                    <span className="text-text-muted text-xs">Minimum initial payment</span>
                    <div className="text-text-default text-sm font-semibold">₦{group.minimumPartPayment.toLocaleString()}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
