import { AddExpense } from "@/components/Expenses/AddExpense";
import { Spinner } from "@/components/ui/spinner";
import React, { Suspense } from "react";

const AddExpensePage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Spinner className="size-16" />
        </div>
      }
    >
      <AddExpense />
    </Suspense>
  );
};

export default AddExpensePage;
