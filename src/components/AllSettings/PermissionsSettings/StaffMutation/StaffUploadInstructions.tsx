"use client";

import Link from "next/link";

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: "Required columns",
    body: "First Name, Last Name, Email and Role must be filled in on every row. The remaining columns are optional and may be left blank.",
  },
  {
    title: "Role",
    body: (
      <>
        Role must match the name of a role that already exists for your school, as listed under{" "}
        <Link href="/staff/settings/permissions?tab=roles-and-permissions" className="text-text-informative font-medium">
          Settings → Roles
        </Link>
        . Spelling is matched loosely (case, spaces and punctuation are ignored), but the role itself must exist — create it first if it does
        not.
        <br />
        <br />A staff member holds exactly one role. That role applies in every branch they are assigned to, and it is what determines their
        permissions. Editing the role later updates everyone who holds it.
      </>
    ),
  },
  {
    title: "Email and phone number",
    body: (
      <>
        Email is the staff member&apos;s login, so it must be unique across Digenty. A row whose email or phone number already belongs to an
        account is rejected — add that person from the Staff page instead.
        <br />
        <br />
        Phone numbers may be written as 08031234567 or +2348031234567. Keep these columns formatted as text so the leading zero is not lost.
      </>
    ),
  },
  {
    title: "Gender",
    body: "Male or Female (M and F are also accepted). Leave blank if unknown.",
  },
  {
    title: "Passwords",
    body: "Each new staff member is emailed their own generated password when the import is confirmed. Passwords are never shown in the app, so if the email does not arrive, ask them to use Forgot Password.",
  },
  {
    title: "Column headings",
    body: 'Do not rename the headings in row 1. Common variations are understood ("Phone" for "Phone Number", "Surname" for "Last Name"), but an unrecognised heading is ignored and its column is not imported. Column order does not matter.',
  },
];

export const StaffUploadInstructions = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center justify-center">
        <h3 className="text-text-default text-lg font-semibold">Bulk staff import</h3>
        <p className="text-text-subtle max-w-100 text-center text-xs">Read this before you upload.</p>
      </div>

      <div className="border-border-darker w-full space-y-4 rounded-md border p-6">
        <p className="text-text-subtle text-sm">
          Fill in the &quot;Staff&quot; sheet, one staff member per row, then upload it. Delete the two example rows before uploading — they are
          only there to show the format.
        </p>
        <p className="text-text-subtle text-sm">
          The file is checked before anything is saved. You get a per-row report of any problems, and nothing is imported until you confirm.
        </p>
      </div>

      <div className="border-border-darker w-full rounded-md border">
        {SECTIONS.map(section => (
          <div key={section.title} className="border-border-default space-y-1.5 border-b p-6 last:border-0">
            <h4 className="text-text-default text-sm font-semibold">{section.title}</h4>
            <p className="text-text-subtle text-sm">{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
