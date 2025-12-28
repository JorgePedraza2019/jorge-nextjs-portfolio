// src/services/httpClient.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000, // opcional, 10s
});

// Interceptor para agregar Bearer interno a todas las requests
api.interceptors.request.use((config) => {
  const token = process.env.NEXT_PUBLIC_INTERNAL_API_KEY;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Interceptor de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default api;