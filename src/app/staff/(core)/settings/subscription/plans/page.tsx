import { PlansView } from "@/components/AllSettings/SubscriptionsSettings/PlansView";
import { SubscriptionBackLink } from "@/components/AllSettings/SubscriptionsSettings/SubscriptionBackLink";

const PlansPage = () => {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <SubscriptionBackLink href="/staff/settings/subscription" />
      <PlansView />
    </div>
  );
};

export default PlansPage;
