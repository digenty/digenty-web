import { AddStudentsForm } from "@/components/AllSettings/SubscriptionsSettings/AddStudentsForm";
import { SubscriptionBackLink } from "@/components/AllSettings/SubscriptionsSettings/SubscriptionBackLink";

const AddStudentsPage = () => {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <SubscriptionBackLink href="/staff/settings/subscription" />
      <AddStudentsForm />
    </div>
  );
};

export default AddStudentsPage;
