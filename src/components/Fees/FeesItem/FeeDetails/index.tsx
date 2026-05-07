"use client";

import { AlertFill, DeleteBin, Edit, FileCopy, GraduationCap, School } from "@digenty/icons";

import { Modal } from "@/components/Modal";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Spinner } from "@/components/ui/spinner";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useGetFeeItemById, useDeleteFeeItem } from "@/hooks/queryHooks/useFee";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface AppliedClass {
  className: string;
  type: string;
  amount: number;
}

interface AppliedBranch {
  title: string;
  classes: AppliedClass[];
}

export const FeeItemDetail = () => {
  const router = useRouter();
  const params = useParams();
  const itemId = params?.id ? Number(params.id) : undefined;

  const { data: itemData, isLoading } = useGetFeeItemById(itemId);
  const { mutate: deleteFeeItem, isPending: isDeleting } = useDeleteFeeItem();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const itemName = itemData?.name ?? itemData?.feeName ?? `Fee Item #${itemId}`;
  const termLabel = itemData?.termLabel ?? itemData?.term ?? "—";
  const amount = itemData?.amount ?? 0;
  const quantity = itemData?.quantity ?? 1;

  const appliedBranches: AppliedBranch[] =
    itemData?.branches?.map((b: { branchName: string; classes: { className: string; type?: string; amount: number }[] }) => ({
      title: b.branchName,
      classes:
        b.classes?.map((c: { className: string; type?: string; amount: number }) => ({
          className: c.className,
          type: c.type ?? "Class",
          amount: c.amount,
        })) ?? [],
    })) ?? [];

  useBreadcrumb([
    { label: "Fees", url: "/staff/fees" },
    { label: "Fee Items", url: "/staff/fees?tab=Fee Items" },
    { label: itemName, url: "#" },
  ]);

  const handleDelete = () => {
    if (!itemId) return;
    deleteFeeItem(itemId, {
      onSuccess: () => {
        toast.success("Fee item deleted");
        setOpenDeleteModal(false);
        router.push("/staff/fees?tab=Fee Items");
      },
      onError: (err: unknown) => {
        const msg = (err as { message?: string })?.message ?? "Failed to delete fee item";
        toast.error(msg);
        setOpenDeleteModal(false);
      },
    });
  };

  return (
    <div className="flex items-center justify-center px-4 py-3 pb-8 md:px-8">
      {isLoading && <Skeleton className="bg-bg-input-soft h-100 w-full" />}

      {openDeleteModal && (
        <>
          <Modal
            open={openDeleteModal}
            setOpen={setOpenDeleteModal}
            title="Delete Fee Item?"
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
                Are you sure you want to permanently delete this fee item? This action cannot be undone.
              </div>
              <div className="bg-bg-basic-orange-subtle border-border-default flex items-center gap-3 rounded-md border px-3 py-2">
                <AlertFill fill="var(--color-bg-basic-orange-accent)" className="size-12" />
                <div className="text-text-subtle text-sm">
                  Deleting this fee item will remove it from the fee setup and it will no longer appear in new invoices. Once removed, this action
                  cannot be reversed automatically.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox />
                <div className="text-text-subtle text-sm">I understand that deleting this fee item is permanent and cannot be undone.</div>
              </div>
            </div>
          </Modal>
          <MobileDrawer title="Delete Fee Item?" open={openDeleteModal} setIsOpen={setOpenDeleteModal}>
            <div className="flex flex-col gap-4 px-3 py-4">
              <div className="text-text-subtle text-sm font-medium">
                Are you sure you want to permanently delete this fee item? This action cannot be undone.
              </div>
              <div className="bg-bg-basic-orange-subtle border-border-default flex items-center gap-3 rounded-md border px-3 py-2">
                <AlertFill fill="var(--color-bg-basic-orange-accent)" className="size-24" />
                <div className="text-text-subtle text-sm">
                  Deleting this fee item will remove it from the fee setup and it will no longer appear in new invoices. Once removed, this action
                  cannot be reversed automatically.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox />
                <div className="text-text-subtle text-sm">I understand that deleting this fee item is permanent and cannot be undone.</div>
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

      <div className="mx-auto flex w-full max-w-225 flex-col gap-6 md:gap-9">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-text-default text-xl font-semibold">{itemName}</div>
            <div className="flex items-center gap-1">
              <Button
                onClick={() => setOpenDeleteModal(true)}
                className="bg-bg-state-destructive! hover:bg-bg-state-destructive-hover! text-text-white-default h-8! w-auto rounded-md"
              >
                <DeleteBin fill="var(--color-icon-white-default)" /> Delete
              </Button>
              <Button className="border-border-default text-text-default h-8! border">
                <FileCopy fill="var(--color-icon-default-muted)" /> Duplicate
              </Button>
              <Button className="border-border-default text-text-default h-8! border">
                <Edit fill="var(--color-icon-default-muted)" /> Edit Fee
              </Button>
            </div>
          </div>

          {/* Summary grid */}
          <div className="border-border-default grid grid-cols-2 rounded-sm border md:grid-cols-4">
            <div className="border-border-default flex flex-col gap-4 border-r border-b p-3 py-4 md:border-b-0 md:p-6">
              <div className="text-text-muted text-xs font-medium">Status</div>
              <Badge className="bg-bg-badge-green text-bg-basic-green-strong border-border-default h-5 rounded-md text-xs font-medium">
                {itemData?.active === false ? "Inactive" : "Active"}
              </Badge>
            </div>
            <div className="border-border-default flex flex-col gap-4 border-r border-b p-3 py-4 md:border-b-0 md:p-6">
              <div className="text-text-muted text-xs font-medium">Term &amp; Session</div>
              <div className="text-text-default text-md font-medium">{termLabel}</div>
            </div>
            <div className="border-border-default flex flex-col gap-4 border-r p-3 py-4 md:p-6">
              <div className="text-text-muted text-xs font-medium">Amount</div>
              <div className="text-text-default text-md font-medium">₦{amount.toLocaleString()}</div>
            </div>
            <div className="flex flex-col gap-4 p-3 py-4 md:p-6">
              <div className="text-text-muted text-xs font-medium">Quantity</div>
              <div className="text-text-default text-md font-medium">{quantity}</div>
            </div>
          </div>
        </div>

        {/* Applied Branches */}
        {appliedBranches.length > 0 && (
          <div className="border-border-default flex w-full flex-col gap-6 rounded-sm border p-4 md:p-6">
            <div className="flex items-center gap-2">
              <School fill="var(--color-icon-default)" className="size-4" />
              <h2 className="text-text-default text-sm font-medium">Applied Branches ({appliedBranches.length})</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {appliedBranches.map(b => (
                <div key={b.title} className="bg-bg-muted flex items-center gap-2 rounded-sm px-3 py-2">
                  <School fill="var(--color-icon-default)" className="size-4" />
                  <h2 className="text-text-default text-sm font-medium">{b.title}</h2>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Applied Classes */}
        {appliedBranches.length > 0 && (
          <div className="border-border-default rounded-sm border p-4 md:p-6">
            <div className="mb-6 flex items-center gap-2">
              <GraduationCap fill="var(--color-icon-default)" className="size-4" />
              <h2 className="text-text-default text-sm font-medium">
                Applied Classes ({appliedBranches.reduce((acc, b) => acc + b.classes.length, 0)})
              </h2>
            </div>
            {appliedBranches.map(branch => (
              <div key={branch.title} className="mb-6">
                <div className="mb-4 flex items-center gap-2">
                  <School fill="var(--color-icon-default)" />
                  <h2 className="text-text-default text-sm font-medium">{branch.title}</h2>
                </div>
                <div className="flex flex-col gap-3">
                  {branch.classes.map(cls => (
                    <div key={cls.className} className="bg-bg-subtle flex w-full items-center justify-between rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <GraduationCap fill="var(--color-bg-basic-purple-strong)" className="size-4" />
                        <div className="text-text-default text-sm font-semibold">{cls.className}</div>
                        <Badge className="bg-bg-badge-default border-border-default text-text-subtle h-5! rounded-md border text-xs font-medium">
                          {cls.type}
                        </Badge>
                      </div>
                      <div className="text-text-default text-sm font-semibold">₦{cls.amount.toLocaleString()}</div>
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
