import axios from "axios";

/**
 * BASE URL RULE:
 * - Local → http://localhost:8000
 * - Production → REACT_APP_API_URL (no /api here)
 * Note: This project uses CRA env vars (process.env.REACT_APP_*).
 */

const apiBase = process.env.REACT_APP_API_URL || "http://localhost:8000";
const api = axios.create({
  baseURL: `${apiBase}/api`,
  withCredentials: false, // using token in Authorization header; cookies not required
});

/* ================= REQUEST INTERCEPTOR ================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.replace("/");
    }

    return Promise.reject(error);
  }
);

export default api;
