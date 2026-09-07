import {
  getActiveParentPortalTerm,
  getParentPortalArms,
  getParentPortalBranches,
  getParentPortalClasses,
  getParentPortalTerms,
} from "@/api/parent-lookup";
import { parentLookupKeys } from "@/queries/parent-lookup";
import { useQuery } from "@tanstack/react-query";

export const useGetActiveParentPortalTerm = () => {
  return useQuery({
    queryKey: parentLookupKeys.activeTerm(),
    queryFn: getActiveParentPortalTerm,
    retry: false,
  });
};

export const useGetParentPortalTerms = (academicSessionId?: number) => {
  return useQuery({
    queryKey: parentLookupKeys.terms(academicSessionId),
    queryFn: () => getParentPortalTerms(academicSessionId!),
    enabled: !!academicSessionId,
    retry: false,
  });
};

export const useGetParentPortalBranches = (schoolId?: number) => {
  return useQuery({
    queryKey: parentLookupKeys.branches(schoolId),
    queryFn: () => getParentPortalBranches(schoolId!),
    enabled: !!schoolId,
    retry: false,
  });
};

export const useGetParentPortalClasses = (schoolId?: number, branchId?: number) => {
  return useQuery({
    queryKey: parentLookupKeys.classes(schoolId, branchId),
    queryFn: () => getParentPortalClasses(schoolId!, branchId),
    enabled: !!schoolId,
    retry: false,
  });
};

export const useGetParentPortalArms = (classId?: number) => {
  return useQuery({
    queryKey: parentLookupKeys.arms(classId),
    queryFn: () => getParentPortalArms(classId!),
    enabled: !!classId,
    retry: false,
  });
};
