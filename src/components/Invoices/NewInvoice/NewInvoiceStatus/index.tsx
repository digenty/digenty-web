import React from "react";
import { Paid } from "./Paid";
import { UnPaid } from "./UnPaid";
import { Tabs } from "@/components/Tab";
import { PartiallyPaid } from "./PartiallyPaid";

export const NewInvoiceStatus = () => {
  return (
    <div className=" ">
      <div className="text-text-default mb-4 text-lg font-semibold">Payment Status</div>
      <Tabs
        items={[
          { label: "Unpaid", content: <UnPaid /> },
          { label: "Paid", content: <Paid /> },
          { label: "Partially Paid", content: <PartiallyPaid /> },
        ]}
        className="max-w-80"
      />
    </div>
  );
};
