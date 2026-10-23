import { CorsImage } from "../CorsImage";

type Signer = { label: string; name?: string | null; signature?: string | null };

// Class teacher and principal/admin signatures at the foot of a report card. Renders nothing until the API sends at least one signature.
export const ReportSignatures = ({ signers }: { signers: Signer[] }) => {
  if (!signers.some(s => s.signature)) return null;

  return (
    <div className="flex flex-wrap justify-between gap-6 px-4 pb-5">
      {signers.map(({ label, name, signature }) => (
        <div key={label} className="flex min-w-40 flex-1 flex-col items-center gap-1">
          <div className="border-border-default flex h-16 w-full items-end justify-center border-b">
            {signature && <CorsImage src={signature} alt={`${label} signature`} className="max-h-16 object-contain" />}
          </div>
          {name && <span className="text-text-default text-sm font-medium">{name}</span>}
          <span className="text-text-subtle text-xs">{label}</span>
        </div>
      ))}
    </div>
  );
};
