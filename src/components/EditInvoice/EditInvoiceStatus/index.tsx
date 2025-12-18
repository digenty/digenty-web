"use client";

import { Paid } from "@/components/NewInvoice/NewInvoiceStatus/Paid";
import { PartiallyPaid } from "@/components/NewInvoice/NewInvoiceStatus/PartiallyPaid";
import { UnPaid } from "@/components/NewInvoice/NewInvoiceStatus/UnPaid";
import { Tabs } from "@/components/Tab";
import React from "react";

export const EditStatus = () => {
  return (
    <div>
      <div className="text-text-default mb-4 text-lg font-semibold">Payment Status</div>
      <Tabs
        items={[
          { label: "UnPaid", content: <UnPaid /> },
          { label: "Paid", content: <Paid /> },
          { label: "Partially Paid", content: <PartiallyPaid /> },
        ]}
      />
    </div>
  );
};
