"use client";

import { ArrowLeft } from "@digenty/icons";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { DiarySettingsPayload, DiaryTemplate, ParentResponseRule, SnapshotFieldKey } from "@/api/diary";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useExportTermDiaryPdf, useGetDiarySettings, useUpdateDiarySettings } from "@/hooks/queryHooks/useDiary";
import { useGetTerms } from "@/hooks/queryHooks/useTerm";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { cn } from "@/lib/utils";
import { Term } from "@/api/types";

import { DiaryCard, DiaryCardHeader, DotBadge, getDiaryErrorMessage } from "../shared";

const RESPONSE_RULES: { value: ParentResponseRule; title: string; description: string }[] = [
  {
    value: "REQUIRE_SIGNATURE",
    title: "Require “Seen & signed”",
    description: "Parent must acknowledge each report. The class list shows who has not signed and staff can send a reminder.",
  },
  {
    value: "TRACK_OPENS_ONLY",
    title: "Track opens only",
    description: "No signature asked for. Staff still see who opened the report — for schools that do not want to chase parents.",
  },
];

const SettingRow = ({ title, description, control }: { title: string; description: string; control: React.ReactNode }) => (
  <div className="border-border-default flex flex-col gap-3 border-t px-4 py-3.5 sm:flex-row sm:items-center sm:gap-4">
    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
      <p className="text-text-default text-[13px] leading-[18px] font-medium">{title}</p>
      <p className="text-text-muted text-xs leading-4">{description}</p>
    </div>
    <div className="shrink-0">{control}</div>
  </div>
);

const SettingsSkeleton = () => (
  <div className="flex flex-col gap-5">
    {Array.from({ length: 4 }).map((_, index) => (
      <Skeleton key={index} className="bg-bg-input-soft h-52 w-full rounded-lg" />
    ))}
  </div>
);

