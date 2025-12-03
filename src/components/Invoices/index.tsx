import React from "react";
import { OverviewCard } from "../OverviewCard";
import Approve from "../Icons/Approve";
import AlertFill from "../Icons/AlertFill";

import FileList3Fill from "../Icons/FileList3Fill";
import { InvoiceOverviewTable } from "./InvoiceOverviewTable";
import { InvoicesHeader } from "./InvoicesHeader";
import { InvoiceSearchAndExport } from "./InvoiceSearchAndExport";

export const Invoices = () => {
  return (
    <div>
      <div className="space-y-6 px-4 pt-4 pb-8 md:space-y-7.5 md:px-8 md:pt-6 md:pb-12">
        <InvoicesHeader />
        <div className="grid w-full grid-cols-2 gap-3 lg:grid-cols-3">
          <div>
            <OverviewCard
              title="Total Issued"
              Icon={() => (
                <div className="bg-bg-basic-teal-subtle border-bg-basic-teal-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
                  <FileList3Fill fill="var(--color-icon-default)" />
                </div>
              )}
              value="₦200,280"
            />
          </div>

          <div>
            <OverviewCard
              title="Total Paid "
              Icon={() => (
                <div className="bg-bg-basic-sky-subtle border-bg-basic-sky-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
                  <Approve fill="var(--color-icon-default)" />
                </div>
              )}
              value="50,000"
            />
          </div>

          <div className="col-span-2 lg:col-span-1">
            <OverviewCard
              title="Outstanding Fees"
              Icon={() => (
                <div className="bg-bg-basic-yellow-subtle border-bg-basic-yellow-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
                  <AlertFill fill="var(--color-icon-default)" />
                </div>
              )}
              value="50,000"
            />
          </div>
        </div>
        <InvoiceSearchAndExport />
        <InvoiceOverviewTable />
      </div>
    </div>
  );
};
