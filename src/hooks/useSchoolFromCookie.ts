"use client";
import { useEffect, useState } from "react";

type School = {
  id: number;
  name: string;
  logo?: string;
  [key: string]: unknown;
};

export const useSchoolFromCookie = (): School | null => {
  const [school, setSchool] = useState<School | null>(null);

  useEffect(() => {
    const match = document.cookie.split("; ").find(c => c.startsWith("school="));
    if (!match) return;
    try {
      setSchool(JSON.parse(decodeURIComponent(match.split("=")[1])));
    } catch {
      // ignore malformed cookie
    }
  }, []);

  return school;
};
