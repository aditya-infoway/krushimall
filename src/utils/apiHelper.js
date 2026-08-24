// src/utils/apiHelper.js

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const url = config.url || "";

    let token = null;

    // Vendor routes
   // Vendor login doesn't require a token
if (url === "/vendor/login") {
  token = null;
}
// Become Vendor uses the website user's token
else if (url === "/vendor/become") {
  token = localStorage.getItem("webToken");
}
// Vendor dashboard routes use the vendor token
else if (url.startsWith("/vendor")) {
  token = localStorage.getItem("vendorToken");
}
// Other website routes use the web token
else if (
  !url.startsWith("/admin") &&
  !url.startsWith("/branch")
) {
  token = localStorage.getItem("webToken");
}
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ==============================
// Response interceptor — handles vendor forced logout
// (status changed to SUSPENDED/PENDING/REJECTED by admin,
// or vendor JWT invalid/expired)
// ==============================
// ==============================
// Response interceptor — handles vendor forced logout
// (status changed to SUSPENDED/PENDING/REJECTED by admin,
// or vendor JWT invalid/expired)
// ==============================

const VENDOR_LOGIN_PATH = `${import.meta.env.BASE_URL}vendor-login`.replace(/\/+/g, "/");

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    const status = error.response?.status;
    const shouldLogout = error.response?.data?.logout === true;

    if (url.startsWith("/vendor") && url !== "/vendor/login" && url !== "/vendor/become") {
      if (status === 401 || shouldLogout) {
        localStorage.removeItem("vendorToken");

        if (window.location.pathname !== VENDOR_LOGIN_PATH) {
          window.location.href = VENDOR_LOGIN_PATH;
        }
      }
    }

    return Promise.reject(error);
  },
);
const BASE_URL = import.meta.env.VITE_API_URL.replace(/\/api$/, "");

const apiHelper = {
  get: async (url, config = {}) => {
    const response = await api.get(url, config);
    return response.data;
  },

  post: async (url, data = {}, config = {}) => {
    const response = await api.post(url, data, config);
    return response.data;
  },

  put: async (url, data = {}, config = {}) => {
    const response = await api.put(url, data, config);
    return response.data;
  },

  patch: async (url, data = {}, config = {}) => {
    const response = await api.patch(url, data, config);
    return response.data;
  },

  delete: async (url, config = {}) => {
    const response = await api.delete(url, config);
    return response.data;
  },

  upload: async (url, formData, config = {}) => {
    const response = await api.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      ...config,
    });
    return response.data;
  },

  image: (path) => {
    if (!path) return "/mah.png";

    if (path.startsWith("http")) {
      return path;
    }

    path = path.replace(/^\/+/, "");

    if (path.startsWith("uploads/")) {
      return `${BASE_URL}/${path}`;
    }

    return `${BASE_URL}/uploads/${path}`;
  },
  getImageUrl(path) {
    return this.image(path);
  },
};

export default apiHelper;