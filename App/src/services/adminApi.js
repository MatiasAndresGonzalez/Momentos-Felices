import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const adminApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminApi.interceptors.response.use(
  (response) => {
    console.log(
      `[ADMIN] Respuesta ${response.config.method?.toUpperCase()} ${response.config.url}:`,
      response.data,
    );
    if (response.data && response.data.data !== undefined) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.mensaje || error.message;
    console.error("[ADMIN] Error en la petición:", message);
    return Promise.reject(new Error(message));
  },
);
