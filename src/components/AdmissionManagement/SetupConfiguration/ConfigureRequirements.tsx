"use client";

import { ClassConfigRequest, LevelConfigRequest, SubjectEntry } from "@/api/admission";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useGetClassConfig, useGetLevelConfig, useUpdateClassConfig, useUpdateLevelConfig } from "@/hooks/queryHooks/useAdmission";
import { AddFill, ArrowLeft, Bill, BookOpen, DeleteBin, FileList3, Settings4 } from "@digenty/icons";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  scope: "level" | "class";
  name: string;
  cycleId: number;
  levelId: number;
  classId?: number;
  branchId?: number;
}

interface ToggleRowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (val: boolean) => void;
}

interface ConfigFormValues {
  admitting: boolean;
  applicationFeeEnabled: boolean;
  applicationFeeAmount: number;
  examFeeEnabled: boolean;
  examFeeAmount: number;
  entranceExamEnabled: boolean;
  documents: string[];
  intakes: string;
}

const ToggleRow = ({ icon, title, description, checked, onCheckedChange }: ToggleRowProps) => (
  <div className="border-border-default flex items-center justify-between gap-4 rounded-xl border p-4">
    <div className="flex items-center gap-2.5">
      <span className="shrink-0">{icon}</span>
      <div className="flex flex-col gap-0.5">
        <p className="text-text-default text-sm font-semibold">{title}</p>
        <p className="text-text-muted text-xs font-normal">{description}</p>
      </div>
    </div>
    <Switch checked={checked} onCheckedChange={onCheckedChange} className="shrink-0" />
  </div>
);

