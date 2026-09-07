import {
  createExpense,
  createExpenseCategory,
  deleteExpense,
  deleteExpenseCategory,
  editExpense,
  editExpenseCategory,
  ExpenseSummaryParams,
  getAllExpenseCategories,
  getExpenseById,
  getExpenseCategoryById,
  getExpenseSummary,
  searchExpenses,
  SearchExpensesParams,
} from "@/api/expense";
import { expenseKeys } from "@/queries/expense";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useSearchExpenses = (params: SearchExpensesParams) => {
  const { branchId, categoryId, termId, search = "", startDate, endDate, page = 0, size = 15 } = params;
  return useQuery({
    queryKey: expenseKeys.search(branchId, categoryId, termId, search, startDate, endDate, page, size),
    queryFn: () => searchExpenses({ branchId, categoryId, termId, search, startDate, endDate, page, size }),
    placeholderData: keepPreviousData,
    retry: false,
  });
};

export const useGetExpenseSummary = (params: ExpenseSummaryParams = {}) => {
  const { branchId, categoryId, termId } = params;
  return useQuery({
    queryKey: expenseKeys.summary(branchId, categoryId, termId),
    queryFn: () => getExpenseSummary({ branchId, categoryId, termId }),
    placeholderData: keepPreviousData,
    retry: false,
  });
};

export const useGetExpenseById = (id?: number) => {
  return useQuery({
    queryKey: expenseKeys.detail(id ?? 0),
    queryFn: () => getExpenseById(id as number),
    enabled: !!id,
    retry: false,
  });
};

export const useGetExpenseCategories = (page = 0, size = 15) => {
  return useQuery({
    queryKey: expenseKeys.categories(page, size),
    queryFn: () => getAllExpenseCategories({ page, size }),
    placeholderData: keepPreviousData,
    retry: false,
  });
};

export const useGetExpenseCategoryById = (id?: number) => {
  return useQuery({
    queryKey: expenseKeys.categoryDetail(id ?? 0),
    queryFn: () => getExpenseCategoryById(id as number),
    enabled: !!id,
    retry: false,
  });
};

const invalidateExpenseLists = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: expenseKeys.all });
  // Category rows carry an expense count, so they go stale with every expense write.
  queryClient.invalidateQueries({ queryKey: ["expenseCategories"] });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: expenseKeys.createExpense,
    mutationFn: createExpense,
    onSuccess: () => invalidateExpenseLists(queryClient),
  });
};

export const useEditExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: expenseKeys.editExpense,
    mutationFn: editExpense,
    onSuccess: () => invalidateExpenseLists(queryClient),
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: expenseKeys.deleteExpense,
    mutationFn: (expenseId: number) => deleteExpense(expenseId),
    onSuccess: () => invalidateExpenseLists(queryClient),
  });
};

export const useCreateExpenseCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: expenseKeys.createCategory,
    mutationFn: createExpenseCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenseCategories"] });
    },
  });
};

export const useEditExpenseCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: expenseKeys.editCategory,
    mutationFn: editExpenseCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenseCategories"] });
    },
  });
};

export const useDeleteExpenseCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: expenseKeys.deleteCategory,
    mutationFn: (expenseCategoryId: number) => deleteExpenseCategory(expenseCategoryId),
    onSuccess: () => {
      // Expenses under a deleted category become uncategorised, so the lists move too.
      queryClient.invalidateQueries({ queryKey: ["expenseCategories"] });
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
    },
  });
};
