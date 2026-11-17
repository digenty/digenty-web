"use client";

import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { usePersistedLoad, usePersistValue } from "@/hooks/usePersistedState";
import { useCallback, useMemo, useState } from "react";

export type ExpenseFilters = {
  search: string;
  branchId?: number;
  termId?: number;
  categoryId?: number;
  startDate?: string;
  endDate?: string;
};

export type SavedExpenseView = { filters: ExpenseFilters; page: number };

/** Reads the filters remembered for `storageKey`; `loaded` flips once they're read so the list can mount with them. */
export const useSavedExpenseView = (storageKey: string) => usePersistedLoad<SavedExpenseView>(storageKey);

/**
 * Filters are shared by the header (branch / term / date range) and the toolbar
 * (search / category), and every change resets pagination — so they live in one place.
 */
export const useExpenseFilters = (initial: Partial<ExpenseFilters> = {}, saved?: SavedExpenseView, storageKey?: string) => {
  const { branchIds, isMain, isAdmin, adminBranchIds } = useLoggedInUser();

  // A staff member with no branch-admin/main access is restricted to their own assigned
  // branch(es) — they shouldn't default to, or be able to pick, another branch's expenses.
  const userBranchIds = useMemo(() => branchIds ?? [], [branchIds]);
  const hasFullAccess = isMain || isAdmin || (adminBranchIds?.length ?? 0) > 0;
  const isBranchRestricted = !hasFullAccess && userBranchIds.length > 0;
  const restrictedBranchId = isBranchRestricted ? userBranchIds[0] : undefined;

  const [filtersState, setFiltersState] = useState<ExpenseFilters>({ search: "", ...initial, ...saved?.filters });
  const [page, setPage] = useState(saved?.page ?? 1);

  const view = useMemo(() => ({ filters: filtersState, page }), [filtersState, page]);
  usePersistValue(storageKey ?? "", storageKey ? view : undefined);

  const setFilters = useCallback((patch: Partial<ExpenseFilters>) => {
    setFiltersState(current => ({ ...current, ...patch }));
    setPage(1);
  }, []);

  // Fall back to the staff member's own branch until they (or, once restricted, they can
  // only ever pick their own branch anyway) explicitly choose one — this keeps every
  // consumer of `filters.branchId` correctly scoped with no unscoped fetch in between.
  const filters = useMemo(() => ({ ...filtersState, branchId: filtersState.branchId ?? restrictedBranchId }), [filtersState, restrictedBranchId]);

  return { filters, setFilters, page, setPage, isBranchRestricted, userBranchIds };
};
