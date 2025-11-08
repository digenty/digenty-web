import { Dashboard } from "@/components/Dashboard";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <div className="">
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Spinner className="size-16" />
          </div>
        }
      >
        <Dashboard />
      </Suspense>
    </div>
  );
}
