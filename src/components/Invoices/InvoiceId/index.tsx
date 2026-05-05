"use client";

import { useGetInvoiceDetail } from "@/hooks/queryHooks/useInvoice";
import { useParams } from "next/navigation";
import { InvoiceView } from "./InvoiceView";
import { InvoiceIdBreakDownTable, InvoiceIdPaymentHistoryTable } from "./InvoiceIdTable";
import { InvoicePaymentSummary } from "./InvoicePaymentSummary";
import { InvoiceIdHeader } from "./InvoiceIdHeader";
import { InvoiceDetailResponse } from "./invoiceIdTypes";
import { Tabs } from "../../Tabs";

export const InvoiceDetail = () => {
  const params = useParams();
  const invoiceId = params.id as string;

  const { data, isPending: loading } = useGetInvoiceDetail(invoiceId);
  const invoice = data as InvoiceDetailResponse | undefined;

  return (
    <div>
      {/* Desktop */}
      <div className="hidden flex-col px-4 py-4 md:flex md:px-8">
        <InvoiceIdHeader
          invoiceNumber={invoice?.invoiceNumber}
          invoiceId={invoice?.id}
          loading={loading}
        />
        <div className="mt-4.5 space-y-8">
          <InvoiceView invoice={invoice} loading={loading} />
          <div className="flex w-full flex-col gap-6 lg:flex-row lg:gap-4">
            <InvoiceIdBreakDownTable items={invoice?.items ?? []} loading={loading} />
            <InvoicePaymentSummary
              invoiceId={invoice?.id}
              totalAmount={invoice?.totalAmount}
              totalPaid={invoice?.totalPaid}
              outstandingBalance={invoice?.outstandingBalance}
              paymentProgress={invoice?.paymentProgress}
              loading={loading}
            />
          </div>
          <div>
            <InvoiceIdPaymentHistoryTable invoiceId={invoiceId} />
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="flex flex-col gap-8 px-4 py-4 md:hidden">
        <Tabs
          items={[
            {
              label: "Overview",
              content: (
                <div className="flex flex-col gap-6 md:gap-8">
                  <InvoiceIdHeader
                    invoiceNumber={invoice?.invoiceNumber}
                    invoiceId={invoice?.id}
                    loading={loading}
                  />
                  <InvoiceView invoice={invoice} loading={loading} />
                  <InvoicePaymentSummary
                    invoiceId={invoice?.id}
                    totalAmount={invoice?.totalAmount}
                    totalPaid={invoice?.totalPaid}
                    outstandingBalance={invoice?.outstandingBalance}
                    paymentProgress={invoice?.paymentProgress}
                    loading={loading}
                  />
                </div>
              ),
            },
            {
              label: "Breakdown",
              content: <InvoiceIdBreakDownTable items={invoice?.items ?? []} loading={loading} />,
            },
            {
              label: "History",
              content: <InvoiceIdPaymentHistoryTable invoiceId={invoiceId} />,
            },
          ]}
        />
      </div>
    </div>
  );
};
