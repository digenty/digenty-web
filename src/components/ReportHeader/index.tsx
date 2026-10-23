import { ReactNode } from "react";
import { CorsImage } from "../CorsImage";

// Shared header for the term and mid-term report cards: school logo pinned top-left, school name and subtitle centred.
// The logo comes straight from the report payload (`schoolLogo`).
export const ReportHeader = ({ schoolName, schoolLogo, children }: { schoolName: string; schoolLogo?: string | null; children: ReactNode }) => {
  return (
    <div className="relative flex flex-col items-center justify-center px-24 py-3">
      {schoolLogo && (
        <CorsImage src={schoolLogo} alt={schoolName} className="absolute top-1/2 left-4 size-16 -translate-y-1/2 rounded-full object-cover" />
      )}
      <h1 className="text-bg-basic-cyan-contrast text-center text-xl font-semibold">{schoolName}</h1>
      {children}
    </div>
  );
};
