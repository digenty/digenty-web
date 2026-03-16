import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

type UpdateLevelPayload = {
  levelId: number;
  levelType: "CRECHE" | "KINDERGARTEN" | "NURSERY" | "PRIMARY" | "JUNIOR SECONDARY" | "SENIOR SECONDARY";
  levelName: string;
  classNamePrefix: string;
  classStart: number;
  classEnd: number;
  branchSpecific: boolean;
};

export const levelKeys = {
  levels: ["levels"] as const,
  updateLevel: ["updateLevel"] as const,
};

export const updateLevel = async (payload: UpdateLevelPayload) => {
  try {
    const { data } = await api.put("/class-levels", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
