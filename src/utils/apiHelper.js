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

const BASE_URL = import.meta.env.VITE_API_URL.replace(/\/api$/, "");

const apiHelper = {
  // GET
  // get: async (url, params = {}) => {
  //   const response = await api.get(url, { params });
  //   return response.data;
  // },

  get: async (url, config = {}) => {
    const response = await api.get(url, config);
    return response.data;
  },

  // POST (Create)
  post: async (url, data = {}, config = {}) => {
    const response = await api.post(url, data, config);
    return response.data;
  },

  // PUT (Update Entire Resource)
  put: async (url, data = {}, config = {}) => {
    const response = await api.put(url, data, config);
    return response.data;
  },

  // PATCH (Partial Update)
  patch: async (url, data = {}, config = {}) => {
    const response = await api.patch(url, data, config);
    return response.data;
  },

  // DELETE
  delete: async (url, config = {}) => {
    const response = await api.delete(url, config);
    return response.data;
  },

  // Upload File
  upload: async (url, formData, config = {}) => {
    const response = await api.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      ...config,
    });
    return response.data;
  },

  // Image URL Helper
  image: (path) => {
    if (!path) return "/mah.png";

    if (path.startsWith("http")) {
      return path;
    }

    if (path.startsWith("/uploads/")) {
      return `${BASE_URL}${path}`;
    }

    if (path.startsWith("/")) {
      return `${BASE_URL}${path}`;
    }

    return `${BASE_URL}/uploads/${path}`;
  },

  getImageUrl(path) {
    return this.image(path);
  },
};

export default apiHelper;
