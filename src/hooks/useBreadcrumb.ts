"use client";
import { useBreadcrumbStore } from "@/store/breadcrumb";
import { useEffect } from "react";

export const useBreadcrumb = (newCrumb: { label: string; url: string }[]) => {
  const { setBreadcrumbs } = useBreadcrumbStore();
  // Serialized so the effect reacts to actual content changes (route params, async-loaded
  // labels) without re-firing on every render — `newCrumb` is a fresh array literal each call.
  const serializedCrumb = JSON.stringify(newCrumb);

  useEffect(() => {
    setBreadcrumbs(JSON.parse(serializedCrumb));
  }, [serializedCrumb, setBreadcrumbs]);
};
