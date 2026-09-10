import { Suspense } from "react";

import { ParentDiary } from "@/components/ParentPortalComponents/ParentDiary";
import { Spinner } from "@/components/ui/spinner";

const ParentDiaryPage = () => (
  <Suspense
    fallback={
      <div className="flex h-screen items-center justify-center">
        <Spinner className="size-16" />
      </div>
    }
  >
    <ParentDiary />
  </Suspense>
);

export default ParentDiaryPage;
