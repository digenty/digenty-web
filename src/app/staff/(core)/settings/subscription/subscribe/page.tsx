import { Suspense } from "react";
import { UpgradeOrSubscribeForm } from "@/components/AllSettings/SubscriptionsSettings/UpgradeOrSubscribeForm";
import { SubscriptionBackLink } from "@/components/AllSettings/SubscriptionsSettings/SubscriptionBackLink";

const SubscribePage = () => {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <SubscriptionBackLink href="/staff/settings/subscription/plans" />
      <Suspense fallback={null}>
        <UpgradeOrSubscribeForm />
      </Suspense>
    </div>
  );
};

export default SubscribePage;
