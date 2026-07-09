import { Suspense } from "react";
import { PaymentVerify } from "@/components/ParentPortalComponents/ParentFees/PaymentVerify";
import { Spinner } from "@/components/ui/spinner";

const PaymentVerifyPage = () => {
  return (
    <div className="p-4 md:p-8">
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Spinner className="size-16" />
          </div>
        }
      >
        <PaymentVerify />
      </Suspense>
    </div>
  );
};

export default PaymentVerifyPage;
