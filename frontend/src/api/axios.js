import axios from "axios";

/**
 * BASE URL RULE:
 * - Local development → http://localhost:8000
 * - Production (Vercel) → VITE_API_URL from env
 */

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "http://localhost:8000",
  withCredentials: true,
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

      // hard redirect (fixes stuck state issues)
      window.location.replace("/");
    }

    return Promise.reject(error);
  }
);

export default api;