export const ConfigureRequirements = ({ scope, name, cycleId, levelId, classId, branchId }: Props) => {
  const router = useRouter();
  const isLevel = scope === "level";
  const iconFill = "var(--color-icon-default-subtle)";

  const levelQuery = useGetLevelConfig(isLevel ? cycleId : undefined, isLevel ? levelId : undefined, branchId);
  const classQuery = useGetClassConfig(!isLevel ? cycleId : undefined, !isLevel ? levelId : undefined, classId, branchId);
  const { data: levelConfig, isPending: levelPending, isError: levelError, refetch: refetchLevel } = levelQuery;
  const { data: classConfig, isPending: classPending, isError: classError, refetch: refetchClass } = classQuery;

  const isPending = isLevel ? levelPending : classPending;
  const isError = isLevel ? levelError : classError;
  const refetch = isLevel ? refetchLevel : refetchClass;

  const preservedSubjects: SubjectEntry[] = (levelConfig?.entranceExam?.subjects ?? []).map(s => ({
    subjectId: s.subjectId,
    customName: s.customName,
    maxScore: s.maxScore,
  }));

  const { mutate: updateLevel, isPending: savingLevel } = useUpdateLevelConfig();
  const { mutate: updateClass, isPending: savingClass } = useUpdateClassConfig();
  const saving = savingLevel || savingClass;

  const [newDocument, setNewDocument] = useState("");
  const [isAddingDocument, setIsAddingDocument] = useState(false);

  const formik = useFormik<ConfigFormValues>({
    enableReinitialize: true,
    initialValues: {
      admitting: isLevel ? (levelConfig?.admitting ?? true) : (classConfig?.admitting ?? true),
      applicationFeeEnabled: isLevel ? (levelConfig?.applicationFee?.enabled ?? false) : (classConfig?.applicationFeeEnabled ?? false),
      applicationFeeAmount: isLevel ? (levelConfig?.applicationFee?.amount ?? 0) : (classConfig?.applicationFeeAmount ?? 0),
      examFeeEnabled: isLevel ? (levelConfig?.examFee?.enabled ?? false) : (classConfig?.examFeeEnabled ?? false),
      examFeeAmount: isLevel ? (levelConfig?.examFee?.amount ?? 0) : (classConfig?.examFeeAmount ?? 0),
      entranceExamEnabled: isLevel ? (levelConfig?.entranceExam?.enabled ?? false) : (classConfig?.entranceExamEnabled ?? false),
      documents: isLevel ? (levelConfig?.requiredDocuments ?? []).map(d => d.documentName) : [],
      intakes: String(isLevel ? (levelConfig?.intakesPerClass ?? "") : (classConfig?.intakesPerClass ?? "")),
    },
    onSubmit: values => {
      const intakesPerClass = values.intakes === "" ? undefined : Number(values.intakes);
      const shared = {
        admitting: values.admitting,
        applicationFee: { enabled: values.applicationFeeEnabled, amount: values.applicationFeeAmount },
        examFee: { enabled: values.examFeeEnabled, amount: values.examFeeAmount },
        entranceExam: { enabled: values.entranceExamEnabled, subjects: preservedSubjects },
        requiredDocuments: values.documents.map(documentName => ({ documentName })),
        intakesPerClass,
      };

      if (isLevel) {
        const payload: LevelConfigRequest = shared;
        updateLevel(
          { cycleId, levelId, payload, branchId },
          {
            onSuccess: () => {
              toast.success("Level requirements saved");
              router.back();
            },
            onError: (error: unknown) => toast.error((error as { message?: string })?.message ?? "Failed to save requirements"),
          },
        );
      } else {
        const payload: ClassConfigRequest = { ...shared, usesLevelSettings: false };
        updateClass(
          { cycleId, levelId, classId: classId!, payload, branchId },
          {
            onSuccess: () => {
              toast.success("Class requirements saved");
              router.back();
            },
            onError: (error: unknown) => toast.error((error as { message?: string })?.message ?? "Failed to save requirements"),
          },
        );
      }
    },
  });

  useEffect(() => {
    setNewDocument("");
    setIsAddingDocument(false);
  }, [levelConfig, classConfig]);

  const addDocument = () => {
    const value = newDocument.trim();
    if (!value) return;
    formik.setFieldValue("documents", [...formik.values.documents, value]);
    setNewDocument("");
    setIsAddingDocument(false);
  };

  const removeDocument = (index: number) => {
    formik.setFieldValue(
      "documents",
      formik.values.documents.filter((_, i) => i !== index),
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => router.back()}
            className="border-border-darker text-text-default bg-bg-state-secondary hover:bg-bg-state-secondary-hover! flex shrink-0 items-center gap-1.5 border text-sm font-medium transition-colors"
          >
            <ArrowLeft fill="var(--color-icon-default-subtle)" className="size-4 shrink-0" />
            Back
          </Button>
          <h2 className="text-text-default text-base font-semibold">Configure Requirements: {name}</h2>
        </div>

        {!isPending && !isError && (
          <Button
            onClick={() => formik.handleSubmit()}
            disabled={saving}
            className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Requirements"}
          </Button>
        )}
      </div>

      {isPending ? (
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="flex justify-center py-12">
          <ErrorComponent
            title="Couldn't load requirements"
            description="Something went wrong while fetching this configuration. Please try again."
            buttonText="Retry"
            onClick={() => refetch()}
          />
        </div>
      ) : (
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
          <ToggleRow
            icon={<span className="size-2 shrink-0" />}
            title={isLevel ? "Is this level admitting students this cycle?" : "Is this class admitting students this cycle?"}
            description="Turn off if students will not be admitted in this cycle"
            checked={formik.values.admitting}
            onCheckedChange={val => formik.setFieldValue("admitting", val)}
          />

          <ToggleRow
            icon={<Bill fill={iconFill} className="size-4" />}
            title="Application Fee"
            description="Require application fee"
            checked={formik.values.applicationFeeEnabled}
            onCheckedChange={val => formik.setFieldValue("applicationFeeEnabled", val)}
          />

          <ToggleRow
            icon={<Bill fill={iconFill} className="size-4" />}
            title="Exam Fee"
            description="Require exam fee"
            checked={formik.values.examFeeEnabled}
            onCheckedChange={val => formik.setFieldValue("examFeeEnabled", val)}
          />

          <ToggleRow
            icon={<BookOpen fill={iconFill} className="size-4" />}
            title="Entrance Exam"
            description="Require entrance exam"
            checked={formik.values.entranceExamEnabled}
            onCheckedChange={val => formik.setFieldValue("entranceExamEnabled", val)}
          />

          {isLevel && (
            <div className="border-border-default flex flex-col gap-3 rounded-xl border p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <FileList3 fill={iconFill} className="size-4 shrink-0" />
                  <p className="text-text-default text-sm font-semibold">Required Documents</p>
                </div>
                <Button
                  onClick={() => setIsAddingDocument(true)}
                  className="border-border-darker text-text-default bg-bg-state-secondary hover:bg-bg-state-secondary-hover! flex h-7 shrink-0 items-center gap-1 border text-xs font-medium transition-colors"
                >
                  <AddFill fill="var(--color-icon-default-subtle)" className="size-3.5 shrink-0" />
                  Add Required Document
                </Button>
              </div>

              <div className="flex flex-col gap-2">
                {formik.values.documents.map((doc, index) => (
                  <div key={`${doc}-${index}`} className="bg-bg-input-soft flex items-center justify-between gap-3 rounded-lg px-3 py-2.5">
                    <span className="text-text-default text-sm">{doc}</span>
                    <button
                      type="button"
                      onClick={() => removeDocument(index)}
                      className="text-text-muted hover:text-text-destructive shrink-0 cursor-pointer transition-colors"
                      aria-label={`Remove ${doc}`}
                    >
                      <DeleteBin fill="currentColor" className="size-4" />
                    </button>
                  </div>
                ))}

                {isAddingDocument && (
                  <div className="flex items-center gap-2">
                    <Input
                      autoFocus
                      value={newDocument}
                      onChange={e => setNewDocument(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter") addDocument();
                        if (e.key === "Escape") {
                          setNewDocument("");
                          setIsAddingDocument(false);
                        }
                      }}
                      placeholder="e.g., Birth Certificate"
                      className="bg-bg-input-soft! border-none text-sm shadow-none"
                    />
                    <Button
                      onClick={addDocument}
                      className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-9 shrink-0 px-3 text-sm font-medium"
                    >
                      Add
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="border-border-default flex flex-col gap-3 rounded-xl border p-4">
            <div className="flex items-center gap-2.5">
              <Settings4 fill={iconFill} className="size-4 shrink-0" />
              <p className="text-text-default text-sm font-semibold">Other Settings</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-text-default text-sm font-medium">
                {isLevel ? "Number of Intakes Per Class" : "Number of Intakes For This Class"}
              </label>
              <Input
                type="number"
                min={0}
                value={formik.values.intakes}
                onChange={e => formik.setFieldValue("intakes", e.target.value)}
                placeholder="Input number of intakes per class"
                className="bg-bg-input-soft! border-none text-sm shadow-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