export const DiarySettings = () => {
  const router = useRouter();
  const user = useLoggedInUser();
  const [editingTemplate, setEditingTemplate] = useState<DiaryTemplate["section"] | null>(null);

  const { data: settings, isPending, isError, error, refetch } = useGetDiarySettings();
  const { data: termsData } = useGetTerms(user.schoolId);
  const { mutate: update, isPending: saving } = useUpdateDiarySettings();
  const { mutate: exportTerm, isPending: exporting } = useExportTermDiaryPdf();

  const activeTerm: Term | undefined = (termsData?.data?.terms ?? []).find((term: Term) => term.isActiveTerm);
  const sessionName: string = termsData?.data?.academicSessionName ?? "";

  useBreadcrumb([
    { label: "Daily Diary", url: "/staff/daily-diary" },
    { label: "Report settings", url: "/staff/daily-diary/settings" },
  ]);

  // Every control saves on change — this is a settings page, not a form with a submit button.
  const patch = (payload: DiarySettingsPayload, successTitle = "Settings updated") =>
    update(payload, {
      onSuccess: () => toast({ title: successTitle, type: "success" }),
      onError: err => toast({ title: "Could not save settings", description: getDiaryErrorMessage(err), type: "error" }),
    });

  const patchTemplate = (section: DiaryTemplate["section"], changes: Partial<DiaryTemplate>) =>
    patch({ templates: [{ section, ...changes }] }, "Template updated");

  const toggleSnapshotField = (key: SnapshotFieldKey, enabled: boolean) => patch({ snapshotFields: [{ key, enabled }] }, "Snapshot fields updated");

  if (isPending) {
    return (
      <div className="px-4 pt-6 pb-10 md:px-8">
        <SettingsSkeleton />
      </div>
    );
  }

  if (isError || !settings) {
    return (
      <div className="px-4 py-10 md:px-8">
        <ErrorComponent
          title="We could not load diary settings"
          description={getDiaryErrorMessage(error)}
          buttonText="Try again"
          onClick={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="border-border-default bg-bg-default flex items-center gap-3 border-b px-4 py-3 md:px-8">
        <Button
          variant="outline"
          onClick={() => router.push("/staff/daily-diary")}
          className="border-border-darker text-text-default bg-bg-card h-8 shrink-0 gap-1.5 rounded-md"
        >
          <ArrowLeft fill="var(--color-icon-default)" className="size-4" />
          Back
        </Button>
        <h1 className="text-text-default truncate text-lg leading-7 font-semibold">Diary settings</h1>
      </div>

      <div className={cn("flex flex-col gap-5 px-4 pt-5 pb-10 md:px-8 md:pb-12", saving && "pointer-events-none opacity-70")}>
        <div className="border-border-green bg-bg-badge-green flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border px-4 py-3">
          <p className="text-text-default text-[13px] leading-[18px] font-medium">Daily Diary is included on Starter, Standard and Advanced</p>
          <span className="text-text-muted text-[13px]">•</span>
          <p className="text-text-muted text-[13px] leading-[18px]">
            Available to early years and primary classes. Switch it off for a section that does not use it.
          </p>
          <div className="hidden flex-1 lg:block" />
          <Switch
            checked={settings.moduleEnabled}
            onCheckedChange={checked => patch({ moduleEnabled: checked }, checked ? "Daily Diary switched on" : "Daily Diary switched off")}
            aria-label="Enable Daily Diary for this school"
          />
        </div>

        <DiaryCard>
          <DiaryCardHeader
            title="Template by school section"
            description="Daily Diary is for early years and primary. Each section gets the entry types that make sense for it."
          />
          <div className="flex flex-col gap-3 px-4 pb-4 md:flex-row">
            {settings.templates.map(template => {
              const isEditing = editingTemplate === template.section;
              return (
                <div key={template.section} className="border-border-default bg-bg-sidebar-subtle flex flex-1 flex-col gap-2.5 rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <p className="text-text-default text-[13px] leading-[18px] font-semibold">{template.label}</p>
                      <p className="text-text-muted text-xs leading-4">{template.description}</p>
                    </div>
                    <Switch
                      checked={template.enabled}
                      onCheckedChange={checked => patchTemplate(template.section, { enabled: checked })}
                      aria-label={`Enable the ${template.label} template`}
                    />
                  </div>

                  {isEditing ? (
                    <div className="flex flex-col gap-2 py-1">
                      {(
                        [
                          ["snapshotEnabled", "Daily snapshot"],
                          ["privateNoteEnabled", "Private pupil note"],
                          ["signatureRequired", "Signature required"],
                          ["weeklyReportEnabled", "Weekly report"],
                        ] as const
                      ).map(([key, label]) => (
                        <label key={key} className="flex cursor-pointer items-center gap-2.5">
                          <Checkbox
                            checked={template[key]}
                            onCheckedChange={checked => patchTemplate(template.section, { [key]: checked === true })}
                          />
                          <span className="text-text-default text-[13px] leading-[18px]">{label}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-text-muted text-xs leading-4">
                      {[
                        `Daily snapshot ${template.snapshotEnabled ? "on" : "off"}`,
                        `private pupil note ${template.privateNoteEnabled ? "on" : "off"}`,
                        template.signatureRequired ? "signature required" : "signature optional",
                        `weekly report ${template.weeklyReportEnabled ? "on" : "off"}`,
                      ].join(" · ")}
                    </p>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => setEditingTemplate(isEditing ? null : template.section)}
                    className="border-border-darker text-text-default bg-bg-card w-full rounded-md"
                  >
                    {isEditing ? "Done" : "Edit template"}
                  </Button>
                </div>
              );
            })}
          </div>
        </DiaryCard>

        <DiaryCard>
          <DiaryCardHeader
            title="Parent response"
            description="How parents close the loop. This is the digital replacement for the signature column."
          />
          {RESPONSE_RULES.map(rule => {
            const isActive = settings.parentResponseRule === rule.value;
            return (
              <button
                key={rule.value}
                type="button"
                onClick={() => patch({ parentResponseRule: rule.value }, "Parent response rule updated")}
                className="border-border-default hover:bg-bg-state-soft flex w-full items-start gap-3 border-t px-4 py-3.5 text-left transition-colors"
              >
                <span
                  className={cn(
                    "mt-0.5 size-4 shrink-0 rounded-full border",
                    isActive ? "border-bg-state-primary border-[5px]" : "border-border-darker bg-bg-card",
                  )}
                  aria-hidden
                />
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-text-default text-[13px] leading-[18px] font-medium">{rule.title}</span>
                  <span className="text-text-muted text-xs leading-4">{rule.description}</span>
                </span>
              </button>
            );
          })}

          <SettingRow
            title="Ask for a parent comment"
            description="Adds the “Parent's comments” box. Parents can always reply even when this is off."
            control={
              <Switch
                checked={settings.requestComment}
                onCheckedChange={checked => patch({ requestComment: checked })}
                aria-label="Ask for a parent comment"
              />
            }
          />
          <SettingRow
            title="Remind parents who have not signed"
            description="Sends one reminder the next morning. Uses Communications credits."
            control={
              <Switch
                checked={settings.remindUnsignedParents}
                onCheckedChange={checked => patch({ remindUnsignedParents: checked })}
                aria-label="Remind parents who have not signed"
              />
            }
          />
        </DiaryCard>

        <DiaryCard>
          <DiaryCardHeader
            title="Approvals"
            description="Set per school. Daily entries always publish immediately — only weekly reports can be gated."
          />
          <SettingRow
            title="Head teacher approval for weekly reports"
            description="When on, a weekly report goes to the approver before parents see it. When off, teachers publish directly."
            control={
              <Switch
                checked={settings.weeklyApprovalRequired}
                onCheckedChange={checked => patch({ weeklyApprovalRequired: checked })}
                aria-label="Head teacher approval for weekly reports"
              />
            }
          />
          <SettingRow
            title="Approver"
            description="Falls back to any user with the “Approve reports” permission if the named approver is away."
            control={
              <div className="flex items-center gap-2">
                <DotBadge
                  label={settings.approverName ? `${settings.approverName}${settings.approverRole ? ` · ${settings.approverRole}` : ""}` : "Not set"}
                  dot="bg-bg-basic-gray-accent"
                  className="bg-bg-card"
                />
                <Button
                  variant="outline"
                  onClick={() => router.push("/staff/settings/permissions")}
                  className="border-border-darker text-text-default bg-bg-card h-8 rounded-md"
                >
                  Change
                </Button>
              </div>
            }
          />
        </DiaryCard>

        <DiaryCard>
          <DiaryCardHeader title="Daily snapshot fields" description="Early years only. Turn off what your school does not record." />
          <div className="flex flex-wrap gap-x-5 gap-y-3 px-4 pb-4">
            {settings.snapshotFields.map(field => (
              <label key={field.key} className="flex cursor-pointer items-center gap-2">
                <Checkbox checked={field.enabled} onCheckedChange={checked => toggleSnapshotField(field.key, checked === true)} />
                <span className={cn("text-[13px] leading-[18px]", field.enabled ? "text-text-default font-medium" : "text-text-muted")}>
                  {field.label}
                </span>
              </label>
            ))}
          </div>
        </DiaryCard>

        <DiaryCard>
          <DiaryCardHeader title="Records and export" description="Reports are kept for the life of the pupil record." />
          <SettingRow
            title="Term-end PDF export"
            description="Compiles a term's daily and weekly reports into one PDF per pupil, including parent comments and signature timestamps."
            control={
              <Switch
                checked={settings.termPdfExportEnabled}
                onCheckedChange={checked => patch({ termPdfExportEnabled: checked })}
                aria-label="Term-end PDF export"
              />
            }
          />
          {settings.termPdfExportEnabled && (
            <SettingRow
              title="Export now"
              description="Generated in the background — you get a notification when the file is ready."
              control={
                <Button
                  variant="outline"
                  disabled={exporting || !activeTerm}
                  onClick={() =>
                    activeTerm &&
                    exportTerm(
                      { termId: activeTerm.termId },
                      {
                        onSuccess: () =>
                          toast({ title: "Export started", description: "You will be notified when the file is ready.", type: "info" }),
                        onError: err => toast({ title: "Could not start export", description: getDiaryErrorMessage(err), type: "error" }),
                      },
                    )
                  }
                  className="border-border-darker text-text-default bg-bg-card h-8 rounded-md"
                >
                  {exporting ? "Starting…" : activeTerm ? `Export ${sessionName} ${activeTerm.term.toLowerCase()} term` : "No active term"}
                </Button>
              }
            />
          )}
          <SettingRow
            title="Give parents their own download"
            description="Adds a “Download PDF” button to each report and a term archive in the parent portal."
            control={
              <Switch
                checked={settings.parentDownloadEnabled}
                onCheckedChange={checked => patch({ parentDownloadEnabled: checked })}
                aria-label="Give parents their own download"
              />
            }
          />
        </DiaryCard>
      </div>
    </div>
  );
};
