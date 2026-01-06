import { getSessionData } from "@/app/actions/auth";
import axios from "axios";
import { redirect } from "next/navigation";

const api = axios.create({
  baseURL: "https://school-app-backend-y82vo.ondigitalocean.app",
  withCredentials: true, // if using cookies
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor
 * - Attach auth token
 */
api.interceptors.request.use(
  async config => {
    const { accessToken } = await getSessionData();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  error => Promise.reject(error),
);

/**
 * Response interceptor
 * - Centralized error handling
 */
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Unauthorized
      await redirect("/auth");
    }

    return Promise.reject(error);
  },
);

export default api;
