import axios from "axios";

/**
 * BASE URL RULE:
 * - Local  → http://localhost:8000
 * - Prod   → REACT_APP_API_URL (WITHOUT /api)
 *
 * Example:
 * REACT_APP_API_URL=https://taskflow-backend.onrender.com
 */

const apiBase =
  process.env.REACT_APP_API_URL?.replace(/\/$/, "") ||
  "http://localhost:8000";

const api = axios.create({
  baseURL: `${apiBase}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // JWT via Authorization header
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

      // Avoid infinite reload loop
      if (window.location.pathname !== "/") {
        window.location.replace("/");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
