import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || "/api" });

// --- Auth + language on every request ---------------------------------------
// We attach two things automatically to each call:
//   1. the admin's Bearer token (if logged in), and
//   2. the current language as a ?lang= query param.
// Attaching lang here means individual components don't have to remember to add
// it — the backend then returns only the rows for that language. Components
// still re-run their fetch effects when `lang` changes (see useLang in deps).
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // Don't override an explicit lang if a caller already set one.
  config.params = config.params || {};
  if (config.params.lang === undefined) {
    config.params.lang = localStorage.getItem("lang") || "en";
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem("token");
      if (window.location.pathname.startsWith("/admin") &&
          window.location.pathname !== "/admin") {
        window.location.href = "/admin";
      }
    }
    return Promise.reject(err);
  }
);

// Resolve an uploaded path to a usable URL
export const mediaUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return path; // /uploads/... is proxied
};

export default api;
