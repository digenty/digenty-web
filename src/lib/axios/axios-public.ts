import axios from "axios";

const apiPublic = axios.create({
  baseURL: "https://school-app-backend-y82vo.ondigitalocean.app",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiPublic;
