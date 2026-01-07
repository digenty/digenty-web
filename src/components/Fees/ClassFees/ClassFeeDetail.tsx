"use client";

import { AddFill } from "@/components/Icons/AddFill";
import AlertFill from "@/components/Icons/AlertFill";
import DeleteBin from "@/components/Icons/DeleteBin";
import Edit from "@/components/Icons/Edit";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { getStatusBadge } from "@/components/Status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const ClassItems = [
  {
    id: 1,
    title: "Tution",
    qty: 2,
    status: "Required",
    amount: 200280,
  },
  {
    id: 2,
    title: "Tution",
    qty: 2,
    status: "Optional",
    amount: 200280,
  },
  {
    id: 3,
    title: "Tution",
    qty: 2,
    status: "Required",
    amount: 200280,
  },
  {
    id: 4,
    title: "Tution",
    qty: 2,
    status: "Optional",
    amount: 200280,
  },
];

export const ClassFeeDetail = () => {
  const route = useRouter();
  const [items, setItems] = useState(ClassItems);
  const [openDeleteModal, setOpeDeleteModal] = useState(false);

  useBreadcrumb([
    { label: "Fees", url: "/fees" },
    { label: "Class Fees", url: "/fees" },
    { label: "JSS 1", url: "/fees/class-fees/jss-1" },
  ]);
  const remove = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((acc, item) => acc + item.qty * item.amount, 0);

  return (
    <div className="flex items-center justify-center px-4 md:px-30 lg:px-70.5">
      <div className="w-full py-4">
        <div className="mb-4 flex flex-col justify-between gap-4 md:mb-9 md:flex-row">
          <div className="text-text-default text-xl font-semibold">JSS 1</div>
          <div className="flex gap-2">
            <Button className="bg-bg-state-secondary! border-border-darker hover:bg-bg-state-secondary-hover! h-8! w-8! border shadow-sm!">
              <DeleteBin fill="var(--color-bg-state-destructive)" className="size-4" />
            </Button>
            <Button
              onClick={() => route.push("/fees/add-fee-to-class")}
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
              <div className="" key={itm.id}>
                <div className="">
                  {openDeleteModal && (
                    <div className="">
                      <Modal
                        open={openDeleteModal}
                        setOpen={setOpeDeleteModal}
                        title="Delete Fee from Class?"
                        ActionButton={
                          <Button className="hover:bg-bg-state-destructive! bg-bg-state-disabled! text-text-hint! hover:text-text-white-default! h-7!">
                            Delete
                          </Button>
                        }
                      >
                        <div className="flex flex-col gap-4 px-6 py-4">
                          <div className="text-text-subtle text-sm font-medium">
                            Are you sure you want to permanently delete this fee from JSS 1 ? This action cannot be undone.{" "}
                          </div>
                          <div className="bg-bg-basic-orange-subtle border-border-default flex items-center gap-3 rounded-md border px-3 py-2">
                            <AlertFill fill="var(--color-bg-basic-orange-accent)" className="size-12" />

                            <div className="text-text-subtle text-sm">
                              Deleting this fee will remove it from the class’s fee setup and it will no longer appear in new invoices for this class.
                              Once removed, this action cannot be reversed automatically.
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Checkbox />
                            <div className="text-text-subtle text-sm">
                              I understand that deleting this fee from the class is permanent and cannot be undone.
                            </div>
                          </div>
                        </div>
                      </Modal>

                      <MobileDrawer title="Delete Fee from Class?" open={openDeleteModal} setIsOpen={setOpeDeleteModal}>
                        <div className="flex flex-col gap-4 px-3 py-4">
                          <div className="text-text-subtle text-sm font-medium">
                            Are you sure you want to permanently delete this fee from JSS 1 ? This action cannot be undone.{" "}
                          </div>
                          <div className="bg-bg-basic-orange-subtle border-border-default flex items-center gap-3 rounded-md border px-3 py-2">
                            <AlertFill fill="var(--color-bg-basic-orange-accent)" className="size-24" />

                            <div className="text-text-subtle text-sm">
                              Deleting this fee will remove it from the class’s fee setup and it will no longer appear in new invoices for this class.
                              Once removed, this action cannot be reversed automatically.
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Checkbox />
                            <div className="text-text-subtle text-sm">
                              I understand that deleting this fee from the class is permanent and cannot be undone.
                            </div>
                          </div>
                        </div>
                        <DrawerFooter className="border-border-default border-t">
                          <div className="flex justify-between">
                            <DrawerClose asChild>
                              <Button className="bg-bg-state-soft text-text-subtle h-7! rounded-md! px-4 py-2 text-sm font-medium">Cancel</Button>
                            </DrawerClose>

                            <Button className="hover:bg-bg-state-destructive! bg-bg-state-disabled! text-text-hint! hover:text-text-white-default! h-7!">
                              Delete
                            </Button>
                          </div>
                        </DrawerFooter>
                      </MobileDrawer>
                    </div>
                  )}
                </div>

                <div className="border-border-default flex items-center justify-between rounded-md border px-6 py-4" key={itm.id}>
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
            <div className="text-text-default text-base font-bold"> ₦{subtotal.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
