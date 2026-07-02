import {
  addSchool,
  createSubdomain,
  getSchoolDetails,
  getSchools,
  getSubdomain,
  updateSchool,
  updateSubdomain,
  getOnboardingProgress,
} from "@/api/school";
import { schoolsKey } from "@/queries/school";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useGetSubdomain = () => {
  return useQuery({
    queryKey: schoolsKey.getSubdomain,
    queryFn: getSubdomain,
  });
};

export const useCreateSubdomain = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: schoolsKey.createSubdomain,
    mutationFn: createSubdomain,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: schoolsKey.getSchoolDetails });
      queryClient.invalidateQueries({ queryKey: schoolsKey.getSubdomain });
    },
  });
};

export const useUpdateSubdomain = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: schoolsKey.updateSubdomain,
    mutationFn: updateSubdomain,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: schoolsKey.getSchoolDetails });
      queryClient.invalidateQueries({ queryKey: schoolsKey.getSubdomain });
    },
  });
};
