import { MidtermReport } from "@/api/types";
import { format } from "date-fns";

const formatDate = (value?: string | null) => {
  if (!value) return "--";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : format(date, "d MMMM, yyyy");
};

// Shared by the staff preview and the parent portal. Rules from the API contract: a CA without a score is
// blank (never 0), and a subject with scoresEntered: false reads "Not entered" across its total columns.
export const MidtermReportView = ({ report }: { report: MidtermReport }) => {
  const assessmentHeaders = report.subjectReports[0]?.assessments.map(a => ({ id: a.assessmentId, name: a.assessmentName, weight: a.weight })) ?? [];

  return (
    <div className="border-t-bg-basic-cyan-contrast border-x-border-default border-b-border-default mb-10 border-x border-t-2 border-b">
      <div className="flex flex-col items-center justify-center py-3">
        <h1 className="text-bg-basic-cyan-contrast text-xl font-semibold">{report.schoolName}</h1>
        <p className="text-text-muted text-sm font-normal capitalize">
          {report.sessionName} {report.termName?.toLowerCase()} · Mid-term report
        </p>
      </div>

      <div className="border-border-default text-text-default flex flex-wrap justify-between gap-2 border-y px-4 py-2.5 text-sm font-normal">
        <span>
          Name: <span className="font-medium">{report.studentName}</span>
        </span>
        <span>
          Class: <span className="font-medium">{report.className}</span>
        </span>
        <span>
          As of: <span className="font-medium">{formatDate(report.asOf)}</span>
        </span>
      </div>

      <div className="flex flex-col gap-5 px-4 py-5">
        <div className="w-full space-y-2">
          <h3 className="text-bg-basic-red-accent text-sm font-semibold">ATTENDANCE</h3>
          <div className="text-text-subtle border-border-default border text-xs font-medium md:text-sm">
            <div className="border-border-default flex justify-between border-b px-2">
              <div className="flex-1 py-2">Sessions Held:</div>
              <div className="border-border-default w-1/4 border-l py-2 pl-2 text-center">{report.totalSessions}</div>
            </div>
            <div className="border-border-default flex justify-between border-b px-2">
              <div className="flex-1 py-2">Sessions Present:</div>
              <div className="border-border-default w-1/4 border-l py-2 pl-2 text-center">{report.sessionsPresent}</div>
            </div>
            <div className="flex justify-between px-2">
              <div className="flex-1 py-2">Sessions Absent:</div>
              <div className="border-border-default w-1/4 border-l py-2 pl-2 text-center">{report.sessionsAbsent}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-bg-subtle border-border-default flex flex-col border-t p-4">
        <h3 className="text-bg-basic-cyan-contrast text-center text-xs font-semibold md:text-sm">MID-TERM ACADEMIC REPORT</h3>

        {report.subjectReports.length === 0 ? (
          <p className="text-text-muted my-10 text-center text-sm">No subjects to show for this mid-term yet.</p>
        ) : (
          <div className="mt-3 w-full overflow-x-auto">
            <table className="border-border-default bg-bg-card w-full border text-xs md:text-sm">
              <thead>
                <tr className="text-text-muted border-border-default border-b">
                  <th className="border-border-default border-r px-2 py-2 text-left font-medium">Subject</th>
                  {assessmentHeaders.map(header => (
                    <th key={header.id} className="border-border-default border-r px-2 py-2 text-center font-medium">
                      {header.name} <span className="text-text-muted font-normal">({header.weight})</span>
                    </th>
                  ))}
                  <th className="border-border-default border-r px-2 py-2 text-center font-medium">Total</th>
                  <th className="border-border-default border-r px-2 py-2 text-center font-medium">%</th>
                  <th className="border-border-default border-r px-2 py-2 text-center font-medium">Grade</th>
                  <th className="px-2 py-2 text-center font-medium">Remark</th>
                </tr>
              </thead>
              <tbody className="text-text-default">
                {report.subjectReports.map(subject => (
                  <tr key={subject.subjectId} className="border-border-default border-b last:border-b-0">
                    <td className="border-border-default border-r px-2 py-2 capitalize">{subject.subjectName?.toLowerCase()}</td>
                    {assessmentHeaders.map(header => {
                      const score = subject.assessments.find(a => a.assessmentId === header.id)?.score;
                      return (
                        <td key={header.id} className="border-border-default border-r px-2 py-2 text-center">
                          {score ?? ""}
                        </td>
                      );
                    })}
                    {subject.scoresEntered ? (
                      <>
                        <td className="border-border-default border-r px-2 py-2 text-center">
                          {subject.subtotal ?? ""}/{subject.maxScore}
                        </td>
                        <td className="border-border-default border-r px-2 py-2 text-center">
                          {subject.percentage != null ? `${subject.percentage}%` : ""}
                        </td>
                        <td className="border-border-default border-r px-2 py-2 text-center">{subject.grade ?? "-"}</td>
                        <td className="px-2 py-2 text-center">{subject.remark ?? "-"}</td>
                      </>
                    ) : (
                      <td colSpan={4} className="text-text-muted px-2 py-2 text-center italic">
                        Not entered
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="text-text-default flex flex-col gap-4 px-4 py-5 text-sm font-normal">
        <div>
          <span>OVERALL PERCENTAGE:</span>{" "}
          <span className="font-medium">{report.overallPercentage != null ? `${Math.round(report.overallPercentage * 100) / 100}%` : "--"}</span>
        </div>
        <div className="flex flex-col gap-2.5 md:flex-row md:gap-1">
          <span className="text-text-subtle">Class Teacher&apos;s Mid-term Comment:</span>{" "}
          <span className="border-border-default inline-block min-w-[150px] flex-1 border-b">{report.classTeacherComment || "--"}</span>
        </div>
      </div>
    </div>
  );
};
