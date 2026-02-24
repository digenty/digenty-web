import { addStaff, getStaff } from "@/api/staff";
import { staffKeys } from "@/queries/staff";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetStaffs = () => {
  return useQuery({
    queryKey: staffKeys.staffs,
    queryFn: getStaff,
  });
};

export const useAddStaff = () => {
  return useMutation({
    mutationKey: staffKeys.addStaff,
    mutationFn: addStaff,
  });
};
