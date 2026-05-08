import {
  adjustStockQuantity,
  createStock,
  createStockCategory,
  createStockUnit,
  deleteStock,
  deleteStockCategory,
  deleteStockUnit,
  editStock,
  editStockCategory,
  editStockUnit,
  getAllStockCategories,
  getAllStockUnits,
  getAllStockUnitsSize,
  getStockById,
  getStockByCategory,
  getStockByName,
  getStockByStatus,
  getStockCategoryByName,
  getStocksByBranch,
  getStockSettings,
  getStockTransactions,
  searchStocks,
  StockStatus,
  updateStockSettings,
} from "@/api/stock";
import { stockKeys } from "@/queries/stock";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useSearchStocks = (params: { branchId?: number; search?: string; page?: number; size?: number }) => {
  const { branchId, search = "", page = 0, size = 20 } = params;
  return useQuery({
    queryKey: stockKeys.search(branchId ?? 0, search, page, size),
    queryFn: () => searchStocks({ branchId: branchId as number, search, page, size }),
    enabled: !!branchId,
    placeholderData: keepPreviousData,
    retry: false,
  });
};

export const useGetStocksByBranch = (branchId?: number, page = 0, size = 15) => {
  return useQuery({
    queryKey: stockKeys.byBranch(branchId ?? 0, page, size),
    queryFn: () => getStocksByBranch(branchId as number, { page, size }),
    enabled: !!branchId,
    placeholderData: keepPreviousData,
    retry: false,
  });
};

export const useGetStockById = (id?: number) => {
  return useQuery({
    queryKey: stockKeys.detail(id ?? 0),
    queryFn: () => getStockById(id as number),
    enabled: !!id,
    retry: false,
  });
};

export const useGetStockByStatus = (status?: StockStatus) => {
  return useQuery({
    queryKey: stockKeys.byStatus(status),
    queryFn: () => getStockByStatus(status as StockStatus),
    enabled: !!status,
    retry: false,
  });
};

export const useGetStockByName = (name?: string) => {
  return useQuery({
    queryKey: stockKeys.byName(name),
    queryFn: () => getStockByName(name as string),
    enabled: !!name,
    retry: false,
  });
};

export const useGetStockByCategory = (category?: string | number) => {
  return useQuery({
    queryKey: stockKeys.byCategory(category),
    queryFn: () => getStockByCategory(category as string | number),
    enabled: !!category,
    retry: false,
  });
};

export const useGetStockTransactions = (stockId?: number, page = 0, size = 15) => {
  return useQuery({
    queryKey: stockKeys.transactions(stockId ?? 0, page, size),
    queryFn: () => getStockTransactions(stockId as number, { page, size }),
    enabled: !!stockId,
    retry: false,
  });
};

export const useGetStockUnits = (page = 0, size = 15) => {
  return useQuery({
    queryKey: stockKeys.units(page, size),
    queryFn: () => getAllStockUnits({ page, size }),
    placeholderData: keepPreviousData,
    retry: false,
  });
};

export const useGetStockUnitsSize = (page = 0, size = 15) => {
  return useQuery({
    queryKey: stockKeys.unitSizes(page, size),
    queryFn: () => getAllStockUnitsSize({ page, size }),
    placeholderData: keepPreviousData,
    retry: false,
  });
};

export const useGetStockCategories = (page = 0, size = 15) => {
  return useQuery({
    queryKey: stockKeys.categories(page, size),
    queryFn: () => getAllStockCategories({ page, size }),
    placeholderData: keepPreviousData,
    retry: false,
  });
};

export const useGetStockCategoryByName = (name?: string) => {
  return useQuery({
    queryKey: stockKeys.categoryByName(name),
    queryFn: () => getStockCategoryByName(name as string),
    enabled: !!name,
    retry: false,
  });
};

export const useGetStockSettings = (branchId?: number) => {
  return useQuery({
    queryKey: stockKeys.settings(branchId),
    queryFn: () => getStockSettings(branchId),
    retry: false,
  });
};

const invalidateStockLists = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: stockKeys.all });
};

export const useCreateStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: stockKeys.createStock,
    mutationFn: createStock,
    onSuccess: () => invalidateStockLists(queryClient),
  });
};

export const useEditStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: stockKeys.editStock,
    mutationFn: editStock,
    onSuccess: () => invalidateStockLists(queryClient),
  });
};

export const useDeleteStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: stockKeys.deleteStock,
    mutationFn: (stockId: number) => deleteStock(stockId),
    onSuccess: () => invalidateStockLists(queryClient),
  });
};

export const useAdjustStockQuantity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: stockKeys.adjustQuantity,
    mutationFn: adjustStockQuantity,
    onSuccess: () => invalidateStockLists(queryClient),
  });
};

export const useCreateStockUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: stockKeys.createUnit,
    mutationFn: createStockUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stockUnits"] });
    },
  });
};

export const useEditStockUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: stockKeys.editUnit,
    mutationFn: editStockUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stockUnits"] });
    },
  });
};

export const useDeleteStockUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: stockKeys.deleteUnit,
    mutationFn: (stockUnitId: number) => deleteStockUnit(stockUnitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stockUnits"] });
    },
  });
};

export const useCreateStockCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: stockKeys.createCategory,
    mutationFn: createStockCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stockCategories"] });
    },
  });
};

export const useEditStockCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: stockKeys.editCategory,
    mutationFn: editStockCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stockCategories"] });
    },
  });
};

export const useDeleteStockCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: stockKeys.deleteCategory,
    mutationFn: (stockCategoryId: number) => deleteStockCategory(stockCategoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stockCategories"] });
    },
  });
};

export const useUpdateStockSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: stockKeys.updateSettings,
    mutationFn: updateStockSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stockSettings"] });
    },
  });
};
