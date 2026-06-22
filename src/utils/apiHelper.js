// src/utils/apiHelper.js

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const BASE_URL = import.meta.env.VITE_API_URL.replace(/\/api$/, "");

const apiHelper = {
  // Fetch API data
  get: async (url, params = {}) => {
    const response = await api.get(url, { params });
    return response.data;
  },

  // ✅ FIXED: Get image URL
  image: (path) => {
    if (!path) return "/mah.png";

    // If it's already a full URL
    if (path.startsWith("http")) {
      return path;
    }

    // ✅ If path already has /uploads/, just add base URL (no extra /uploads/)
    if (path.startsWith("/uploads/")) {
      return `${BASE_URL}${path}`;
    }

    // ✅ If path starts with / but not /uploads/
    if (path.startsWith("/")) {
      return `${BASE_URL}${path}`;
    }

    // Otherwise, add /uploads/
    return `${BASE_URL}/uploads/${path}`;
  },
};

export default apiHelper;