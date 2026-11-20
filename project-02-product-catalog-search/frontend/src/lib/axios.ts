import axios from "axios";

import { normalizeApiError } from "./normalize-api-error";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Response interceptor.
api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error: unknown) => {
    return Promise.reject(normalizeApiError(error));
  },
);

export default api;
