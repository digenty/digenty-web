"use client";

import type { BranchAmount, ClassArmAmount, FeeItemDto, FeeTermType } from "@/api/fee";
import type { Branch, BranchWithClassLevels, ClassType, Term } from "@/api/types";
import { useGetActiveSession } from "@/hooks/queryHooks/useAcademic";
import { useGetAllArms } from "@/hooks/queryHooks/useArm";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useGetClasses } from "@/hooks/queryHooks/useClass";
import { useGetTerms } from "@/hooks/queryHooks/useTerm";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";

export interface ArmAmountInput {
  armId: number;
  amount: number | "";
}

export interface BranchAmountInput {
  branchId: number;
  amount: number | "";
}

export interface FeeItemFormValues {
  name: string;
  required: boolean;
  sessionId: number | "";
  term: FeeTermType | "";
  quantity: number;
  branchIds: number[];
  setDifferentPricesPerBranch: boolean;
  branchAmounts: BranchAmountInput[];
  armIds: number[];
  amount: number | "";
  setDifferentPricesPerClass: boolean;
  classArmAmounts: ArmAmountInput[];
  allowPartPayment: boolean;
  minimumPartPayment: number | "";
}

export const initialFeeItemValues: FeeItemFormValues = {
  name: "",
  required: false,
  sessionId: "",
  term: "",
  quantity: 1,
  branchIds: [],
  setDifferentPricesPerBranch: false,
  branchAmounts: [],
  armIds: [],
  amount: "",
  setDifferentPricesPerClass: false,
  classArmAmounts: [],
  allowPartPayment: false,
  minimumPartPayment: "",
};

// Shape returned by GET /arms (ArmWithClassNameDto).
export interface FeeArmOption {
  armId: number;
  armName: string;
  classId: number;
  branchId: number;
}

export interface ClassWithArms {
  classId: number;
  className: string;
  branchId: number;
  arms: FeeArmOption[];
}

export const buildClassesWithArms = (classList: ClassType[], armList: FeeArmOption[], branchIds: number[]): ClassWithArms[] => {
  const inScope = (branchId: number) => branchIds.length === 0 || branchIds.includes(branchId);

  // Group arms by their class. An arm's branch is implied by its class, so we
  // only need to scope the classes by branch.
  const armsByClass = new Map<number, FeeArmOption[]>();
  armList.forEach(a => {
    const arr = armsByClass.get(a.classId) ?? [];
    arr.push(a);
    armsByClass.set(a.classId, arr);
  });

  return classList
    .filter(c => inScope(c.branchId))
    .map(c => ({ classId: c.id, className: c.name, branchId: c.branchId, arms: armsByClass.get(c.id) ?? [] }))
    .filter(c => c.arms.length > 0);
};

/** Converts the validated form values into the POST /fee/items payload. */
export const buildFeeItemPayload = (values: FeeItemFormValues): FeeItemDto => {
  const { setDifferentPricesPerBranch, setDifferentPricesPerClass } = values;

  const branchAmounts: BranchAmount[] | undefined = setDifferentPricesPerBranch
    ? values.branchAmounts.map(b => ({ branchId: b.branchId, amount: Number(b.amount) || 0 }))
    : undefined;

  const classArmAmounts: ClassArmAmount[] | undefined = setDifferentPricesPerClass
    ? values.classArmAmounts.map(c => ({ armId: c.armId, amount: Number(c.amount) || 0 }))
    : undefined;

  return {
    name: values.name.trim(),
    session: Number(values.sessionId),
    term: values.term as FeeTermType,
    quantity: values.quantity,
    required: values.required,
    branchIds: values.branchIds,
    armIds: values.armIds,
    amount: setDifferentPricesPerBranch || setDifferentPricesPerClass ? undefined : Number(values.amount) || 0,
    setDifferentPricesPerBranch,
    setDifferentPricesPerClass,
    branchAmounts,
    classArmAmounts,
    allowPartPayment: values.allowPartPayment,
    minimumPartPayment: values.allowPartPayment ? Number(values.minimumPartPayment) || 0 : undefined,
  };
};

/** Shared reference data for the Add Fee form (branches, classes, arms, session, terms). */
export const useFeeFormData = () => {
  const { schoolId } = useLoggedInUser();
  const { data: branchesResp, isPending: loadingBranches } = useGetBranches();
  const { data: classesResp, isPending: loadingClasses } = useGetClasses();
  const { data: armsResp, isPending: loadingArms } = useGetAllArms();
  const { data: termsResp } = useGetTerms(schoolId);
  const { data: sessionResp } = useGetActiveSession();

  const branchList: Branch[] = ((branchesResp?.data ?? []) as BranchWithClassLevels[]).map(b => b.branch);
  const classList: ClassType[] = classesResp?.data?.content ?? [];

  const rawArms = Array.isArray(armsResp) ? armsResp : (armsResp?.data ?? armsResp?.content ?? []);
  const armList: FeeArmOption[] = (rawArms as FeeArmOption[]) ?? [];

  const termList: Term[] = termsResp?.data?.terms ?? [];
  const sessionName: string = termsResp?.data?.academicSessionName ?? "";
  const sessionId: number | undefined = sessionResp?.data?.id;

  return { branchList, classList, armList, termList, sessionName, sessionId, loadingBranches, loadingClasses, loadingArms };
};
