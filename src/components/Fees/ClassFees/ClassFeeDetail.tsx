"use client";

import { AddFill, DeleteBin } from "@digenty/icons";
import { getStatusBadge } from "@/components/Status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteFeeItem, useGetFeeItems } from "@/hooks/queryHooks/useFee";
import { useGetClasses } from "@/hooks/queryHooks/useClass";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import type { ClassType } from "@/api/types";

export const ClassFeeDetail = () => {
  const router = useRouter();
  const params = useParams();
  const classId = Number(params?.id);

  const { data: classesResp } = useGetClasses();
  const className = (classesResp?.data?.content as ClassType[] | undefined)?.find(c => c.id === classId)?.name ?? "Class Fees";

  const { data: items = [], isPending, isError } = useGetFeeItems({ classId });
  const { mutate: deleteFeeItem, isPending: deleting } = useDeleteFeeItem();

  useBreadcrumb([
    { label: "Fees", url: "/staff/fees" },
    { label: "Class Fees", url: "/staff/fees" },
    { label: className, url: `/staff/fees/${classId}` },
  ]);

  const subtotal = items.reduce((acc, item) => acc + item.amount * item.quantity, 0);

  const handleDelete = (feeItemId: number) => {
    deleteFeeItem(feeItemId, {
      onSuccess: () => toast.success("Fee removed from class"),
      onError: (error: unknown) => toast.error((error as { message?: string })?.message ?? "Failed to remove fee"),
    });
  };

  return (
    <div className="flex items-center justify-center px-4 md:px-30 lg:px-70.5">
      <div className="w-full py-4">
        <div className="mb-4 flex flex-col justify-between gap-4 md:mb-9 md:flex-row">
          <div className="text-text-default text-xl font-semibold">{className}</div>
          <div className="flex gap-2">
            <Button
              onClick={() =>
                router.push(`/staff/fees/add-fee-to-class?classId=${classId}&className=${encodeURIComponent(className)}`)
              }
              className="bg-bg-state-secondary! border-border-darker text-text-default hover:bg-bg-state-secondary-hover! h-8! border font-medium shadow-sm!"
            >
              <AddFill fill="var(--color-icon-default-muted)" />
              Add Fee To This Class
            </Button>
          </div>
        </div>

        {isPending ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="bg-bg-input-soft h-16 w-full rounded-md" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-text-muted flex items-center justify-center py-20 text-sm">Could not load fees for this class.</div>
        ) : items.length === 0 ? (
          <div className="text-text-muted flex items-center justify-center py-20 text-sm">No fees attached to this class yet.</div>
        ) : (
          <div className="flex flex-col gap-6">
            {items.map(itm => (
              <div className="border-border-default flex items-center justify-between rounded-md border px-6 py-4" key={itm.feeItemId}>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <div className="text-text-default text-base font-medium">{itm.feeName}</div>
                    <Badge className="bg-bg-state-secondary! border-border-default text-text-default rounded-md border">{itm.quantity}</Badge>
                  </div>
                  <div className="font-medium">{getStatusBadge(itm.required ? "Required" : "Optional")}</div>
                </div>
                <div className="flex items-center gap-7">
                  <div className="text-text-default text-base font-semibold">₦{itm.amount.toLocaleString()}</div>
                  <DeleteBin
                    onClick={() => !deleting && handleDelete(itm.feeItemId)}
                    fill="var(--color-icon-default-subtle)"
                    className="cursor-pointer"
                  />
                </div>
              </div>
            ))}

            <div className="border-border-default flex items-center justify-between rounded-md border px-6 py-4">
              <div className="text-text-muted text-base font-semibold">Total</div>
              <div className="text-text-default text-base font-bold"> ₦{subtotal.toLocaleString()}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
