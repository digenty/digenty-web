import { getParentPortalArms, getParentPortalBranches, getParentPortalClasses, getParentPortalTerms } from "@/api/parent-lookup";
import { parentLookupKeys } from "@/queries/parent-lookup";
import { useQuery } from "@tanstack/react-query";

export const useGetParentPortalTerms = (schoolId?: number, academicSessionId?: number) => {
  return useQuery({
    queryKey: parentLookupKeys.terms(schoolId, academicSessionId),
    queryFn: () => getParentPortalTerms(schoolId!, academicSessionId),
    enabled: !!schoolId,
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
