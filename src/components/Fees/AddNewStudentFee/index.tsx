"use client";

import DeleteBin from "@/components/Icons/DeleteBin";
import Edit from "@/components/Icons/Edit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
export const AddNewStudentFees = () => {
  const [items, setItems] = useState(ClassItems);

  const subtotal = items.reduce((acc, item) => acc + item.qty * item.amount, 0);

  return (
    <div className="mx-auto flex items-center justify-center">
      <div className="w-full px-4 py-3 md:w-1/2 md:px-8">
        <div className="mb-9 flex justify-between">
          <div className="text-text-default text-xl font-semibold">JSS 1</div>
          <div className="flex gap-2">
            <Button className="bg-bg-state-secondary! border-border-darker hover:bg-bg-state-secondary-hover! h-8! w-8! border shadow-sm!">
              <DeleteBin fill="var(--color-bg-state-destructive)" className="size-4" />
            </Button>
            <Button
              // onClick={() => route.push("/fees/add-fee-to-class")}
              className="bg-bg-state-secondary! border-border-darker text-text-default hover:bg-bg-state-secondary-hover! h-8! border font-medium shadow-sm!"
            >
              <Edit fill="var(--color-icon-default-muted)" />
            </Button>
          </div>
        </div>
        <div>
          <div className="flex flex-col gap-6">
            {items.map(itm => (
              <div className="border-border-default flex items-center justify-between rounded-md border px-6 py-4" key={itm.id}>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <div className="text-text-default">{itm.title}</div>
                    <Badge className="bg-bg-state-secondary! border-border-default text-text-default rounded-md border">{itm.qty}</Badge>
                  </div>
                  <Badge
                    className={`border-border-default rounded-md border text-xs font-medium ${itm.status === "Required" && "text-bg-basic-blue-strong bg-bg-badge-blue"} ${itm.status === "Optional" && "text-bg-basic-fuchsia-strong bg-bg-badge-fuchsia"}`}
                  >
                    {itm.status}
                  </Badge>
                </div>
                <div className="">
                  <div className="text-text-default">₦{itm.amount.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-border-default mt-6 flex items-center justify-between rounded-md border px-6 py-4">
            <div className="text-text-muted text-md font-semibold">Total</div>
            <div className="text-text-default text-sm font-medium"> ₦{subtotal.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
