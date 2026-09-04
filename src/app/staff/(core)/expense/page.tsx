import { ExpensesMain } from "@/components/Expenses";
import { Spinner } from "@/components/ui/spinner";
import React, { Suspense } from "react";

const ExpensesPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Spinner className="size-16" />
        </div>
      }
    >
      <ExpensesMain />
    </Suspense>
  );
};

export default ExpensesPage;
