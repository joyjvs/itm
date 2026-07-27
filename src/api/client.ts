import axios, {
  type AxiosInstance,
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { API_BASE_URL } from "./endpoints";
import type { ApiError } from "../types/api.types";

const TOKEN_KEY = "auth_token";

// Crear instancia de Axios
const axiosClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor para manejar respuestas
axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem(TOKEN_KEY);
    }

    // Retornar el error para que lo maneje quien haga la llamada
    return Promise.reject(error.response?.data || error);
  },
);

export const setAuthToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const removeAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  delete axiosClient.defaults.headers.common["Authorization"];
};

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);

export default axiosClient;
