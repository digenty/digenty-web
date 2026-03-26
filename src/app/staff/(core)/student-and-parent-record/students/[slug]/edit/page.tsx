import { EditStudent } from "@/components/StudentAndParent/StudentMutation/EditStudent";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Spinner className="size-16" />
        </div>
      }
    >
      <EditStudent />
    </Suspense>
  );
}
