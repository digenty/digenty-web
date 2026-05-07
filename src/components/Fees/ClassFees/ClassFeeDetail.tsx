"use client";

import { AddFill, AlertFill, DeleteBin, Edit } from "@digenty/icons";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { getStatusBadge } from "@/components/Status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Spinner } from "@/components/ui/spinner";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useGetFeeById, useDeleteFee } from "@/hooks/queryHooks/useFee";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import React, { useState } from "react";

interface FeeItem {
  id: number;
  title: string;
  qty: number;
  status: string;
  amount: number;
}

export const ClassFeeDetail = () => {
  const router = useRouter();
  const params = useParams();
  const feeId = params?.id ? Number(params.id) : undefined;

  const { data: feeData, isLoading } = useGetFeeById(feeId);
  const { mutate: deleteFee, isPending: isDeleting } = useDeleteFee();

  const [openDeleteModal, setOpeDeleteModal] = useState(false);
  const [openClassDeleteModal, setOpenClassDeleteModal] = useState(false);

  useBreadcrumb([
    { label: "Fees", url: "/staff/fees" },
    { label: "Class Fees", url: "/staff/fees?tab=Class Fees" },
    { label: feeData?.className ?? feeData?.name ?? `Fee #${feeId}`, url: "#" },
  ]);

  const rawItems: FeeItem[] =
    feeData?.items?.map((item: { id: number; name: string; quantity?: number; required?: boolean; amount: number }) => ({
      id: item.id,
      title: item.name,
      qty: item.quantity ?? 1,
      status: item.required ? "Required" : "Optional",
      amount: item.amount,
    })) ?? [];

  const [items, setItems] = useState<FeeItem[]>(rawItems);

  // Sync items when feeData loads
  React.useEffect(() => {
    if (feeData?.items) {
      setItems(
        feeData.items.map((item: { id: number; name: string; quantity?: number; required?: boolean; amount: number }) => ({
          id: item.id,
          title: item.name,
          qty: item.quantity ?? 1,
          status: item.required ? "Required" : "Optional",
          amount: item.amount,
        })),
      );
    }
  }, [feeData]);

  const remove = (id: number) => setItems(prev => prev.filter(item => item.id !== id));
  const subtotal = items.reduce((acc, item) => acc + item.qty * item.amount, 0);

  const handleDeleteClass = () => {
    if (!feeId) return;
    deleteFee(feeId, {
      onSuccess: () => {
        toast.success("Class fee deleted");
        setOpenClassDeleteModal(false);
        router.push("/staff/fees");
      },
      onError: (err: unknown) => {
        const msg = (err as { message?: string })?.message ?? "Failed to delete fee";
        toast.error(msg);
        setOpenClassDeleteModal(false);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner className="size-10" />
      </div>
    );
  }

  const title = feeData?.className ?? feeData?.name ?? `Fee #${feeId}`;

  return (
    <div className="flex items-center justify-center px-4 md:px-30 lg:px-70.5">
      <div className="w-full py-4">

        {/* Class-level delete modal */}
        {openClassDeleteModal && (
          <>
            <Modal
              open={openClassDeleteModal}
              setOpen={setOpenClassDeleteModal}
              title="Delete Class Fee?"
              ActionButton={
                <Button
                  onClick={handleDeleteClass}
                  disabled={isDeleting}
                  className="hover:bg-bg-state-destructive! bg-bg-state-disabled! text-text-hint! hover:text-text-white-default! h-7!"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              }
            >
              <div className="flex flex-col gap-4 px-6 py-4">
                <div className="text-text-subtle text-sm font-medium">
                  Are you sure you want to permanently delete all fees for {title}? This action cannot be undone.
                </div>
                <div className="bg-bg-basic-orange-subtle border-border-default flex items-center gap-3 rounded-md border px-3 py-2">
                  <AlertFill fill="var(--color-bg-basic-orange-accent)" className="size-12" />
                  <div className="text-text-subtle text-sm">
                    Deleting this class fee will remove it from the fee setup and it will no longer appear in new invoices.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Checkbox />
                  <div className="text-text-subtle text-sm">I understand that deleting this class fee is permanent.</div>
                </div>
              </div>
            </Modal>
            <MobileDrawer title="Delete Class Fee?" open={openClassDeleteModal} setIsOpen={setOpenClassDeleteModal}>
              <div className="flex flex-col gap-4 px-3 py-4">
                <div className="text-text-subtle text-sm font-medium">
                  Are you sure you want to permanently delete all fees for {title}?
                </div>
                <div className="bg-bg-basic-orange-subtle border-border-default flex items-center gap-3 rounded-md border px-3 py-2">
                  <AlertFill fill="var(--color-bg-basic-orange-accent)" className="size-24" />
                  <div className="text-text-subtle text-sm">
                    Deleting this class fee will remove it from the fee setup and it will no longer appear in new invoices.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Checkbox />
                  <div className="text-text-subtle text-sm">I understand that deleting this class fee is permanent.</div>
                </div>
              </div>
              <DrawerFooter className="border-border-default border-t">
                <div className="flex justify-between">
                  <DrawerClose asChild>
                    <Button className="bg-bg-state-soft text-text-subtle h-7! rounded-md! px-4 py-2 text-sm font-medium">Cancel</Button>
                  </DrawerClose>
                  <Button onClick={handleDeleteClass} disabled={isDeleting} className="hover:bg-bg-state-destructive! bg-bg-state-disabled! text-text-hint! hover:text-text-white-default! h-7!">
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </DrawerFooter>
            </MobileDrawer>
          </>
        )}

        <div className="mb-4 flex flex-col justify-between gap-4 md:mb-9 md:flex-row">
          <div className="text-text-default text-xl font-semibold">{title}</div>
          <div className="flex gap-2">
            <Button
              onClick={() => setOpenClassDeleteModal(true)}
              className="bg-bg-state-secondary! border-border-darker hover:bg-bg-state-secondary-hover! h-8! w-8! border shadow-sm!"
            >
              <DeleteBin fill="var(--color-bg-state-destructive)" className="size-4" />
            </Button>
            <Button
              onClick={() => router.push("/staff/fees/add-fee-to-class")}
              className="bg-bg-state-secondary! border-border-darker text-text-default hover:bg-bg-state-secondary-hover! h-8! border font-medium shadow-sm!"
            >
              <AddFill fill="var(--color-icon-default-muted)" />
              Add Fee To This Class
            </Button>
          </div>
        </div>

        <div>
          <div className="flex flex-col gap-6">
            {items.map(itm => (
              <div key={itm.id}>
                {openDeleteModal && (
                  <div>
                    <Modal
                      open={openDeleteModal}
                      setOpen={setOpeDeleteModal}
                      title="Delete Fee from Class?"
                      ActionButton={
                        <Button
                          onClick={() => { remove(itm.id); setOpeDeleteModal(false); }}
                          className="hover:bg-bg-state-destructive! bg-bg-state-disabled! text-text-hint! hover:text-text-white-default! h-7!"
                        >
                          Delete
                        </Button>
                      }
                    >
                      <div className="flex flex-col gap-4 px-6 py-4">
                        <div className="text-text-subtle text-sm font-medium">
                          Are you sure you want to permanently delete this fee from {title}? This action cannot be undone.
                        </div>
                        <div className="bg-bg-basic-orange-subtle border-border-default flex items-center gap-3 rounded-md border px-3 py-2">
                          <AlertFill fill="var(--color-bg-basic-orange-accent)" className="size-12" />
                          <div className="text-text-subtle text-sm">
                            Deleting this fee will remove it from the class's fee setup and it will no longer appear in new invoices.
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Checkbox />
                          <div className="text-text-subtle text-sm">I understand that deleting this fee from the class is permanent.</div>
                        </div>
                      </div>
                    </Modal>

                    <MobileDrawer title="Delete Fee from Class?" open={openDeleteModal} setIsOpen={setOpeDeleteModal}>
                      <div className="flex flex-col gap-4 px-3 py-4">
                        <div className="text-text-subtle text-sm font-medium">
                          Are you sure you want to permanently delete this fee from {title}?
                        </div>
                        <div className="bg-bg-basic-orange-subtle border-border-default flex items-center gap-3 rounded-md border px-3 py-2">
                          <AlertFill fill="var(--color-bg-basic-orange-accent)" className="size-24" />
                          <div className="text-text-subtle text-sm">
                            Deleting this fee will remove it from the class's fee setup and it will no longer appear in new invoices.
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Checkbox />
                          <div className="text-text-subtle text-sm">I understand that deleting this fee from the class is permanent.</div>
                        </div>
                      </div>
                      <DrawerFooter className="border-border-default border-t">
                        <div className="flex justify-between">
                          <DrawerClose asChild>
                            <Button className="bg-bg-state-soft text-text-subtle h-7! rounded-md! px-4 py-2 text-sm font-medium">Cancel</Button>
                          </DrawerClose>
                          <Button
                            onClick={() => { remove(itm.id); setOpeDeleteModal(false); }}
                            className="hover:bg-bg-state-destructive! bg-bg-state-disabled! text-text-hint! hover:text-text-white-default! h-7!"
                          >
                            Delete
                          </Button>
                        </div>
                      </DrawerFooter>
                    </MobileDrawer>
                  </div>
                )}

                <div className="border-border-default flex items-center justify-between rounded-md border px-6 py-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <div className="text-text-default text-base font-medium">{itm.title}</div>
                      <Badge className="bg-bg-state-secondary! border-border-default text-text-default rounded-md border">{itm.qty}</Badge>
                    </div>
                    <div className="font-medium">{getStatusBadge(itm.status)}</div>
                  </div>
                  <div className="flex gap-7">
                    <div className="text-text-default text-base font-semibold">₦{itm.amount.toLocaleString()}</div>
                    <div className="flex gap-3">
                      <DeleteBin onClick={() => setOpeDeleteModal(true)} fill="var(--color-icon-default-subtle)" className="cursor-pointer" />
                      <Edit fill="var(--color-icon-default-subtle)" className="cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-border-default mt-6 flex items-center justify-between rounded-md border px-6 py-4">
            <div className="text-text-muted text-base font-semibold">Total</div>
            <div className="text-text-default text-base font-bold">₦{subtotal.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
