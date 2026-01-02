import { EmptyFeeState } from "./EmptyFeeState";

export const FeesGroup = () => {
  return (
    <EmptyFeeState
      title="No Fee Groups Yet"
      description="Create groups to organise related fees into bundles you can reuse when setting up invoices."
      buttonText="Add Fee Group"
    />
  );
};
