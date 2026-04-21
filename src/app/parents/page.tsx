import { Parents } from "@/components/Parents";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

export default function ParentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Spinner className="size-16" />
        </div>
      }
    >
      <Parents />
    </Suspense>
  );
}
