import axiosClient from "../client";
import { ENDPOINTS } from "../endpoints";
import type {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
  User,
} from "../../types/auth.types";

const users: User[] = [
  {
    id: "1",
    name: "Juan",
    email: "juan@example.com",
    phone: "+1 234 567 890",
    address: "Av. Principal 123, Ciudad",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    lastName: "Pérez",
  },
];

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await axiosClient.post(ENDPOINTS.AUTH.LOGIN, payload);
    return response.data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await axiosClient.post(ENDPOINTS.AUTH.REGISTER, payload);
    return response.data;
  },

  async changePassword(currentPassword: string, newPassword: string) {
    // TODO: Reemplazar con llamada real a la API
    // await apiClient.post(ENDPOINTS.AUTH.CHANGE_PASSWORD, { currentPassword, newPassword });

    // Simulación: si la contraseña actual es "password123" funciona
    if (currentPassword === "password123") {
      // Simular éxito
      return;
    } else {
      throw new Error("Contraseña actual incorrecta");
    }
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    // TODO: Reemplazar con llamada real a la API
    // const response = await apiClient.put(ENDPOINTS.AUTH.PROFILE, data);
    // return response.data;

    // Simulación: actualizar el usuario mock
    const userIndex = users.findIndex((u) => u.id === "1");
    if (userIndex === -1) throw new Error("Usuario no encontrado");

    const updatedUser = { ...users[userIndex], ...data };
    users[userIndex] = updatedUser;
    return updatedUser;
  },
};
