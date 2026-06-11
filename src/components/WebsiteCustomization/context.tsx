"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { defaultConfig } from "./defaults";
import { WebsiteConfig } from "./types";

type SectionKey = keyof WebsiteConfig;

interface WebsiteCustomizationContextValue {
  config: WebsiteConfig;
  /** Shallow-merge a patch into a top-level section. */
  patchSection: <K extends SectionKey>(key: K, patch: Partial<WebsiteConfig[K]>) => void;
  /** Replace a whole section (used for array updates). */
  setSection: <K extends SectionKey>(key: K, value: WebsiteConfig[K]) => void;
  reset: () => void;
}

const WebsiteCustomizationContext = createContext<WebsiteCustomizationContextValue | null>(null);

export const WebsiteCustomizationProvider = ({ children }: { children: React.ReactNode }) => {
  const [config, setConfig] = useState<WebsiteConfig>(defaultConfig);

  const patchSection = useCallback(<K extends SectionKey>(key: K, patch: Partial<WebsiteConfig[K]>) => {
    setConfig(current => ({ ...current, [key]: { ...current[key], ...patch } }));
  }, []);

  const setSection = useCallback(<K extends SectionKey>(key: K, value: WebsiteConfig[K]) => {
    setConfig(current => ({ ...current, [key]: value }));
  }, []);

  const reset = useCallback(() => setConfig(defaultConfig), []);

  const value = useMemo(() => ({ config, patchSection, setSection, reset }), [config, patchSection, setSection, reset]);

  return <WebsiteCustomizationContext.Provider value={value}>{children}</WebsiteCustomizationContext.Provider>;
};

export const useWebsiteCustomization = () => {
  const context = useContext(WebsiteCustomizationContext);
  if (!context) throw new Error("useWebsiteCustomization must be used within a WebsiteCustomizationProvider");
  return context;
};
