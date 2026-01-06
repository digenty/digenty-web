import apiPublic from "@/lib/axios/axios-public";

type Payload = {
  email: string;
  password: string;
};

// export const signup = async (payload: Payload): Promise<Payload[]> => {
export const signup = async (payload: Payload) => {
  const { data } = await apiPublic.post("/auth/register", payload);
  return data;
};

export const login = async (payload: Payload) => {
  const { data } = await apiPublic.post("/auth/login", payload);
  return data;
};
