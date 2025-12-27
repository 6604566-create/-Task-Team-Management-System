const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://task-team-management-system.onrender.com";

const fetchClient = async (endpoint, options = {}) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // ✅ REQUIRED for cookie auth
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export default fetchClient;
