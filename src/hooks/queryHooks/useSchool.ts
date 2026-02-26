import { addSchool, getSchools, updateSchool } from "@/api/school";
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
