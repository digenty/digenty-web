import React from "react";
import { InvoiceView } from "./InvoiceView";
import { InvoiceIdBreakDownTable, InvoiceIdPaymentHistoryTable } from "./InvoiceIdTable";
import { InvoicePaymentSummary } from "./InvoicePaymentSummary";
import { InvoiceIdHeader } from "./InvoiceIdHeader";
import { Tabs } from "../Tabs";

export const InvoiceDetail = () => {
  return (
    <div>
      <div className="hidden flex-col gap-8 px-4 py-4 md:flex md:px-8">
        <InvoiceIdHeader />
        <InvoiceView />
        <div className="flex w-full flex-col gap-6 lg:flex-row lg:gap-12">
          <InvoiceIdBreakDownTable />
          <InvoicePaymentSummary />
        </div>
        <div>
          <InvoiceIdPaymentHistoryTable />
        </div>
      </div>

      <div className="flex flex-col gap-8 px-4 py-4 md:hidden">
        <Tabs
          items={[
            {
              label: "Overview",
              content: (
                <div className="flex flex-col gap-4">
                  <InvoiceIdHeader />
                  <InvoiceView />
                  <InvoicePaymentSummary />
                </div>
              ),
            },
            { label: "Breakdown", content: <InvoiceIdBreakDownTable /> },
            { label: "History", content: <InvoiceIdPaymentHistoryTable /> },
          ]}
        />
      </div>
    </div>
  );
};
