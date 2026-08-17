// Thin wrapper around fetch. Every call to the backend goes through here
// so there's exactly one place that knows the API base URL and how

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await res.json() : null;

  if (!res.ok) {
    const message = body?.error || "Something went wrong. Please try again.";
    const error = new Error(message);
    error.details = body?.details;
    error.status = res.status;
    throw error;
  }

  return body;
}

export const api = {
  getConfig: () => request("/api/config"),

  submitEstimate: (payload) =>
    request("/api/estimate", { method: "POST", body: JSON.stringify(payload) }),

  login: (username, password) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  logout: () => request("/api/auth/logout", { method: "POST" }),

  me: () => request("/api/auth/me"),

  getAdminConfig: () => request("/api/admin/config"),

  updateAdminConfig: (payload) =>
    request("/api/admin/config", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  getLeads: () => request("/api/admin/leads"),
};
