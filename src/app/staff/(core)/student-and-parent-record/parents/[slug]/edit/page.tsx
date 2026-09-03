import { ManageAccessGate } from "@/components/StudentAndParent/ManageAccessGate";
import { EditParent } from "@/components/StudentAndParent/Parent/EditParent/EditParent";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

export default function Page() {
  return (
    <ManageAccessGate>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Spinner className="size-16" />
          </div>
        }
      >
        <EditParent />
      </Suspense>
    </ManageAccessGate>
  );
}
