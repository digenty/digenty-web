import { Communications } from "@/components/Communications";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

export default function CommunicationsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Spinner className="size-16" />
        </div>
      }
    >
      <Communications />
    </Suspense>
  );
}
