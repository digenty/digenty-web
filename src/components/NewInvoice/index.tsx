"use client";

import { useState } from "react";
import { NewInvoiceDetail } from "./NewInvoiceDetails/NewInvoiceDetail";
import { NewInvoiceHeader } from "./NewInvoiceHeader";
import { NewInvoiceItem } from "./NewInvoiceItems/NewInvoiceItem";
import { NewInvoiceStatus } from "./NewInvoiceStatus";
import { InvoicePreview } from "./NewInvoicePreview/InvoicePreview";
import { Button } from "../ui/button";
import { INVOICE_STEPS, useInvoiceStep } from "./step";
import { ArrRight } from "../Icons/ArrRight";

export const NewInvoice = () => {
  const [openPreview, setOpenPreview] = useState(false);
  const { step, goToStep } = useInvoiceStep();
  const stepIndex = INVOICE_STEPS.findIndex(s => s.key === step);

  return (
    <div>
      <NewInvoiceHeader openPreview={openPreview} onPreviewToggle={setOpenPreview} />
      <div className={`grid ${openPreview ? "grid-cols-2" : "grid-cols-1"}`}>
        <div className="border-border-default mx-4 hidden h-fit flex-col gap-6 rounded-md border p-6 md:mx-8 md:flex">
          <NewInvoiceDetail />
          <NewInvoiceItem />
          <NewInvoiceStatus />
        </div>

        {/* Mobile */}
        <div className="mx-4 flex flex-col justify-between gap-4 md:hidden">
          <div className="mb-20">
            {step === "details" && <NewInvoiceDetail />}
            {step === "items" && <NewInvoiceItem />}
            {step === "status" && <NewInvoiceStatus />}
          </div>

          <div className="border-border-default bg-bg-default absolute right-0 bottom-0 left-0 z-20 mt-4 flex w-full justify-between gap-2 border-t p-2">
            {stepIndex > 0 && (
              <Button
                variant="outline"
                className="bg-bg-state-soft! text-text-subtle h-8! rounded-sm border-none px-2.5! py-1.5 text-sm"
                onClick={() => goToStep(INVOICE_STEPS[stepIndex - 1].key)}
              >
                Back
              </Button>
            )}
            <div>
              {" "}
              {stepIndex == 0 && <Button className="bg-bg-state-soft! text-text-subtle h-8! border-none px-2.5! py-1.5 text-sm">Cancel</Button>}
            </div>

            <div className="flex flex-row items-center justify-between">
              {stepIndex < INVOICE_STEPS.length - 1 ? (
                <div className="flex items-center justify-between gap-2">
                  <Button
                    className="text-text-white-default bg-bg-state-primary! h-8! border-none px-2.5! py-1.5 text-sm"
                    onClick={() => goToStep(INVOICE_STEPS[stepIndex + 1].key)}
                  >
                    Next
                  </Button>
                </div>
              ) : (
                <Button className="text-text-white-default bg-bg-state-primary! h-8! border-none px-2.5! py-1.5 text-sm">
                  <ArrRight fill="var(--color-icon-white-default)" /> Send Invoice
                </Button>
              )}
            </div>
          </div>
        </div>
        {openPreview && <InvoicePreview onPreviewToggle={setOpenPreview} />}
      </div>
    </div>
  );
};
