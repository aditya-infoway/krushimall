// src/utils/apiHelper.js

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});


// Automatically attach JWT token to every request
// api.interceptors.request.use(
  
//   (config) => {
//     const token = localStorage.getItem("webToken");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("webToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("➡️ REQUEST");
    console.log("Method:", config.method?.toUpperCase());
    console.log("URL:", config.baseURL + config.url);
    console.log("Headers:", config.headers);
    console.log("Body:", config.data);

    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("✅ RESPONSE");
    console.log(response.status);
    console.log(response.config.url);
    console.log(response.data);

    return response;
  },
  (error) => {
    console.error("❌ RESPONSE ERROR");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Response:", error.response);
    console.error("Request:", error.request);

    return Promise.reject(error);
  }
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
};

export default apiHelper;