"use client";

import type { FeeTermType } from "@/api/fee";
import type { BranchWithClassLevels, Term } from "@/api/types";
import { useGetSessions } from "@/hooks/queryHooks/useAcademic";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useGetTerms } from "@/hooks/queryHooks/useTerm";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { useCallback, useEffect, useMemo, useState } from "react";

export const ALL_BRANCHES = "All Branches";
export const ALL_TERMS = "All Terms";

const branchLabel = (b: BranchWithClassLevels) => b.branch.name ?? `Branch ${b.branch.id}`;

/**
 * Shared branch + term/session filter state for the Fees tabs.
 * Selection is stored as IDs (not display labels) to avoid label-matching race
 * conditions when sessionName arrives after termList.
 */
export const useFeesFilters = () => {
  const { schoolId, branchIds, isMain, isAdmin, adminBranchIds } = useLoggedInUser();
  const { data: branchesResp, isPending: loadingBranches } = useGetBranches();
  const { data: termsResp, isPending: loadingTerms } = useGetTerms(schoolId);
  const { data: sessions } = useGetSessions();

  // A staff member with no branch-admin/main access is restricted to their own assigned
  // branch(es) — they shouldn't be able to select, or default to, another branch's fees.
  const userBranchIds = useMemo(() => branchIds ?? [], [branchIds]);
  const hasFullAccess = isMain || isAdmin || (adminBranchIds?.length ?? 0) > 0;
  const isBranchRestricted = !hasFullAccess && userBranchIds.length > 0;

  const branchList: BranchWithClassLevels[] = useMemo(() => {
    const all: BranchWithClassLevels[] = branchesResp?.data ?? [];
    return isBranchRestricted ? all.filter(b => userBranchIds.includes(b.branch.id)) : all;
  }, [branchesResp, isBranchRestricted, userBranchIds]);
  const termList: Term[] = useMemo(() => termsResp?.data?.terms ?? [], [termsResp]);
  const sessionName: string = termsResp?.data?.academicSessionName ?? "";
  const sessionId: number | undefined = useMemo(() => (Array.isArray(sessions) ? sessions.find(s => s.isActive)?.id : undefined), [sessions]);

  const termLabel = useCallback((t: Term) => `${sessionName} ${t.term.toLowerCase()}`.trim(), [sessionName]);

  const branchOptions = useMemo(
    () => (isBranchRestricted ? branchList.map(branchLabel) : [ALL_BRANCHES, ...branchList.map(branchLabel)]),
    [branchList, isBranchRestricted],
  );
  const termOptions = useMemo(() => [ALL_TERMS, ...termList.map(termLabel)], [termList, termLabel]);

  const [branchSelected, setBranchSelected] = useState(ALL_BRANCHES);
  const restrictedBranchId = isBranchRestricted ? userBranchIds[0] : undefined;

  // Once the restricted staff member's own branch resolves, select it by name so the
  // dropdown reflects it (the branchId memo below already scopes data before this runs).
  useEffect(() => {
    if (branchSelected !== ALL_BRANCHES || !restrictedBranchId || branchList.length === 0) return;
    const own = branchList.find(b => b.branch.id === restrictedBranchId);
    if (own) setBranchSelected(branchLabel(own));
  }, [restrictedBranchId, branchList, branchSelected]);
  // Store the termId instead of a label string to avoid label-mismatch when
  // sessionName arrives asynchronously after termList.
  const [selectedTermId, setSelectedTermId] = useState<number | null>(null);

  // Default to the active term once the list resolves (only once per mount).
  useEffect(() => {
    if (selectedTermId !== null || termList.length === 0) return;
    const active = termList.find(t => t.isActiveTerm) ?? termList[0];
    if (active) setSelectedTermId(active.termId);
  }, [termList, selectedTermId]);

  // Derive the display label from the stored ID (re-computes when sessionName loads).
  const termSelected = useMemo(() => {
    if (selectedTermId === null) return ALL_TERMS;
    const t = termList.find(t => t.termId === selectedTermId);
    return t ? termLabel(t) : ALL_TERMS;
  }, [selectedTermId, termList, termLabel]);

  // Accept a display-label string from FeesHeader's select and reverse-resolve to ID.
  const setTermSelected = useCallback(
    (label: string) => {
      if (label === ALL_TERMS) {
        setSelectedTermId(null);
        return;
      }
      const t = termList.find(t => termLabel(t) === label);
      setSelectedTermId(t?.termId ?? null);
    },
    [termList, termLabel],
  );

  const branchId = useMemo(() => {
    if (branchSelected === ALL_BRANCHES) return restrictedBranchId;
    return branchList.find(b => branchLabel(b) === branchSelected)?.branch.id;
  }, [branchSelected, branchList, restrictedBranchId]);

  const selectedTerm = useMemo(() => termList.find(t => t.termId === selectedTermId), [termList, selectedTermId]);
  const termId = selectedTerm?.termId;
  const term = selectedTerm?.term as FeeTermType | undefined;

  return {
    branchOptions,
    termOptions,
    branchSelected,
    setBranchSelected,
    termSelected,
    setTermSelected,
    branchId,
    termId,
    term,
    sessionId,
    sessionName,
    loadingBranches,
    loadingTerms,
  };
};
