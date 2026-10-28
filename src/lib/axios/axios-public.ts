import axios from "axios";
import { normalizeAxiosError } from "./normalize-error";

const apiPublic = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiPublic.interceptors.response.use(
  response => response,
  async error => Promise.reject(await normalizeAxiosError(error)),
);

export default apiPublic;
