import axiosClient from "../client";
import { ENDPOINTS } from "../endpoints";
import type {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
  User,
} from "../../types/auth.types";

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await axiosClient.post(ENDPOINTS.AUTH.LOGIN, payload);
    return response.data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await axiosClient.post(ENDPOINTS.AUTH.REGISTER, payload);
    return response.data;
  },

  async changePassword(userId:string, currentPassword: string, newPassword: string) {
    const response = await axiosClient.patch(ENDPOINTS.AUTH.CHANGE_PASSWORD(userId), {
      currentPassword,
      newPassword: newPassword,
      confirmPassword: newPassword,
    })
    return response.data;
  },

  updateProfile: async (userId: string,data: Partial<User>): Promise<User> => {
    const response = await axiosClient.patch(ENDPOINTS.AUTH.UPDATE_PROFILE(userId), data);
    return response.data;
  },
};
