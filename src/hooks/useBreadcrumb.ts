"use client";
import { useBreadcrumbStore } from "@/store/breadcrumb";
import { useEffect } from "react";

export const useBreadcrumb = (newCrumb: { label: string; url: string }[]) => {
  const { setBreadcrumbs } = useBreadcrumbStore();

  useEffect(() => {
    setBreadcrumbs([...newCrumb]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setBreadcrumbs]);
};
