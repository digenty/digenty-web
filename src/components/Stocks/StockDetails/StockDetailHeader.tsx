"use client";

import { DeleteBin, Edit } from "@digenty/icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Modal } from "@/components/Modal";
import { toast } from "@/components/Toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useDeleteStock } from "@/hooks/queryHooks/useStock";

import { StockDetailResponse } from "./type";

type Props = {
  stock?: StockDetailResponse | null;
};

export const StockDetailHeader = ({ stock }: Props) => {
  const router = useRouter();
  const { mutate: deleteStock, isPending: deleting } = useDeleteStock();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const name = stock?.name ?? stock?.itemName ?? "Stock";
  const description = stock?.description ?? "";
  const categoryName = stock?.category?.name ?? stock?.categoryName ?? "";
  const image = stock?.imagePath ?? stock?.image ?? "/staff/images/image.png";

  const handleDelete = () => {
    if (!stock?.id) return;
    deleteStock(stock.id, {
      onSuccess: () => {
        toast({ title: "Stock deleted", type: "success" });
        router.push("/staff/stock");
      },
      onError: (error: unknown) => {
        const message = (error as { message?: string } | null)?.message ?? "Could not delete stock";
        toast({ title: message, type: "error" });
      },
    });
  };

  return (
    <>
      {confirmDelete && (
        <Modal
          open={confirmDelete}
          setOpen={setConfirmDelete}
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
              Are you sure you want to permanently delete <span className="text-text-default font-medium">{name}</span>? This action cannot be undone.
            </p>
          </div>
        </Modal>
      )}

      <div className="border-border-default flex w-full flex-col gap-3 rounded-md border p-3 md:flex-row md:items-center md:justify-between md:p-6">
        <div className="flex items-center gap-2">
          <Image src={image} alt="stock image" width={64} height={64} className="rounded-md object-cover" />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <div className="text-text-default text-lg font-semibold">{name}</div>
              {categoryName && (
                <Badge className="bg-bg-badge-lime text-bg-basic-lime-strong border-border-default rounded-md border font-medium">{categoryName}</Badge>
              )}
            </div>
            {description && <div className="text-text-subtle text-sm">{description}</div>}
          </div>
        </div>

        <div className="border-border-default flex items-center gap-3 border-t pt-4 md:border-none md:p-0">
          <Button
            onClick={() => setConfirmDelete(true)}
            className="border-border-darker bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! h-8! rounded-md border"
          >
            <DeleteBin fill="var(--color-icon-destructive)" />
          </Button>
          <Button
            onClick={() => stock?.id && router.push(`/staff/stock/add-stock?id=${stock.id}`)}
            className="border-border-darker text-text-default bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! h-8! rounded-md border text-sm font-medium"
          >
            <Edit fill="var(--color-icon-default)" /> Edit Stock
          </Button>
        </div>
      </div>
    </>
  );
};
