"use client";
import { getSchoolFromCookie } from "@/app/actions/school";
import { useEffect, useState } from "react";

type School = {
  id: number;
  name: string;
  logo: string;
  motto: string;
  country: string;
  currency: string;
  timezone: string;
  subdomain: string;
  customDomain: string;
};

export const useSchoolFromCookie = () => {
  const [school, setSchool] = useState<School | null>(null);
  useEffect(() => {
    getSchoolFromCookie().then(setSchool);
  }, []);

  return school;
};
