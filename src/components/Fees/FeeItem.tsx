import { EmptyFeeState } from "./EmptyFeeState";

export const FeeItem = () => {
  return (
    <EmptyFeeState
      title="No Fees Created"
      description="Add fees here to start managing tuition, exams, levies, or other charges for your classes."
      buttonText="Add First Fee"
    />
  );
};
