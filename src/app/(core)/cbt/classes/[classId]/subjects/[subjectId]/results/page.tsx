import Results from "@/components/CBT/Results";
import React from "react";

const ResultsPage = ({
  params,
}: Readonly<{
  params: Promise<{ classId: string; subjectId: string }>;
}>) => {
  return <Results params={params} />;
};

export default ResultsPage;
