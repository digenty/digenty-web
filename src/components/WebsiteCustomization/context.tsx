"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useFormik } from "formik";
import { toast } from "@/components/Toast";
import { useCreateWebsiteConfig, useGetWebsiteConfig, usePublishWebsite, useUpdateWebsiteConfig } from "@/hooks/queryHooks/useWebsite";
import { websiteCustomizationSchema } from "@/schema/website";
import { configToDto, dtoToConfig, WebsiteMeta } from "./mapping";
import { WebsiteConfig } from "./types";

type SectionKey = keyof WebsiteConfig;

interface WebsiteCustomizationContextValue {
  config: WebsiteConfig;
  patchSection: <K extends SectionKey>(key: K, patch: Partial<WebsiteConfig[K]>) => void;
  setSection: <K extends SectionKey>(key: K, value: WebsiteConfig[K]) => void;
  /** Returns the validation message for a dot-path field, but only after a save attempt. */
  fieldError: (path: string) => string | undefined;
  /** True when existing data is loaded from the server. */
  hasData: boolean;
  /** True when the user is actively editing (or creating). Inputs are disabled when false + hasData. */
  isEditing: boolean;
  /** Inputs should be disabled when viewing saved data without editing. */
  disabled: boolean;
  startEdit: () => void;
  cancelEdit: () => void;
  isLoading: boolean;
  isSaving: boolean;
  isPublishing: boolean;
  live: boolean;
  save: () => void;
  publish: () => void;
}

const WebsiteCustomizationContext = createContext<WebsiteCustomizationContextValue | null>(null);

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error && typeof error === "object") {
    const e = error as { message?: string; error?: string; detail?: string };
    return e.message || e.error || e.detail || fallback;
  }
  return fallback;
};

export const WebsiteCustomizationProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading } = useGetWebsiteConfig();
  const createMutation = useCreateWebsiteConfig();
  const updateMutation = useUpdateWebsiteConfig();
  const publishMutation = usePublishWebsite();

  const hasData = !!data?.id;

  // Start in edit/create mode by default; switch to view mode once existing data loads.
  const [isEditing, setIsEditing] = useState(true);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!isLoading && !initializedRef.current) {
      initializedRef.current = true;
      if (data?.id) setIsEditing(false);
    }
  }, [isLoading, data]);

  const disabled = hasData && !isEditing;

  // Keep the server-managed fields (id / live) so we can round-trip them on save.
  const metaRef = useRef<WebsiteMeta>({});
  useEffect(() => {
    metaRef.current = { id: data?.id, live: data?.live };
  }, [data]);

  const initialValues = useMemo(() => dtoToConfig(data), [data]);

  const formik = useFormik<WebsiteConfig>({
    initialValues,
    enableReinitialize: true,
    validationSchema: websiteCustomizationSchema,
    onSubmit: async values => {
      try {
        const dto = configToDto(values, metaRef.current);
        const saved = metaRef.current.id ? await updateMutation.mutateAsync(dto) : await createMutation.mutateAsync(dto);
        metaRef.current = { id: saved.id, live: saved.live };
        setIsEditing(false);
        toast({ title: "Saved", description: "Your website changes have been saved.", type: "success" });
      } catch (error) {
        toast({
          title: "Could not save",
          description: getErrorMessage(error, "Something went wrong while saving. Please try again."),
          type: "error",
        });
      }
    },
  });

  const { values, errors, setFieldValue, submitForm, submitCount, resetForm } = formik;

  const patchSection = <K extends SectionKey>(key: K, patch: Partial<WebsiteConfig[K]>) => {
    Object.entries(patch).forEach(([field, value]) => setFieldValue(`${key}.${field}`, value, false));
  };

  const setSection = <K extends SectionKey>(key: K, value: WebsiteConfig[K]) => {
    setFieldValue(key, value, false);
  };

  const fieldError = (path: string): string | undefined => {
    if (submitCount === 0) return undefined;
    const resolved = path
      .split(".")
      .reduce<unknown>((acc, key) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[key] : undefined), errors);
    return typeof resolved === "string" ? resolved : undefined;
  };

  const startEdit = () => setIsEditing(true);

  const cancelEdit = () => {
    setIsEditing(false);
    resetForm();
  };

  const publish = async () => {
    const next = !(metaRef.current.live ?? false);
    try {
      const saved = await publishMutation.mutateAsync(next);
      metaRef.current = { id: saved.id, live: saved.live };
      toast({
        title: next ? "Published" : "Unpublished",
        description: next ? "Your website is now live." : "Your website is no longer public.",
        type: "success",
      });
    } catch (error) {
      toast({ title: "Action failed", description: getErrorMessage(error, "Could not update publish status."), type: "error" });
    }
  };

  const value: WebsiteCustomizationContextValue = {
    config: values,
    patchSection,
    setSection,
    fieldError,
    hasData,
    isEditing,
    disabled,
    startEdit,
    cancelEdit,
    isLoading,
    isSaving: createMutation.isPending || updateMutation.isPending,
    isPublishing: publishMutation.isPending,
    live: data?.live ?? false,
    save: submitForm,
    publish,
  };

  return <WebsiteCustomizationContext.Provider value={value}>{children}</WebsiteCustomizationContext.Provider>;
};

export const useWebsiteCustomization = () => {
  const context = useContext(WebsiteCustomizationContext);
  if (!context) throw new Error("useWebsiteCustomization must be used within a WebsiteCustomizationProvider");
  return context;
};
