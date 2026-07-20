import { Bill, QuickReferenceAll } from "@digenty/icons";

// Note: the "Parent Portal - Fees" API does not expose a payment history endpoint yet
// (only fee overview, invoice, pay-data and record-payment). This surfaces an honest
// empty state instead of mock data until the backend adds one.
export const PaymentHistory = () => {
  return (
    <div>
      <div className="border-border-default flex flex-col rounded-xl border">
        <div className="text-text-default flex items-center gap-3 p-4 text-sm font-semibold">
          <Bill fill="var(--color-icon-default-muted)" /> Payment History
        </div>
        <div className="border-border-default flex flex-col items-center gap-2 border-t p-10 text-center">
          <QuickReferenceAll fill="var(--color-icon-default-muted)" />
          <p className="text-text-default text-sm font-medium">No payment history yet</p>
          <p className="text-text-muted text-xs">Payments you make for this student will show up here.</p>
        </div>
      </div>
    </div>
  );
};
