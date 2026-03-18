import { ViewScore } from "@/components/ClassesAndSubjects/Subjects/Score/ViewScores";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

const ViewScoresPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Spinner className="size-16" />
        </div>
      }
    >
      <ViewScore />
    </Suspense>
  );
};

export default ViewScoresPage;
