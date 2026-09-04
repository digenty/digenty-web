"use client";

import { useCallback, useState } from "react";

export type ExpenseFilters = {
  search: string;
  branchId?: number;
  termId?: number;
  categoryId?: number;
  startDate?: string;
  endDate?: string;
};

/**
 * Filters are shared by the header (branch / term / date range) and the toolbar
 * (search / category), and every change resets pagination — so they live in one place.
 */
export const useExpenseFilters = (initial: Partial<ExpenseFilters> = {}) => {
  const [filters, setFiltersState] = useState<ExpenseFilters>({ search: "", ...initial });
  const [page, setPage] = useState(1);

  const setFilters = useCallback((patch: Partial<ExpenseFilters>) => {
    setFiltersState(current => ({ ...current, ...patch }));
    setPage(1);
  }, []);

  return { filters, setFilters, page, setPage };
};
