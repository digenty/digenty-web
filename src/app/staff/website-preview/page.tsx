import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { WebsitePreviewPage } from "@/components/WebsiteCustomization/preview/WebsitePreviewPage";

export default function WebsitePreviewRoute() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Spinner className="size-16" />
        </div>
      }
    >
      <WebsitePreviewPage />
    </Suspense>
  );
}
