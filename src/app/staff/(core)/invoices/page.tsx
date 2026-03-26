import { Invoices } from "@/components/Invoices";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

export default function InvoicesPage() {
  return (
    <div>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Spinner className="size-16" />
          </div>
        }
      >
        <Invoices />
      </Suspense>
    </div>
  );
}
