"use client";

import React, { useState } from "react";
import { EditInvoiceDetail } from "./EditInvoiceDetails/EditInvoiceDetail";
import { EditInvoiceItem } from "./EditInvoiceItems/EditInvoiceItem";
import { EditStatus } from "./EditInvoiceStatus";
import { EditInvoiceHeader } from "./EditInvoiceHeader";
import { Tabs } from "@/components/Tab";
import { Button } from "@/components/ui/button";

export const EditInvoice = () => {
  const [openPreview, setOpenPreview] = useState(false);
  return (
    <div className="">
      <EditInvoiceHeader openPreview={openPreview} onPreviewToggle={setOpenPreview} />
      <div className="border-border-default mx-4 hidden h-fit flex-col gap-6 rounded-md border p-6 md:mx-8 md:flex">
        <EditInvoiceDetail />
        <EditInvoiceItem />
        <EditStatus />
      </div>

      <div className="mx-4 flex flex-col justify-between gap-2 md:hidden">
        <div className="">
          <Tabs
            items={[
              {
                label: "Details",
                content: (
                  <div className="mt-4">
                    <EditInvoiceDetail />
                  </div>
                ),
              },
              {
                label: "Invoice Items",
                content: (
                  <div className="mt-4">
                    <EditInvoiceItem />{" "}
                  </div>
                ),
              },
              {
                label: "Payment",
                content: (
                  <div className="mt-4">
                    <EditStatus />
                  </div>
                ),
              },
            ]}
            className="max-w-full"
          />
        </div>
        <div className="border-border-default bg-bg-default absolute right-0 bottom-0 left-0 z-20 flex w-full justify-between gap-2 border-t p-2">
          <Button className="bg-bg-state-soft! text-text-subtle h-8! rounded-sm border-none px-2.5! py-1.5 text-sm">Cancel</Button>
          <Button className="text-text-white-default bg-bg-state-primary! h-8! border-none px-2.5! py-1.5 text-sm">Save Changes</Button>
        </div>
      </div>
    </div>
  );
};
