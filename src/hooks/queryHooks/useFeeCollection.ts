import {
  getAllBanks,
  getBankAccounts,
  getSetupStatus,
  setupFeeCollection,
  updateBankAccount,
  updateMode,
  UpdateBankAccountDto,
} from "@/api/fee-collection";
import { feeCollectionKeys } from "@/queries/fee-collection";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllBanks = () => {
  return useQuery({
    queryKey: feeCollectionKeys.allBanks,
    queryFn: getAllBanks,
    staleTime: 24 * 60 * 60 * 1000,
    retry: false,
  });
};

export const useGetFeeCollectionSetupStatus = () => {
  return useQuery({
    queryKey: feeCollectionKeys.setupStatus,
    queryFn: getSetupStatus,
    retry: false,
  });
};

export const useGetFeeCollectionBankAccounts = () => {
  return useQuery({
    queryKey: feeCollectionKeys.bankAccounts,
    queryFn: getBankAccounts,
    retry: false,
  });
};

export const useSetupFeeCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: feeCollectionKeys.setupFeeCollection,
    mutationFn: setupFeeCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feeCollectionKeys.setupStatus });
      queryClient.invalidateQueries({ queryKey: feeCollectionKeys.bankAccounts });
    },
  });
};

export const useUpdateFeeCollectionBankAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: feeCollectionKeys.updateBankAccount,
    mutationFn: ({ accountId, payload }: { accountId: number; payload: UpdateBankAccountDto }) => updateBankAccount(accountId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feeCollectionKeys.bankAccounts });
      queryClient.invalidateQueries({ queryKey: feeCollectionKeys.setupStatus });
    },
  });
};

export const useUpdateFeeCollectionMode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: feeCollectionKeys.updateMode,
    mutationFn: updateMode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feeCollectionKeys.setupStatus });
      queryClient.invalidateQueries({ queryKey: feeCollectionKeys.bankAccounts });
    },
  });
};
