import { Suspense } from "react";
import { SubscriptionVerify } from "@/components/AllSettings/SubscriptionsSettings/SubscriptionVerify";

const VerifyPage = () => {
  return (
    <div className="p-4 md:p-8">
      <Suspense fallback={null}>
        <SubscriptionVerify />
      </Suspense>
    </div>
  );
};

export default VerifyPage;
