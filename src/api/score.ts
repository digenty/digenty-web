import { SubmitScorePayload } from "@/components/ScoreViewBySubject/types";
import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

export const addScoreToStudent = async (payload: SubmitScorePayload) => {
  try {
    const { data } = await api.post("/report/subject/students", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
