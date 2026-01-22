import DeleteBin from "@/components/Icons/DeleteBin";
import Edit from "@/components/Icons/Edit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

export const StockDetailHeader = () => {
  return (
    <div className="border-border-default flex w-full flex-col gap-3 rounded-md border p-3 md:flex-row md:items-center md:justify-between md:p-6">
      <div className="flex items-center gap-2">
        <Image src="/images/image.png" alt="stock image" width={64} height={64} />
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <div className="text-text-default text-lg font-semibold">Textbook</div>
            <Badge className="bg-bg-badge-lime text-bg-basic-lime-strong border-border-default rounded-md border font-medium">SS 3 Items</Badge>
          </div>
          <div className="text-text-subtle text-sm">Please buy</div>
        </div>
      </div>

      <div className="border-border-default flex items-center gap-3 border-t pt-4 md:border-none md:p-0">
        <Button className="border-border-darker bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! h-8! rounded-md border">
          <DeleteBin fill="var(--color-icon-destructive)" />
        </Button>
        <Button className="border-border-darker text-text-default bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! h-8! rounded-md border text-sm font-medium">
          <Edit fill="var(--color-icon-default)" /> Edit Stock
        </Button>
      </div>
    </div>
  );
};
