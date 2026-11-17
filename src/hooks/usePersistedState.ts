"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Reads a value saved in sessionStorage once the component is on the client (so SSR markup still matches),
 * and gives back `loaded` so callers can wait before they start fetching with the restored value.
 * Session storage is per tab, so a filter is remembered on Back but never leaks to another tab.
 */
export const readPersisted = <T>(key: string): T | undefined => {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : undefined;
  } catch {
    return undefined;
  }
};

export const usePersistedLoad = <T>(key: string) => {
  const [state, setState] = useState<{ loaded: boolean; value?: T }>({ loaded: false });

  useEffect(() => {
    setState({ loaded: true, value: readPersisted<T>(key) });
  }, [key]);

  return state;
};

export const usePersistValue = (key: string, value: unknown) => {
  useEffect(() => {
    if (!key) return;
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage unavailable (private mode, quota): filters just won't be remembered
    }
  }, [key, value]);
};

export const useClearPersisted = (key: string) =>
  useCallback(() => {
    try {
      sessionStorage.removeItem(key);
    } catch {}
  }, [key]);
