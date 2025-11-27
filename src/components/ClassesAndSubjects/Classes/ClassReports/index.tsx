import React from "react";
import { ReportHeader } from "./ReportHeader";
import { ReportTable } from "./ReportTable";

const ClassReport = () => {
  return (
    <div>
      <ReportHeader />

      <div className="">
        <ReportTable />
      </div>
    </div>
  );
};

export default ClassReport;
