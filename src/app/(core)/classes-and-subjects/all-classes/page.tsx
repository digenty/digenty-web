import { AllClassesMain } from "@/components/ClassesAndSubjects/Classes/AllClasses";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

const page = () => {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Spinner className="size-16" />
        </div>
      }
    >
      <AllClassesMain />
    </Suspense>
  );
};

export default page;
