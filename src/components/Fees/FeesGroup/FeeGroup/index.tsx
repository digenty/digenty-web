"use client";

import { AlertFill, DeleteBin, Edit } from "@digenty/icons";
import { Modal } from "@/components/Modal";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Spinner } from "@/components/ui/spinner";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useGetFeeGroupById, useDeleteFeeGroup } from "@/hooks/queryHooks/useFee";
import { FeeGroupByIdData } from "@/api/fee";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import React, { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const FeeGroup = () => {
  const router = useRouter();
  const params = useParams();
  const groupId = params?.id ? Number(params.id) : undefined;

  const { data: rawGroupData, isLoading } = useGetFeeGroupById(groupId);
  const { mutate: deleteFeeGroup, isPending: isDeleting } = useDeleteFeeGroup();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const group = ((rawGroupData as { data?: FeeGroupByIdData })?.data ?? rawGroupData) as FeeGroupByIdData | undefined;

  const groupName = group?.name ?? `Fee Group #${groupId} `;

  useBreadcrumb([
    { label: "Fees", url: "/staff/fees" },
    { label: "Fee Groups", url: "/staff/fees?tab=Fee Groups" },
    { label: groupName, url: "#" },
  ]);

  const items = (group?.items ?? []).map(item => ({
    id: item.id,
    title: item.itemName,
    qty: item.quantity,
    status: item.optional ? "Optional" : "Required",
    amount: item.total,
  }));

  const subtotal = items.reduce((acc, item) => acc + item.amount, 0);

  const handleDelete = () => {
    if (!groupId) return;
    deleteFeeGroup(groupId, {
      onSuccess: () => {
        toast.success("Fee group deleted");
        setOpenDeleteModal(false);
        router.push("/staff/fees?tab=Fee Groups");
      },
      onError: (err: unknown) => {
        const msg = (err as { message?: string })?.message ?? "Failed to delete fee group";
        toast.error(msg);
        setOpenDeleteModal(false);
      },
    });
  };

  return (
    <div className="mx-auto flex items-center justify-center">
      <div className="w-full px-4 py-3 md:px-30 lg:px-60">
        {openDeleteModal && (
          <>
            <Modal
              open={openDeleteModal}
              setOpen={setOpenDeleteModal}
              title="Delete Fee Group?"
              ActionButton={
                <Button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="hover:bg-bg-state-destructive! bg-bg-state-disabled! text-text-hint! hover:text-text-white-default! h-7!"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              }
            >
              <div className="flex flex-col gap-4 px-6 py-4">
                <div className="text-text-subtle text-sm font-medium">
                  Are you sure you want to permanently delete this fee group? This action cannot be undone.
                </div>
                <div className="bg-bg-basic-orange-subtle border-border-default flex items-center gap-3 rounded-md border px-3 py-2">
                  <AlertFill fill="var(--color-bg-basic-orange-accent)" className="size-12" />
                  <div className="text-text-subtle text-sm">
                    Deleting this fee group will remove it from your setup and it will no longer be available for invoices.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Checkbox />
                  <div className="text-text-subtle text-sm">I understand that deleting this fee group is permanent and cannot be undone.</div>
                </div>
              </div>
            </Modal>
            <MobileDrawer title="Delete Fee Group?" open={openDeleteModal} setIsOpen={setOpenDeleteModal}>
              <div className="flex flex-col gap-4 px-3 py-4">
                <div className="text-text-subtle text-sm font-medium">
                  Are you sure you want to permanently delete this fee group? This action cannot be undone.
                </div>
                <div className="bg-bg-basic-orange-subtle border-border-default flex items-center gap-3 rounded-md border px-3 py-2">
                  <AlertFill fill="var(--color-bg-basic-orange-accent)" className="size-24" />
                  <div className="text-text-subtle text-sm">
                    Deleting this fee group will remove it from your setup and it will no longer be available for invoices.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Checkbox />
                  <div className="text-text-subtle text-sm">I understand that deleting this fee group is permanent and cannot be undone.</div>
                </div>
              </div>
              <DrawerFooter className="border-border-default border-t">
                <div className="flex justify-between">
                  <DrawerClose asChild>
                    <Button className="bg-bg-state-soft text-text-subtle h-7! rounded-md! px-4 py-2 text-sm font-medium">Cancel</Button>
                  </DrawerClose>
                  <Button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="hover:bg-bg-state-destructive! bg-bg-state-disabled! text-text-hint! hover:text-text-white-default! h-7!"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </DrawerFooter>
            </MobileDrawer>
          </>
        )}

        {isLoading ? (
          <Skeleton className="bg-bg-input-soft h-10 w-full" />
        ) : (
          <div className="mb-4 flex flex-col justify-between gap-3 md:mb-9 md:flex-row">
            <div className="text-text-default text-xl font-semibold">{groupName}</div>
            <div className="flex gap-2">
              <Button
                onClick={() => setOpenDeleteModal(true)}
                className="bg-bg-state-secondary! border-border-darker hover:bg-bg-state-secondary-hover! h-8! w-8! border shadow-sm!"
              >
                <DeleteBin fill="var(--color-bg-state-destructive)" className="size-4" />
              </Button>
              <Button
                type="button"
                onClick={() => router.push(`/staff/fees/fee-group/${groupId}/edit`)}
                className="bg-bg-state-secondary! border-border-darker text-text-default hover:bg-bg-state-secondary-hover! h-8! border font-medium shadow-sm!"
              >
                <Edit fill="var(--color-icon-default-muted)" />
                <p className="inline md:hidden">Edit Fee Group</p>
              </Button>
            </div>
          </div>
        )}

        {isLoading ? (
          <Skeleton className="bg-bg-input-soft h-100 w-full" />
        ) : (
          <div>
            <div className="flex flex-col gap-6">
              {items.map(itm => (
                <div className="border-border-default flex items-center justify-between rounded-md border px-6 py-4" key={itm.id}>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <div className="text-text-default font-medium">{itm.title}</div>
                      <Badge className="bg-bg-state-secondary! border-border-default text-text-default size-5 rounded-md border">{itm.qty}</Badge>
                    </div>
                    <Badge
                      className={`border-border-default rounded-md border text-xs font-medium ${itm.status === "Required" ? "text-bg-basic-blue-strong bg-bg-badge-blue" : "text-bg-basic-fuchsia-strong bg-bg-badge-fuchsia"}`}
                    >
                      {itm.status}
                    </Badge>
                  </div>
                  <div className="text-text-default text-base font-semibold">₦{itm.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div className="border-border-default mt-6 flex items-center justify-between rounded-md border px-6 py-4">
              <div className="text-text-muted text-md font-semibold">Total</div>
              <div className="text-text-default text-sm font-medium">₦{subtotal.toLocaleString()}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
