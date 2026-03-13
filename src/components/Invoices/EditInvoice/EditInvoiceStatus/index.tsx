"use client";

import { Paid } from "@/components/Invoices/NewInvoice/NewInvoiceStatus/Paid";
import { PartiallyPaid } from "@/components/Invoices/NewInvoice/NewInvoiceStatus/PartiallyPaid";
import { UnPaid } from "@/components/Invoices/NewInvoice/NewInvoiceStatus/UnPaid";
import { Tabs } from "@/components/Tabs";
import React from "react";

export const EditStatus = () => {
  return (
    <div>
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
