import { FeesIndex } from "@/components/Fees";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

export default function feesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Spinner className="size-16" />
        </div>
      }
    >
      <FeesIndex />
    </Suspense>
  );
}
