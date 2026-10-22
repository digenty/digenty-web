import { ReactNode } from "react";

// Shared header for the term and mid-term report cards: school logo pinned top-left, school name and subtitle centred.
// The logo comes straight from the report payload (`schoolLogo`).
export const ReportHeader = ({ schoolName, schoolLogo, children }: { schoolName: string; schoolLogo?: string | null; children: ReactNode }) => {
  return (
    <div className="relative flex flex-col items-center justify-center px-16 py-3">
      {schoolLogo && (
        // eslint-disable-next-line @next/next/no-img-element -- must be a plain <img> so html2canvas can capture it with useCORS
        <img src={schoolLogo} alt={schoolName} crossOrigin="anonymous" className="absolute top-3 left-4 size-12 rounded-xs object-contain" />
      )}
      <h1 className="text-bg-basic-cyan-contrast text-center text-xl font-semibold">{schoolName}</h1>
      {children}
    </div>
  );
};
