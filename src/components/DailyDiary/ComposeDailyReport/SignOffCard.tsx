"use client";

import { Checkbox } from "@/components/ui/checkbox";

export type SignOffOptions = {
  requireAcknowledgement: boolean;
  requestComment: boolean;
  sendPushSms: boolean;
};

type Props = {
  value: SignOffOptions;
  onChange: (value: SignOffOptions) => void;
  teacherName: string;
  teacherRole: string;
  armName: string;
  /** When the school has set the response rule to "track opens only" the signature toggle is not offered. */
  signatureConfigurable?: boolean;
  disabled?: boolean;
};

const OPTIONS: { key: keyof SignOffOptions; title: string; description: string }[] = [
  {
    key: "requireAcknowledgement",
    title: "Require parent acknowledgement",
    description: "Parent must tap “Seen & signed” — this is the parent's signature.",
  },
  {
    key: "requestComment",
    title: "Ask for a parent comment",
    description: "Adds the “Parent's comments” box to the parent portal entry.",
  },
  {
    key: "sendPushSms",
    title: "Send push + SMS when published",
    description: "Uses the school's Communications credits.",
  },
];

/** Publishing is the teacher's signature — no scanned signature is stored. */
export const SignOffCard = ({ value, onChange, teacherName, teacherRole, armName, signatureConfigurable = true, disabled }: Props) => {
  const options = signatureConfigurable ? OPTIONS : OPTIONS.filter(option => option.key !== "requireAcknowledgement");

  return (
    <div className="border-border-default bg-bg-sidebar-subtle w-full rounded-lg border">
      <div className="flex flex-col gap-6 p-5 lg:flex-row lg:gap-8">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <p className="text-text-default text-sm leading-5 font-semibold">Teacher sign-off</p>
          <p className="text-text-muted max-w-130 text-xs leading-4">
            Publishing signs the report as {teacherName} ({teacherRole}
            {armName ? `, ${armName}` : ""}) and timestamps it. This replaces the teacher&apos;s signature column in the paper diary — no scanned
            signature is stored.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {options.map(option => (
            <label key={option.key} className="flex cursor-pointer items-start gap-2.5">
              <Checkbox
                checked={value[option.key]}
                onCheckedChange={checked => onChange({ ...value, [option.key]: checked === true })}
                disabled={disabled}
                className="mt-px"
              />
              <span className="flex flex-col gap-0.5">
                <span className="text-text-default text-[13px] leading-[18px] font-medium">{option.title}</span>
                <span className="text-text-muted text-xs leading-4">{option.description}</span>
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
