import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

export const getLevelGrading = async (levelId: number) => {
  try {
    const { data } = await api.get(`/gradings/level${levelId ? `?levelId=${levelId}` : ""}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
