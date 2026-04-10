import { addSchool, getSchoolDetails, getSchools, updateSchool, getOnboardingProgress } from "@/api/school";
import { schoolsKey } from "@/queries/school";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAddSchool = () => {
  return useMutation({
    mutationKey: schoolsKey.addSchool,
    mutationFn: addSchool,
  });
};

export const usePutSchool = () => {
  return useMutation({
    mutationKey: schoolsKey.putSchool,
    mutationFn: updateSchool,
  });
};

export const useGetSchools = () => {
  return useQuery({
    queryKey: schoolsKey.getSchool,
    queryFn: getSchools,
  });
};

export const useGetSchoolDetails = () => {
  return useQuery({
    queryKey: schoolsKey.getSchoolDetails,
    queryFn: getSchoolDetails,
  });
};

export const useGetOnboardingProgress = () => {
  return useQuery({
    queryKey: schoolsKey.getOnboardingProgress,
    queryFn: getOnboardingProgress,
  });
};
